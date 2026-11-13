"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem("archive-theme");
      const initialTheme = savedTheme === "light" ? "light" : "dark";
      document.documentElement.dataset.theme = initialTheme;
      setTheme(initialTheme);
    } catch (error) {
      console.error("Could not load the saved theme preference.", error);
      document.documentElement.dataset.theme = "dark";
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;

    try {
      window.localStorage.setItem("archive-theme", nextTheme);
    } catch (error) {
      console.error("Could not save the theme preference.", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
