import React, {useEffect, useState} from "react";
import { useTaskStore } from "../utils/TaskStore.ts";
import { motion, AnimatePresence } from "motion/react";

type Priority = "Low" | "Medium" | "High";
export type Type = "Work" | "School" | "Group" | "Club" | "Other";

interface AddTaskModalProps {
    open: boolean;
    onClose: () => void;
}

export default function AddTaskModal({ open, onClose }: AddTaskModalProps) {
    const add = useTaskStore(s => s.add);

    const [title, setTitle] = useState("");
    const [dueAt, setDueAt] = useState("");
    const [hint, setHint] = useState<{priority: 'Low'|'Medium'|'High'; estimatedMins: number; rationale: string} | null>(null);
    const [loadingHint, setLoadingHint] = useState(false);

    const [estimatedMins, setEstimatedMins] = useState<number>(60);
    const [priority, setPriority] = useState<Priority>("Medium");
    const [type, setType] = useState<Type>("School");
    const [error, setError] = useState<string | null>(null);

    function resetForm() {
        setTitle("");
        setDueAt("");
        setEstimatedMins(60);
        setPriority("Medium");
        setType("School");
        setError(null);
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

    async function fetchSuggestion(title: string, type: Type, deadlineLocal: string) {
        if (!title || !type || !deadlineLocal) return;
        setLoadingHint(true);
        try {
            const deadlineISO = new Date(deadlineLocal).toISOString();
            const res = await fetch('/api/suggest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, type, deadline: deadlineISO }),
            });

            if (!res.ok) {
                const text = await res.text();
                console.error('Suggest API error', res.status, text);
                setHint(null);
                return;
            }

            const data = await res.json();
            if (!data.error) setHint(data);
        } finally {
            setLoadingHint(false);
        }
    }

    useEffect(() => {
        const id = setTimeout(() => {
            if (title && type && dueAt) fetchSuggestion(title, type, dueAt);
        }, 400);
        return () => clearTimeout(id);
    }, [title, type, dueAt]);

    function applyHint() {
        if (!hint) return;
        setPriority(hint.priority);
        setEstimatedMins(hint.estimatedMins);
    }

    if (!open) return null;

    return (
        <AnimatePresence>
            {open && (    
                    <div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    aria-modal="true"
                    role="dialog"
                >
                    <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="absolute inset-0 bg-black/40" onClick={handleClose} />

                    <motion.div initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}} className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-lg">
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
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-tacora"
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
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-tacora"
                                />
                            </label>

                            <label className="block text-sm">
                                <span className="mb-1 block font-medium">Type</span>
                                <select
                                    value={type}
                                    onChange={e => setType(e.target.value as Type)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-tacora"
                                >
                                    <option value="School">School</option>
                                    <option value="Club">Club</option>
                                    <option value="Group">Group</option>
                                    <option value="Work">Work</option>
                                    <option value="Other">Other</option>
                                </select>
                            </label>

                            <div className="grid grid-cols-2 gap-3">
                                <label className="text-sm">
                                    <span className="mb-1 font-medium">Estimated (mins)</span>
                                    <input
                                        type="number"
                                        min={15}
                                        step={15}
                                        value={estimatedMins}
                                        onChange={e => setEstimatedMins(Number(e.target.value))}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-tacora"
                                    />
                                </label>

                                <label className="text-sm">
                                    <span className="mb-1 font-medium">Priority</span>
                                    <select
                                        value={priority}
                                        onChange={e => setPriority(e.target.value as Priority)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-tacora"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </label>
                            </div>

                            {hint && (
                                <div className="rounded-xl border border-tacora p-4 text-sm font-SFProRegular">
                                    <div><b className="text-tacora">Tacora AI suggests:</b> Priority <u>{hint.priority}</u>, {hint.estimatedMins} mins</div>
                                    <div className="text-gray-500 font-SFProRegular">{hint.rationale}</div>
                                    <button type="button" onClick={applyHint} className="flex justify-center mt-1 rounded-lg bg-tacora mt-2 px-3 py-2 text-white">
                                        Apply
                                    </button>
                                </div>
                            )}
                            {loadingHint && <div className="text-sm text-gray-500 font-SFProRegular">Suggesting…</div>}

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
                                    className="rounded-lg bg-tacora px-4 py-2 text-sm font-medium text-white"
                                >
                                    Add
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
