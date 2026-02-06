import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import HomePage from '@/pages/HomePage';
import DashboardPage from '@/pages/DashboardPage';
import ContactPage from '@/pages/ContactPage';
import SwimAnalyzerPage from '@/pages/SwimAnalyzerPage';
import { ThemeProvider } from '@/features/theme/theme-provider';

function App() {
  // Removed useEffect for loading state and visibility forcing
  
  return (
    <ThemeProvider>
      <Router>
        {/* Removed inline styles from this div */}
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/swim-analyzer" element={<SwimAnalyzerPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </main>
          <footer className="border-t border-border py-6 bg-card text-card-foreground">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center">
                  <span className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center mr-3">
                    ME
                  </span>
                  <span className="font-medium text-foreground">Marco Egidi</span>
                </div>
                <p className="text-sm text-muted-foreground">© 2025 All rights reserved</p>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
