import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/i18n/use-language";
import type { Language } from "@/i18n/language-context";

const SITE_URL = "https://markegididev.github.io";
const OG_IMAGE = `${SITE_URL}/og-marco-egidi.png`;

type PageMetadata = {
  title: string;
  description: string;
  path: string;
  robots?: string;
};

const pages: Record<
  "home" | "dashboard" | "swim" | "notFound",
  Record<Language, PageMetadata>
> = {
  home: {
    en: {
      title: "Marco Egidi | Software Developer — Full Stack, AI & Cloud",
      description:
        "Marco Egidi’s software developer portfolio: Python, TypeScript, React, FastAPI, AI applications, Docker, cloud projects, experience, and contact details.",
      path: "/",
    },
    it: {
      title: "Marco Egidi | Software Developer — Full Stack, AI & Cloud",
      description:
        "Portfolio di Marco Egidi, software developer specializzato in Python, TypeScript, React, FastAPI, applicazioni AI, Docker e cloud. Progetti, esperienza e contatti.",
      path: "/",
    },
  },
  dashboard: {
    en: {
      title: "Swimming Data Dashboard | Marco Egidi",
      description:
        "A personal swimming data dashboard by Marco Egidi, combining activity metrics, pace analysis, and software development.",
      path: "/dashboard/",
    },
    it: {
      title: "Dashboard dati di nuoto | Marco Egidi",
      description:
        "Dashboard personale di Marco Egidi dedicata ai dati di nuoto, con metriche di attività, analisi del passo e visualizzazioni software.",
      path: "/dashboard/",
    },
  },
  swim: {
    en: {
      title: "Swim Analyzer — Swimming Data Analysis | Marco Egidi",
      description:
        "Analyse swimming race segments, World Aquatics points, pacing, stroke metrics, and performance scenarios with Marco Egidi’s Swim Analyzer.",
      path: "/swim-analyzer/",
    },
    it: {
      title: "Swim Analyzer — Analisi dati per il nuoto | Marco Egidi",
      description:
        "Analizza segmenti di gara, punti World Aquatics, passo, bracciate e scenari di prestazione con Swim Analyzer di Marco Egidi.",
      path: "/swim-analyzer/",
    },
  },
  notFound: {
    en: {
      title: "Page not found | Marco Egidi",
      description:
        "The requested page is not available. Return to Marco Egidi’s software developer portfolio.",
      path: "/404/",
      robots: "noindex,follow",
    },
    it: {
      title: "Pagina non trovata | Marco Egidi",
      description:
        "La pagina richiesta non è disponibile. Torna al portfolio software di Marco Egidi.",
      path: "/404/",
      robots: "noindex,follow",
    },
  },
};

function setMeta(selector: string, attribute: "name" | "property", value: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, selector.match(/"(.+)"/)?.[1] ?? "");
    document.head.appendChild(element);
  }

  element.content = value;
}

function setCanonical(href: string) {
  let canonical =
    document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }

  canonical.href = href;
}

function getPageKey(pathname: string) {
  if (pathname === "/") return "home";
  if (pathname === "/dashboard" || pathname === "/dashboard/") {
    return "dashboard";
  }
  if (pathname === "/swim-analyzer" || pathname === "/swim-analyzer/") {
    return "swim";
  }
  return "notFound";
}

export default function SeoManager() {
  const { pathname } = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    const key = getPageKey(pathname);
    const metadata = pages[key][language];
    const canonical = `${SITE_URL}${metadata.path}`;
    const locale = language === "it" ? "it_IT" : "en_GB";

    document.title = metadata.title;
    document.documentElement.lang = language;
    setCanonical(canonical);
    setMeta('meta[name="description"]', "name", metadata.description);
    setMeta(
      'meta[name="robots"]',
      "name",
      metadata.robots ?? "index,follow,max-image-preview:large",
    );
    setMeta('meta[property="og:type"]', "property", "website");
    setMeta('meta[property="og:site_name"]', "property", "Marco Egidi");
    setMeta('meta[property="og:title"]', "property", metadata.title);
    setMeta(
      'meta[property="og:description"]',
      "property",
      metadata.description,
    );
    setMeta('meta[property="og:url"]', "property", canonical);
    setMeta('meta[property="og:image"]', "property", OG_IMAGE);
    setMeta('meta[property="og:image:width"]', "property", "1200");
    setMeta('meta[property="og:image:height"]', "property", "630");
    setMeta('meta[property="og:locale"]', "property", locale);
    setMeta('meta[name="twitter:card"]', "name", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "name", metadata.title);
    setMeta(
      'meta[name="twitter:description"]',
      "name",
      metadata.description,
    );
    setMeta('meta[name="twitter:image"]', "name", OG_IMAGE);

    const structuredData = document.getElementById("structured-data");
    if (structuredData) {
      structuredData.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            name: "Marco Egidi",
            url: `${SITE_URL}/`,
            inLanguage: language,
          },
          {
            "@type": "Person",
            "@id": `${SITE_URL}/#person`,
            name: "Marco Egidi",
            url: `${SITE_URL}/`,
            jobTitle: "Software Developer",
            description:
              language === "it"
                ? "Software developer specializzato in sviluppo full stack, applicazioni AI e cloud."
                : "Software developer focused on full-stack development, AI applications, and cloud systems.",
            email: "mailto:marco.egidi.me@gmail.com",
            alumniOf: {
              "@type": "CollegeOrUniversity",
              name: "Università degli Studi di Padova",
            },
            knowsAbout: [
              "Software Development",
              "Full Stack Development",
              "Python",
              "TypeScript",
              "JavaScript",
              "React",
              "FastAPI",
              "Artificial Intelligence",
              "Docker",
              "Cloud Computing",
              "Cybersecurity",
            ],
            sameAs: [
              "https://github.com/markegidiDev",
              "https://www.linkedin.com/in/marcoegidi",
              "https://www.youtube.com/@markegidi",
            ],
          },
          {
            "@type": key === "home" ? "ProfilePage" : "WebPage",
            "@id": `${canonical}#webpage`,
            url: canonical,
            name: metadata.title,
            description: metadata.description,
            isPartOf: { "@id": `${SITE_URL}/#website` },
            about: { "@id": `${SITE_URL}/#person` },
            inLanguage: language,
            ...(key === "home"
              ? { mainEntity: { "@id": `${SITE_URL}/#person` } }
              : {}),
          },
        ],
      });
    }
  }, [language, pathname]);

  return null;
}
