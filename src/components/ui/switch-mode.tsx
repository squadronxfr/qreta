import useDarkMode from "@/hooks/use-switch-mode";
import {SunIcon, MoonIcon} from '@animateicons/react/lucide'

export default function SwitchMode() {
    const {toggleDarkMode, isDarkMode} = useDarkMode();

    return (
        <>
            {isDarkMode ? <SunIcon
                    onClick={toggleDarkMode}
                    className="h-5 w-5 text-indigo-600 hover:text-indigo-700 cursor-pointer transition-colors"/> :
                <MoonIcon
                    onClick={toggleDarkMode}
                    className="h-5 w-5 text-indigo-600 hover:text-indigo-700 cursor-pointer transition-colors"/>
            }</>
    )
}