import { useTaskStore } from "../../utils/TaskStore.ts";
import { useMemo, useState } from "react";
import TaskCard from "../TaskCard.tsx";
import { findConflicts } from "../../utils/Conflict.ts";
import type { Task } from "../../types/TaskType.ts";
import EditTaskOverlay from "../EditTaskOverlay.tsx";
import { useSettingsStore } from "../../utils/SettingsStore.ts";

export default function ConflictingTasks() {
    const tasks = useTaskStore(s => s.tasks);
    const { conflictWindowHours, conflictMinHeavyMins, conflictMinPrioritySum } = useSettingsStore();
    const [editOpen, setEditOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const conflictIds = useMemo(
        () => findConflicts(tasks, {
            windowHours: conflictWindowHours,
            minHeavyMins: conflictMinHeavyMins,
            minPrioritySum: conflictMinPrioritySum
        }),
        [tasks, conflictWindowHours, conflictMinHeavyMins, conflictMinPrioritySum]
    );

    const conflictingTasks = useMemo(() => {
        const filtered = tasks.filter(task => conflictIds.has(task.id));
        return filtered.sort((a, b) => +new Date(a.dueAt) - +new Date(b.dueAt));
    }, [tasks, conflictIds]);

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setEditOpen(true);
    };

    const handleCloseEdit = () => {
        setEditOpen(false);
        setEditingTask(null);
    };

    if (conflictingTasks.length === 0) {
        return (
            <div className="rounded-xl border border-dashed p-6 text-center text-gray-500">
                <div className="mb-2">No conflicting tasks!</div>
            </div>
        );
    }

    return (
        <div className="font-SFProRegular">
            <div className="mb-3 p-3 bg-purple-50 border border-purple-200 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-conflicting rounded-full"></div>
                    <span className="font-SFProSemibold text-purple-800">
                        {conflictingTasks.length} Conflicting Task{conflictingTasks.length !== 1 ? 's' : ''}
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                {conflictingTasks.map(task => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        inConflict={true}
                        onEdit={handleEditTask}
                    />
                ))}
            </div>

            <EditTaskOverlay open={editOpen} onClose={handleCloseEdit} task={editingTask} />
        </div>
    );
}