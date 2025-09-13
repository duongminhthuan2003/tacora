export type Priority = "Low" | "Medium" | "High";
export type Type = "Work" | "School" | "Group" | "Club" | "Other";

export interface Task {
    id: string;
    title: string;
    type: Type;
    dueAt: string;
    estimatedMins: number;
    priority: Priority;
}
