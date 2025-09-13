import { useState } from "react";
import AddTaskOverlay from "../components/AddTaskOverlay.tsx";
import {HugeiconsIcon} from "@hugeicons/react";
import {TaskAdd02Icon} from "@hugeicons/core-free-icons";
import ViewModeToggle from "../components/ViewModeToggle.tsx"
import type { ViewMode } from '../types/TaskViewMode.ts';
import AllTasks from "../components/taskspage/AllTasks.tsx";
import TasksByType from "../components/taskspage/TasksByType.tsx";
import TasksByDate from "../components/taskspage/TasksByDate.tsx";
import ConflictingTasks from "../components/taskspage/ConflictingTasks.tsx";

export default function TasksPage() {
    const [addOpen, setAddOpen] = useState(false);

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
