import type { AISuggestionRequest, AISuggestionResponse } from '../types/AISuggestion';

class AIService {
    private baseUrl = '/api';

    async getSuggestion(request: AISuggestionRequest): Promise<AISuggestionResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/ai-suggest`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('AI Service Error:', error);
            // Return fallback suggestion
            return {
                estimatedMins: 60,
                priority: 'Medium',
                reasoning: 'Unable to get AI suggestions at this time.'
            };
        }
    }

    async getSuggestionWithContext(
        title: string, 
        dueAt?: string, 
        type?: string, 
        existingTasks?: any[]
    ): Promise<AISuggestionResponse> {
        const contextTasks = existingTasks?.map(task => ({
            title: task.title,
            type: task.type,
            priority: task.priority,
            estimatedMins: task.estimatedMins
        }));

        return this.getSuggestion({
            title,
            dueAt,
            type,
            existingTasks: contextTasks
        });
    }
}

export const aiService = new AIService();