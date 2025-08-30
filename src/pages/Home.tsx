import FeatureSection from "@/components/FeatureSection";
import Footer from "@/components/Footer";
import Header from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";


export default function Home() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
  <Header />
  <HeroSection />
  <FeatureSection />
  <Footer />
    </div>
  )
}
