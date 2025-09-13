import type { AISuggestionResponse } from '../types/AISuggestion';

interface AISuggestionCardProps {
    suggestion: AISuggestionResponse;
    onApply: (suggestion: AISuggestionResponse) => void;
    onDismiss: () => void;
    isLoading?: boolean;
}

export default function AISuggestionCard({ 
    suggestion, 
    onApply, 
    onDismiss, 
    isLoading = false 
}: AISuggestionCardProps) {
    if (isLoading) {
        return (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                    <span className="text-sm text-blue-700">Getting AI suggestions...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                        AI
                    </div>
                    <span className="font-medium text-blue-900">Smart Suggestions</span>
                </div>
                <button
                    onClick={onDismiss}
                    className="text-blue-600 hover:text-blue-800"
                    aria-label="Dismiss suggestions"
                >
                    ✕
                </button>
            </div>

            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded bg-white px-3 py-2">
                        <span className="font-medium text-gray-700">Time:</span>
                        <span className="ml-1 text-blue-700">{suggestion.estimatedMins} mins</span>
                    </div>
                    <div className="rounded bg-white px-3 py-2">
                        <span className="font-medium text-gray-700">Priority:</span>
                        <span className={`ml-1 font-medium ${
                            suggestion.priority === 'High' ? 'text-red-600' :
                            suggestion.priority === 'Medium' ? 'text-yellow-600' :
                            'text-green-600'
                        }`}>
                            {suggestion.priority}
                        </span>
                    </div>
                </div>

                {suggestion.reasoning && (
                    <div className="rounded bg-white p-3 text-sm">
                        <span className="font-medium text-gray-700">Reasoning:</span>
                        <p className="mt-1 text-gray-600">{suggestion.reasoning}</p>
                    </div>
                )}

                {suggestion.suggestions && suggestion.suggestions.length > 0 && (
                    <div className="rounded bg-white p-3 text-sm">
                        <span className="font-medium text-gray-700">Tips:</span>
                        <ul className="mt-1 space-y-1">
                            {suggestion.suggestions.map((tip, index) => (
                                <li key={index} className="flex items-start gap-2 text-gray-600">
                                    <span className="mt-0.5 h-1 w-1 rounded-full bg-blue-500 flex-shrink-0"></span>
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="flex gap-2">
                    <button
                        onClick={() => onApply(suggestion)}
                        className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        Apply Suggestions
                    </button>
                    <button
                        onClick={onDismiss}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    );
}
