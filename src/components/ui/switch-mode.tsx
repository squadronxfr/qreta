import useDarkMode from "@/hooks/use-switch-mode";
import {Sun, MoonIcon} from 'lucide-react';

export default function SwitchMode() {
    const {toggleDarkMode, isDarkMode} = useDarkMode();

    return (
        <>
            {isDarkMode ? <Sun
                    onClick={toggleDarkMode}
                    className="h-5 w-5 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"/> :
                <MoonIcon
                    onClick={toggleDarkMode}
                    className="h-5 w-5 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"/>
            }</>
    )
}