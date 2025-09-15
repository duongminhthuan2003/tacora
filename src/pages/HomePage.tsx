import TaskCard from "../components/TaskCard.tsx";
import EditTaskOverlay from "../components/EditTaskOverlay.tsx";
import { useTaskStore } from "../utils/TaskStore.ts";
import { countByStatus, countConflictingTasks } from "../utils/TaskUtils.ts";
import { useMemo, useState } from "react";
import type { Task } from "../types/TaskType.ts";
import {findConflicts} from "../utils/Conflict.ts";

export default function HomePage() {
    const tasks = useTaskStore(s => s.tasks);

    const [editOpen, setEditOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const sorted = useMemo(
        () => [...tasks].sort((a, b) => +new Date(a.dueAt) - +new Date(b.dueAt)),
        [tasks]
    );

    const counts = useMemo(() => ({
        incoming: countByStatus(tasks, "Incoming"),
        warning: countByStatus(tasks, "Warning"),
        dangerous: countByStatus(tasks, "Dangerous"),
        conflicting: countConflictingTasks(tasks)
    }), [tasks]);

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setEditOpen(true);
    };

    const handleCloseEdit = () => {
        setEditOpen(false);
        setEditingTask(null);
    };

    const conflictIds = useMemo(
        () => findConflicts(tasks, { windowHours: 48, minHeavyMins: 45, minPrioritySum: 5 }),
        [tasks]
    );

    return (
        <div>
            <div>
                <p className="font-SFProSemibold text-xl mt-8">
                    Summary
                </p>

                <div className="flex flex-col gap-3 mt-2 h-80 lg:h-56 font-SFProRegular lg:flex-row">
                    <div className="flex flex-row gap-3 flex-1">
                        <div className="flex flex-col flex-1 bg-[#4AA239] p-2 rounded-2xl">
                            <p className="ml-2 mt-1 text-white">
                                Incoming
                            </p>
                            <div className="flex-1"></div>
                            <div className="w-full h-9/12 bg-white rounded-xl flex items-center justify-center">
                                <div className="-mt-1 text-2xl">
                                    {counts.incoming}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col flex-1 bg-[#FFA13F] p-2 rounded-2xl">
                            <p className="ml-2 mt-1 text-white">
                                Warning
                            </p>
                            <div className="flex-1"></div>
                            <div className="w-full h-9/12 bg-white rounded-xl flex items-center justify-center">
                                <div className="-mt-1 text-2xl">
                                    {counts.warning}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row gap-3 flex-1">
                        <div className="flex flex-col flex-1 bg-[#F86163] p-2 rounded-2xl">
                            <p className="ml-2 mt-1 text-white">
                                Dangerous
                            </p>
                            <div className="flex-1"></div>
                            <div className="w-full h-9/12 bg-white rounded-xl flex items-center justify-center">
                                <div className="-mt-1 text-2xl">
                                    {counts.dangerous}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col flex-1 bg-[#8D55F5] p-2 rounded-2xl">
                            <p className="ml-2 mt-1 text-white">
                                Conflicting
                            </p>
                            <div className="flex-1"></div>
                            <div className="w-full h-9/12 bg-white rounded-xl flex items-center justify-center">
                                <div className="-mt-1 text-2xl">
                                    {counts.conflicting}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <p className="font-SFProSemibold text-xl mt-8 mb-2">
                    Due soon
                </p>
                <div className="flex flex-col gap-3 md:grid md:grid-cols-2 xl:grid-cols-3">
                    {
                        sorted.map((t) => (
                            <div key={t.id}>
                                <TaskCard
                                    task={t}
                                    inConflict={conflictIds.has(t.id)}
                                    onEdit={handleEditTask}
                                />
                            </div>
                        ))
                    }
                    {sorted.length === 0 && (
                        <div className="rounded-xl border border-dashed p-6 text-center text-gray-500">
                            Press "Add task" in Tasks Page to add a new task.
                        </div>
                    )}
                </div>
            </div>

            <EditTaskOverlay
                open={editOpen}
                onClose={handleCloseEdit}
                task={editingTask}
            />
        </div>
    )
}
