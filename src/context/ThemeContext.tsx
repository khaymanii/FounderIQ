// src/contexts/ThemeContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

// Define theme types
export type Theme = "light" | "dark";

export type TextColorType = "primary" | "purple" | "secondary" | "muted";

export type BackgroundColorType = "primary" | "secondary" | "card" | "accent";

// Define the theme classes interface
export interface ThemeClasses {
  // Text classes
  primaryText: string;
  purpleText: string;
  secondaryText: string;
  mutedText: string;

  // Background classes
  primaryBg: string;
  secondaryBg: string;
  cardBg: string;
  accentBg: string;

  // Combined utility classes
  container: string;
  card: string;
  button: string;
  input: string;
}

// Define the context value interface
export interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  isLight: boolean;
  toggleTheme: () => void;
  setLightTheme: () => void;
  setDarkTheme: () => void;
  getTextColor: (type?: TextColorType) => string;
  getBackgroundColor: (type?: BackgroundColorType) => string;
  classes: ThemeClasses;
}

// Define props for the ThemeProvider
export interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

// Create the context with undefined as initial value
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Custom hook to use the theme context with proper error handling
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Theme Provider Component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = "light",
}) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const initializeTheme = (): void => {
      try {
        const savedTheme = localStorage.getItem("theme") as Theme | null;
        const systemPrefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;

        if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
          setTheme(savedTheme);
        } else if (systemPrefersDark) {
          setTheme("dark");
        } else {
          setTheme("light");
        }
      } catch (error) {
        console.warn("Failed to initialize theme from localStorage:", error);
        setTheme(defaultTheme);
      }
    };

    initializeTheme();
  }, [defaultTheme]);

  // Apply theme to document and save to localStorage
  useEffect(() => {
    const applyTheme = (): void => {
      try {
        const root = window.document.documentElement;

        if (theme === "dark") {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }

        localStorage.setItem("theme", theme);
      } catch (error) {
        console.warn("Failed to apply theme:", error);
      }
    };

    applyTheme();
  }, [theme]);

  // Theme control functions
  const toggleTheme = (): void => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const setLightTheme = (): void => {
    setTheme("light");
  };

  const setDarkTheme = (): void => {
    setTheme("dark");
  };

  // Helper function to get text colors based on your requirements
  const getTextColor = (type: TextColorType = "primary"): string => {
    switch (type) {
      case "primary":
        // White text becomes dark in light mode, white in dark mode
        return theme === "dark" ? "text-white" : "text-gray-900";
      case "purple":
        // Purple stays purple in both modes
        return "text-purple-600";
      case "secondary":
        // Secondary text color
        return theme === "dark" ? "text-gray-300" : "text-gray-600";
      case "muted":
        // Muted text color
        return theme === "dark" ? "text-gray-400" : "text-gray-500";
      default:
        return theme === "dark" ? "text-white" : "text-gray-900";
    }
  };

  // Helper function to get background colors
  const getBackgroundColor = (
    type: BackgroundColorType = "primary"
  ): string => {
    switch (type) {
      case "primary":
        return theme === "dark" ? "bg-gray-900" : "bg-white";
      case "secondary":
        return theme === "dark" ? "bg-gray-800" : "bg-gray-100";
      case "card":
        return theme === "dark" ? "bg-gray-800" : "bg-white";
      case "accent":
        return theme === "dark" ? "bg-gray-700" : "bg-gray-50";
      default:
        return theme === "dark" ? "bg-gray-900" : "bg-white";
    }
  };

  // Pre-built theme classes for easy consumption
  const classes: ThemeClasses = {
    // Text classes based on your requirements
    primaryText: theme === "dark" ? "text-white" : "text-gray-900",
    purpleText: "text-purple-600", // Always purple
    secondaryText: theme === "dark" ? "text-gray-300" : "text-gray-600",
    mutedText: theme === "dark" ? "text-gray-400" : "text-gray-500",

    // Background classes
    primaryBg: theme === "dark" ? "bg-gray-900" : "bg-white",
    secondaryBg: theme === "dark" ? "bg-gray-800" : "bg-gray-100",
    cardBg: theme === "dark" ? "bg-gray-800" : "bg-white",
    accentBg: theme === "dark" ? "bg-gray-700" : "bg-gray-50",

    // Combined utility classes
    container: `min-h-screen transition-colors duration-200 ${
      theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
    }`,
    card: `rounded-lg shadow-md border transition-colors duration-200 ${
      theme === "dark"
        ? "bg-gray-800 text-white border-gray-700"
        : "bg-white text-gray-900 border-gray-200"
    }`,
    button: `px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      theme === "dark"
        ? "focus:ring-offset-gray-900"
        : "focus:ring-offset-white"
    }`,
    input: `w-full px-3 py-2 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
      theme === "dark"
        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-offset-gray-900"
        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-offset-white"
    }`,
  };

  // Context value
  const value: ThemeContextValue = {
    theme,
    isDark: theme === "dark",
    isLight: theme === "light",
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    getTextColor,
    getBackgroundColor,
    classes,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// Export the context for advanced use cases
export { ThemeContext };

// Optional: Type guard to check if theme is valid
export const isValidTheme = (theme: string): theme is Theme => {
  return theme === "light" || theme === "dark";
};

// Optional: Hook to get system theme preference
export const useSystemTheme = (): Theme => {
  const [systemTheme, setSystemTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent): void => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return systemTheme;
};

// Example usage types for components
export interface ThemedComponentProps {
  className?: string;
  children?: ReactNode;
}

// Utility type for theme-aware component props
export type ThemedProps<T = {}> = T & {
  theme?: Theme;
  className?: string;
};
