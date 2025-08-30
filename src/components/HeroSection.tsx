import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";


export default function HeroSection () {
    return (
        <div className="">
                  <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            The AI assistant that
            <span className="text-purple-600"> understands</span> you
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Experience the future of conversation with our advanced AI. Get instant answers, creative solutions, and
            intelligent assistance for any task.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="cursor-pointer text-lg px-8 py-6 bg-purple-600 hover:bg-purple-700 text-white">
              Start chatting now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
        </div>
    )
}