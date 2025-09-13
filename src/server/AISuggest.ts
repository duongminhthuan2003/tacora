import express from "express";

const app = express();
app.use(express.json());

app.post("/api/ai/suggest", async (req, res) => {
    const { title, dueAt, type } = req.body || {};
    const prompt = `Bạn là trợ lý lập kế hoạch. Dựa trên: 
        Title: "${title}"
        Deadline (ISO): ${dueAt}
        Type: ${type}
        
        Hãy gợi ý:
        - estimatedMins (số phút, số nguyên)
        - priority (Low|Medium|High)

        Chỉ trả JSON: {"estimatedMins": number, "priority": "Low"|"Medium"|"High"}`;

    try {
        const r = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.2,
            }),
        });

        const data = await r.json();
        const text = data?.choices?.[0]?.message?.content ?? "";
        let parsed = { estimatedMins: 60, priority: "Medium" as const };
        try { const j = JSON.parse(text); if (typeof j.estimatedMins==="number" && ["Low","Medium","High"].includes(j.priority)) parsed = { estimatedMins: Math.max(15, Math.round(j.estimatedMins)), priority: j.priority }; } catch {}
        res.json(parsed);
    } catch {
        res.json({ estimatedMins: 60, priority: "Medium" });
    }
});

app.listen(3001);
