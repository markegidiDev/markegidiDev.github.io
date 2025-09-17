import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ThemeContext, type Theme } from './theme-context'

function resolveSystem(): 'light'|'dark' {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem('theme') as Theme | null
    if (saved === 'light' || saved === 'dark' || saved === 'system' || saved === 'nord') return saved
  } catch (e) {
    // noop: localStorage not available
    if (process.env.NODE_ENV !== 'production') console.debug('theme:getInitialTheme failed', e)
  }
  return 'dark'
}

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme())

  const apply = useCallback((t: Theme) => {
    const root = document.documentElement
    root.classList.remove('dark', 'nord')
    const effective = t === 'system' ? resolveSystem() : t
    if (effective === 'dark') root.classList.add('dark')
    if (effective === 'nord') root.classList.add('nord')
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
      if (e.key === 'theme' && e.newValue) setThemeState(e.newValue as Theme)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const setTheme = useCallback((t: Theme) => setThemeState(t), [])
  const toggleTheme = useCallback(() => {
    const order: Theme[] = ['dark','light','nord','system']
    const idx = order.indexOf(theme)
    setThemeState(order[(idx + 1) % order.length])
  }, [theme])

  const resolvedTheme: 'light'|'dark'|'nord' = useMemo(() => {
    const eff = theme === 'system' ? resolveSystem() : theme
    return eff === 'dark' || eff === 'nord' ? eff : 'light'
  }, [theme])

  const value = useMemo(() => ({ theme, resolvedTheme, setTheme, toggleTheme }), [theme, resolvedTheme, setTheme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
