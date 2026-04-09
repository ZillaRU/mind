import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';
import { themes, getTheme, type Theme } from '../data/themes';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (id: string) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: themes[0],
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('mind-theme');
      return saved ? getTheme(saved) : themes[0];
    } catch {
      return themes[0];
    }
  });

  const setTheme = useCallback((id: string) => {
    const t = getTheme(id);
    setThemeState(t);
    try {
      localStorage.setItem('mind-theme', id);
    } catch {}
  }, []);

  // Apply CSS variables to :root
  useEffect(() => {
    const root = document.documentElement;
    const c = theme.colors;
    root.style.setProperty('--color-midnight', c.midnight);
    root.style.setProperty('--color-deep', c.deep);
    root.style.setProperty('--color-surface', c.surface);
    root.style.setProperty('--color-muted', c.muted);
    root.style.setProperty('--color-soft', c.soft);
    root.style.setProperty('--color-whisper', c.whisper);
    root.style.setProperty('--color-glow', c.glow);
    root.style.setProperty('--color-warm', c.warm);
    root.style.setProperty('--color-aurora', c.aurora);
    root.style.setProperty('--color-aurora-dim', c.auroraDim);
    root.style.setProperty('--color-ember', c.ember);
    root.style.setProperty('--color-moss', c.moss);
    root.style.setProperty('--color-rain', c.rain);
    // Also update body background for smooth transition
    document.body.style.backgroundColor = c.midnight;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
