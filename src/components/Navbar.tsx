import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';
import ThemeMenu from '@/features/theme/ThemeMenu';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Tab,
  TabGroup,
  TabList,
} from '@headlessui/react';

interface NavItem {
  to: string;
  label: string;
  kind?: 'document';
}

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/#projects", label: "Progetti" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/aurastats.html", label: "AuraStats", kind: 'document' },
  { to: "/swim-analyzer", label: "Swim Analyzer" },
  { to: "/#contact", label: "Contatti" },
] satisfies NavItem[];

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
  const navigateDocument = (to: string) => {
    window.location.assign(to);
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

  // Il drawer mobile non deve restare aperto passando al layout desktop.
  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 768px)');
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setIsMenuOpen(false);
    };

    if (desktopQuery.matches) setIsMenuOpen(false);
    desktopQuery.addEventListener('change', closeOnDesktop);
    return () => desktopQuery.removeEventListener('change', closeOnDesktop);
  }, []);

  const handleHashLinkClick = (path: string) => {
    if (!path.startsWith('/#')) return;

    const hash = path.slice(1);
    const id = hash.slice(1);
    const scrollToSection = () => {
      const section = document.getElementById(id);
      if (!section) return;

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      section.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    };

    setIsMenuOpen(false);

    if (window.location.pathname !== '/') {
      navigate(path);
    } else if (window.location.hash !== hash) {
      history.replaceState({}, '', path);
      setCurrentHash(hash);
    }

    // Due frame permettono alla home e al dialog di aggiornarsi prima dello scroll.
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(scrollToSection);
    });
  };

  const handleMobileLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    link: NavItem,
  ) => {
    if (link.kind === 'document') {
      setIsMenuOpen(false);
      return;
    }

    if (link.to.startsWith('/#')) {
      event.preventDefault();
      handleHashLinkClick(link.to);
      return;
    }

    setIsMenuOpen(false);
  };

  // Custom function to determine if a link should be active
  const isLinkActive = (linkPath: string) => {
    if (linkPath.startsWith('/#')) {
      return currentPath === '/' && `${currentPath}${currentHash}` === linkPath;
    }
    if (linkPath === '/' && currentPath === '/' && !currentHash) return true;
    if (linkPath !== '/' && currentPath === linkPath) return true;
    return false;
  };
  const deriveIndexFromLocation = (path: string, hash: string): number | null => {
    if (hash) {
      const hashIdx = navLinks.findIndex(l => l.to === `${path}${hash}`);
      if (hashIdx >= 0) return hashIdx;
    }
    const direct = navLinks.findIndex(l => !l.to.startsWith('/#') && l.to === path);
    if (direct >= 0) return direct;
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
    if (target.kind === 'document') {
      navigateDocument(target.to);
      return;
    }
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
    <>
      <nav aria-label="Navigazione principale" className={`sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border transition-all duration-300 ${className}`}>
        <div className="w-full px-6 md:px-12">
          <div className={`relative flex items-center justify-between transition-all duration-300 ${shrink ? 'h-16' : 'h-24'}`}>
          {/* Logo and Brand */}
          <Link to="/" className="text-2xl font-bold flex items-center group">
            <div className={`rounded-full flex items-center justify-center mr-3 bg-primary text-primary-foreground transition-all duration-300 group-hover:scale-110 shadow-lg ${shrink ? 'w-10 h-10 text-base' : 'w-12 h-12 text-lg'}`}>
              ME
            </div>
            <span className="hidden sm:inline text-foreground tracking-tight">Marco Egidi</span>
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
          <div className="md:hidden flex items-center gap-4">
            <ThemeMenu />
            
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-full hover:bg-accent text-foreground w-12 h-12 flex items-center justify-center"
              aria-label={isMenuOpen ? 'Chiudi menu di navigazione' : 'Apri menu di navigazione'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation-drawer"
            >
              {isMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </Button>
          </div>
          </div>
        </div>
      </nav>

      {/* Headless UI porta il dialog fuori dalla navbar e rende inert il resto della pagina. */}
      <Dialog
        open={isMenuOpen}
        onClose={setIsMenuOpen}
        className="relative z-[60] md:hidden"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-sm transition-opacity duration-200 ease-out data-closed:opacity-0 motion-reduce:transition-none"
        />

        <div className="fixed inset-0 z-[61] flex justify-end overflow-hidden">
          <DialogPanel
            id="mobile-navigation-drawer"
            transition
            className="flex h-dvh w-[88vw] max-w-[22rem] flex-col border-l border-border bg-background text-foreground shadow-2xl transition-transform duration-300 ease-out data-closed:translate-x-full motion-reduce:transition-none"
            style={{
              paddingTop: 'max(1.25rem, env(safe-area-inset-top))',
              paddingRight: 'max(1.25rem, env(safe-area-inset-right))',
              paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))',
              paddingLeft: '1.25rem',
            }}
          >
            <div className="flex items-center justify-between gap-4 border-b border-border pb-5">
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight">
                  Navigazione
                </DialogTitle>
                <p className="mt-1 text-sm text-muted-foreground">Marco Egidi</p>
              </div>
              <Button
                autoFocus
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(false)}
                className="h-11 w-11 shrink-0 rounded-full"
                aria-label="Chiudi menu di navigazione"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </Button>
            </div>

            <nav
              aria-label="Navigazione mobile"
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-6"
            >
              <ul className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  const isActive = isLinkActive(link.to);
                  const linkClassName = `flex min-h-12 items-center rounded-2xl px-4 py-3 text-xl font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none ${
                    isActive
                      ? 'bg-primary/12 text-primary'
                      : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                  }`;

                  return (
                    <li key={link.label}>
                      {link.kind === 'document' ? (
                        <a
                          href={link.to}
                          onClick={(event) => handleMobileLinkClick(event, link)}
                          className={linkClassName}
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          to={link.to}
                          onClick={(event) => handleMobileLinkClick(event, link)}
                          aria-current={isActive ? (link.to.startsWith('/#') ? 'location' : 'page') : undefined}
                          className={linkClassName}
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default Navbar;
