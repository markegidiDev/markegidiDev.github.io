import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun, Menu, X } from 'lucide-react';

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/#experience", label: "Experience" },
  { to: "/#certifications", label: "Certifications" },
  { to: "/contact", label: "Contact" },
];

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Chiudi il menu quando cambia la route
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Chiudi il menu quando si clicca fuori
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && !(event.target as Element).closest('.mobile-menu-container')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const handleHashLinkClick = (path: string) => {
    if (window.location.pathname === "/" && path.startsWith("/#")) {
      const id = path.substring(2);
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: 'smooth' });
    } else if (path.startsWith("/#")) {
      // This will be handled by router
    }
    // Chiudi il menu mobile dopo il click
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    if (path.startsWith("/#")) {
      return location.pathname === "/" && location.hash === path.substring(1);
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-md bg-white border-b border-[#E5E5E5] ${className}`} style={{backgroundColor: "white"}}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link to="/" className="text-xl font-bold flex items-center">
            <div className="rounded-full w-8 h-8 flex items-center justify-center mr-2 bg-[#0C0C0D] text-white">
              ME
            </div>
            <span className="hidden sm:inline text-[#0C0C0D]">Marco Egidi</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                onClick={() => link.to.includes("#") ? handleHashLinkClick(link.to) : undefined}
                className={({ isActive: routerActive }) => {
                  const isLinkActive = routerActive || isActive(link.to);
                  return `px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    isLinkActive 
                      ? 'bg-[#0C0C0D] text-white' 
                      : 'text-[#6B6B6B] hover:text-[#0C0C0D] hover:bg-[#0C0C0D]/5'
                  }`
                }}
              >
                {link.label}
              </NavLink>
            ))}
            
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="ml-2 rounded-md border-[#0C0C0D] text-[#0C0C0D]"
              aria-label="Toggle theme"
            >
              {theme === 'light' 
                ? <Moon className="h-4 w-4" /> 
                : <Sun className="h-4 w-4" />
              }
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="rounded-md border-[#0C0C0D] text-[#0C0C0D]"
              aria-label="Toggle theme"
            >
              {theme === 'light' 
                ? <Moon className="h-4 w-4" /> 
                : <Sun className="h-4 w-4" />
              }
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-md border-[#0C0C0D] text-[#0C0C0D] mobile-menu-container"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mobile-menu-container">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-[#E5E5E5] bg-white">
              {navLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.to}
                  onClick={() => link.to.includes("#") ? handleHashLinkClick(link.to) : handleHashLinkClick("")}
                  className={({ isActive: routerActive }) => {
                    const isLinkActive = routerActive || isActive(link.to);
                    return `block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                      isLinkActive 
                        ? 'bg-[#0C0C0D] text-white' 
                        : 'text-[#6B6B6B] hover:text-[#0C0C0D] hover:bg-[#0C0C0D]/5'
                    }`
                  }}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
