import React, { useState, useEffect } from "react";
import { useTaskStore } from "../utils/TaskStore.ts";
import type { Task, Priority, Type } from "../types/TaskType.ts";

interface EditTaskModalProps {
    open: boolean;
    onClose: () => void;
    task: Task | null;
}

export default function EditTaskOverlay({ open, onClose, task }: EditTaskModalProps) {
    const update = useTaskStore(s => s.update);

    const [title, setTitle] = useState("");
    const [dueAt, setDueAt] = useState("");
    const [estimatedMins, setEstimatedMins] = useState<number>(60);
    const [priority, setPriority] = useState<Priority>("Medium");
    const [type, setType] = useState<Type>("School");
    const [error, setError] = useState<string | null>(null);
    
    // Populate form when task changes
    useEffect(() => {
        if (task) {
            setTitle(task.title);
            const dueDate = new Date(task.dueAt);
            const localDateTime = new Date(dueDate.getTime() - dueDate.getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16);
            setDueAt(localDateTime);
            setEstimatedMins(task.estimatedMins);
            setPriority(task.priority);
            setType(task.type);
            setError(null);
        }
    }, [task]);

    if (!open || !task) return null;

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

        update(task!.id, {
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

            <div className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-lg">
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Edit Task</h2>
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
                            className="rounded-lg bg-tacora px-4 py-2 text-sm font-medium text-white hover:bg-tacora-dark"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
