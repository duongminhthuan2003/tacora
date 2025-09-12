export default function HomePage() {
    return (
        <div>
            <div>
                <p className="font-SFProSemibold text-xl mt-8">
                    Summary
                </p>

                <div className="flex flex-col gap-3 mt-2 font-SFProRegular">
                    <div className="flex flex-row gap-3 h-40">
                        <div className="flex flex-col flex-1 bg-[#4AA239] p-2 rounded-2xl">
                            <p className="ml-2 mt-1 text-white">
                                Incoming
                            </p>
                            <div className="flex-1"></div>
                            <div className="w-full h-9/12 bg-white rounded-xl">

                            </div>
                        </div>

                        <div className="flex flex-col flex-1 bg-[#FFA13F] p-2 rounded-2xl">
                            <p className="ml-2 mt-1 text-white">
                                Warning
                            </p>
                            <div className="flex-1"></div>
                            <div className="w-full h-9/12 bg-white rounded-xl">

                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row gap-3 h-40">
                        <div className="flex flex-col flex-1 bg-[#F86163] p-2 rounded-2xl">
                            <p className="ml-2 mt-1 text-white">
                                Dangerous
                            </p>
                            <div className="flex-1"></div>
                            <div className="w-full h-9/12 bg-white rounded-xl">

                            </div>
                        </div>

                        <div className="flex flex-col flex-1 bg-[#8D55F5] p-2 rounded-2xl">
                            <p className="ml-2 mt-1 text-white">
                                Conflicting
                            </p>
                            <div className="flex-1"></div>
                            <div className="w-full h-9/12 bg-white rounded-xl">

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <p className="font-SFProSemibold text-xl mt-8">
                    Tasks due soon
                </p>
            </div>
        </div>
    )
}
