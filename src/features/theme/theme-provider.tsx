import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ThemeContext, type Theme } from './theme-context'

function resolveSystem(): 'light'|'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved
    if (saved === 'nord') return 'dark'
  } catch (e) {
    // noop: localStorage not available
    if (process.env.NODE_ENV !== 'production') console.debug('theme:getInitialTheme failed', e)
  }
  return 'system'
}

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme())

  const apply = useCallback((t: Theme) => {
    const root = document.documentElement
    root.classList.remove('dark')
    const effective = t === 'system' ? resolveSystem() : t
    if (effective === 'dark') root.classList.add('dark')
  }, [])

  // apply on mount and when theme changes
  useEffect(() => {
    apply(theme)
    try {
      localStorage.setItem('theme', theme)
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') console.debug('theme:persist failed', e)
    }
  }, [theme, apply])

  // sync when system scheme changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => { if (theme === 'system') apply('system') }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme, apply])

  // sync across tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== 'theme' || !e.newValue) return
      if (e.newValue === 'light' || e.newValue === 'dark' || e.newValue === 'system') {
        setThemeState(e.newValue)
      } else if (e.newValue === 'nord') {
        setThemeState('dark')
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const setTheme = useCallback((t: Theme) => setThemeState(t), [])
  const toggleTheme = useCallback(() => {
    const order: Theme[] = ['dark', 'light', 'system']
    const idx = order.indexOf(theme)
    setThemeState(order[(idx + 1) % order.length])
  }, [theme])

  const resolvedTheme: 'light'|'dark' = useMemo(() => {
    const eff = theme === 'system' ? resolveSystem() : theme
    return eff === 'dark' ? 'dark' : 'light'
  }, [theme])

  const value = useMemo(() => ({ theme, resolvedTheme, setTheme, toggleTheme }), [theme, resolvedTheme, setTheme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
