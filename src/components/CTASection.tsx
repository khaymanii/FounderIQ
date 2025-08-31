import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function CTASection() {
  return (
    <section className="container mx-auto px-4 py-20">
      <Card className="bg-card border-border">
        <CardContent className="p-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to transform your workflow?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join millions of users who trust our AI for their daily tasks. Start
            your journey today and experience the difference.
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
  );
}

export default CTASection;
