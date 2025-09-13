import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Task } from "../types/TaskType.ts";

interface TaskStore {
    tasks: Task[];
    add: (t: Omit<Task, "id">) => void;
    update: (id: string, patch: Partial<Task>) => void;
    remove: (id: string) => void;
}

export const useTaskStore = create<TaskStore>()(
    persist(
        (set) => ({
            tasks: [],
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
        }),
        {
            name: "tacora-tasks",
            version: 1,
        }
    )
);