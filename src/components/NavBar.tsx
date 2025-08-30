import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import Logo from "@/assets/logo.png"

export default function NavBar () {
    return (
        <div className="">
              <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src={Logo} className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Founder<span className="text-purple-600">IQ</span></span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
            <Link to="/Signin" >
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white cursor-pointer">
              Sign In
            </Button>
            </Link>
          </nav>
        </div>
      </header>
        </div>
    )
}