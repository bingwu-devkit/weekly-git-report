import { createContext, useContext, useEffect, useState } from 'react'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

export type Theme = 'dark' | 'light' | 'system'
export type ResolvedTheme = Exclude<Theme, 'system'>

const DEFAULT_THEME: Theme = 'dark'
const THEME_COOKIE_NAME = 'vite-ui-theme'
const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  defaultTheme: Theme
  resolvedTheme: ResolvedTheme
  theme: Theme
  setTheme: (theme: Theme) => void
  resetTheme: () => void
}

const initialState: ThemeProviderState = {
  defaultTheme: DEFAULT_THEME,
  resolvedTheme: 'dark',
  theme: DEFAULT_THEME,
  setTheme: () => null,
  resetTheme: () => null,
}

const ThemeContext = createContext<ThemeProviderState>(initialState)

function getStoredTheme(storageKey: string, fallback: Theme): Theme {
  const stored = getCookie(storageKey)
  if (stored === 'dark' || stored === 'light' || stored === 'system') {
    return stored
  }
  return fallback
}

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
  storageKey = THEME_COOKIE_NAME,
  ...props
}: ThemeProviderProps) {
  const [theme, _setTheme] = useState<Theme>(() =>
    getStoredTheme(storageKey, defaultTheme)
  )
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() =>
    getSystemTheme()
  )

  const resolvedTheme: ResolvedTheme = theme === 'system' ? systemTheme : theme

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      setSystemTheme(mediaQuery.matches ? 'dark' : 'light')
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(resolvedTheme)
    root.style.colorScheme = resolvedTheme

    const metaThemeColor = document.querySelector("meta[name='theme-color']")
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        resolvedTheme === 'dark' ? '#0B0C0E' : '#F6F7F8'
      )
    }

    void window.electronAPI?.system?.setWindowTheme?.(resolvedTheme)
  }, [resolvedTheme])

  const setTheme = (nextTheme: Theme) => {
    setCookie(storageKey, nextTheme, THEME_COOKIE_MAX_AGE)
    _setTheme(nextTheme)
  }

  const resetTheme = () => {
    removeCookie(storageKey)
    _setTheme(DEFAULT_THEME)
  }

  const contextValue: ThemeProviderState = {
    defaultTheme,
    resolvedTheme,
    resetTheme,
    theme,
    setTheme,
  }

  return (
    <ThemeContext value={contextValue} {...props}>
      {children}
    </ThemeContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext)

  if (!context) throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
