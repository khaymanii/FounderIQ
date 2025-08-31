import { Shield, Users, Zap } from "lucide-react";
import { Card, CardContent } from "./ui/card";
//import { Button } from "./ui/button";

export default function FeatureSection() {
  return (
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
            <h3 className="text-2xl font-semibold mb-4">Team Collaboration</h3>
            <p className="text-muted-foreground leading-relaxed">
              Share conversations and collaborate with your team. Perfect for
              businesses and creative projects.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
