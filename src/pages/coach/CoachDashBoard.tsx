"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Users, Calendar, MessageSquare, User, BookOpen, Activity, TrendingUp, Menu, X } from "lucide-react"
import { CoachOverview } from "./components/CoachOverview"
import { CustomerManagement } from "./components/CustomerManagement"
import { CommunicationCenter } from "./components/CommunicationCenter"
import { CoachProfile } from "./components/CoachProfile"
import { CoachBlogManagement } from "./components/CoachBlogManagement"
// import { AppointmentScheduler } from "./components/AppointmentScheduler"
import { AppointmentScheduler } from "./components/AppointmentSchedulerNew"
import { AnimatePresence, motion } from "framer-motion"
import { useAuth } from "@/hooks/useAuth"
import { userService, type CoachProfileResponse } from "@/services/userService"

export default function CoachDashboard() {
    const { user, logout } = useAuth()
    const [activeTab, setActiveTab] = useState("appointments")
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [coachProfile, setCoachProfile] = useState<CoachProfileResponse | null>(null)
    const [profileLoading, setProfileLoading] = useState(true)

    const navItems = [
        // { id: "overview", label: "Tổng Quan", icon: Activity },
        // { id: "customers", label: "Quản Lý Khách Hàng", icon: Users },
        { id: "appointments", label: "Lịch Hẹn", icon: Calendar },
        // { id: "communication", label: "Giao Tiếp", icon: MessageSquare },
        { id: "blog", label: "Quản Lý Blog", icon: BookOpen },
        { id: "profile", label: "Hồ Sơ Cá Nhân", icon: User },
    ]

    useEffect(() => {
        const fetchCoachProfile = async () => {
            try {
                setProfileLoading(true)
                const profileData = await userService.getCoachProfile()
                setCoachProfile(profileData)
            } catch (err) {
                console.error("Error fetching coach profile:", err)
            } finally {
                setProfileLoading(false)
            }
        }

        if (user?.role === "COACH") {
            fetchCoachProfile()
        } else {
            setProfileLoading(false)
        }
    }, [user])

    const getProfilePictureUrl = (profilePicture?: string | null) => {
        if (!profilePicture) return null

        // If it's already a full URL, return as is
        if (profilePicture.startsWith("http")) {
            return profilePicture
        }

        // If it's a relative path, construct the full URL
        const baseUrl = "http://localhost:8080"
        const cleanPath = profilePicture.startsWith("/") ? profilePicture : `/${profilePicture}`
        return `${baseUrl}${cleanPath}`
    }

    const renderContent = () => {
        switch (activeTab) {
            case "overview":
                return <CoachOverview />
            case "customers":
                return <CustomerManagement />
            case "appointments":
                return <AppointmentScheduler />
            case "communication":
                return <CommunicationCenter />
            case "blog":
                return <CoachBlogManagement />
            case "profile":
                return <CoachProfile />
            default:
                return <AppointmentScheduler />
        }
    }

    // Use coach profile picture if available, otherwise fallback to user profile picture
    const profileImageUrl = getProfilePictureUrl(coachProfile?.profilePicture || user?.profilePicture)
    const displayUsername = coachProfile?.username || user?.username
    const displayEmail = coachProfile?.email || user?.email

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
            )}

            {/* Sidebar */}
            <div
                className={`fixed left-0 top-0 h-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-r border-slate-200 dark:border-slate-700/50 z-50 transition-all duration-300 ${sidebarCollapsed ? "w-16" : "w-64"
                    } ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700/50">
                    {!sidebarCollapsed && (
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">C</span>
                            </div>
                            <div>
                                <h2 className="text-slate-900 dark:text-white font-semibold">Coach Panel</h2>
                                <p className="text-slate-600 dark:text-slate-400 text-xs">Bảng điều khiển huấn luyện viên</p>
                            </div>
                        </div>
                    )}

                    {/* Close Button - Mobile */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setMobileMenuOpen(false)}
                        className="lg:hidden text-slate-600 dark:text-slate-400"
                    >
                        <X size={16} />
                    </Button>
                </div>

                {/* Navigation Items */}
                <nav className="p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = activeTab === item.id

                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id)
                                    setMobileMenuOpen(false)
                                }}
                                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive
                                    ? "bg-gradient-to-r from-blue-500/20 to-green-500/20 text-slate-900 dark:text-white border border-blue-500/30"
                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50"
                                    }`}
                            >
                                <Icon size={20} className={isActive ? "text-blue-500" : ""} />
                                {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
                            </button>
                        )
                    })}
                </nav>

                {/* Coach Profile - Bottom */}
                <div className="absolute bottom-4 left-4 right-4">
                    <div
                        className={`flex items-center space-x-3 p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg ${sidebarCollapsed ? "justify-center" : ""
                            }`}
                    >
                        <Avatar className="h-8 w-8 border-2 border-blue-200 dark:border-blue-500">
                            {profileImageUrl ? (
                                <AvatarImage
                                    src={profileImageUrl || "/placeholder.svg"}
                                    alt={displayUsername || "Coach"}
                                    className="object-cover"
                                />
                            ) : null}
                            <AvatarFallback className="bg-blue-500 text-white text-sm">
                                {displayUsername?.charAt(0).toUpperCase() || "HLV"}
                            </AvatarFallback>
                        </Avatar>
                        <AnimatePresence>
                            {!sidebarCollapsed && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex-1 min-w-0"
                                >
                                    <p className="text-slate-900 dark:text-white text-sm font-medium truncate">
                                        {profileLoading ? "Đang tải..." : displayUsername}
                                    </p>
                                    <p className="text-slate-600 dark:text-slate-400 text-xs truncate">
                                        {profileLoading ? "..." : displayEmail}
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-2 w-full bg-transparent"
                                        onClick={() => {
                                            logout()
                                            setMobileMenuOpen(false)
                                        }}
                                    >
                                        Đăng xuất
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={`transition-all duration-300 ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
                {/* Top Header */}
                <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/50 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {/* Mobile Menu Button */}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setMobileMenuOpen(true)}
                                className="lg:hidden text-slate-600 dark:text-slate-400"
                            >
                                <Menu size={20} />
                            </Button>

                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Bảng Điều Khiển Huấn Luyện Viên</h1>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">Quản lý khách hàng và hỗ trợ cai thuốc lá</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* <Button variant="outline" size="sm" className="hidden md:flex bg-transparent">
                                <Bell className="w-4 h-4 mr-2" />
                                Thông báo
                                <Badge className="ml-2 bg-red-500 text-white">3</Badge>
                            </Button> */}

                            <Badge
                                variant="outline"
                                className="px-3 py-1 border-green-500/30 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10"
                            >
                                <Activity className="w-4 h-4 mr-2" />
                                Đang Hoạt Động
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="p-6">
                    {/* Quick Stats - Only show on overview */}
                    {activeTab === "overview" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700/50">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Tổng Khách Hàng
                                    </CardTitle>
                                    <Users className="h-4 w-4 text-blue-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">47</div>
                                    <p className="text-xs text-green-600 dark:text-green-400">+3 khách hàng mới tuần này</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700/50">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Lịch Hẹn Hôm Nay
                                    </CardTitle>
                                    <Calendar className="h-4 w-4 text-green-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">8</div>
                                    <p className="text-xs text-blue-600 dark:text-blue-400">2 cuộc hẹn sắp tới</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700/50">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Tin Nhắn Chưa Đọc
                                    </CardTitle>
                                    <MessageSquare className="h-4 w-4 text-orange-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">12</div>
                                    <p className="text-xs text-orange-600 dark:text-orange-400">5 tin nhắn khẩn cấp</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700/50">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Tỷ Lệ Thành Công
                                    </CardTitle>
                                    <TrendingUp className="h-4 w-4 text-purple-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">78%</div>
                                    <p className="text-xs text-green-600 dark:text-green-400">+5% so với tháng trước</p>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Dynamic Content */}
                    <div className="space-y-6">{renderContent()}</div>
                </div>
            </div>
        </div>
    )
}
