import type { ComponentType, ReactNode } from "react";
import {
  ArrowRight,
  Award,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  Camera,
  CheckCircle2,
  Cloud,
  Code2,
  Container,
  Database,
  Download,
  ExternalLink,
  Film,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Play,
  Radio,
  ShieldCheck,
  Sparkles,
  Waves,
} from "lucide-react";
import { useLanguage } from "@/i18n/use-language";
import type { Language } from "@/i18n/language-context";

type LocalizedText = Record<Language, string>;

type Project = {
  name: string;
  eyebrow: LocalizedText;
  description: LocalizedText;
  contribution: LocalizedText;
  stack: string[];
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  tone: "green" | "blue" | "violet" | "amber";
  links: Array<{ label: LocalizedText; href: string; github?: boolean }>;
};

const profileLinks = {
  github: "https://github.com/markegidiDev",
  linkedin: "https://www.linkedin.com/in/marcoegidi",
  email: "mailto:marco.egidi.me@gmail.com",
};

const projects: Project[] = [
  {
    name: "AI LiveBot",
    eyebrow: {
      en: "AI operations · Odoo",
      it: "Operazioni AI · Odoo",
    },
    description: {
      en: "An AI assistant embedded in Odoo 18 for handling warehouse availability, sales orders, and deliveries through natural language.",
      it: "Assistente AI integrato in Odoo 18 per gestire disponibilità di magazzino, ordini di vendita e consegne tramite linguaggio naturale.",
    },
    contribution: {
      en: "I built the Gemini and OpenRouter integration, function calling, fuzzy product search, real-time stock checks, and the confirmation flow before order creation.",
      it: "Ho sviluppato l’integrazione con Gemini e OpenRouter, il function calling, la ricerca fuzzy dei prodotti, i controlli dello stock in tempo reale e il flusso di conferma prima della creazione degli ordini.",
    },
    stack: [
      "Python",
      "Odoo 18",
      "Odoo ORM",
      "JavaScript",
      "Gemini",
      "OpenRouter",
    ],
    icon: Bot,
    tone: "green",
    links: [
      {
        label: { en: "View source", it: "Vedi codice" },
        href: "https://github.com/markegidiDev/ERP-ChatBot-LLM",
        github: true,
      },
    ],
  },
  {
    name: "Spinout Engine",
    eyebrow: {
      en: "HackRome · Two-person team",
      it: "HackRome · Team di due persone",
    },
    description: {
      en: "An AI application that turns technical and research documents into structured venture memos, with an investor-style question room.",
      it: "Applicazione AI che trasforma documenti tecnici e di ricerca in venture memo strutturati, con una sezione di domande in stile investitore.",
    },
    contribution: {
      en: "The multi-agent pipeline analyses technical novelty, market opportunity, competition, risks, and commercial potential, then produces material for founders and investors.",
      it: "La pipeline multi-agente analizza novità tecnica, mercato, concorrenza, rischi e potenziale commerciale, producendo materiale utile per founder e investitori.",
    },
    stack: [
      "Python",
      "FastAPI",
      "Pydantic",
      "Firebase",
      "Docker",
      "Scaleway",
      "OpenAI",
      "Gemini",
      "ElevenLabs",
    ],
    icon: BrainCircuit,
    tone: "violet",
    links: [
      {
        label: { en: "Open demo", it: "Apri demo" },
        href: "https://spinout-engine.vercel.app",
      },
      {
        label: { en: "View source", it: "Vedi codice" },
        href: "https://github.com/markegidiDev/spinout-engine",
        github: true,
      },
    ],
  },
  {
    name: "Pulse Buddy",
    eyebrow: {
      en: "Chrome extension · Real-time data",
      it: "Estensione Chrome · Dati real-time",
    },
    description: {
      en: "A Chrome Manifest V3 extension that adds real-time financial data and personalised badges directly to crypto platform interfaces.",
      it: "Estensione Chrome Manifest V3 che integra dati finanziari in tempo reale e badge personalizzati direttamente nelle interfacce di piattaforme crypto.",
    },
    contribution: {
      en: "Designed around dynamic interface updates, WebSocket connections, and local preferences, with a focus on performance and privacy.",
      it: "Progettata per gestire aggiornamenti dinamici dell’interfaccia, connessioni WebSocket e preferenze locali, con attenzione a prestazioni e privacy.",
    },
    stack: [
      "JavaScript ES6+",
      "Chrome MV3",
      "WebSocket",
      "MutationObserver",
      "DOM API",
    ],
    icon: Radio,
    tone: "blue",
    links: [
      {
        label: { en: "View source", it: "Vedi codice" },
        href: "https://github.com/markegidiDev/pulse-buddy",
        github: true,
      },
    ],
  },
  {
    name: "Sigma18 Cloud Platform",
    eyebrow: {
      en: "University project · Cloud",
      it: "Progetto universitario · Cloud",
    },
    description: {
      en: "A cloud-native workflow automation project developed with an academic team and Var Group, using generative AI through Amazon Bedrock.",
      it: "Progetto cloud-native per l’automazione di workflow sviluppato in team universitario con Var Group, usando AI generativa tramite Amazon Bedrock.",
    },
    contribution: {
      en: "Practical full-stack and deployment work across a React interface, Python services, authentication, containers, and AWS infrastructure.",
      it: "Esperienza pratica full stack e di deployment tra interfaccia React, servizi Python, autenticazione, container e infrastruttura AWS.",
    },
    stack: [
      "React",
      "Python",
      "Flask",
      "AWS",
      "Docker",
      "Amazon Bedrock",
    ],
    icon: Cloud,
    tone: "amber",
    links: [
      {
        label: { en: "Project site", it: "Sito progetto" },
        href: "https://sigma18unipd.github.io/",
      },
      {
        label: { en: "Documentation", it: "Documentazione" },
        href: "https://github.com/Sigma18Unipd/docs",
        github: true,
      },
    ],
  },
];

