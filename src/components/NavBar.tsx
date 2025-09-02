import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import Logo from "@/assets/logo.png";
import ThemeButton from "./ThemeButton";

export default function NavBar() {
  return (
    <header className="w-full fixed top-0 left-0 z-50 shadow-md bg-black">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo + Brand */}
        <div className="flex items-center space-x-2">
          <Link to="/">
            <img src={Logo} alt="FounderIQ Logo" className="h-10 w-10" />
          </Link>
          <span className="text-lg md:text-xl font-bold text-white hidden md:inline-block">
            Founder<span className="text-purple-800">IQ</span>
          </span>
        </div>

        {/* Right Section */}
        <nav className="flex items-center space-x-3">
          <ThemeButton />
          <Link to="/signin">
            <Button className="w-16 py-1 text-xs bg-purple-800 hover:bg-purple-900 text-white cursor-pointer">
              Sign In
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
