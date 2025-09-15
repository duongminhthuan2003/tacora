import type { Task } from "../types/TaskType.ts";
import { useTaskStore } from "../utils/TaskStore.ts";
import { useSettingsStore } from "../utils/SettingsStore.ts";
import { AnimatePresence, motion } from "framer-motion";

interface DeleteConfirmationProps {
    open: boolean;
    onClose: () => void;
    task: Task | null;
    onDeleteConfirmed: (task: Task) => void;
}

export default function DeleteConfirmation({ open, onClose, task, onDeleteConfirmed }: DeleteConfirmationProps) {
    const scheduleDelete = useTaskStore(s => s.scheduleDelete);
    const deleteDelay = useSettingsStore(s => s.deleteDelay);

    if (!task) return null;

    const handleDelete = () => {
        scheduleDelete(task.id, deleteDelay);
        onDeleteConfirmed(task);
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    aria-modal="true"
                    role="dialog"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="absolute inset-0 bg-black/40" onClick={onClose} />
                    <motion.div
                        initial={{opacity: 0, scale: 0.9}}
                        animate={{opacity: 1, scale: 1}}
                        exit={{opacity: 0, scale: 0.9}}
                        className="relative bg-white rounded-xl p-6 mx-4 max-w-sm w-full shadow-xl"
                    >
                        <div className="text-center">
                            <h3 className="text-lg font-SFProSemibold text-gray-900 mb-2">
                                Delete Task
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete "{task.title}"?
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-SFProRegular"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-SFProRegular"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
