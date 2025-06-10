"use client"

import { Routes, Route, useLocation } from "react-router-dom"
import { LandingPage } from "./pages/Landing/components/LandingPage"
import { Navbar } from "./components/ui/Navbar"
import BlogPage from "./pages/blog/BlogPage"
import AboutPage from "./pages/about/AboutPage"
import PlanPage from "./pages/plan/PlanPage"
import LoginPage from "./pages/auth/LoginPage"
import { AnimatePresence } from "framer-motion"
import RegisterPage from "./pages/auth/RegisterPage"
import { OnboardingPage } from "./pages/onboarding/onBoardingPage"
import { PlanSelectionDirectPage } from "./pages/plan-selection/PlanDirectPage"

function shouldHideNavbar(pathname: string) {
  const hiddenPaths = [
    "/login",
    "/register",
    "/admin",
    "/reset-password",
    "/forgot-password",
    "/onboarding",
    "/plan-selection",
  ]

  // Dùng startsWith để hỗ trợ cả các route như /admin/dashboard
  return hiddenPaths.some((prefix) => pathname.startsWith(prefix))
}

export default function App() {
  const location = useLocation()
  const shouldShowNavbar = !shouldHideNavbar(location.pathname)

  // Check if onboarding is completed
  const isOnboardingCompleted = localStorage.getItem("onboarding_completed") === "true"
  const isOnOnboardingPage = location.pathname === "/onboarding"
  const isPlanSelectionPage = location.pathname === "/plan-selection"
  const isHomePage = location.pathname === "/"
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register"

  // Only redirect to onboarding if:
  // 1. Onboarding is not completed
  // 2. User is not already on onboarding page
  // 3. User is not on plan selection page
  // 4. User is not on homepage (allow access to homepage)
  // 5. User is not on auth pages (allow login/register)
  const shouldRedirectToOnboarding =
    !isOnboardingCompleted && !isOnOnboardingPage && !isPlanSelectionPage && !isHomePage && !isAuthPage

  if (shouldRedirectToOnboarding) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          <OnboardingPage />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {shouldShowNavbar && <Navbar />}
      <main className="flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/plan-selection" element={<PlanSelectionDirectPage />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/plan" element={<PlanPage />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  )
}