const copy = {
  en: {
    hero: {
      eyebrow: "Software Developer · Veneto, Italy",
      role: "Full Stack, AI & Cloud Developer",
      description:
        "I build web applications and AI systems with Python, TypeScript, React, FastAPI, and SQL — from interface and API design to databases and cloud deployment.",
      education:
        "Computer Science graduate from the University of Padua. Master’s studies in Cybersecurity planned for October 2026.",
      projects: "Explore projects",
      resume: "Download résumé",
      contact: "Contact me",
      linkedin: "Marco Egidi’s LinkedIn profile",
    },
    section: {
      projects: "Selected projects",
      projectsKicker: "Built to solve real problems",
      projectsIntro:
        "Full-stack products, AI integrations, and cloud systems — with the contribution and essential stack made clear.",
      experience: "Professional experience",
      experienceKicker: "Hands-on work",
      experienceIntro:
        "Technical roles first, with other work experience kept concise and relevant.",
      skills: "Technical skills",
      skillsKicker: "Working toolkit",
      skillsIntro:
        "Grouped by area and practical use, without arbitrary proficiency scores.",
      creative: "Creative Work",
      creativeKicker: "A complementary practice",
      creativeIntro: "Video editing and photo post-production",
      about: "About me",
      aboutKicker: "How I approach the work",
      beyond: "Beyond code",
      beyondKicker: "Discipline outside the screen",
      education: "Education & learning",
      educationKicker: "A foundation that keeps evolving",
      contact: "Let’s connect",
      contactKicker: "Open to the right opportunity",
    },
    projectContribution: "My contribution",
    experience: {
      techTitle: "Technical experience",
      syncTitle: "Software Developer Intern",
      syncCompany: "Sync Lab S.r.l.",
      syncMeta: "October 2025 – December 2025 · Padua · Hybrid",
      syncText:
        "Designed and developed AI LiveBot, an Odoo 18 module that embeds an AI assistant in the platform’s native chat and automates warehouse, sales, and delivery operations.",
      stardateTitle: "IT Systems and Support Intern",
      stardateCompany: "Stardate Sas",
      stardateMeta: "January 2019 – February 2019",
      stardateText:
        "Hardware and software diagnostics, Windows system configuration, PC maintenance, and local and remote technical support.",
      treenetTitle: "IT Systems Intern",
      treenetCompany: "Treenet SRL",
      treenetMeta: "January 2018 – February 2018",
      treenetText:
        "PC assembly and configuration, hardware support, and user awareness work covering core cybersecurity principles.",
      otherTitle: "Other experience",
      otherText:
        "Roles in sports facilities and hospitality strengthened my communication, organisation, reliability, and ability to work calmly under pressure.",
    },
    skills: [
      {
        title: "Development",
        note: "Core application work",
        items:
          "Python · JavaScript · TypeScript · SQL · React · FastAPI · Flask · Odoo 18 · C/C++ · Java",
        icon: Code2,
      },
      {
        title: "Data & integrations",
        note: "Practical experience",
        items:
          "PostgreSQL · Firebase · Firestore · REST API · WebSocket · Function Calling",
        icon: Database,
      },
      {
        title: "Cloud & DevOps",
        note: "Deployment and delivery",
        items:
          "Docker · Google Cloud · AWS · Scaleway · Git · GitHub · GitHub Actions · CI/CD",
        icon: Container,
      },
      {
        title: "Artificial intelligence",
        note: "APIs and agentic systems",
        items:
          "OpenAI API · Gemini API · OpenRouter · Amazon Bedrock · LangChain · Pydantic · Multi-agent systems",
        icon: Sparkles,
      },
    ],
    creative: {
      intro:
        "Alongside software development, I work on video editing and photo post-production. I mainly work with footage captured by clients or other videographers, taking care of clip selection, editing, sound design, colour grading, and custom animation.",
      formats:
        "My work includes commercial content for swimming events, B&B and hospitality, plus cinematic travel pieces. Most projects are vertical formats for Instagram Reels, TikTok, and YouTube Shorts, alongside longer travel edits.",
      videoTitle: "Video editing",
      videoText:
        "Editing, sound design, colour grading, and custom animation, with close attention to rhythm, atmosphere, and visual communication.",
      photoTitle: "Photo editing",
      photoText:
        "Photo development and post-production, exposure and colour correction, consistent visual looks, and image optimisation for web and social.",
      selected: "Selected work",
      youtubeTitle: "Cinematic & travel videos",
      youtubeText:
        "A selection of cinematic travel and holiday videos edited by Marco, shaped through pacing, colour grading, and sound design.",
      channel: "View YouTube channel",
      reelOneTitle: "Cinematic Swim Meet (Treviso) · Race reel",
      reelOneText:
        "A fast-paced swimming reel edited by Marco, focused on race-day intensity and competing side by side.",
      reelTwoTitle: "City of Montebelluna Trophy",
      reelTwoText:
        "An event reel edited to turn a master swimming meet into a dynamic, cinematic social story.",
      viewReel: "View reel",
    },
    about: [
      "I’m a software developer with a Computer Science degree from the University of Padua, interested in full-stack applications, AI systems, and cloud infrastructure.",
      "I enjoy working across the full development cycle: defining the problem, designing the architecture, implementing APIs, managing data, building the interface, testing, and deployment.",
      "I’m especially interested in products where AI and automation solve real operational problems rather than stopping at a demo. I also take part in hackathons and cybersecurity activities, the field I plan to continue studying from October 2026.",
    ],
    beyond: {
      title: "Master swimming",
      text: "I train and compete with a master swimming team, taking part regularly in competitions and achieving results at regional level. Swimming has strengthened my discipline, consistency, goal management, and attention to detail.",
      analyzer: "Discover Swim Analyzer",
      analyzerNote: "Where sport, data, and software meet.",
    },
    education: {
      degree: "BSc in Computer Science",
      degreeMeta: "University of Padua · April 2026",
      master: "Master’s studies in Cybersecurity",
      masterMeta: "Planned enrolment · October 2026",
      complementary: "Complementary learning",
      items: [
        {
          title: "AWS Intro to Cost Management for SaaS",
          type: "Learning course",
        },
        {
          title: "Reply Hack the Code Challenge",
          type: "Cybersecurity competition",
        },
        {
          title: "Microsoft Azure Fundamentals",
          type: "Cloud fundamentals learning path",
        },
        {
          title: "Cisco Networking Academy — Introduction to Networks",
          type: "Networking course",
        },
      ],
    },
    contact: {
      text: "I’m interested in junior opportunities and collaborations across software development, backend, AI, cloud, and cybersecurity.",
      secondary:
        "I also consider selected video editing and post-production projects for commercial and social content.",
      email: "Email me",
      linkedin: "LinkedIn",
      github: "GitHub",
      resume: "Download résumé",
    },
  },
  it: {
    hero: {
      eyebrow: "Software Developer · Veneto, Italia",
      role: "Full Stack, AI & Cloud Developer",
      description:
        "Sviluppo applicazioni web e sistemi AI con Python, TypeScript, React, FastAPI e SQL, dalla progettazione dell’interfaccia fino alle API, ai database e al deployment cloud.",
      education:
        "Laureato in Informatica all’Università di Padova. Studi magistrali in Cybersecurity previsti da ottobre 2026.",
      projects: "Esplora i progetti",
      resume: "Scarica il CV",
      contact: "Contattami",
      linkedin: "Profilo LinkedIn di Marco Egidi",
    },
    section: {
      projects: "Progetti in evidenza",
      projectsKicker: "Soluzioni per problemi reali",
      projectsIntro:
        "Prodotti full stack, integrazioni AI e sistemi cloud, con contributo personale e stack essenziale sempre chiari.",
      experience: "Esperienza professionale",
      experienceKicker: "Esperienza pratica",
      experienceIntro:
        "Prima i ruoli tecnici, con le altre esperienze lavorative raccolte in modo compatto e pertinente.",
      skills: "Competenze tecniche",
      skillsKicker: "Strumenti di lavoro",
      skillsIntro:
        "Organizzate per area ed esperienza pratica, senza percentuali arbitrarie.",
      creative: "Creative Work",
      creativeKicker: "Una pratica complementare",
      creativeIntro: "Video editing e post-produzione fotografica",
      about: "Chi sono",
      aboutKicker: "Il mio approccio al lavoro",
      beyond: "Oltre il codice",
      beyondKicker: "Disciplina anche fuori dallo schermo",
      education: "Formazione e approfondimenti",
      educationKicker: "Una base in continua evoluzione",
      contact: "Entriamo in contatto",
      contactKicker: "Disponibile per l’opportunità giusta",
    },
    projectContribution: "Il mio contributo",
    experience: {
      techTitle: "Esperienza tecnica",
      syncTitle: "Software Developer Intern",
      syncCompany: "Sync Lab S.r.l.",
      syncMeta: "Ottobre 2025 – dicembre 2025 · Padova · Modalità ibrida",
      syncText:
        "Progettazione e sviluppo di AI LiveBot, un modulo per Odoo 18 che integra un assistente AI nella chat nativa della piattaforma e automatizza operazioni relative a magazzino, vendita e consegna.",
      stardateTitle: "IT Systems and Support Intern",
      stardateCompany: "Stardate Sas",
      stardateMeta: "Gennaio 2019 – febbraio 2019",
      stardateText:
        "Diagnosi hardware e software, configurazione di sistemi Windows, manutenzione dei PC e assistenza tecnica locale e remota.",
      treenetTitle: "IT Systems Intern",
      treenetCompany: "Treenet SRL",
      treenetMeta: "Gennaio 2018 – febbraio 2018",
      treenetText:
        "Assemblaggio e configurazione di PC, supporto hardware e attività di sensibilizzazione degli utenti sui principi fondamentali della sicurezza informatica.",
      otherTitle: "Altre esperienze",
      otherText:
        "Le esperienze nel settore sportivo e della ristorazione hanno rafforzato comunicazione, organizzazione, affidabilità e gestione del lavoro sotto pressione.",
    },
    skills: [
      {
        title: "Sviluppo",
        note: "Lavoro applicativo principale",
        items:
          "Python · JavaScript · TypeScript · SQL · React · FastAPI · Flask · Odoo 18 · C/C++ · Java",
        icon: Code2,
      },
      {
        title: "Database e integrazioni",
        note: "Esperienza pratica",
        items:
          "PostgreSQL · Firebase · Firestore · REST API · WebSocket · Function Calling",
        icon: Database,
      },
      {
        title: "Cloud e DevOps",
        note: "Deployment e delivery",
        items:
          "Docker · Google Cloud · AWS · Scaleway · Git · GitHub · GitHub Actions · CI/CD",
        icon: Container,
      },
      {
        title: "Intelligenza artificiale",
        note: "API e sistemi agentici",
        items:
          "OpenAI API · Gemini API · OpenRouter · Amazon Bedrock · LangChain · Pydantic · Sistemi multi-agente",
        icon: Sparkles,
      },
    ],
    creative: {
      intro:
        "Accanto allo sviluppo software, mi occupo di video editing e post-produzione fotografica. Lavoro soprattutto su materiale registrato da clienti o altri videomaker, curando selezione delle clip, montaggio, sound design, color grading e animazioni personalizzate.",
      formats:
        "Realizzo contenuti commerciali per eventi di nuoto, B&B e hospitality, oltre a video cinematici di viaggi e vacanze. Lavoro soprattutto su formati verticali per Instagram Reels, TikTok e YouTube Shorts, ma anche su video di viaggio più lunghi.",
      videoTitle: "Video Editing",
      videoText:
        "Montaggio, sound design, color grading e animazioni personalizzate, con particolare attenzione a ritmo, atmosfera e comunicazione visiva.",
      photoTitle: "Photo Editing",
      photoText:
        "Sviluppo e post-produzione fotografica, correzione di esposizione e colore, creazione di look coerenti e ottimizzazione delle immagini per web e social.",
      selected: "Lavori selezionati",
      youtubeTitle: "Video cinematici e di viaggio",
      youtubeText:
        "Una selezione di video cinematici di viaggi e vacanze montati da Marco, curati in post-produzione per atmosfera, ritmo, color grading e sound design.",
      channel: "Guarda il canale YouTube",
      reelOneTitle: "Cinematic Swim Meet (Treviso) · Race reel",
      reelOneText:
        "Edit focalizzato sull’intensità della gara e sul confronto in vasca.",
      reelTwoTitle: "Trofeo Città di Montebelluna",
      reelTwoText:
        "Reel montato per trasformare un evento master in un racconto social e cinematografico.",
      viewReel: "Guarda il reel",
    },
    about: [
      "Sono un software developer laureato in Informatica all’Università di Padova, interessato alla progettazione di applicazioni full stack, sistemi AI e infrastrutture cloud.",
      "Mi piace seguire l’intero ciclo di sviluppo: definizione del problema, progettazione dell’architettura, implementazione delle API, gestione dei dati, sviluppo dell’interfaccia, testing e deployment.",
      "Mi interessano soprattutto i progetti in cui AI e automazione risolvono problemi operativi reali, andando oltre la semplice realizzazione di demo. Partecipo inoltre ad hackathon e attività legate alla cybersecurity, ambito nel quale continuerò il mio percorso universitario da ottobre 2026.",
    ],
    beyond: {
      title: "Nuoto master",
      text: "Mi alleno e gareggio con una squadra master, partecipando regolarmente a competizioni e ottenendo risultati a livello regionale. Il nuoto ha rafforzato disciplina, costanza, gestione degli obiettivi e attenzione ai dettagli.",
      analyzer: "Scopri Swim Analyzer",
      analyzerNote: "Il punto d’incontro tra sport, dati e software.",
    },
    education: {
      degree: "Laurea in Informatica",
      degreeMeta: "Università degli Studi di Padova · aprile 2026",
      master: "Studi magistrali in Cybersecurity",
      masterMeta: "Iscrizione prevista · ottobre 2026",
      complementary: "Formazione complementare",
      items: [
        {
          title: "AWS Intro to Cost Management for SaaS",
          type: "Corso di formazione",
        },
        {
          title: "Reply Hack the Code Challenge",
          type: "Competizione di cybersecurity",
        },
        {
          title: "Microsoft Azure Fundamentals",
          type: "Learning path sui fondamenti cloud",
        },
        {
          title: "Cisco Networking Academy — Introduction to Networks",
          type: "Corso di networking",
        },
      ],
    },
    contact: {
      text: "Sono interessato a opportunità junior e collaborazioni nei settori software development, backend, AI, cloud e cybersecurity.",
      secondary:
        "Valuto inoltre progetti selezionati di video editing e post-produzione per contenuti commerciali e social.",
      email: "Scrivimi",
      linkedin: "LinkedIn",
      github: "GitHub",
      resume: "Scarica il CV",
    },
  },
} as const;

