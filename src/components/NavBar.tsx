import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import Logo from "@/assets/logo.png";

export default function NavBar() {
  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src={Logo} className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">
            Founder<span className="text-purple-800">IQ</span>
          </span>
        </div>
        <nav className="md:flex items-center space-x-6">
          <Link to="/signin">
            <Button
              size="sm"
              className="bg-purple-800 hover:bg-purple-900 text-white cursor-pointer"
            >
              Sign In
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
