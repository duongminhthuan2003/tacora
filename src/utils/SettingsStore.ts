import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DeleteDelay = 3 | 5 | 10;

interface SettingsStore {
    deleteDelay: DeleteDelay;
    setDeleteDelay: (delay: DeleteDelay) => void;

    conflictWindowHours: number;
    setConflictWindowHours: (n: number) => void;

    conflictMinHeavyMins: number;
    setConflictMinHeavyMins: (n: number) => void;

    conflictMinPrioritySum: number;
    setConflictMinPrioritySum: (n: number) => void;
}

export const useSettingsStore = create<SettingsStore>()(
    persist(
        (set) => ({
            deleteDelay: 10,
            setDeleteDelay: (delay) => set({ deleteDelay: delay }),

            conflictWindowHours: 48,
            setConflictWindowHours: (n) => set({ conflictWindowHours: Math.max(1, Math.floor(n || 0)) }),

            conflictMinHeavyMins: 45,
            setConflictMinHeavyMins: (n) => set({ conflictMinHeavyMins: Math.max(1, Math.floor(n || 0)) }),

            conflictMinPrioritySum: 5,
            setConflictMinPrioritySum: (n) => set({ conflictMinPrioritySum: Math.max(1, Math.floor(n || 0)) }),
        }),
        {
            name: "tacora-settings",
            version: 2,
        }
    )
);