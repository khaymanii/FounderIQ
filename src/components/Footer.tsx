import Logo from "@/assets/logo.png";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-20 text-center">
      <div className="container mx-auto px-4 py-12">
        <div className="">
          <div>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Link to="/">
                <img src={Logo} alt="FounderIQ Logo" className="h-10 w-10" />
              </Link>
              <span className="text-xl font-bold hidden md:inline-block">
                Founder<span className="text-purple-800">IQ</span>
              </span>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground">
              Your AI Co-Founder — available 24/7 to help validate, build, and
              scale your startup.
            </p>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2025 FounderIQ. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
