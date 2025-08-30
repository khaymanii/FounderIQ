import Logo from "@/assets/logo.png"

export default function Footer () {
    return (
        <div className=""
        >
            <footer className="border-t border-border mt-20">

        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col items-center justify-center mb-10">
              <div className="flex items-center space-x-2 mb-4">
                <img src={Logo} className="h-6 w-6 text-primary" />
                 <span className="text-xl font-bold">Founder<span className="text-violet-600">IQ</span></span>
              </div>
              <p className="text-muted-foreground">The most advanced AI assistant for modern professionals.</p>
            </div>
            <div className=" flex flex-row items-center justify-center gap-72 space-x-4 mt-20">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
            </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 FounderIQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
        </div>
    )
}