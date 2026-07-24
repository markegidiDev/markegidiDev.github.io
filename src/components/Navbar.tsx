import { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Menu, X } from "lucide-react";
import ThemeMenu from "@/features/theme/ThemeMenu";
import { useLanguage } from "@/i18n/use-language";
import type { Language } from "@/i18n/language-context";

type NavLink = {
  href: string;
  en: string;
  it: string;
};

const navLinks: NavLink[] = [
  { href: "/#projects", en: "Projects", it: "Progetti" },
  { href: "/#experience", en: "Experience", it: "Esperienza" },
  { href: "/#skills", en: "Skills", it: "Competenze" },
  { href: "/#creative-work", en: "Creative work", it: "Creative work" },
  { href: "/#contact", en: "Contact", it: "Contatti" },
];

function LanguageSwitch({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useLanguage();
  const labels = {
    en: {
      group: "Choose language",
      English: "Switch to English",
      Italian: "Passa all'italiano",
    },
    it: {
      group: "Scegli la lingua",
      English: "Switch to English",
      Italian: "Passa all'italiano",
    },
  }[language];

  const options: Array<{
    value: Language;
    short: string;
    flag: string;
    label: string;
  }> = [
    { value: "en", short: "ENG", flag: "🇬🇧", label: labels.English },
    { value: "it", short: "ITA", flag: "🇮🇹", label: labels.Italian },
  ];

  return (
    <div
      className="flex items-center rounded-full border border-border/80 bg-card/70 p-1 shadow-sm"
      role="group"
      aria-label={labels.group}
    >
      {options.map((option) => {
        const selected = option.value === language;

        return (
          <button
            key={option.value}
            type="button"
            className={`flex min-h-9 items-center justify-center gap-1.5 rounded-full px-2.5 text-xs font-bold tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none ${
              selected
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
            onClick={() => setLanguage(option.value)}
            aria-label={option.label}
            aria-pressed={selected}
          >
            <span aria-hidden="true">{option.flag}</span>
            {!compact ? <span>{option.short}</span> : null}
          </button>
        );
      })}
    </div>
  );
}

export default function Navbar() {
  const { language } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const copy =
    language === "en"
      ? {
          aria: "Main navigation",
          open: "Open navigation menu",
          close: "Close navigation menu",
          menu: "Menu",
          home: "Marco Egidi home",
        }
      : {
          aria: "Navigazione principale",
          open: "Apri il menu di navigazione",
          close: "Chiudi il menu di navigazione",
          menu: "Menu",
          home: "Home di Marco Egidi",
        };

  useEffect(() => {
    const closeMenu = () => setIsMenuOpen(false);
    window.addEventListener("hashchange", closeMenu);
    window.addEventListener("popstate", closeMenu);
    return () => {
      window.removeEventListener("hashchange", closeMenu);
      window.removeEventListener("popstate", closeMenu);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <nav
        aria-label={copy.aria}
        className="mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        <a
          href="/"
          aria-label={copy.home}
          className="group flex shrink-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm transition-transform group-hover:-rotate-3 group-hover:scale-105 motion-reduce:transition-none">
            ME
          </span>
          <span className="hidden font-semibold tracking-tight text-foreground sm:inline">
            Marco Egidi
          </span>
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          <a
            href="/"
            className="rounded-full px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Home
          </a>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {link[language]}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageSwitch />
          </div>
          <ThemeMenu />
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
            aria-label={copy.open}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </nav>

      <Dialog
        open={isMenuOpen}
        onClose={setIsMenuOpen}
        className="relative z-[70] lg:hidden"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity data-closed:opacity-0 motion-reduce:transition-none"
        />
        <div className="fixed inset-0 flex justify-end">
          <DialogPanel
            id="mobile-navigation"
            transition
            className="flex h-dvh w-[88vw] max-w-sm flex-col border-l border-border bg-background p-5 shadow-2xl transition-transform data-closed:translate-x-full motion-reduce:transition-none"
          >
            <div className="flex items-center justify-between border-b border-border pb-5">
              <div>
                <p className="font-semibold text-foreground">{copy.menu}</p>
                <p className="text-sm text-muted-foreground">Marco Egidi</p>
              </div>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={copy.close}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-5 sm:hidden">
              <LanguageSwitch />
            </div>

            <nav aria-label={copy.aria} className="mt-6 min-h-0 overflow-y-auto">
              <ul className="space-y-2">
                <li>
                  <a
                    href="/"
                    className="flex min-h-12 items-center rounded-xl px-4 py-3 text-lg font-semibold text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Home
                  </a>
                </li>
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex min-h-12 items-center rounded-xl px-4 py-3 text-lg font-semibold text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {link[language]}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </DialogPanel>
        </div>
      </Dialog>
    </header>
  );
}
