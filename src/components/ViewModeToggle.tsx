import type { ViewMode } from "../types/TaskViewMode.ts";

const viewMode: {key: ViewMode; label: string }[] = [
    {key: "all", label: "All"},
    {key: "date", label: "Date"},
    {key: "conflict", label: "Conflicting"},
    {key: "type", label: "Type"},
]

export default function ViewModeToggle({value, onChange}: { value: ViewMode; onChange: (v: ViewMode) => void }) {
    return (
        <div className="flex flex-row gap-2">
            {
                viewMode.map(
                    opt=> {
                        const active = value === opt.key;
                        return (
                            <button
                                className={`px-4 py-1 rounded-lg font-SFProRegular ${active ? "bg-tacora text-white" : "bg-tacora-light"} transition-all`}
                                key={opt.key}
                                role="tab"
                                aria-selected={active}
                                onClick={() => onChange(opt.key)}
                            >
                                {opt.label}
                            </button>
                        )
                    }
                )
            }
        </div>
    )
}
