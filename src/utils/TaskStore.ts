import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Task } from "../types/TaskType.ts";

interface DeletedTask {
    task: Task;
    deletedAt: number;
    timeoutId: NodeJS.Timeout;
}

interface TaskStore {
    tasks: Task[];
    deletedTasks: Map<string, DeletedTask>;
    add: (t: Omit<Task, "id">) => void;
    update: (id: string, patch: Partial<Task>) => void;
    remove: (id: string) => void;
    scheduleDelete: (id: string, delaySeconds: number) => void;
    undoDelete: (id: string) => void;
    permanentlyDelete: (id: string) => void;
}

export const useTaskStore = create<TaskStore>()(
    persist(
        (set, get) => ({
            tasks: [],
            deletedTasks: new Map(),

            add: (t) => set((s) => ({
                tasks: [...s.tasks, { ...t, id: crypto.randomUUID() }]
            })),

            update: (id, patch) => set((s) => ({
                tasks: s.tasks.map(task =>
                    task.id === id ? { ...task, ...patch } : task
                )
            })),

            remove: (id) => set((s) => ({
                tasks: s.tasks.filter(task => task.id !== id)
            })),

            scheduleDelete: (id, delaySeconds) => {
                const state = get();
                const task = state.tasks.find(t => t.id === id);

                if (!task) return;

                set((s) => ({
                    tasks: s.tasks.filter(t => t.id !== id)
                }));

                const timeoutId = setTimeout(() => {
                    get().permanentlyDelete(id);
                }, delaySeconds * 1000);

                const deletedTask: DeletedTask = {
                    task,
                    deletedAt: Date.now(),
                    timeoutId
                };

                state.deletedTasks.set(id, deletedTask);
            },

            undoDelete: (id) => {
                const state = get();
                const deletedTask = state.deletedTasks.get(id);

                if (!deletedTask) return;

                clearTimeout(deletedTask.timeoutId);

                state.deletedTasks.delete(id);

                set((s) => ({
                    tasks: [...s.tasks, deletedTask.task]
                }));
            },

            permanentlyDelete: (id) => {
                const state = get();
                state.deletedTasks.delete(id);
            },
        }),
        {
            name: "tacora-tasks",
            version: 1,
        }
    )
);
