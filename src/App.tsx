import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SeoManager from "@/components/SeoManager";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";
import { ThemeProvider } from "@/features/theme/theme-provider";
import { ToastProvider } from "@/components/ui/toast-provider";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { useLanguage } from "@/i18n/use-language";

const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const SwimAnalyzerPage = lazy(() => import("@/pages/SwimAnalyzerPage"));

function RouteFallback() {
  const { language } = useLanguage();
  return (
    <div
      className="mx-auto flex min-h-[55svh] w-full max-w-7xl items-center justify-center px-4 py-20 text-center text-muted-foreground"
      role="status"
    >
      {language === "en" ? "Loading application…" : "Caricamento applicazione…"}
    </div>
  );
}

function AppShell() {
  const { language } = useLanguage();
  const copy =
    language === "en"
      ? {
          skip: "Skip to main content",
          rights: "All rights reserved.",
          positioning: "Software Developer · Full Stack, AI & Cloud",
        }
      : {
          skip: "Vai al contenuto principale",
          rights: "Tutti i diritti riservati.",
          positioning: "Software Developer · Full Stack, AI & Cloud",
        };

  return (
    <BrowserRouter>
      <SeoManager />
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only z-[100] rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          {copy.skip}
        </a>
        <Navbar />
        <main id="main-content" className="w-full flex-1" tabIndex={-1}>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/swim-analyzer" element={<SwimAnalyzerPage />} />
              <Route
                path="/contact"
                element={<Navigate to="/#contact" replace />}
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        <footer className="border-t border-border bg-card py-8">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-xs font-bold text-primary-foreground">
                ME
              </span>
              <div>
                <p className="font-semibold text-foreground">Marco Egidi</p>
                <p className="text-xs text-muted-foreground">
                  {copy.positioning}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Marco Egidi. {copy.rights}
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <AppShell />
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
