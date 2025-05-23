import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import HomePage from '@/pages/HomePage';
import DashboardPage from '@/pages/DashboardPage';
import ContactPage from '@/pages/ContactPage';
import { ThemeProvider } from '@/context/ThemeContext';

function App() {
  // Removed useEffect for loading state and visibility forcing
  
  return (
    <ThemeProvider>
      <Router>
        {/* Removed inline styles from this div */}
        <div>
          <Navbar />
          <main style={{
            flexGrow: 1,
            width: "100%"
          }}>
            <div style={{ display: "block" }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Routes>
            </div>
          </main>
          <footer style={{
            borderTop: "1px solid #E5E5E5",
            padding: "1.5rem 0",
            backgroundColor: "#FFFFFF",
            color: "#6B6B6B"
          }}>
            <div style={{
              maxWidth: "1400px",
              margin: "0 auto",
              padding: "0 1rem"
            }}>
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center", 
                gap: "1rem",
              }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{
                    backgroundColor: "#0C0C0D", 
                    color: "white", 
                    borderRadius: "9999px", 
                    width: "2.5rem", 
                    height: "2.5rem", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    marginRight: "0.75rem"
                  }}>
                    ME
                  </span>
                  <span style={{fontWeight: 500, color: "#0C0C0D"}}>Marco Egidi</span>
                </div>
                <p style={{fontSize: "0.875rem", color: "#6B6B6B"}}>© 2025 All rights reserved</p>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
