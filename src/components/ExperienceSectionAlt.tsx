import { Calendar, MapPin } from "lucide-react";
import { StaggeredBoxReveal } from "@/components/magicui/staggered-box-reveal";

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

// Versione alternativa con struttura più pulita e layout responsive
const ExperienceSectionAlt = () => {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '1.5rem' 
    }}>
      {experiences.map((exp, index) => (        <div className="transition-all duration-300 hover:shadow-md hover:scale-105">
          <StaggeredBoxReveal
            key={exp.id}
            width="100%"
            duration={0.5}
            index={index}
            boxColor="#0C0C0D"
          >            <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="text-lg font-medium text-foreground">{exp.title}</div>
            </div>            <div className="wb-card-content flex-1 flex flex-col space-y-3 p-6">
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{exp.location}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{exp.duration}</span>
              </div>
              <div className="text-muted-foreground">{exp.company} · {exp.type}</div>
              <p style={{ marginTop: "0.5rem", lineHeight: "1.6" }} className="flex-1">{exp.description}</p>            </div>
            </div>
          </StaggeredBoxReveal>
        </div>
      ))}
    </div>
  );
};

export default ExperienceSectionAlt;
