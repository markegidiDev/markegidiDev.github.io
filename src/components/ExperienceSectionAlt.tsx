import { Calendar, MapPin, Building2, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Disclosure } from "@headlessui/react";

interface Experience {
  id: number;
  title: string;
  company: string;
  type: string;
  duration: string;
  location: string;
  description: string;
}

const experiences: Experience[] = [
  
  {
    id: 1,
    title: "Tirocinante Sistemista e Tecnico Informatico",
    company: "Stardate Sas",
    type: "A tempo pieno",
    duration: "gen 2019 - feb 2019 · 2 mesi",
    location: "Montebelluna, Veneto, Italia",
    description: "Manutenzione e riparazione di computer (diagnosi hardware/software, risoluzione guasti). Installazione e configurazione di sistemi operativi e software. Assistenza tecnica ai clienti per problemi informatici. Collaborazione con il team per la gestione dei progetti IT."
  },
  {
    id: 2,
    title: "Tirocinante Sistemista e Tecnico Informatico",
    company: "Treenet SRL",
    type: "A tempo pieno",
    duration: "gen 2018 - feb 2018 · 2 mesi",
    location: "Montebelluna, Veneto, Italia",
    description: "Gestione etichette per spedizioni internazionali (Office, Adobe), Montaggio e configurazione PC, supporto hardware avanzato, Formazione base sulla cybersicurezza"
  },
  {
    id: 3,
    title: "Cameriere presso ristorante",
    company: "Ristorante Al Mercato",
    type: "Stagionale",
    duration: "giu 2023 - lug 2023 · 2 mesi",
    location: "Montebelluna, Veneto, Italia",
    description: "Accoglienza e assistenza clienti durante il servizio di pranzo e/o cena, Presa delle comande e servizio ai tavoli con attenzione alla cura del cliente, Gestione di piatti e bevande, coordinamento con la cucina e il bar, Mantenimento dell'ordine e della pulizia in sala, Supporto nella gestione di turni intensi, eventi e prenotazioni"
  },
  {
    id: 4,
    title: "Aiuto Bagnino (stagionale)",
    company: "Piscine Comunali di Montebelluna Treviso",
    type: "Stagionale",
    duration: "giu 2019 - set 2024 · 5 anni 4 mesi",
    location: "Montebelluna, Veneto, Italia",
    description: "Accoglienza clienti e gestione degli accessi alla struttura, Organizzazione e sistemazione delle aree con lettini e ombrelloni, Controllo dei biglietti e supporto nelle operazioni di sicurezza, Assistenza ai bagnini nelle attività quotidiane"
  }
];

// Modern Experience Section with responsive card grid
const ExperienceSectionAlt = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 auto-rows-fr">
      {experiences.map((exp) => {
        const details = exp.description
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

        return (
          <div
            key={exp.id}
            className="relative h-full overflow-hidden rounded-2xl border border-border bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/5 via-transparent to-transparent" />

            <div className="relative p-6 sm:p-7 flex flex-col h-full">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-card-foreground leading-tight">
                    {exp.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
                    <span className="inline-flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      <span className="font-medium">{exp.company}</span>
                    </span>
                    <Badge variant="secondary" className="text-[10px] !px-6 !py-2">
                      {exp.type}
                    </Badge>
                  </div>
                </div>

                {/* Meta info */}
                <div className="flex flex-col sm:items-end gap-2 text-xs sm:text-sm text-muted-foreground">
                  <div className="inline-flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{exp.duration}</span>
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{exp.location}</span>
                  </div>
                </div>
              </div>

              {/* Short summary */}
              <p className="mt-4 text-card-foreground/90 leading-relaxed">
                {details[0]}
              </p>

              {/* Expandable details */}
              {details.length > 1 && (
                <div className="mt-auto pt-4">
                  <Disclosure>
                    {({ open }) => (
                      <div>
                        <Disclosure.Button className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm text-foreground hover:bg-muted/60 transition-colors">
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
                          />
                          Dettagli
                        </Disclosure.Button>
                        <Disclosure.Panel>
                          <ul className="mt-3 grid list-disc pl-5 text-sm text-muted-foreground/90 gap-1.5">
                            {details.slice(1).map((d, i) => (
                              <li key={i}>{d}</li>
                            ))}
                          </ul>
                        </Disclosure.Panel>
                      </div>
                    )}
                  </Disclosure>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExperienceSectionAlt;