function SectionHeader({
  id,
  kicker,
  title,
  description,
}: {
  id: string;
  kicker: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-9 max-w-3xl sm:mb-12">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
        {kicker}
      </p>
      <h2
        id={id}
        className="text-balance text-3xl font-bold tracking-[-0.035em] text-foreground sm:text-4xl lg:text-5xl"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function ProjectVisual({
  project,
}: {
  project: Pick<Project, "name" | "icon" | "tone">;
}) {
  const Icon = project.icon;
  const tone = {
    green: "from-emerald-400/20 via-teal-400/5 text-emerald-400",
    blue: "from-sky-400/20 via-cyan-400/5 text-sky-400",
    violet: "from-violet-400/20 via-indigo-400/5 text-violet-400",
    amber: "from-amber-400/20 via-orange-400/5 text-amber-400",
  }[project.tone];

  return (
    <div
      className={`relative isolate min-h-52 overflow-hidden border-b border-border bg-gradient-to-br ${tone} to-transparent`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-grid-soft opacity-50" />
      <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-current opacity-10 blur-3xl" />
      <div className="relative flex min-h-52 flex-col justify-between p-6">
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-current/20 bg-background/50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em]">
            Case study
          </span>
          <Icon className="h-7 w-7" aria-hidden={true} />
        </div>
        <div>
          <div className="mb-3 flex gap-2">
            <span className="h-2 w-2 rounded-full bg-current opacity-90" />
            <span className="h-2 w-12 rounded-full bg-current opacity-30" />
            <span className="h-2 w-20 rounded-full bg-current opacity-15" />
          </div>
          <p className="max-w-[15rem] text-2xl font-bold tracking-tight text-foreground">
            {project.name}
          </p>
        </div>
      </div>
    </div>
  );
}

function ExternalAction({
  href,
  children,
  primary = false,
  github = false,
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  primary?: boolean;
  github?: boolean;
  ariaLabel?: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      aria-label={ariaLabel}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none ${
        primary
          ? "bg-primary text-primary-foreground shadow-sm hover:-translate-y-0.5 hover:shadow-lg"
          : "border border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted"
      }`}
    >
      {github ? (
        <Github className="h-4 w-4" aria-hidden="true" />
      ) : null}
      <span>{children}</span>
      {!github ? (
        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
      ) : null}
    </a>
  );
}

function ExperienceCard({
  title,
  company,
  meta,
  text,
  featured = false,
}: {
  title: string;
  company: string;
  meta: string;
  text: string;
  featured?: boolean;
}) {
  return (
    <article
      className={`rounded-3xl border bg-card p-6 shadow-sm sm:p-7 ${
        featured
          ? "border-primary/35 lg:col-span-2"
          : "border-border"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
            featured
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          <BriefcaseBusiness className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="mt-0.5 font-medium text-primary">{company}</p>
          <p className="mt-2 text-sm text-muted-foreground">{meta}</p>
        </div>
      </div>
      <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">
        {text}
      </p>
    </article>
  );
}

export default function HomePage() {
  const { language } = useLanguage();
  const t = copy[language];
  const resumeHref =
    language === "en"
      ? "/Marco_Egidi_CV_EN_updated.pdf"
      : "/Marco_Egidi_CV_IT_updated.pdf";

  return (
    <div className="relative overflow-hidden bg-background text-foreground">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[46rem] bg-[radial-gradient(circle_at_18%_14%,rgb(var(--blob-green)/0.16),transparent_36%),radial-gradient(circle_at_82%_12%,rgb(var(--blob-sky)/0.13),transparent_32%)]"
        aria-hidden="true"
      />

      <section
        aria-labelledby="hero-title"
        className="relative mx-auto flex min-h-[calc(100svh-4.5rem)] w-full max-w-7xl items-center px-4 py-14 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="grid w-full items-center gap-12 lg:grid-cols-[minmax(0,1fr)_25rem] lg:gap-16">
          <div className="max-w-4xl">
            <p className="hero-reveal inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {t.hero.eyebrow}
            </p>
            <h1
              id="hero-title"
              className="hero-reveal mt-6 text-[clamp(3.25rem,13vw,7.75rem)] font-bold leading-[0.88] tracking-[-0.075em] text-foreground"
            >
              Marco
              <span className="block text-gradient">Egidi</span>
            </h1>
            <p className="hero-reveal mt-7 text-xl font-semibold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
              {t.hero.role}
            </p>
            <p className="hero-reveal mt-5 max-w-3xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              {t.hero.description}
            </p>
            <p className="hero-reveal mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
              {t.hero.education}
            </p>

            <div className="hero-reveal mt-8 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/15 transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
              >
                {t.hero.projects}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href={resumeHref}
                download
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-bold text-foreground transition hover:border-primary/50 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                {t.hero.resume}
              </a>
              <a
                href="#contact"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-transparent px-5 py-3 text-sm font-bold text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
              >
                {t.hero.contact}
              </a>
            </div>

            <div className="hero-reveal mt-7 flex flex-wrap items-center gap-2">
              <a
                href={profileLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Marco Egidi on GitHub"
                className="social-link"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                GitHub
              </a>
              <a
                href={profileLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t.hero.linkedin}
                className="social-link"
              >
                <Linkedin className="h-4 w-4" aria-hidden="true" />
                LinkedIn
              </a>
              <a
                href={profileLinks.email}
                className="social-link"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Email
              </a>
            </div>
          </div>

          <div
            className="hero-reveal relative hidden aspect-[4/5] overflow-hidden rounded-[2.25rem] border border-border bg-card p-5 shadow-2xl shadow-primary/10 lg:block"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-grid-soft opacity-50" />
            <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative flex h-full flex-col justify-between rounded-[1.6rem] border border-border/80 bg-background/70 p-6 backdrop-blur">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  ME / 2026
                </span>
                <span className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_18px_hsl(var(--primary))]" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Code2 className="h-6 w-6 text-primary" />
                  <span className="h-2 flex-1 rounded-full bg-primary/35" />
                </div>
                <div className="flex items-center gap-3">
                  <BrainCircuit className="h-6 w-6 text-sky-400" />
                  <span className="h-2 w-3/4 rounded-full bg-sky-400/35" />
                </div>
                <div className="flex items-center gap-3">
                  <Cloud className="h-6 w-6 text-violet-400" />
                  <span className="h-2 w-1/2 rounded-full bg-violet-400/35" />
                </div>
              </div>
              <div>
                <p className="text-4xl font-bold leading-none tracking-[-0.055em]">
                  Build.
                  <br />
                  Connect.
                  <br />
                  Ship.
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  Python · TypeScript · React · FastAPI
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div>
        <section
          id="projects"
          aria-labelledby="projects-title"
          className="scroll-mt-24 border-t border-border/70 py-20 sm:py-28"
        >
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              id="projects-title"
              kicker={t.section.projectsKicker}
              title={t.section.projects}
              description={t.section.projectsIntro}
            />

            <div className="grid gap-6 lg:grid-cols-2">
              {projects.map((project, index) => (
                <article
                  key={project.name}
                  className={`project-card group overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm ${
                    index === 0 ? "lg:row-span-1" : ""
                  }`}
                >
                  <ProjectVisual project={project} />
                  <div className="p-6 sm:p-8">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                      {project.eyebrow[language]}
                    </p>
                    <h3 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
                      {project.name}
                    </h3>
                    <p className="mt-4 leading-7 text-muted-foreground">
                      {project.description[language]}
                    </p>
                    <div className="mt-5 rounded-2xl border border-border/70 bg-muted/35 p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-foreground">
                        {t.projectContribution}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {project.contribution[language]}
                      </p>
                    </div>
                    <ul
                      className="mt-5 flex flex-wrap gap-x-3 gap-y-2 text-sm text-muted-foreground"
                      aria-label={`${project.name} stack`}
                    >
                      {project.stack.map((item) => (
                        <li key={item} className="inline-flex items-center gap-2">
                          <span
                            className="h-1 w-1 rounded-full bg-primary"
                            aria-hidden="true"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 flex flex-wrap gap-3">
                      {project.links.map((link, linkIndex) => (
                        <ExternalAction
                          key={link.href}
                          href={link.href}
                          github={link.github}
                          primary={linkIndex === 0}
                        >
                          {link.label[language]}
                        </ExternalAction>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="experience"
          aria-labelledby="experience-title"
          className="scroll-mt-24 bg-muted/30 py-20 sm:py-28"
        >
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              id="experience-title"
              kicker={t.section.experienceKicker}
              title={t.section.experience}
              description={t.section.experienceIntro}
            />

            <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-muted-foreground">
              {t.experience.techTitle}
            </h3>
            <div className="grid gap-5 lg:grid-cols-2">
              <ExperienceCard
                title={t.experience.syncTitle}
                company={t.experience.syncCompany}
                meta={t.experience.syncMeta}
                text={t.experience.syncText}
                featured
              />
              <ExperienceCard
                title={t.experience.stardateTitle}
                company={t.experience.stardateCompany}
                meta={t.experience.stardateMeta}
                text={t.experience.stardateText}
              />
              <ExperienceCard
                title={t.experience.treenetTitle}
                company={t.experience.treenetCompany}
                meta={t.experience.treenetMeta}
                text={t.experience.treenetText}
              />
            </div>

            <article className="mt-5 flex flex-col gap-4 rounded-2xl border border-border bg-background p-5 sm:flex-row sm:items-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  {t.experience.otherTitle}
                </h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {t.experience.otherText}
                </p>
              </div>
            </article>
          </div>
        </section>

        <section
          id="skills"
          aria-labelledby="skills-title"
          className="scroll-mt-24 py-20 sm:py-28"
        >
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              id="skills-title"
              kicker={t.section.skillsKicker}
              title={t.section.skills}
              description={t.section.skillsIntro}
            />
            <div className="grid gap-5 md:grid-cols-2">
              {t.skills.map((skill) => {
                const Icon = skill.icon;
                return (
                  <article
                    key={skill.title}
                    className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-7"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {skill.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {skill.note}
                        </p>
                      </div>
                    </div>
                    <p className="mt-6 text-base leading-8 text-muted-foreground">
                      {skill.items}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="creative-work"
          aria-labelledby="creative-title"
          className="scroll-mt-24 border-y border-border/70 bg-card/45 py-20 sm:py-28"
        >
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              id="creative-title"
              kicker={t.section.creativeKicker}
              title={t.section.creative}
              description={t.section.creativeIntro}
            />
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="text-pretty text-lg leading-8 text-foreground">
                  {t.creative.intro}
                </p>
                <p className="mt-5 leading-7 text-muted-foreground">
                  {t.creative.formats}
                </p>

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <article className="rounded-3xl border border-border bg-background p-6">
                    <Film
                      className="h-7 w-7 text-primary"
                      aria-hidden="true"
                    />
                    <h3 className="mt-5 text-xl font-semibold">
                      {t.creative.videoTitle}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {t.creative.videoText}
                    </p>
                    <p className="mt-5 text-sm font-semibold text-foreground">
                      DaVinci Resolve · Fusion · Fairlight
                    </p>
                  </article>
                  <article className="rounded-3xl border border-border bg-background p-6">
                    <Camera
                      className="h-7 w-7 text-sky-500"
                      aria-hidden="true"
                    />
                    <h3 className="mt-5 text-xl font-semibold">
                      {t.creative.photoTitle}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {t.creative.photoText}
                    </p>
                    <p className="mt-5 text-sm font-semibold text-foreground">
                      Adobe Lightroom
                    </p>
                  </article>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  {t.creative.selected}
                </h3>
                <div className="space-y-4">
                  <a
                    href="https://www.youtube.com/@markegidi/videos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-3xl border border-border bg-background p-5 transition hover:border-primary/45 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
                        <Play className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {t.creative.youtubeTitle}
                        </h4>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {t.creative.youtubeText}
                        </p>
                        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                          {t.creative.channel}
                          <ExternalLink
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                    </div>
                  </a>

                  <a
                    href="https://www.instagram.com/edr.foto/reel/DZNQ9nOKB0GrULNF-ppQFvoj3nlJde7eKU9CEs0/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-3xl border border-border bg-background p-5 transition hover:border-primary/45 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500">
                        <Waves className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {t.creative.reelOneTitle}
                        </h4>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {t.creative.reelOneText}
                        </p>
                        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                          {t.creative.viewReel}
                          <ExternalLink
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                    </div>
                  </a>

                  <a
                    href="https://www.instagram.com/edr.foto/reel/DRNJ7BFCCQT/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-3xl border border-border bg-background p-5 transition hover:border-primary/45 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Film className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {t.creative.reelTwoTitle}
                        </h4>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {t.creative.reelTwoText}
                        </p>
                        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                          {t.creative.viewReel}
                          <ExternalLink
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="about"
          aria-labelledby="about-title"
          className="scroll-mt-24 py-20 sm:py-28"
        >
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
            <SectionHeader
              id="about-title"
              kicker={t.section.aboutKicker}
              title={t.section.about}
            />
            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm sm:p-9">
              {t.about.map((paragraph, index) => (
                <p
                  key={paragraph}
                  className={`text-pretty leading-8 ${
                    index === 0
                      ? "text-lg font-medium text-foreground"
                      : "mt-5 text-muted-foreground"
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section
          id="beyond-code"
          aria-labelledby="beyond-title"
          className="scroll-mt-24 bg-muted/30 py-16 sm:py-20"
        >
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              id="beyond-title"
              kicker={t.section.beyondKicker}
              title={t.section.beyond}
            />
            <article className="grid items-center gap-7 rounded-[2rem] border border-border bg-card p-6 shadow-sm sm:p-8 lg:grid-cols-[auto_1fr_auto]">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-sky-500/10 text-sky-500">
                <Waves className="h-8 w-8" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{t.beyond.title}</h3>
                <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
                  {t.beyond.text}
                </p>
              </div>
              <div className="lg:text-right">
                <a
                  href="/swim-analyzer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/50 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
                >
                  {t.beyond.analyzer}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <p className="mt-2 text-xs text-muted-foreground">
                  {t.beyond.analyzerNote}
                </p>
              </div>
            </article>
          </div>
        </section>

        <section
          id="education"
          aria-labelledby="education-title"
          className="scroll-mt-24 py-20 sm:py-28"
        >
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              id="education-title"
              kicker={t.section.educationKicker}
              title={t.section.education}
            />
            <div className="grid gap-5 lg:grid-cols-2">
              <article className="rounded-3xl border border-primary/30 bg-primary/6 p-6 sm:p-7">
                <GraduationCap
                  className="h-7 w-7 text-primary"
                  aria-hidden="true"
                />
                <h3 className="mt-5 text-xl font-semibold">
                  {t.education.degree}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {t.education.degreeMeta}
                </p>
              </article>
              <article className="rounded-3xl border border-border bg-card p-6 sm:p-7">
                <ShieldCheck
                  className="h-7 w-7 text-sky-500"
                  aria-hidden="true"
                />
                <h3 className="mt-5 text-xl font-semibold">
                  {t.education.master}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {t.education.masterMeta}
                </p>
              </article>
            </div>

            <h3 className="mb-5 mt-10 text-sm font-bold uppercase tracking-[0.18em] text-muted-foreground">
              {t.education.complementary}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {t.education.items.map((item) => (
                <article
                  key={item.title}
                  className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5"
                >
                  <Award
                    className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.type}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="contact"
          aria-labelledby="contact-title"
          className="scroll-mt-24 border-t border-border/70 py-20 sm:py-28"
        >
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-[2.25rem] bg-slate-950 px-6 py-12 text-white shadow-2xl dark:border dark:border-border sm:px-10 sm:py-16 lg:px-16">
              <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(16,185,129,0.25),transparent_35%),radial-gradient(circle_at_90%_75%,rgba(56,189,248,0.18),transparent_32%)]"
                aria-hidden="true"
              />
              <div className="relative max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
                  {t.section.contactKicker}
                </p>
                <h2
                  id="contact-title"
                  className="mt-4 text-balance text-4xl font-bold tracking-[-0.045em] text-white sm:text-5xl"
                >
                  {t.section.contact}
                </h2>
                <p className="mt-5 text-pretty text-lg leading-8 text-slate-200">
                  {t.contact.text}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {t.contact.secondary}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={profileLinks.email}
                    className="inline-flex min-h-12 items-center gap-2 rounded-full bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none"
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    {t.contact.email}
                  </a>
                  <a
                    href={profileLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-link"
                  >
                    <Linkedin className="h-4 w-4" aria-hidden="true" />
                    {t.contact.linkedin}
                  </a>
                  <a
                    href={profileLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-link"
                  >
                    <Github className="h-4 w-4" aria-hidden="true" />
                    {t.contact.github}
                  </a>
                  <a
                    href={resumeHref}
                    download
                    className="contact-link"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    {t.contact.resume}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
