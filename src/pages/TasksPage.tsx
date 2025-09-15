import { useState, useRef } from "react";
import AddTaskOverlay from "../components/AddTaskOverlay.tsx";
import {HugeiconsIcon} from "@hugeicons/react";
import {TaskAdd02Icon} from "@hugeicons/core-free-icons";
import ViewModeToggle from "../components/ViewModeToggle.tsx"
import type { ViewMode } from '../types/TaskViewMode.ts';
import AllTasks from "../components/taskspage/AllTasks.tsx";
import TasksByType from "../components/taskspage/TasksByType.tsx";
import TasksByDate from "../components/taskspage/TasksByDate.tsx";
import ConflictingTasks from "../components/taskspage/ConflictingTasks.tsx";
import { useTaskStore } from "../utils/TaskStore.ts";
import type { Task } from "../types/TaskType.ts";

export default function TasksPage() {
    const [addOpen, setAddOpen] = useState(false);

    const [view, setView] = useState<ViewMode>('all');

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        const data = JSON.stringify(useTaskStore.getState().tasks, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tasks.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleImportChange = async (e: any) => {
        const f = e.target.files?.[0];
        if (!f) return;
        try {
            const text = await f.text();
            const parsed = JSON.parse(text) as Task[] | { tasks: Task[] };
            const incoming = Array.isArray(parsed) ? parsed : (parsed as any).tasks;
            if (!Array.isArray(incoming)) throw new Error('Invalid format');

            const replace = confirm('Delete all current tasks?');
            if (replace) {
                useTaskStore.setState({ tasks: [] });
            }

            incoming.forEach(({ id, ...t }) => useTaskStore.getState().add(t));
            alert(`Imported ${incoming.length} tasks${replace ? ' (replaced current tasks)' : ''}.`);
        } catch (err) {
            alert('Invalid tasks.json');
        } finally {
            e.target.value = '';
        }
    };

    return (
        <div className="mx-auto w-full lg:w-8/12 mt-6">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-xl font-SFProSemibold">Tasks</h1>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setAddOpen(true)}
                        className="flex flex-row rounded-lg justify-center items-center gap-1.5 bg-tacora px-4 py-2 text-sm text-white font-SFProRegular"
                    >
                        <div>
                            <HugeiconsIcon icon={TaskAdd02Icon} size={20} strokeWidth={1.7}/>
                        </div>
                        <p>Add task</p>
                    </button>
                    
                    <p className="font-SFProRegular">or</p>

                    <button
                        onClick={handleImportClick}
                        className="rounded-lg px-3 py-2 text-sm font-SFProRegular border border-tacora text-tacora"
                        title="Import tasks from JSON"
                    >
                        Import
                    </button>

                    <button
                        onClick={handleExport}
                        className="rounded-lg px-3 py-2 text-sm font-SFProRegular border border-tacora text-tacora"
                        title="Export tasks to JSON"
                    >
                        Export
                    </button>
                </div>
            </div>

            <div className="my-3">
                <ViewModeToggle value={view} onChange={setView} />
            </div>

            {view ==="all" && (<AllTasks />)}
            {view ==="date" && (<TasksByDate />)}
            {view ==="conflict" && (<ConflictingTasks />)}
            {view ==="type" && (<TasksByType />)}

            <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={handleImportChange}
            />

            <AddTaskOverlay open={addOpen} onClose={() => setAddOpen(false)} />
        </div>
    );
}