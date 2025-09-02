import {
  Zap,
  Shield,
  Presentation,
  Route,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";

export default function FeatureSection() {
  return (
    <section id="features" className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          What Founder<span className="text-purple-800">IQ</span> Can Do
        </h2>
        <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          From idea conception to complex problem-solving, our AI adapts to your
          unique requirements
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 lg:grid-cols-3">
        {/* Idea Validation */}
        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center">
            <Zap className="h-12 w-12 text-purple-800 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-4">Idea Validation</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Test your startup ideas against market data, analyze competitors,
              and refine your concept before you invest time and money.
            </p>
          </CardContent>
        </Card>

        {/* Business Strategy */}
        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 text-purple-800 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-4">Business Strategy</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Get tailored strategies for product development, marketing,
              fundraising, and scaling—just like having an experienced advisor
              by your side.
            </p>
          </CardContent>
        </Card>

        {/* Pitch & Fundraising */}
        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center">
            <Presentation className="h-12 w-12 text-purple-800 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-4">Pitch & Fundraising</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Craft compelling pitch decks, executive summaries, and investor
              outreach plans to raise funding with confidence.
            </p>
          </CardContent>
        </Card>

        {/* Product Roadmapping */}
        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center">
            <Route className="h-12 w-12 text-purple-800 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-4">Product Roadmapping</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Break down your big vision into achievable milestones and
              development sprints, keeping your team aligned and focused.
            </p>
          </CardContent>
        </Card>

        {/* Growth Hacking */}
        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center">
            <TrendingUp className="h-12 w-12 text-purple-800 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-4">Growth Hacking</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Access marketing playbooks, customer acquisition strategies, and
              user retention insights built from analyzing successful startups.
            </p>
          </CardContent>
        </Card>

        {/* 24/7 Guidance */}
        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center">
            <Clock className="h-12 w-12 text-purple-800 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-4">24/7 Guidance</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Unlike human consultants, your AI Co-Founder is always available
              to answer questions, review strategies, and provide feedback.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
