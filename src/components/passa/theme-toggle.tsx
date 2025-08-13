"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  }

  // We need to wait for the component to mount to know the theme
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])


  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
      {mounted && theme === 'dark' ? (
         <Moon className="size-5" />
      ) : mounted && theme === 'light' ? (
         <Sun className="size-5" />
      ) : (
        <Sun className="size-5 transition-transform duration-500 ease-in-out rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
      )}
       <Moon className="absolute size-5 transition-transform duration-500 ease-in-out rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
    </Button>
  )
}
