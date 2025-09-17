import { createContext } from 'react';

export type Theme = 'light' | 'dark' | 'system' | 'nord';

export interface ThemeContextType {
  theme: Theme; // user preference
  resolvedTheme: 'light' | 'dark' | 'nord'; // applied
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
