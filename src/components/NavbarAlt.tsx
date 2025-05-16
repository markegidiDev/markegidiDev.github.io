import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NavbarAlt: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav style={{
      backgroundColor: "white",
      borderBottom: "1px solid #E5E5E5",
      padding: "1rem 0",
      position: "sticky",
      top: 0,
      zIndex: 50
    }}>
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "0 1rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        {/* Logo Section */}
        <Link to="/" style={{
          display: "flex",
          alignItems: "center",
          textDecoration: "none"
        }}>
          <div style={{
            width: "2.5rem",
            height: "2.5rem",
            backgroundColor: "#0C0C0D",
            color: "white",
            borderRadius: "9999px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "0.75rem",
            fontSize: "1rem",
            fontWeight: 700
          }}>
            ME
          </div>
          <span style={{
            fontWeight: 600,
            fontSize: "1.25rem",
            color: "#0C0C0D"
          }}>
            Marco Egidi
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            display: "block",
            padding: "0.5rem",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#0C0C0D"
          }}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            {isMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </>
            )}
          </svg>
        </button>

        {/* Navigation Links - Desktop */}
        <div style={{
          display: "flex",
          gap: "1.5rem"
        }}>
          <Link to="/" style={{
            textDecoration: "none",
            color: "#0C0C0D",
            fontWeight: 500,
            fontSize: "1rem",
            padding: "0.5rem 0",
            borderBottom: "2px solid transparent",
            transition: "border-color 0.2s ease"
          }}>
            Home
          </Link>
          
          <Link to="/dashboard" style={{
            textDecoration: "none",
            color: "#0C0C0D",
            fontWeight: 500,
            fontSize: "1rem",
            padding: "0.5rem 0",
            borderBottom: "2px solid transparent",
            transition: "border-color 0.2s ease"
          }}>
            Dashboard
          </Link>
          
          <Link to="/contact" style={{
            textDecoration: "none",
            color: "#0C0C0D",
            fontWeight: 500,
            fontSize: "1rem",
            padding: "0.5rem 0",
            borderBottom: "2px solid transparent",
            transition: "border-color 0.2s ease"
          }}>
            Contatti
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div style={{
          padding: "1rem",
          backgroundColor: "white",
          borderTop: "1px solid #E5E5E5"
        }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem"
          }}>
            <Link 
              to="/" 
              onClick={() => setIsMenuOpen(false)}
              style={{
                display: "block",
                padding: "0.75rem",
                color: "#0C0C0D",
                textDecoration: "none",
                fontWeight: 500,
                borderRadius: "0.375rem",
                transition: "background-color 0.2s ease"
              }}
            >
              Home
            </Link>
            
            <Link 
              to="/dashboard" 
              onClick={() => setIsMenuOpen(false)}
              style={{
                display: "block",
                padding: "0.75rem",
                color: "#0C0C0D",
                textDecoration: "none",
                fontWeight: 500,
                borderRadius: "0.375rem",
                transition: "background-color 0.2s ease"
              }}
            >
              Dashboard
            </Link>
            
            <Link 
              to="/contact" 
              onClick={() => setIsMenuOpen(false)}
              style={{
                display: "block",
                padding: "0.75rem",
                color: "#0C0C0D",
                textDecoration: "none",
                fontWeight: 500,
                borderRadius: "0.375rem",
                transition: "background-color 0.2s ease"
              }}
            >
              Contatti
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarAlt;
