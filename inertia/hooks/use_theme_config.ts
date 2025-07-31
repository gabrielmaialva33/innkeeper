import { useState, useEffect } from 'react'

export type ThemeColor = 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'pink' | 'teal' | 'indigo'

export type ThemeRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl'

interface ThemeConfig {
  color: ThemeColor
  radius: ThemeRadius
}

const THEME_COLORS = {
  blue: {
    light: '217 91% 60%',
    dark: '217 91% 60%',
  },
  green: {
    light: '142 76% 36%',
    dark: '142 76% 60%',
  },
  purple: {
    light: '271 91% 65%',
    dark: '271 91% 65%',
  },
  red: {
    light: '0 84% 60%',
    dark: '0 84% 60%',
  },
  orange: {
    light: '25 95% 53%',
    dark: '25 95% 53%',
  },
  pink: {
    light: '340 82% 52%',
    dark: '340 82% 65%',
  },
  teal: {
    light: '174 72% 56%',
    dark: '174 72% 56%',
  },
  indigo: {
    light: '243 75% 59%',
    dark: '243 75% 59%',
  },
}

const THEME_RADIUS = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
}

const STORAGE_KEY = 'app-theme-config'

export function useThemeConfig() {
  const [config, setConfig] = useState<ThemeConfig>({
    color: 'blue',
    radius: 'md',
  })

  useEffect(() => {
    // Load config from localStorage
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ThemeConfig
        setConfig(parsed)
        applyTheme(parsed)
      } catch (e) {
        console.error('Failed to parse theme config', e)
      }
    }
  }, [])

  const applyTheme = (newConfig: ThemeConfig) => {
    const root = document.documentElement
    const isDark = root.classList.contains('dark')

    // Apply color
    const colorValue = THEME_COLORS[newConfig.color][isDark ? 'dark' : 'light']
    root.style.setProperty('--primary', colorValue)

    // Apply radius
    root.style.setProperty('--radius', THEME_RADIUS[newConfig.radius])
  }

  const updateConfig = (updates: Partial<ThemeConfig>) => {
    const newConfig = { ...config, ...updates }
    setConfig(newConfig)
    applyTheme(newConfig)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig))
  }

  const setColor = (color: ThemeColor) => updateConfig({ color })
  const setRadius = (radius: ThemeRadius) => updateConfig({ radius })

  // Listen for theme changes (dark/light)
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          applyTheme(config)
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [config])

  return {
    config,
    setColor,
    setRadius,
    availableColors: Object.keys(THEME_COLORS) as ThemeColor[],
    availableRadius: Object.keys(THEME_RADIUS) as ThemeRadius[],
  }
}
