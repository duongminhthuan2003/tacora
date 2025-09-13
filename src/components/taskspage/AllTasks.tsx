import { useTaskStore } from "../../utils/TaskStore.ts";
import {useMemo, useState} from "react";
import TaskCard from "../TaskCard.tsx";
import {findConflicts} from "../../utils/Conflict.ts";
import type {Task} from "../../types/TaskType.ts";
import EditTaskOverlay from "../EditTaskOverlay.tsx";

export default function AllTasks() {
    const tasks = useTaskStore(s => s.tasks
    );
    const [editOpen, setEditOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const sorted = useMemo(
        () => [...tasks].sort((a, b) => +new Date(a.dueAt) - +new Date(b.dueAt)),
        [tasks]
    );

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setEditOpen(true);
    };

    const conflictIds = useMemo(
        () => findConflicts(tasks, { windowHours: 48, minHeavyMins: 45, minPrioritySum: 5 }),
        [tasks]
    );

    const handleCloseEdit = () => {
        setEditOpen(false);
        setEditingTask(null);
    };

    return (
        <div>
            <div className="flex flex-col gap-3">
                {sorted.map(t => (
                    <TaskCard
                        key={t.id}
                        task={t}
                        inConflict={conflictIds.has(t.id)}
                        onEdit={handleEditTask}
                    />
                ))}

                {sorted.length === 0 && (
                    <div className="rounded-xl border border-dashed p-6 text-center text-gray-500">
                        Press "Add task" to add a new task.
                    </div>
                )}
            </div>

            <EditTaskOverlay open={editOpen} onClose={handleCloseEdit} task={editingTask} />
        </div>
    )
}
