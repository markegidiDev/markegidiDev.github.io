import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import './index.css'

/**
 * Pre-paint theme guard:
 * Applies the saved theme class on <html> BEFORE React renders to avoid FOUC.
 */
(function () {
  try {
    const saved = localStorage.getItem('theme') as 'dark'|'light'|'system'|'nord'|null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const root = document.documentElement
    const removeAll = () => root.classList.remove('dark')
    if (saved === 'dark') { removeAll(); root.classList.add('dark') }
    else if (saved === 'nord') { removeAll(); root.classList.add('dark') }
    else if (saved === 'light') { removeAll() }
    else { // system
      removeAll()
      if (prefersDark) root.classList.add('dark')
    }
  } catch {
    // ignore pre-paint errors (e.g. storage unavailable)
  }
})()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
