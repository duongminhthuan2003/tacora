import { useSettingsStore, type DeleteDelay } from "../utils/SettingsStore.ts";

const DELETE_DELAY_OPTIONS: { value: DeleteDelay; label: string }[] = [
    { value: 3, label: "3 seconds"},
    { value: 5, label: "5 seconds"},
    { value: 10, label: "10 seconds"}
];

export default function SettingsPage() {
    const {
        deleteDelay, setDeleteDelay,
        conflictWindowHours, setConflictWindowHours,
        conflictMinHeavyMins, setConflictMinHeavyMins,
        conflictMinPrioritySum, setConflictMinPrioritySum
    } = useSettingsStore();

    return (
        <div className="pt-6 w-full lg:w-8/12 mx-auto font-SFProRegular">
            <h1 className="text-xl font-SFProSemibold text-gray-900 mb-6">Settings</h1>

            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-SFProSemibold text-gray-900 mb-4">Undo time (Currently unavailable)</h2>

                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-600 mb-4">
                            Choose how long you can undo after deleting a task.
                        </p>

                        <div className="space-y-3">
                            {DELETE_DELAY_OPTIONS.map((option) => (
                                <label
                                    key={option.value}
                                    className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                >
                                    <input
                                        type="radio"
                                        name="deleteDelay"
                                        value={option.value}
                                        checked={deleteDelay === option.value}
                                        onChange={() => setDeleteDelay(option.value)}
                                        className="h-4 w-4 accent-tacora border-gray-300 focus:ring-tacora"
                                    />
                                    <div className="ml-3 flex-1">
                                        <div className="font-SFProMedium text-gray-900">
                                            {option.label}
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-SFProSemibold text-gray-900 mb-4">Conflict Rules</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Adjust how tasks are flagged as conflicting.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="text-sm">
                        <span className="mb-1 block font-medium">Window (hours)</span>
                        <input
                            type="number"
                            min={1}
                            value={conflictWindowHours}
                            onChange={(e) => setConflictWindowHours(Number(e.target.value))}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-tacora"
                        />
                    </label>

                    <label className="text-sm">
                        <span className="mb-1 block font-medium">Heavy threshold (mins)</span>
                        <input
                            type="number"
                            min={1}
                            step={5}
                            value={conflictMinHeavyMins}
                            onChange={(e) => setConflictMinHeavyMins(Number(e.target.value))}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-tacora"
                        />
                    </label>

                    <label className="text-sm">
                        <span className="mb-1 block font-medium">Priority sum min</span>
                        <input
                            type="number"
                            min={1}
                            value={conflictMinPrioritySum}
                            onChange={(e) => setConflictMinPrioritySum(Number(e.target.value))}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-tacora"
                        />
                    </label>
                </div>
            </div>
        </div>
    );
}