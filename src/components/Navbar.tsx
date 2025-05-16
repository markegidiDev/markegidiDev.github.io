import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

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

  const handleHashLinkClick = (path: string) => {
    if (window.location.pathname === "/" && path.startsWith("/#")) {
      const id = path.substring(2);
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: 'smooth' });
    } else if (path.startsWith("/#")) {
      // This will be handled by router
    }
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
          
          {/* Navigation */}
          <div className="flex items-center gap-1 sm:gap-2">
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
