"use client"

import { useEffect, useState} from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

const btnStyle = "p-2 rounded-full border border-accent-subtle cursor-pointer text-text-secondary hover:border-accent hover:text-accent transition-all duration-180 ease-out";

export function ThemeToggle() {
    const { setTheme, theme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <button className={btnStyle}>
                <Moon className="h-[1.2rem] w-[1.2rem]" />
            </button>
        )
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={btnStyle}
        >
            {theme === "dark" ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
            )}
        </button>
    )
}
