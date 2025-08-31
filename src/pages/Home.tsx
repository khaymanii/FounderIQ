import FeatureSection from "@/components/FeatureSection";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import NavBar from "@/components/NavBar";

export default function Home() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <NavBar />
      <HeroSection />
      <FeatureSection />
      <CTASection />
      <Footer />
    </div>
  );
}
