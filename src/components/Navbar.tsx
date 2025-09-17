import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';
import ThemeMenu from '@/features/theme/ThemeMenu';
import { Tab, TabGroup, TabList } from '@headlessui/react';

// Slimmed to only the three requested tabs
const navLinks = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/#contact", label: "Contact" },
];

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [currentHash, setCurrentHash] = useState(window.location.hash);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [shrink, setShrink] = useState(false);
  const tabListRef = useRef<HTMLDivElement | null>(null);
  const [indicator, setIndicator] = useState({ left: 0, top: 0, width: 0, height: 0 });
  // react-router-dom v7 changed some navigation APIs; fallback to manual pushState
  const navigate = (to: string) => {
    if (window.location.pathname + window.location.hash === to) return;
    window.history.pushState({}, '', to);
    const navEvent = new PopStateEvent('popstate');
    window.dispatchEvent(navEvent);
  };

  // Update current path when route changes
  useEffect(() => {
    const updatePath = () => {
      setCurrentPath(window.location.pathname);
      setCurrentHash(window.location.hash);
      setIsMenuOpen(false);
      // derive index from route/hash
      const idx = deriveIndexFromLocation(window.location.pathname, window.location.hash);
      if (idx !== null) {
        setSelectedIndex(idx);
        localStorage.setItem('nav:lastTab', String(idx));
      }
    };

    // Listen for browser navigation
    window.addEventListener('popstate', updatePath);
    
    // Listen for programmatic navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      updatePath();
    };
    
    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      updatePath();
    };

    return () => {
      window.removeEventListener('popstate', updatePath);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  // Chiudi il menu quando cambia la route
  useEffect(() => {
    setIsMenuOpen(false);
  }, [currentPath]);

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
    if (window.location.pathname !== '/' && path.startsWith('/#')) {
      // Navigate to root then scroll after short delay
      navigate('/');
      setTimeout(() => {
        const id = path.substring(2);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else if (path.startsWith('/#')) {
      const id = path.substring(2);
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      history.replaceState({}, '', path); // update hash without reload
      setCurrentHash(path);
    }
    setIsMenuOpen(false);
  };

  // Custom function to determine if a link should be active
  const isLinkActive = (linkPath: string) => {
    if (linkPath.startsWith('/#')) {
      return currentPath === '/' && currentHash === linkPath;
    }
    if (linkPath === '/' && currentPath === '/') return true;
    if (linkPath !== '/' && currentPath === linkPath) return true;
    return false;
  };
  const deriveIndexFromLocation = (path: string, hash: string): number | null => {
    const direct = navLinks.findIndex(l => !l.to.startsWith('/#') && l.to === path);
    if (direct >= 0) return direct;
    if (hash) {
      const combined = `/${hash}`; // hash includes '#'
      const hashIdx = navLinks.findIndex(l => l.to === combined);
      if (hashIdx >= 0) return hashIdx;
    }
    if (path === '/' && hash === '#contact') {
      const c = navLinks.findIndex(l => l.to === '/#contact');
      if (c >= 0) return c;
    }
    return null;
  };

  // Initial selected tab from route or localStorage
  useEffect(() => {
    const routeIdx = deriveIndexFromLocation(window.location.pathname, window.location.hash);
    if (routeIdx !== null) {
      setSelectedIndex(routeIdx);
      return;
    }
    const stored = localStorage.getItem('nav:lastTab');
    if (stored) {
      const i = parseInt(stored, 10);
      if (!Number.isNaN(i) && i >= 0 && i < navLinks.length) setSelectedIndex(i);
    }
  }, []);

  const handleTabSelect = (index: number) => {
    const target = navLinks[index];
    if (!target) return;
    setSelectedIndex(index);
    localStorage.setItem('nav:lastTab', String(index));
    if (target.to.startsWith('/#')) {
      handleHashLinkClick(target.to);
    } else {
      navigate(target.to);
    }
  };

  // Animated indicator position recalculation
  useEffect(() => {
    const updateIndicator = () => {
      if (!tabListRef.current) return;
      const btn = tabListRef.current.querySelector<HTMLButtonElement>(`button[data-tab-index='${selectedIndex}']`);
      if (!btn) return;
      const parentRect = tabListRef.current.getBoundingClientRect();
      const rect = btn.getBoundingClientRect();
      setIndicator({
        left: rect.left - parentRect.left - 8, // add horizontal padding
        top: rect.top - parentRect.top - 4,    // add vertical padding
        width: rect.width + 16,
        height: rect.height + 8,
      });
    };
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [selectedIndex, currentPath, currentHash]);

  // Shrink on scroll
  useEffect(() => {
    const onScroll = () => {
      setShrink(window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
  <nav className={`sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border transition-[height,background,backdrop-filter] duration-300 ${className}`}>        
      <div className="container mx-auto px-6 lg:px-8">
  <div className={`relative flex items-center justify-between transition-all duration-300 ${shrink ? 'h-14' : 'h-20'}`}>
          {/* Logo and Brand */}
          <Link to="/" className="text-xl font-bold flex items-center group">
            <div className={`rounded-full flex items-center justify-center mr-3 bg-primary text-primary-foreground transition-all duration-300 group-hover:scale-105 ${shrink ? 'w-9 h-9 text-sm' : 'w-10 h-10'}`}>
              ME
            </div>
            <span className="hidden sm:inline text-foreground">Marco Egidi</span>
          </Link>
          {/* Desktop Navigation as Tabs */}
          <div className="hidden md:flex items-center rounded-full px-3 py-2 backdrop-blur-sm border border-border/50 bg-background/60 absolute left-1/2 -translate-x-1/2">
            <TabGroup selectedIndex={selectedIndex} onChange={handleTabSelect}>
              <TabList ref={tabListRef} className="flex gap-6 relative">
                {/* Animated Pill Indicator */}
                <span
                  className="absolute z-0 rounded-full transition-all duration-300 ease-out shadow-sm backdrop-blur-sm bg-foreground/15 dark:bg-white/10 border border-border/60"
                  style={{
                    left: indicator.left,
                    top: indicator.top,
                    width: indicator.width,
                    height: indicator.height,
                    transform: 'translateZ(0)'
                  }}
                />
                {navLinks.map(({ label }, i) => (
                  <Tab
                    key={label}
                    data-tab-index={i}
                    className="relative z-10 rounded-full px-5 py-2.5 text-base font-medium text-muted-foreground focus:outline-none data-hover:bg-foreground/5 data-selected:text-foreground data-focus-visible:ring-2 data-focus-visible:ring-primary/60 transition-colors"
                  >
                    {label}
                  </Tab>
                ))}
              </TabList>
              {/* TabPanels with fade/scale mini badge below (for visual change) */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 pointer-events-none">
                <div className="relative h-6 w-32">
                  {/* We don't need actual content per tab; keeping accessible label */}
                </div>
              </div>
            </TabGroup>
          </div>

          {/* Theme Menu - Desktop */}
          <div className="hidden md:block">
            <ThemeMenu />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeMenu />
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-full border-border text-foreground mobile-menu-container w-10 h-10"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mobile-menu-container">
            <div className="px-4 pt-4 pb-6 space-y-2 border-t border-border bg-card/80 backdrop-blur-sm rounded-b-lg mx-4 mb-4">              {navLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.to}
                  onClick={() => link.to.includes("#") ? handleHashLinkClick(link.to) : handleHashLinkClick("")}
                  className={() => {
                    const isActive = isLinkActive(link.to);
                    return `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 w-full ${
                      isActive
                        ? 'text-primary-foreground bg-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/80'
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
