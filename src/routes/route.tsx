import { Routes, Route } from "react-router-dom"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { AuthRedirect } from "@/components/auth/AuthRedirect"

// Public pages
import BlogPage from "@/pages/blog/BlogPage"
import { QuitPlanGuard } from "@/components/auth/QuitPlanGuard"

// Public pages
import { LandingPage } from "@/pages/Landing/LandingPage"
import AboutPage from "@/pages/about/AboutPage"
import LoginPage from "@/pages/auth/LoginPage"
import RegisterPage from "@/pages/auth/RegisterPage"
import { OnboardingPage } from "@/pages/onboarding/onBoardingPage"
import ProgramPage from "@/pages/learning/ProgramPage"
// import { PlanSelectionDirectPage } from "@/pages/plan-selection/PlanDirectPage"

// Protected pages
// import PlanPage from "@/pages/plan/PlanPage"
import UserProfilePage from "@/pages/user/userProfilePage"
import PublicProfileViewPage from "@/pages/user/PublicProfileViewPage"
import SubscriptionPage from "@/pages/plan/subscription/SubscriptionPage"
import PaymentReturnPage from "@/pages/plan/subscription/PaymentReturnPage"

// Role-specific pages
import AdminPage from "@/pages/admin/AdminPage"
import CoachPage from "@/pages/coach/CoachPage"
import ContentAdminPage from "@/pages/admin/content/ContentAdminPage"

