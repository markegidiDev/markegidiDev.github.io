import { useCallback, useEffect, useMemo, useState } from "react";
import {
  LanguageContext,
  type Language,
} from "@/i18n/language-context";

const STORAGE_KEY = "portfolio-language";

function getInitialLanguage(): Language {
  try {
    const savedLanguage = localStorage.getItem(STORAGE_KEY);
    if (savedLanguage === "en" || savedLanguage === "it") {
      return savedLanguage;
    }
  } catch {
    // English remains the first-visit default when storage is unavailable.
  }

  return "en";
}

export function LanguageProvider({ children }: React.PropsWithChildren) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // The language switch still works for the current session.
    }
  }, [language]);

  const value = useMemo(
    () => ({ language, setLanguage }),
    [language, setLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
