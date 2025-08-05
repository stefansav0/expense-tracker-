// context/ThemeContext.tsx
"use client";
import { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext<{ theme: string; toggle: () => void } | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    setTheme(stored === "dark" ? "dark" : "light");
    setMounted(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  if (!mounted) return null;

  return (
    <ThemeContext.Provider value={{ theme, toggle: () => setTheme(theme === "dark" ? "light" : "dark") }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext)!;
