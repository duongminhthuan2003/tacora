export const config = { runtime: 'edge' };

type Priority = 'Low' | 'Medium' | 'High';
type Type = 'Work' | 'School' | 'Group' | 'Club' | 'Other';

function heuristic(title: string, type: Type, deadlineISO: string) {
    const now = new Date();
    const due = new Date(deadlineISO);
    const hoursLeft = Math.max(0, (due.getTime() - now.getTime()) / 36e5);

    let est = 45;
    if (type === 'School') est = 60;
    if (type === 'Work') est = 90;
    if (type === 'Group') est = 45;
    if (type === 'Club') est = 30;
    if (type === 'Other') est = 30;

    const t = title.toLowerCase();
    if (/\b(final|report|presentation|write|essay|proposal|documentation)\b/.test(t)) est += 45;
    if (/\b(lab|assignment|homework|project|implement|refactor)\b/.test(t)) est += 30;
    if (/\b(exam|quiz|midterm|review|study)\b/.test(t)) est += 30;
    if (/\b(meeting|call|sync)\b/.test(t)) est = Math.max(est, 30);
    if (/\b(fix|bug|debug)\b/.test(t)) est += 15;

    est = Math.round(est / 15) * 15;
    est = Math.min(240, Math.max(15, est));

    let prio: Priority = 'Medium';
    if (hoursLeft <= 24) prio = 'High';
    else if (hoursLeft <= 72) prio = 'Medium';
    else prio = 'Low';

    if ((type === 'School' || type === 'Work') && prio === 'Low') prio = 'Medium';
    if ((/exam|final|report|presentation/i.test(title)) && prio !== 'High') prio = 'High';

    return {
        priority: prio,
        estimatedMins: est,
        rationale: `Còn ~${Math.round(hoursLeft)} giờ đến hạn; loại ${type}; ước lượng ${est} phút, ưu tiên ${prio}.`
    };
}

export default async function handler(req: Request) {
    try {
        if (req.method !== 'POST') {
            return new Response(JSON.stringify({ error: 'Only POST' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
        }

        const { title, type, deadline } = await req.json();
        if (!title || !type || !deadline) {
            return new Response(JSON.stringify({ error: 'Missing title/type/deadline' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const USE_AI = process.env.USE_AI === '1';
        const hasAIEnv = !!(process.env.AI_API_KEY && process.env.AI_API_BASE && process.env.AI_MODEL);

        if (USE_AI && hasAIEnv) {
            const body = {
                model: process.env.AI_MODEL,
                messages: [
                    { role: 'system', content: 'Output JSON with fields: priority (Low|Medium|High), estimatedMins (int 15..240), rationale (short).' },
                    { role: 'user', content: `title=${title}\ntype=${type}\ndeadline=${deadline}\nReturn JSON only.` }
                ],
                response_format: { type: 'json_object' }
            };

            const aiRes = await fetch(`${process.env.AI_API_BASE}/chat/completions`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${process.env.AI_API_KEY}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (aiRes.ok) {
                const aiJson = await aiRes.json();
                const txt = aiJson?.choices?.[0]?.message?.content;
                if (txt) {
                    const obj = JSON.parse(txt);
                    return new Response(JSON.stringify({ ...obj, source: 'ai' }), { headers: { 'Content-Type': 'application/json' } });
                }
            }
        }

        const h = heuristic(title, type, deadline);
        return new Response(JSON.stringify({ ...h, source: 'heuristic' }), { headers: { 'Content-Type': 'application/json' } });

    } catch (e: any) {
        return new Response(JSON.stringify({ error: e?.message || 'Server error'}), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
