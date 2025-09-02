import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="container mx-auto px-4 lg:pt-40 pt-30 pb-10 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Meet Your AI Co-Founder & Startup Consultant that
          <span className="text-purple-800"> understands</span> you
        </h1>
        <p className="text-lg md:text-2xl text-muted-foreground mb-8 leading-relaxed">
          Build, scale, and grow your startup with a 24/7 intelligent partner
          who helps you strategize, validate, and execute ideas faster than
          ever.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signin">
            <Button
              size="lg"
              className="cursor-pointer text-lg px-8 py-6 bg-purple-800 hover:bg-purple-900 text-white"
            >
              Start chatting now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
