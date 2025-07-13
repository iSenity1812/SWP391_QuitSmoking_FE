"use client"

import { useState, useEffect } from "react"
import { userData } from "../data/user-data"
import UserProfileHeader from "./UserProfileHeader"
import { UserProfileSidebar } from "./UserProfileSidebar"
import { StatsCards } from "./StatsCards"
import { AchievementNotificationModal } from "./AchievementNotificationModal"
import { OverviewTab } from "../components/tabs/OverviewTab"
import { ProgressTab } from "../components/tabs/ProgressTab"
import { AchievementsTab } from "../components/tabs/AchievementsTab"
import { HealthTab } from "../components/tabs/HealthTab"
import { SocialTab } from "../components/tabs/SocialTab"
import { BookingTab } from "../components/tabs/BookingtTab"
import CertificationTab from "../components/tabs/CertificationTab"
import type { AchievementNotification } from "../types/user-types"
import ProfileCard from "./ProfileCard"
import { motion } from "framer-motion"
import type { UserProfile } from "../types/UserProfile"
import SettingsTab from "./tabs/SettingTab"


export default function UserProfile() {
    const [activeTab, setActiveTab] = useState("overview")
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [achievementNotification, setAchievementNotification] = useState<AchievementNotification>({
        show: false,
        achievement: null,
    })

    const user = userData

    const handleTestAchievement = () => {
        const randomAchievement = user.achievements[Math.floor(Math.random() * user.achievements.length)]
        setAchievementNotification({
            show: true,
            achievement: randomAchievement,
        })
    }

    const handleCloseNotification = () => {
        setAchievementNotification({ show: false, achievement: null })
    }

    const handleViewAchievements = () => {
        setActiveTab("achievements")
        handleCloseNotification()
    }

    const handleMenuToggle = () => {
        setSidebarOpen(!sidebarOpen)
    }

    const handleSidebarClose = () => {
        setSidebarOpen(false)
    }

    const handleTabChange = (tab: string) => {
        setActiveTab(tab)
    }

    // Close sidebar when clicking outside on mobile
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarOpen && window.innerWidth < 768) {
                const sidebar = document.getElementById("sidebar")
                if (sidebar && !sidebar.contains(event.target as Node)) {
                    setSidebarOpen(false)
                }
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [sidebarOpen])

    const renderTabContent = () => {
        switch (activeTab) {
            case "overview":
                return <OverviewTab user={user} onTestAchievement={handleTestAchievement} />
            case "progress":
                return <ProgressTab user={user} />
            case "achievements":
                return <AchievementsTab user={user} />
            case "health":
                return <HealthTab />
            case "social":
                return <SocialTab user={user} />
            case "booking":
                return <BookingTab user={user} />
            case "certification":
                return <CertificationTab />
            case "settings":
                return <SettingsTab user={mockUser} />
            default:
                return <OverviewTab user={user} onTestAchievement={handleTestAchievement} />
        }
    }


    // Mock user data - replace with actual data from your API
    const mockUser: UserProfile = {
        userId: "user-123",
        username: "chamcham3",
        displayName: "Cham Cham",
        email: "chamcham@example.com",
        profilePicture: null,
        createdAt: "2025-07-10T23:30:44.442925",
        role: "PREMIUM_MEMBER",
        streakCount: 15,
        totalAchievements: 8,
        followerCount: 24,
        followingCount: 12,
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <UserProfileHeader user={user} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
                    {/* Profile Card */}
                    <div className="mb-8">
                        <ProfileCard user={mockUser} />
                    </div>

                    {/* Tab Content */}
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderTabContent()}
                    </motion.div>
                </main>
            </div>

            <div className="flex">
                <div id="sidebar">
                    <UserProfileSidebar
                        user={user}
                        activeTab={activeTab}
                        sidebarOpen={sidebarOpen}
                        onTabChange={handleTabChange}
                        onSidebarClose={handleSidebarClose}
                    />
                </div>

                <div className="flex-1 p-6">
                    <div className="max-w-7xl mx-auto">
                        <StatsCards user={user} />
                        {renderTabContent()}
                    </div>
                </div>
            </div>

            {/* Overlay for mobile sidebar */}
            {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={handleSidebarClose} />}

            <AchievementNotificationModal
                notification={achievementNotification}
                onClose={handleCloseNotification}
                onViewAchievements={handleViewAchievements}
            />
        </div>
    )
}
