import { BenefitsSection } from "@/pages/Landing/BenefitsSection";
import { HeroSection } from "@/pages/Landing/HeroSection";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { MotivationSection } from "@/pages/Landing/MotivationSection";
import { MotivationMessages } from "@/pages/Landing/MotivationMessages";
import { CoachAndAchievement } from "@/pages/Landing/CoachAndAchievement";
import { SubscriptionsSection } from "@/pages/Landing/SubscriptionsSection";
import { motion } from "framer-motion";

const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
  },
}

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.5,
};

export function LandingPage() {
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
      {/* Full height container to ensure the navbar is always at the top */}
      <div className="flex min-h-screen flex-col bg-[#f9f9f9]">
        <Navbar />
        <main className="flex-1">
          <HeroSection />
          <MotivationMessages />
          <BenefitsSection />
          <CoachAndAchievement />
          <SubscriptionsSection />
          <MotivationSection />
        </main>
        <Footer />
      </div>
    </motion.div>
  );
}
