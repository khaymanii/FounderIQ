import FeatureSection from "@/components/FeatureSection";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import NavBar from "@/components/NavBar";
import Problem from "@/components/Problem";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import { useTheme } from "@/context/ThemeContext"; // ✅ import ThemeContext

export default function Home() {
  const { theme } = useTheme(); // ✅ get theme ("light" | "dark")

  return (
    <div
      className={`${
        theme === "dark" ? "dark" : ""
      } min-h-screen bg-white dark:bg-black text-foreground`}
    >
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
