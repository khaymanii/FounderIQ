import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Zap, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/assets/logo.png";

export default function Home() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      {/* Header */}
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

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            The AI assistant that
            <span className="text-purple-800"> understands</span> you
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Experience the future of conversation with our advanced AI. Get
            instant answers, creative solutions, and intelligent assistance for
            any task.
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

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful features for every need
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From creative writing to complex problem-solving, our AI adapts to
            your unique requirements
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center">
              <Zap className="h-12 w-12 text-purple-800 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Lightning Fast</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get instant responses with our optimized AI models. No waiting,
                just immediate intelligent assistance.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center">
              <Shield className="h-12 w-12 text-purple-800 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Secure & Private</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your conversations are encrypted and private. We prioritize your
                data security above all else.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-purple-800 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-4">
                Team Collaboration
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Share conversations and collaborate with your team. Perfect for
                businesses and creative projects.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to transform your workflow?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join millions of users who trust our AI for their daily tasks.
              Start your journey today and experience the difference.
            </p>
            <Button
              size="lg"
              className="text-lg px-12 py-6 bg-purple-800 hover:bg-purple-900 text-white cursor-pointer"
            >
              Get started for free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
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
    </div>
  );
}
