import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import Logo from "@/assets/logo.png";
import ThemeButton from "./ThemeButton";
import { useTheme } from "@/context/ThemeContext";

export default function NavBar() {
  const { classes, isDark } = useTheme();

  return (
    <header
      className={`
      w-full fixed top-0 left-0 z-50 shadow-md transition-all duration-200
      ${
        isDark
          ? "bg-gray-900 border-b border-gray-800"
          : "bg-white border-b border-gray-200"
      }
    `}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo + Brand */}
        <div className="flex items-center space-x-2">
          <Link
            to="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200"
          >
            <img src={Logo} alt="FounderIQ Logo" className="h-10 w-10 " />
            <span
              className={`
              text-lg md:text-xl font-bold hidden md:inline-block transition-colors duration-200
              ${classes.primaryText}
            `}
            >
              Founder<span className={classes.purpleText}>IQ</span>
            </span>
          </Link>
        </div>

        {/* Right Section */}
        <nav className="flex items-center space-x-3">
          <ThemeButton />

          <Link to="/signin">
            <Button
              className={`
              w-16 py-1 text-xs font-medium cursor-pointer transition-all duration-200
              bg-purple-800 hover:bg-purple-900 active:bg-purple-800
              text-white border border-purple-800 hover:border-purple-900
              focus:outline-none focus:ring-2 focus:ring-purple-500 
              ${
                isDark
                  ? "focus:ring-offset-gray-900"
                  : "focus:ring-offset-white"
              }
              shadow-sm hover:shadow-md
            `}
            >
              Sign In
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
