import { useEffect, useState } from "react";
import { useTaskStore } from "../utils/TaskStore.ts";
import { useSettingsStore } from "../utils/SettingsStore.ts";
import type { Task } from "../types/TaskType.ts";

interface UndoNotificationProps {
    task: Task | null;
    onClose: () => void;
}

export default function UndoNotification({ task, onClose }: UndoNotificationProps) {
    const [timeLeft, setTimeLeft] = useState(0);
    const deleteDelay = useSettingsStore(s => s.deleteDelay);
    const undoDelete = useTaskStore(s => s.undoDelete);

    useEffect(() => {
        if (!task) return;

        setTimeLeft(deleteDelay);
        
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    onClose();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [task, deleteDelay, onClose]);

    if (!task) return null;

    const handleUndo = () => {
        undoDelete(task.id);
        onClose();
    };

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
            <div className="bg-gray-800 text-white rounded-lg shadow-lg p-4 flex items-center justify-between">
                <div className="flex-1">
                    <p className="font-SFProSemibold text-sm">Task deleted</p>
                    <p className="text-xs text-gray-300 truncate">"{task.title}"</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="text-xs text-gray-300">
                        {timeLeft}s
                    </div>
                    <button
                        onClick={handleUndo}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-SFProRegular"
                    >
                        Undo
                    </button>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
