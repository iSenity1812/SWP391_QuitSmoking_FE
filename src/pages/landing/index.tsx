import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { UserTestimonials } from "@/components/landing/UserTestimonials";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { MotivationSection } from "@/components/landing/MotivationSection";
import { MotivationMessages } from "@/components/landing/MotivationMessages";
import { CoachAndAchievement } from "@/components/landing/CoachAndAchievement";

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f9f9f9]">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <MotivationMessages />
        <BenefitsSection />
        <CoachAndAchievement />
        <UserTestimonials />
        <MotivationSection />
      </main>
      <Footer />
    </div>
  );
}
