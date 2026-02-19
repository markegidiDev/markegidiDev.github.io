import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import HomePage from '@/pages/HomePage';
import DashboardPage from '@/pages/DashboardPage';
import ContactPage from '@/pages/ContactPage';
import SwimAnalyzerPage from '@/pages/SwimAnalyzerPage';
import { ThemeProvider } from '@/features/theme/theme-provider';
import { ToastProvider } from '@/components/ui/toast-provider';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Navbar />
            <main className="w-full flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/swim-analyzer" element={<SwimAnalyzerPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Routes>
            </main>
            <footer className="border-t border-border bg-card py-6 text-card-foreground">
              <div className="mx-auto max-w-7xl px-4">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center">
                    <span className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      ME
                    </span>
                    <span className="font-medium text-foreground">Marco Egidi</span>
                  </div>
                  <p className="text-sm text-muted-foreground">(c) 2025 All rights reserved</p>
                </div>
              </div>
            </footer>
          </div>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
