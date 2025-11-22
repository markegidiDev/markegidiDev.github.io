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
    title: "Software Developer (Stage)",
    company: "Sync Lab S.r.l.",
    type: "Stage",
    duration: "ott 2025 - Presente",
    location: "Padova, Veneto, Italia (Ibrida)",
    description:
      "Sviluppo software con focus su database relazionali e SQL. Collaborazione in team per la realizzazione di soluzioni enterprise.",
  },
  {
    id: 2,
    title: "Aiuto Bagnino",
    company: "Piscine Comunali di Montebelluna",
    type: "Stagionale",
    duration: "giu 2019 - set 2025 · 6 anni 4 mesi",
    location: "Montebelluna, Veneto, Italia",
    description:
      "Accoglienza clienti e gestione accessi. Organizzazione aree, controllo biglietti e supporto sicurezza. Assistenza ai bagnini nelle attività quotidiane. Gestione logistica e comunicazioni strategiche.",
  },
  {
    id: 3,
    title: "Cameriere",
    company: "Ristorante Al Mercato",
    type: "Stagionale",
    duration: "giu 2023 - lug 2023 · 2 mesi",
    location: "Montebelluna, Veneto, Italia",
    description:
      "Accoglienza e assistenza clienti, presa comande e servizio ai tavoli. Coordinamento con cucina e bar. Gestione turni intensi e mantenimento ordine in sala.",
  },
  {
    id: 4,
    title: "Tirocinante Sistemista",
    company: "Stardate Sas",
    type: "A tempo pieno",
    duration: "gen 2019 - feb 2019 · 2 mesi",
    location: "Montebelluna, Veneto, Italia",
    description:
      "Manutenzione e riparazione PC (hardware/software). Installazione e configurazione Windows. Assistenza tecnica utenti (loco/remoto) e manutenzione preventiva.",
  },
  {
    id: 5,
    title: "Tirocinante Sistemista",
    company: "Treenet SRL",
    type: "A tempo pieno",
    duration: "gen 2018 - feb 2018 · 2 mesi",
    location: "Montebelluna, Veneto, Italia",
    description:
      "Attività sistemistiche e gestione etichette spedizioni internazionali (Office/Adobe). Montaggio e configurazione PC, supporto hardware avanzato. Formazione base cybersicurezza agli utenti.",
  },
]
