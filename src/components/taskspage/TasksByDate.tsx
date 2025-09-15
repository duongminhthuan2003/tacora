import { useTaskStore } from "../../utils/TaskStore.ts";
import { useMemo, useState } from "react";
import TaskCard from "../TaskCard.tsx";
import { findConflicts } from "../../utils/Conflict.ts";
import type { Task } from "../../types/TaskType.ts";
import EditTaskOverlay from "../EditTaskOverlay.tsx";

function formatDateHeader(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    const formatted = date.toLocaleDateString('en-US', options);

    const day = date.getDate();
    let suffix = 'th';
    if (day % 10 === 1 && day !== 11) suffix = 'st';
    else if (day % 10 === 2 && day !== 12) suffix = 'nd';
    else if (day % 10 === 3 && day !== 13) suffix = 'rd';

    return formatted.replace(/(\d+),/, `$1${suffix},`);
}

function getDateKey(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

export default function TasksByDate() {
    const tasks = useTaskStore(s => s.tasks);
    const [editOpen, setEditOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const tasksByDate = useMemo(() => {
        const grouped: Record<string, Task[]> = {};

        tasks.forEach(task => {
            const dateKey = getDateKey(task.dueAt);
            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push(task);
        });

        Object.keys(grouped).forEach(dateKey => {
            grouped[dateKey].sort((a, b) => +new Date(a.dueAt) - +new Date(b.dueAt));
        });

        return Object.entries(grouped)
            .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
            .map(([dateKey, tasks]) => ({
                dateKey,
                date: new Date(dateKey + 'T00:00:00'),
                tasks
            }));
    }, [tasks]);

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

    if (tasksByDate.length === 0) {
        return (
            <div className="rounded-xl border border-dashed p-6 text-center text-gray-500">
                Press "Add task" to add a new task.
            </div>
        );
    }

    return (
        <div>
            <div>
                {tasksByDate.map(({ dateKey, date, tasks: dateTasks }) => (
                    <div key={dateKey}>
                        <div className="text-lg font-SFProSemibold mb-1 mt-3">
                            {formatDateHeader(date)}
                        </div>
                        <div className="flex flex-col gap-2">
                            {dateTasks.map(task => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    inConflict={conflictIds.has(task.id)}
                                    onEdit={handleEditTask}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <EditTaskOverlay open={editOpen} onClose={handleCloseEdit} task={editingTask} />
        </div>
    );
}
