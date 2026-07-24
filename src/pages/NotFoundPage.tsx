import { ArrowLeft, SearchX } from "lucide-react";
import { useLanguage } from "@/i18n/use-language";

export default function NotFoundPage() {
  const { language } = useLanguage();
  const copy =
    language === "en"
      ? {
          eyebrow: "404 · Page not found",
          title: "This page has moved — or never existed.",
          text: "Return to the portfolio to explore software, AI, cloud, and creative work.",
          action: "Back to the homepage",
        }
      : {
          eyebrow: "404 · Pagina non trovata",
          title: "Questa pagina è stata spostata — oppure non è mai esistita.",
          text: "Torna al portfolio per esplorare progetti software, AI, cloud e creative work.",
          action: "Torna alla homepage",
        };

  return (
    <section className="mx-auto flex min-h-[65svh] w-full max-w-3xl items-center px-4 py-20 sm:px-6">
      <div className="w-full rounded-[2rem] border border-border bg-card p-7 text-center shadow-xl sm:p-12">
        <SearchX
          className="mx-auto h-10 w-10 text-primary"
          aria-hidden="true"
        />
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-primary">
          {copy.eyebrow}
        </p>
        <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-5xl">
          {copy.title}
        </h1>
        <p className="mx-auto mt-5 max-w-xl leading-7 text-muted-foreground">
          {copy.text}
        </p>
        <a
          href="/"
          className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {copy.action}
        </a>
      </div>
    </section>
  );
}
