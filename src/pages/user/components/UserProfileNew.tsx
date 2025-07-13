"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import SidebarLeft from "./SidebarLeft"
import SidebarRight from "./SidebarRight"
import ProfileCard from "./ProfileCard"
import { OverviewTab } from "./tabs/OverviewTab"
import { AchievementsTab } from "./tabs/AchievementsTab"
import SettingsTab from "./tabs/SettingsTab"
import type { UserProfile } from "../types/UserProfile"
import type { User } from "../types/user-types"
import { useAuth } from "@/hooks/useAuth"

export default function UserProfileNew() {
  const [activeTab, setActiveTab] = useState("overview")
  const { user, isLoading } = useAuth()

  // Convert auth user data to UserProfile format for ProfileCard
  const userProfile: UserProfile = useMemo(() => {
    if (!user) {
      // Fallback if no user data
      return {
        userId: "",
        username: "Loading...",
        displayName: "Loading...",
        email: "",
        profilePicture: undefined,
        createdAt: new Date().toISOString(),
        role: "NORMAL_MEMBER",
        streakCount: 0,
        totalAchievements: 0,
        followerCount: 0,
        followingCount: 0,
      }
    }

    return {
      userId: user.userId,
      username: user.username,
      displayName: user.username, // Use username as display name if no separate display name
      email: user.email,
      profilePicture: user.profilePicture || undefined,
      createdAt: new Date().toISOString(), // We don't have creation date from auth, use current date
      role: user.role === "NORMAL_MEMBER" || user.role === "PREMIUM_MEMBER" ? user.role : "NORMAL_MEMBER",
      streakCount: 0, // These would need to be fetched from separate APIs
      totalAchievements: 0,
      followerCount: 0,
      followingCount: 0,
    }
  }, [user])

  // Convert auth user data to User format for OverviewTab
  const mockUser: User = useMemo(() => {
    if (!user) {
      return {
        userId: "",
        name: "Loading...",
        email: "",
        avatar: "",
        joinDate: new Date().toISOString(),
        daysSmokeFreee: 0,
        cigarettesAvoided: 0,
        moneySaved: "0 VNĐ",
        healthImprovement: 0,
        level: "Người mới bắt đầu",
        streak: 0,
        achievements: [],
        achievementCategories: [],
        nextMilestone: {
          name: "Cai thuốc 30 ngày",
          daysLeft: 30,
          reward: "Huy hiệu bạc"
        },
        healthBenefits: [],
        weeklyProgress: [],
        friends: [],
        recentActivities: []
      }
    }

    return {
      userId: user.userId,
      name: user.username,
      email: user.email,
      avatar: user.profilePicture || "",
      joinDate: new Date().toISOString(), // Would need to be fetched from API
      daysSmokeFreee: 0, // These would need to be fetched from separate APIs
      cigarettesAvoided: 0,
      moneySaved: "0 VNĐ",
      healthImprovement: 0,
      level: "Người mới bắt đầu",
      streak: 0,
      achievements: [],
      achievementCategories: [],
      nextMilestone: {
        name: "Cai thuốc 30 ngày",
        daysLeft: 30,
        reward: "Huy hiệu bạc"
      },
      healthBenefits: [],
      weeklyProgress: [],
      friends: [],
      recentActivities: []
    }
  }, [user])

  // Show loading state if auth is still loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Đang tải thông tin người dùng...</p>
        </div>
      </div>
    )
  }

  // Show error if no user data
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">Không thể tải thông tin người dùng</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Tải lại
          </button>
        </div>
      </div>
    )
  }

  const renderMainContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab user={mockUser} onTestAchievement={() => { }} />
      case "achievements":
        return <AchievementsTab />
      case "settings":
        return <SettingsTab user={userProfile} />
      default:
        return <OverviewTab user={mockUser} onTestAchievement={() => { }} />
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {/* Left Sidebar */}
      <SidebarLeft activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
          {/* Profile Card */}
          <div className="mb-8">
            <ProfileCard user={userProfile} />
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderMainContent()}
          </motion.div>
        </main>
      </div>

      {/* Right Sidebar */}
      <SidebarRight currentUserId={userProfile.userId} />
    </div>
  )
}