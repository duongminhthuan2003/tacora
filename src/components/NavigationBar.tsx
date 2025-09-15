import { HugeiconsIcon } from '@hugeicons/react'
import {Home09Icon, Task02Icon, Settings02Icon, Search01Icon } from '@hugeicons/core-free-icons'
import { Link, useLocation } from 'react-router-dom'

function TacoraLogo() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
            <circle cx="17" cy="17" r="15.75" stroke="white" stroke-width="2.5"/>
            <path d="M11 17.0909L16.9375 23L30 10" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    )
}

export default function NavigationBar() {
    const location = useLocation();

    return (
        <div className="flex flex-col gap-2">
            <div className="w-full h-24 bg-tacora flex flex-row gap-3 items-end justify-start p-4 rounded-xl">
                <TacoraLogo />
                <p className="font-AppleGaramond text-white text-4xl -mb-1">
                    Tacora
                </p>
            </div>

            <div className="w-full h-14 lg:h-64 flex flex-row gap-2 lg:flex-col">
                <Link to={"/"} className={`flex-1 flex justify-center lg:justify-start px-0 lg:px-5 items-center rounded-xl ${location.pathname === "/" ? "bg-tacora" : "bg-tacora-light"} transition-all`}>
                    <HugeiconsIcon icon={Home09Icon} size={24} color={`${location.pathname === "/" ? "white" : "black"}`} />
                    <p className={`font-SFPro-Regular hidden lg:block ml-3 ${location.pathname === "/" ? "text-white" : ""}`}>Home</p>
                </Link>

                <Link to={"/tasks"} className={`flex-1 flex justify-center lg:justify-start px-0 lg:px-5 items-center rounded-xl ${location.pathname === "/tasks" ? "bg-tacora" : "bg-tacora-light"} transition-all`}>
                    <HugeiconsIcon icon={Task02Icon} size={24} color={`${location.pathname === "/tasks" ? "white" : "black"}`} />
                    <p className={`font-SFPro-Regular hidden lg:block ml-3 ${location.pathname === "/tasks" ? "text-white" : ""}`}>Tasks</p>
                </Link>

                <Link to={"/settings"} className={`flex-1 flex justify-center lg:justify-start px-0 lg:px-5 items-center rounded-xl ${location.pathname === "/settings" ? "bg-tacora" : "bg-tacora-light"} transition-all`}>
                    <HugeiconsIcon icon={Settings02Icon} size={24} color={`${location.pathname === "/settings" ? "white" : "black"}`} />
                    <p className={`font-SFPro-Regular hidden lg:block ml-3 ${location.pathname === "/settings" ? "text-white" : ""}`}>Settings</p>
                </Link>

                <Link to={"/search"} className={`flex-1 flex justify-center lg:justify-start px-0 lg:px-5 items-center rounded-xl ${location.pathname === "/search" ? "bg-tacora" : "bg-tacora-light"} transition-all`}>
                    <HugeiconsIcon icon={Search01Icon} size={24} color={`${location.pathname === "/search" ? "white" : "black"}`} />
                    <p className={`font-SFPro-Regular hidden lg:block ml-3 ${location.pathname === "/search" ? "text-white" : ""}`}>Search</p>
                </Link>
            </div>
        </div>
    )
}
