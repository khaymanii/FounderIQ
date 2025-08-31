import Logo from "@/assets/logo.png";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-20 text-center">
      <div className="container mx-auto px-4 py-12">
        <div className="">
          <div>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <img src={Logo} className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">
                Founder<span className="text-purple-800">IQ</span>
              </span>
            </div>
            <p className="text-muted-foreground">
              The most advanced AI assistant for modern professionals.
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