// Test components (remove in production)
import BookingPage from "@/pages/booking/BookingPage"
import { MeetingPage } from "@/pages/meeting/MeetingPage"
import QuitStatsPage from "@/pages/user/QuitStatsPage"
import PublicUserProfilePage from "@/pages/user/PublicUserProfilePage"
import HealthBenefitsPage from "@/pages/health-benefits/HealthBenefitsPage"
import { NotificationsPage } from "@/pages/notifications/NotificationsPage"
import { LeaderboardPage } from "@/pages/leaderboard/LeaderboardPage"
import CreateQuitPlanLayout from "@/layouts/CreateQuitPlanLayout"
import { QuitPlanDashboard } from "@/pages/plan/quitPlan/QuitPlanDashboard"
import AchievementsPage from "@/pages/achievements/AchievementsPage"
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage"
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage"

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes - accessible by guests and members only (NOT admin/coach except blog for coach) */}
      <Route
        path="/"
        element={
          <ProtectedRoute
            allowedRoles={['NORMAL_MEMBER', 'PREMIUM_MEMBER']}
            requireAuth={false}
          >
            <LandingPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/plan/create"
        element={
          <ProtectedRoute
            allowedRoles={['NORMAL_MEMBER', 'PREMIUM_MEMBER']}
            requireAuth={false}
          >
            <CreateQuitPlanLayout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/about"
        element={
          <ProtectedRoute
            allowedRoles={['NORMAL_MEMBER', 'PREMIUM_MEMBER']}
            requireAuth={false}
          >
            <AboutPage />
          </ProtectedRoute>
        }
      />

      {/* Blog - accessible by guests, members, and coaches */}
      <Route
        path="/blog"
        element={
          <ProtectedRoute
            allowedRoles={['NORMAL_MEMBER', 'PREMIUM_MEMBER', 'COACH']}
            requireAuth={false}
          >
            <BlogPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="achievements"
        element={
          <ProtectedRoute
            allowedRoles={['PREMIUM_MEMBER']}
            requireAuth={true}
          >
            <AchievementsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/booking"
        element={
          <ProtectedRoute
            allowedRoles={['PREMIUM_MEMBER']}
            requireAuth={true}
          >
            <BookingPage />
          </ProtectedRoute>
        }
      />

      {/* Auth routes - prevent authenticated users from accessing */}
      <Route path="/login" element={<AuthRedirect><LoginPage /></AuthRedirect>} />
      <Route path="/register" element={<AuthRedirect><RegisterPage /></AuthRedirect>} />
      <Route path="/forgot-password" element={<AuthRedirect><ForgotPasswordPage /></AuthRedirect>} />
      <Route path="/reset-password" element={<AuthRedirect><ResetPasswordPage /></AuthRedirect>} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      {/* <Route path="/plan-selection" element={<PlanSelectionDirectPage />} /> */}

      {/* Protected Routes - Require Authentication */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute requireAuth={true}>
            <UserProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Public Profile View - with sidebar layout */}
      <Route
        path="/profile/:userId"
        element={
          <ProtectedRoute requireAuth={true}>
            <PublicProfileViewPage />
          </ProtectedRoute>
        }
      />

      {/* Member Routes - NORMAL_MEMBER & PREMIUM_MEMBER */}
      <Route
        path="/plan"
        element={
          <ProtectedRoute
            allowedRoles={['NORMAL_MEMBER', 'PREMIUM_MEMBER']}
            requireAuth={true}
          >
            <QuitPlanDashboard />
          </ProtectedRoute>
        }
      />

      {/* Member Routes - NORMAL_MEMBER & PREMIUM_MEMBER */}
      <Route
        path="/plan/create"
        element={
          <ProtectedRoute
            allowedRoles={['NORMAL_MEMBER', 'PREMIUM_MEMBER']}
            requireAuth={true}
          >
            <QuitPlanGuard>
              <CreateQuitPlanLayout />
            </QuitPlanGuard>
          </ProtectedRoute>
        }
      />

      {/* Program Page - accessible by PREMIUM_MEMBER only -- Made by Duy */}
      <Route
        path="/program"
        element={
          <ProtectedRoute allowedRoles={["PREMIUM_MEMBER"]} requireAuth={true}>
            <ProgramPage />
          </ProtectedRoute>
        }
      />

      {/* Leaderboard - accessible by all members */}
      <Route
        path="/leaderboard"
        element={
          <ProtectedRoute
            allowedRoles={['NORMAL_MEMBER', 'PREMIUM_MEMBER']}
            requireAuth={true}
          >
            <LeaderboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payment-return"
        element={
          <ProtectedRoute requireAuth={true}>
            <PaymentReturnPage />
          </ProtectedRoute>
        }
      />
      {/* Route cho meeting page */}
      <Route
        path="/meeting/:appointmentId"
        element={
          <ProtectedRoute
            allowedRoles={['PREMIUM_MEMBER', 'COACH']}
            requireAuth={true}
          >
            <MeetingPage />
          </ProtectedRoute>
        }
      >
      </Route>

      <Route
        path="/subscription"
        element={
          <ProtectedRoute
            allowedRoles={['NORMAL_MEMBER', 'PREMIUM_MEMBER']}
            requireAuth={true}
          >
            <SubscriptionPage />
          </ProtectedRoute>
        }
      />      {/* Admin Routes - SUPER_ADMIN only */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN']}
            requireAuth={true}
            redirectTo="/login"
          >
            <AdminPage />
          </ProtectedRoute>
        }
      />

      {/* Health Benefits - accessible by all members */}
      <Route
        path="/health-benefits"
        element={
          <ProtectedRoute
            allowedRoles={['NORMAL_MEMBER', 'PREMIUM_MEMBER']}
            requireAuth={false}
          >
            <HealthBenefitsPage />
          </ProtectedRoute>
        }
      />

      {/* Quit Stats - accessible by all members */}
      <Route
        path="/quit-stats"
        element={
          <ProtectedRoute
            allowedRoles={['NORMAL_MEMBER', 'PREMIUM_MEMBER']}
            requireAuth={true}
          >
            <QuitStatsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute requireAuth={true}>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />

      <Route path="/profile/:userId" element={<PublicUserProfilePage />} />

      {/* Coach Routes - COACH only */}
      <Route
        path="/coach/*"
        element={
          <ProtectedRoute
            allowedRoles={['COACH']}
            requireAuth={true}
            redirectTo="/login"
          >
            <CoachPage />
          </ProtectedRoute>
        }
      />

      {/* Content Admin Routes - CONTENT_ADMIN only */}
      <Route
        path="/contentadmin/*"
        element={
          <ProtectedRoute
            allowedRoles={['CONTENT_ADMIN']}
            requireAuth={true}
            redirectTo="/login"
          >
            <ContentAdminPage />
          </ProtectedRoute>
        }
      />

      <Route path="/user/:userId" element={<PublicUserProfilePage />} />

      {/* Catch all - 404 or redirect to home */}
      <Route path="*" element={<LandingPage />} />
    </Routes>
  )
}
