import type { Task } from "../types/TaskType.ts";
import { findConflicts } from "./Conflict.ts";

export type Status = "Incoming" | "Warning" | "Dangerous";

export function hoursLeft(dueISO: string): number {
    return Math.max(0, (new Date(dueISO).getTime() - Date.now()) / (60*60*1000));
}

export function computeStatus(dueISO: string): Status {
    const h = hoursLeft(dueISO);
    if (h <= 24) return "Dangerous";
    if (h <= 72) return "Warning";
    return "Incoming";
}

export interface TaskCounts {
    incoming: number;
    warning: number;
    dangerous: number;
    conflicting: number;
    total: number;
}

export function countTasksByStatus(tasks: Task[]): TaskCounts {
    const conflictIds = findConflicts(tasks, { 
        windowHours: 48, 
        minHeavyMins: 45, 
        minPrioritySum: 5 
    });

    let incoming = 0;
    let warning = 0;
    let dangerous = 0;
    let conflicting = 0;

    tasks.forEach(task => {
        const status = computeStatus(task.dueAt);
        
        switch (status) {
            case "Incoming":
                incoming++;
                break;
            case "Warning":
                warning++;
                break;
            case "Dangerous":
                dangerous++;
                break;
        }

        if (conflictIds.has(task.id)) {
            conflicting++;
        }
    });

    return {
        incoming,
        warning,
        dangerous,
        conflicting,
        total: tasks.length
    };
}

export function countByStatus(tasks: Task[], status: Status): number {
    return tasks.filter(task => computeStatus(task.dueAt) === status).length;
}

export function countConflictingTasks(tasks: Task[]): number {
    const conflictIds = findConflicts(tasks, { 
        windowHours: 48, 
        minHeavyMins: 45, 
        minPrioritySum: 5 
    });
    return conflictIds.size;
}