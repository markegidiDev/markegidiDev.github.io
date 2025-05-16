import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
// import './styles/reset.css' // Removed, Tailwind preflight handles this
import './index.css' // Material You theme
// import './styles/website-builder-theme-v2.css' // Removed, old theme
import './App.css' // App-specific styles, keep for now
// import '../public/force-visibility.css' // No longer needed
// import '../public/emergency-visibility.css' // No longer needed

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
