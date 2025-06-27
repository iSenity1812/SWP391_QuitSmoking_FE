import { BenefitsSection } from "@/pages/landing/components/BenefitsSection";
import { HeroSection } from "@/pages/landing/components/HeroSection";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { MotivationSection } from "@/pages/landing/components/MotivationSection";
import { MotivationMessages } from "@/pages/landing/components/MotivationMessages";
import { CoachAndAchievement } from "@/pages/landing/components/CoachAndAchievement";
import { SubscriptionsSection } from "@/pages/landing/components/SubscriptionsSection";
import { motion } from "framer-motion";
import { TestimonialSlider } from "./components/TestimonialSlider";
// import { WhoIsThisFor } from "./components/WhoIsThisForSection";
// import SplashCursor from "@/components/ui/SplashCursor";

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
    <>
      {/* <SplashCursor /> */}
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
            <TestimonialSlider />
            <MotivationSection />
            {/* <WhoIsThisFor /> */}
          </main>
          <Footer />
        </div>
      </motion.div>
    </>
  );
}
