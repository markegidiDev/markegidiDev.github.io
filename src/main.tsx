// Helper function to handle SPA routing on GitHub Pages
(function() {
  const l = window.location;
  if (l.search) {
    const q: { [key: string]: string } = {}; // Type annotation for q
    l.search.slice(1).split('&').forEach(function(v) {
      const a = v.split('=');
      q[a[0]] = a.slice(1).join('=').replace(/~and~/g, '&');
    });
    if (q.p !== undefined) {
      window.history.replaceState(null, '', // Changed second argument to empty string
        l.pathname.slice(0, -1) + (q.p || '') +
        (q.q ? ('?' + q.q) : '') +
        l.hash
      );
    }
  }
})();

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

import './index.css' // Material You theme

import './App.css' // App-specific styles, keep for now


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
