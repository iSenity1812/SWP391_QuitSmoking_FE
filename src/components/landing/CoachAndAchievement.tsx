import { useState } from "react";
import { AnimatedSection } from "../shared/AnimatedSection";
import { Award, Crown, Heart, Star, Trophy, Users } from "lucide-react";



export function CoachAndAchievement() {
  const [activeTab, setActiveTab] = useState<"coaches" | "achievements">("coaches");

  const achievements = [
    {
      title: "First Day Complete",
      icon: Star,
      unlocked: true,
      description: "Completed your first smoke-free day",
      gradient: "from-emerald-400 to-emerald-600",
    },
    {
      title: "One Week Milestone",
      icon: Trophy,
      unlocked: true,
      description: "7 days smoke-free!",
      gradient: "from-amber-400 to-amber-600",
    },
    {
      title: "Saved $100",
      icon: Crown,
      unlocked: false,
      description: "Saved your first $100",
      gradient: "from-purple-400 to-purple-600",
    },
    {
      title: "One Month Free",
      icon: Award,
      unlocked: false,
      description: "30 days of freedom",
      gradient: "from-blue-400 to-blue-600",
    },
    {
      title: "Health Champion",
      icon: Heart,
      unlocked: true,
      description: "Improved health metrics",
      gradient: "from-rose-400 to-rose-600",
    },
    {
      title: "Community Helper",
      icon: Users,
      unlocked: true,
      description: "Helped 5 other quitters",
      gradient: "from-teal-400 to-teal-600",
    },
  ]

  {/* Progress Tracker & Leaderboard */ }
  <AnimatedSection animation="fadeUp" delay={400}>
    <section id="progress" className="py-20 bg-gradient-to-br from-emerald-50 to-white dark:from-slate-800 dark:to-slate-900">

    </section>
  </AnimatedSection>
}