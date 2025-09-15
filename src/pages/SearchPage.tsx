import { useTaskStore } from "../utils/TaskStore.ts";
import { useMemo, useState } from "react";
import TaskCard from "../components/TaskCard.tsx";
import { findConflicts } from "../utils/Conflict.ts";
import type { Task } from "../types/TaskType.ts";
import EditTaskOverlay from "../components/EditTaskOverlay.tsx";

export default function SearchPage() {
    const tasks = useTaskStore(s => s.tasks);
    const [searchQuery, setSearchQuery] = useState("");
    const [editOpen, setEditOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const filteredTasks = useMemo(() => {
        if (!searchQuery.trim()) {
            return [];
        }

        return tasks.filter(task =>
            task.title.toLowerCase().includes(searchQuery.toLowerCase())
        ).sort((a, b) => +new Date(a.dueAt) - +new Date(b.dueAt));
    }, [tasks, searchQuery]);

    const conflictIds = useMemo(
        () => findConflicts(tasks, { windowHours: 48, minHeavyMins: 45, minPrioritySum: 5 }),
        [tasks]
    );

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setEditOpen(true);
    };

    const handleCloseEdit = () => {
        setEditOpen(false);
        setEditingTask(null);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="p-4 lg:w-8/12 w-full mx-auto">
            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search tasks by title..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl font-SFProRegular text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-tacora focus:border-tacora"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            <div>
                {!searchQuery.trim() ? (
                    <div className="rounded-xl border border-dashed p-6 text-center text-gray-500">
                        <div className="mb-2">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                        <p className="font-SFProRegular">Start typing to search for tasks by title</p>
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="rounded-xl border border-dashed p-6 text-center text-gray-500">
                        <div className="mb-2">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1}
                                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.563M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        </div>
                        <p className="font-SFProRegular">
                            No tasks found matching "{searchQuery}"
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="mb-4">
                            <p className="text-gray-600 font-SFProRegular">
                                Found {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} matching "{searchQuery}"
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            {filteredTasks.map(task => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    inConflict={conflictIds.has(task.id)}
                                    onEdit={handleEditTask}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            <EditTaskOverlay open={editOpen} onClose={handleCloseEdit} task={editingTask} />
        </div>
    );
}
