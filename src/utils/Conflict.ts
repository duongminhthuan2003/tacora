import type { Task, Priority } from "../types/TaskType"; // đổi path theo dự án bạn

const PRIORITY_WEIGHT: Record<Priority, number> = {
    High: 3,
    Medium: 2,
    Low: 1,
};

export interface ConflictOptions {
    windowHours?: number;     // khoảng gần hạn: mặc định 48h
    minHeavyMins?: number;    // ngưỡng “việc nặng”: mặc định 45’
    minPrioritySum?: number;  // tổng trọng số ưu tiên tối thiểu để coi là đáng lo: mặc định 5 (Medium+High ~ 2+3)
}

export function findConflicts(
    tasks: Task[],
    opts: ConflictOptions = {}
): Set<string> {
    const windowHours = opts.windowHours ?? 48;
    const minHeavyMins = opts.minHeavyMins ?? 45;
    const minPrioritySum = opts.minPrioritySum ?? 5;

    const sorted = [...tasks].sort(
        (a, b) => +new Date(a.dueAt) - +new Date(b.dueAt)
    );

    const ids = new Set<string>();

    for (let i = 0; i < sorted.length; i++) {
        for (let j = i + 1; j < sorted.length; j++) {
            const deltaH =
                (+new Date(sorted[j].dueAt) - +new Date(sorted[i].dueAt)) / 36e5;

            if (deltaH > windowHours) break;

            const heavy =
                Math.max(sorted[i].estimatedMins, sorted[j].estimatedMins) >=
                minHeavyMins;

            const prioritySum =
                PRIORITY_WEIGHT[sorted[i].priority] +
                PRIORITY_WEIGHT[sorted[j].priority];

            const important = prioritySum >= minPrioritySum;

            if (heavy || important) {
                ids.add(sorted[i].id);
                ids.add(sorted[j].id);
            }
        }
    }

    return ids;
}
