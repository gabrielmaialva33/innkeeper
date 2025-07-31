import { useTheme as useNextTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export const useTheme = () => {
  const { theme, setTheme, systemTheme, themes, resolvedTheme } = useNextTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Use resolvedTheme which already handles 'system' automatically
  const currentTheme = mounted ? resolvedTheme : undefined

  return {
    theme,
    setTheme,
    systemTheme,
    themes,
    resolvedTheme: currentTheme,
    isDark: currentTheme === 'dark',
    isLight: currentTheme === 'light',
    isSystem: theme === 'system',
    mounted,
    toggle: () => {
      if (theme === 'system') {
        // If in system mode, toggle based on current resolved theme
        setTheme(currentTheme === 'dark' ? 'light' : 'dark')
      } else {
        // If in light or dark mode, simply toggle
        setTheme(theme === 'dark' ? 'light' : 'dark')
      }
    },
  }
}
