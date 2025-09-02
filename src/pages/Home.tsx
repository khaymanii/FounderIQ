import FeatureSection from "@/components/FeatureSection";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import NavBar from "@/components/NavBar";
import Problem from "@/components/Problem";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <div className="dark min-h-screen bg-black text-foreground">
      <NavBar />
      <HeroSection />
      <Problem />
      <FeatureSection />
      <HowItWorks />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  );
}
