import { useTaskStore } from "../../utils/TaskStore.ts";
import { useMemo, useState } from "react";
import TaskCard from "../TaskCard.tsx";
import { findConflicts } from "../../utils/Conflict.ts";
import type { Task, Type } from "../../types/TaskType.ts";
import EditTaskOverlay from "../EditTaskOverlay.tsx";

export default function TasksByType() {
    const tasks = useTaskStore(s => s.tasks);
    const [editOpen, setEditOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const tasksByType = useMemo(() => {
        const grouped: Record<Type, Task[]> = {
            School: [],
            Work: [],
            Group: [],
            Club: [],
            Other: []
        };
        
        tasks.forEach(task => {
            grouped[task.type].push(task);
        });

        Object.keys(grouped).forEach(type => {
            grouped[type as Type].sort((a, b) => +new Date(a.dueAt) - +new Date(b.dueAt));
        });

        const typeOrder: Type[] = ["School", "Work", "Group", "Club", "Other"];
        return typeOrder
            .filter(type => grouped[type].length > 0)
            .map(type => ({
                type,
                tasks: grouped[type]
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

    if (tasksByType.length === 0) {
        return (
            <div className="rounded-xl border border-dashed p-6 text-center text-gray-500">
                Press "Add task" to add a new task.
            </div>
        );
    }

    return (
        <div>
            <div>
                {tasksByType.map(({ type, tasks: typeTasks }) => (
                    <div key={type}>
                        <div className="text-lg font-SFProSemibold mb-1 mt-3">
                            {type}
                        </div>
                        <div className="flex flex-col gap-3">
                            {typeTasks.map(task => (
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
