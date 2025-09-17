export interface Experience {
  id: number
  title: string
  company: string
  type: string
  duration: string
  location: string
  description: string
}

export const experiences: Experience[] = [
  {
    id: 1,
    title: "Tirocinante Sistemista e Tecnico Informatico",
    company: "Stardate Sas",
    type: "A tempo pieno",
    duration: "gen 2019 - feb 2019 · 2 mesi",
    location: "Montebelluna, Veneto, Italia",
    description:
      "Manutenzione e riparazione di computer (diagnosi hardware/software, risoluzione guasti). Installazione e configurazione di sistemi operativi e software. Assistenza tecnica ai clienti per problemi informatici. Collaborazione con il team per la gestione dei progetti IT.",
  },
  {
    id: 2,
    title: "Tirocinante Sistemista e Tecnico Informatico",
    company: "Treenet SRL",
    type: "A tempo pieno",
    duration: "gen 2018 - feb 2018 · 2 mesi",
    location: "Montebelluna, Veneto, Italia",
    description:
      "Gestione etichette per spedizioni internazionali (Office, Adobe), Montaggio e configurazione PC, supporto hardware avanzato, Formazione base sulla cybersicurezza",
  },
  {
    id: 3,
    title: "Cameriere presso ristorante",
    company: "Ristorante Al Mercato",
    type: "Stagionale",
    duration: "giu 2023 - lug 2023 · 2 mesi",
    location: "Montebelluna, Veneto, Italia",
    description:
      "Accoglienza e assistenza clienti durante il servizio di pranzo e/o cena, Presa delle comande e servizio ai tavoli con attenzione alla cura del cliente, Gestione di piatti e bevande, coordinamento con la cucina e il bar, Mantenimento dell'ordine e della pulizia in sala, Supporto nella gestione di turni intensi, eventi e prenotazioni",
  },
  {
    id: 4,
    title: "Aiuto Bagnino (stagionale)",
    company: "Piscine Comunali di Montebelluna Treviso",
    type: "Stagionale",
    duration: "giu 2019 - set 2024 · 5 anni 4 mesi",
    location: "Montebelluna, Veneto, Italia",
    description:
      "Accoglienza clienti e gestione degli accessi alla struttura, Organizzazione e sistemazione delle aree con lettini e ombrelloni, Controllo dei biglietti e supporto nelle operazioni di sicurezza, Assistenza ai bagnini nelle attività quotidiane",
  },
]
