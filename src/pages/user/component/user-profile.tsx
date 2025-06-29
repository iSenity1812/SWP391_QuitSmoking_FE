"use client"

import { useState, useEffect } from "react"
import { userData } from "../data/user-data"
import { UserProfileHeader } from "../components/UserProfileHeader"
import { UserProfileSidebar } from "../components/UserProfileSidebar"
import { StatsCards } from "../components/StatsCards"
import { AchievementNotificationModal } from "../components/AchievementNotificationModal"
import { OverviewTab } from "../components/tabs/OverviewTab"
import { ProgressTab } from "../components/tabs/ProgressTab"
import { AchievementsTab } from "../components/tabs/AchievementsTab"
import { HealthTab } from "../components/tabs/HealthTab"
import { SocialTab } from "../components/tabs/SocialTab"
import { BookingTab } from "../components/tabs/BookingtTab"
import CertificationTab from "../components/tabs/CertificationTab"
import type { AchievementNotification, User } from "../types/user-types"
import DiaryTab from "../components/tabs/DiaryTab"
import { PremiumChallenges } from "../components/PremiumChallenges"
import { LearningProgramTab } from "../components/tabs/LearningProgramTab" // Import the new LearningProgramTab

export default function UserProfile() {
    const [activeTab, setActiveTab] = useState("overview")
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [achievementNotification, setAchievementNotification] = useState<AchievementNotification>({
        show: false,
        achievement: null,
    })
    const [user, setUser] = useState<User>(userData) // Use useState for user data

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

    // Function to update user challenges
    const handleUpdateUserChallenges = (updatedChallenges: User["challenges"]) => {
        setUser((prevUser) => ({ ...prevUser, challenges: updatedChallenges }))
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

        // Add tab change event listener
        const handleTabChangeEvent = (event: CustomEvent) => {
            setActiveTab(event.detail)
            setSidebarOpen(false)
        }

        document.addEventListener("mousedown", handleClickOutside)
        window.addEventListener("changeTab", handleTabChangeEvent as EventListener)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            window.removeEventListener("changeTab", handleTabChangeEvent as EventListener)
        }
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
            case "diary":
                return <DiaryTab />
            case "challenges":
                return <PremiumChallenges user={user} onUpdateUserChallenges={handleUpdateUserChallenges} />
            case "learning": // New case for learning program
                return <LearningProgramTab />
            default:
                return <OverviewTab user={user} onTestAchievement={handleTestAchievement} />
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <UserProfileHeader user={user} onMenuToggle={handleMenuToggle} />

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
