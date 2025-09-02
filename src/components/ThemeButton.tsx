import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        p-2 rounded-xl border transition-all duration-200 
        hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
        ${
          isDark
            ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-700 focus:ring-offset-gray-900"
            : "bg-gray-200 border-gray-300 text-gray-900 hover:bg-gray-300 focus:ring-offset-white"
        }
        ${className}
      `}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 transition-transform duration-200" />
      ) : (
        <Sun className="w-5 h-5 transition-transform duration-200" />
      )}
    </button>
  );
}
