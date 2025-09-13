// TaskCard.tsx
import { useMemo } from "react";
import { useTaskStore } from "../utils/TaskStore.ts";
import type { Task } from "../types/TaskType.ts";

type Status = "Incoming" | "Warning" | "Dangerous";

function computeStatus(dueISO: string): Status {
    const hours = Math.max(0, (new Date(dueISO).getTime() - Date.now()) / 36e5);
    if (hours <= 24) return "Dangerous";
    if (hours <= 72) return "Warning";
    return "Incoming";
}

function StatusBadge({ status }: { status: Status }) {
    return (
        <div className={`flex justify-center items-center text-white px-2 py-0.5 rounded-lg ${
            status === "Incoming" ? "bg-incoming" :
                status === "Warning"  ? "bg-warning"  : "bg-dangerous"
        }`}>
            {status}
        </div>
    );
}

function ConflictingBadge() {
    return (
        <div className="flex justify-center items-center bg-conflicting text-white px-2 py-0.5 rounded-lg">
            Conflicting
        </div>
    );
}

interface TaskCardProps {
    task: Task;
    inConflict: boolean;
    onEdit?: (task: Task) => void;
}

export default function TaskCard({ task, inConflict, onEdit }: TaskCardProps) {
    const status = useMemo(() => computeStatus(task.dueAt), [task.dueAt]);

    const remove = useTaskStore(s => s.remove);

    return (
        <div className="bg-tacora-light text-sm px-5 py-4 font-SFProRegular rounded-xl">
            <div className="flex flex-row justify-center items-center">
                <p className="text-lg font-SFProSemibold">{task.title}</p>
                <div className="flex-1" />
                <p className="bg-tacora text-white px-2.5 py-0.5 rounded-lg">{task.type}</p>
            </div>

            <div className="flex flex-row">
                <p>
                    Due time: {new Date(task.dueAt).toLocaleDateString()} •{" "}
                    {new Date(task.dueAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
                <div className="flex-1" />
                <p>Estimated: {task.estimatedMins} mins</p>
            </div>

            <div className="mt-0.5">Priority: {task.priority}</div>

            <div className="flex flex-row gap-2 mt-1">
                <StatusBadge status={status} />
                {inConflict && <ConflictingBadge />}

                <div className="flex-1" />

                <button
                    onClick={() => onEdit?.(task)}
                    className="flex justify-center items-center border-tacora border-2 px-2 w-14 py-0.5 rounded-lg"
                >
                    Edit
                </button>

                <button
                    onClick={() => remove(task.id)}
                    className="flex justify-center items-center bg-tacora px-2 w-15 py-0.5 rounded-lg text-white"
                >
                    Done
                </button>
            </div>
        </div>
    );
}
