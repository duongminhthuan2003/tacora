import { useMemo, useState } from "react";
import AddTaskOverlay from "../components/AddTaskOverlay.tsx";
import EditTaskOverlay from "../components/EditTaskOverlay.tsx";
import { useTaskStore } from "../utils/TaskStore.ts";
import type { Task } from "../types/TaskType.ts";
import TaskCard from "../components/TaskCard.tsx";
import { findConflicts } from "../utils/Conflict.ts";
import {HugeiconsIcon} from "@hugeicons/react";
import {TaskAdd02Icon} from "@hugeicons/core-free-icons";
import ViewModeToggle from "../components/ViewModeToggle.tsx"
import type { ViewMode } from '../types/TaskViewMode.ts';
import AllTasks from "../components/taskspage/AllTasks.tsx";
import TasksByType from "../components/taskspage/TasksByType.tsx";
import TasksByDate from "../components/taskspage/TasksByDate.tsx";
import ConflictingTasks from "../components/taskspage/ConflictingTasks.tsx";

export default function TasksPage() {
    const tasks = useTaskStore(s => s.tasks);

    const [addOpen, setAddOpen] = useState(false);
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

    const handleCloseEdit = () => {
        setEditOpen(false);
        setEditingTask(null);
    };

    const conflictIds = useMemo(
        () => findConflicts(tasks, { windowHours: 48, minHeavyMins: 45, minPrioritySum: 5 }),
        [tasks]
    );

    const [view, setView] = useState<ViewMode>('all'); // hoặc lấy từ Zustand

    return (
        <div className="mx-auto max-w-3xl mt-6">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-xl font-SFProSemibold">Tasks</h1>
                <button
                    onClick={() => setAddOpen(true)}
                    className="flex flex-row rounded-lg justify-center items-center gap-1.5 bg-tacora px-4 py-2 text-sm text-white font-SFProRegular"
                >
                    <div>
                        <HugeiconsIcon icon={TaskAdd02Icon} size={20} strokeWidth={1.7}/>
                    </div>
                    <p>Add task</p>
                </button>
            </div>

            <div className="my-3">
                <ViewModeToggle value={view} onChange={setView} />
            </div>

            {view ==="all" && (<AllTasks />)}
            {view ==="date" && (<TasksByDate />)}
            {view ==="conflict" && (<ConflictingTasks />)}
            {view ==="type" && (<TasksByType />)}

            <AddTaskOverlay open={addOpen} onClose={() => setAddOpen(false)} />
        </div>
    );
}
