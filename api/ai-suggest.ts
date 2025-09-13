import type { VercelRequest, VercelResponse } from '@vercel/node';

interface AISuggestionRequest {
    title: string;
    dueAt?: string;
    type?: string;
    existingTasks?: Array<{
        title: string;
        type: string;
        priority: string;
        estimatedMins: number;
    }>;
}

interface AISuggestionResponse {
    estimatedMins: number;
    priority: 'Low' | 'Medium' | 'High';
    reasoning?: string;
    suggestions?: string[];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { title, dueAt, type, existingTasks }: AISuggestionRequest = req.body;

        if (!title?.trim()) {
            return res.status(400).json({ error: 'Title is required' });
        }

        // Create context-aware prompt
        const now = new Date().toISOString();
        const timeUntilDue = dueAt ? 
            Math.max(0, Math.floor((new Date(dueAt).getTime() - new Date(now).getTime()) / (1000 * 60 * 60))) 
            : null;

        const contextInfo = existingTasks?.length ? 
            `\nExisting similar tasks for context:\n${existingTasks.slice(0, 3).map(t => 
                `- ${t.title} (${t.type}, ${t.priority} priority, ${t.estimatedMins}min)`
            ).join('\n')}` : '';

        const prompt = `You are an intelligent task planning assistant. Analyze this task and provide smart recommendations:

Task Details:
- Title: "${title}"
- Type: ${type || 'Unknown'}
- Due: ${dueAt ? new Date(dueAt).toLocaleString() : 'Not specified'}
- Hours until due: ${timeUntilDue ? `${timeUntilDue}h` : 'Unknown'}${contextInfo}

Please suggest:
1. estimatedMins: Realistic time needed (15-480 minutes, in 15-min increments)
2. priority: Based on urgency, importance, and deadline
3. reasoning: Brief explanation of your recommendations
4. suggestions: 2-3 helpful tips for completing this task

Consider:
- Task complexity from title keywords
- Time pressure from deadline
- Task type patterns
- Similar task patterns from context

Respond with valid JSON only:
{
    "estimatedMins": number,
    "priority": "Low"|"Medium"|"High",
    "reasoning": "brief explanation",
    "suggestions": ["tip1", "tip2", "tip3"]
}`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful task planning assistant. Always respond with valid JSON only.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 500,
            }),
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data?.choices?.[0]?.message?.content?.trim();

        if (!aiResponse) {
            throw new Error('Empty response from AI');
        }

        // Parse and validate AI response
        let suggestion: AISuggestionResponse;
        try {
            const parsed = JSON.parse(aiResponse);
            
            // Validate and sanitize the response
            suggestion = {
                estimatedMins: Math.max(15, Math.min(480, Math.round((parsed.estimatedMins || 60) / 15) * 15)),
                priority: ['Low', 'Medium', 'High'].includes(parsed.priority) ? parsed.priority : 'Medium',
                reasoning: typeof parsed.reasoning === 'string' ? parsed.reasoning.slice(0, 200) : undefined,
                suggestions: Array.isArray(parsed.suggestions) ? 
                    parsed.suggestions.slice(0, 3).filter(s => typeof s === 'string' && s.length > 0) : undefined
            };
        } catch (parseError) {
            // Fallback to basic suggestion if parsing fails
            suggestion = {
                estimatedMins: 60,
                priority: 'Medium' as const,
                reasoning: 'Unable to analyze task details, using default recommendations.'
            };
        }

        // Set CORS headers for frontend access
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        return res.status(200).json(suggestion);

    } catch (error) {
        console.error('AI Suggestion Error:', error);
        
        // Return fallback suggestion
        return res.status(200).json({
            estimatedMins: 60,
            priority: 'Medium' as const,
            reasoning: 'Unable to get AI suggestions at this time, using default values.'
        });
    }
}
```

