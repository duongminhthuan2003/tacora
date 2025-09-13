export interface AISuggestionRequest {
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

export interface AISuggestionResponse {
    estimatedMins: number;
    priority: 'Low' | 'Medium' | 'High';
    reasoning?: string;
    suggestions?: string[];
}

export interface AISuggestionState {
    isLoading: boolean;
    suggestion: AISuggestionResponse | null;
    error: string | null;
}
