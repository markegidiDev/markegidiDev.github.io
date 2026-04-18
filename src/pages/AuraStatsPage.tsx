import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";

const auraStatsUrl = `${import.meta.env.BASE_URL}aurastats.html`;

const AuraStatsPage = () => {
  return (
    <div className="bg-background">
      <section className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6">
        <div className="mb-6 rounded-[28px] border border-border bg-card/80 p-6 shadow-sm backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
            AuraStats
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Dashboard NuotoMaster integrata nel sito
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
            Qui sotto trovi l&apos;HTML originale incapsulato nel layout del portfolio.
            Se vuoi aprire la versione standalone direttamente dal browser, puoi farlo dal
            link qui sotto.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild>
              <a href={auraStatsUrl} target="_blank" rel="noreferrer">
                Apri HTML diretto
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-[32px] border border-border bg-card shadow-xl">
          <iframe
            title="AuraStats"
            src={auraStatsUrl}
            className="h-[calc(100vh-16rem)] min-h-[920px] w-full bg-white"
          />
        </div>
      </section>
    </div>
  );
};

export default AuraStatsPage;
