import React, { useState, useEffect } from "react";
import { useTaskStore } from "../utils/TaskStore.ts";
import { aiService } from "../services/aiService.ts";
import AISuggestionCard from "./AISuggestionCard.tsx";
import type { AISuggestionResponse, AISuggestionState } from "../types/AISuggestion.ts";

type Priority = "Low" | "Medium" | "High";
export type Type = "Work" | "School" | "Group" | "Club" | "Other";

interface AddTaskModalProps {
    open: boolean;
    onClose: () => void;
}

export default function AddTaskModal({ open, onClose }: AddTaskModalProps) {
    const { add, tasks } = useTaskStore(s => ({ add: s.add, tasks: s.tasks }));

    const [title, setTitle] = useState("");
    const [dueAt, setDueAt] = useState("");
    const [estimatedMins, setEstimatedMins] = useState<number>(60);
    const [priority, setPriority] = useState<Priority>("Medium");
    const [type, setType] = useState<Type>("School");
    const [error, setError] = useState<string | null>(null);
    
    // AI suggestion state
    const [aiState, setAiState] = useState<AISuggestionState>({
        isLoading: false,
        suggestion: null,
        error: null
    });
    const [showAISuggestions, setShowAISuggestions] = useState(false);

    // Auto-trigger AI suggestions when title changes (with debounce)
    useEffect(() => {
        if (!title.trim() || title.length < 3) {
            setAiState(prev => ({ ...prev, suggestion: null }));
            setShowAISuggestions(false);
            return;
        }

        const debounceTimer = setTimeout(() => {
            getAISuggestions();
        }, 1000); // 1 second debounce

        return () => clearTimeout(debounceTimer);
    }, [title, dueAt, type]);

    if (!open) return null;

    async function getAISuggestions() {
        if (!title.trim()) return;

        setAiState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const suggestion = await aiService.getSuggestionWithContext(
                title,
                dueAt || undefined,
                type,
                tasks
            );

            setAiState({
                isLoading: false,
                suggestion,
                error: null
            });
            setShowAISuggestions(true);
        } catch (error) {
            setAiState({
                isLoading: false,
                suggestion: null,
                error: 'Failed to get AI suggestions'
            });
        }
    }

    function applySuggestion(suggestion: AISuggestionResponse) {
        setEstimatedMins(suggestion.estimatedMins);
        setPriority(suggestion.priority);
        setShowAISuggestions(false);
    }

    function resetForm() {
        setTitle("");
        setDueAt("");
        setEstimatedMins(60);
        setPriority("Medium");
        setType("School");
        setError(null);
        setAiState({ isLoading: false, suggestion: null, error: null });
        setShowAISuggestions(false);
    }

    function handleClose() {
        resetForm();
        onClose();
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!title.trim()) return setError("Please enter a title");
        if (!dueAt) return setError("Please choose a deadline");

        const iso = new Date(dueAt).toISOString();

        add({
            title: title.trim(),
            dueAt: iso,
            estimatedMins: Number(estimatedMins) || 60,
            priority,
            type
        });

        handleClose();
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            aria-modal="true"
            role="dialog"
        >
            <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

            <div className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-lg max-h-[90vh] overflow-y-auto">
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Add Task</h2>
                    <button
                        onClick={handleClose}
                        className="rounded-lg px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="rounded-md bg-red-50 p-2 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <label className="block text-sm">
                        <span className="mb-1 block font-medium">Title</span>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Example: Complete OS Lab 2 Task 1"
                            autoFocus
                        />
                    </label>

                    <label className="block text-sm">
                        <span className="mb-1 block font-medium">Deadline</span>
                        <input
                            type="datetime-local"
                            value={dueAt}
                            onChange={e => setDueAt(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </label>

                    <label className="block text-sm">
                        <span className="mb-1 block font-medium">Type</span>
                        <select
                            value={type}
                            onChange={e => setType(e.target.value as Type)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="School">School</option>
                            <option value="Club">Club</option>
                            <option value="Group">Group</option>
                            <option value="Work">Work</option>
                            <option value="Other">Other</option>
                        </select>
                    </label>

                    {/* AI Suggestions Section */}
                    {(aiState.isLoading || (showAISuggestions && aiState.suggestion)) && (
                        <div className="space-y-3">
                            {aiState.isLoading ? (
                                <AISuggestionCard
                                    suggestion={{} as AISuggestionResponse}
                                    onApply={() => {}}
                                    onDismiss={() => setShowAISuggestions(false)}
                                    isLoading={true}
                                />
                            ) : aiState.suggestion && showAISuggestions ? (
                                <AISuggestionCard
                                    suggestion={aiState.suggestion}
                                    onApply={applySuggestion}
                                    onDismiss={() => setShowAISuggestions(false)}
                                />
                            ) : null}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <label className="text-sm">
                            <span className="mb-1 block font-medium">Estimated (mins)</span>
                            <input
                                type="number"
                                min={15}
                                step={15}
                                value={estimatedMins}
                                onChange={e => setEstimatedMins(Number(e.target.value))}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </label>

                        <label className="text-sm">
                            <span className="mb-1 block font-medium">Priority</span>
                            <select
                                value={priority}
                                onChange={e => setPriority(e.target.value as Priority)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </label>
                    </div>

                    {!showAISuggestions && !aiState.isLoading && title.trim().length >= 3 && (
                        <button
                            type="button"
                            onClick={getAISuggestions}
                            className="w-full rounded-lg border border-blue-300 bg-blue-50 px-4 py-2 text-sm text-blue-700 hover:bg-blue-100"
                        >
                            ✨ Get AI Suggestions
                        </button>
                    )}

                    <div className="mt-4 flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
