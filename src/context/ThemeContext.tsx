import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") as Theme;
      if (savedTheme) {
        return savedTheme;
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  });

  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setIsTransitioning(true);

    // Create ripple effect
    const ripple = document.createElement("div");
    ripple.className =
      "fixed top-1/2 right-24 w-8 h-8 bg-emerald-500/30 rounded-full transform -translate-y-1/2 scale-0 z-[9999] pointer-events-none animate-ping";
    document.body.appendChild(ripple);

    // Trigger animation
    requestAnimationFrame(() => {
      ripple.style.animation = "none";
      ripple.style.transform = "translate(50%, -50%) scale(100)";
      ripple.style.transition =
        "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease-out";
      ripple.style.opacity = "0";
    });

    // Change theme after a short delay
    setTimeout(() => {
      setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    }, 300);

    // Clean up
    setTimeout(() => {
      setIsTransitioning(false);
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isTransitioning }}>
      {children}
    </ThemeContext.Provider>
  );
};
