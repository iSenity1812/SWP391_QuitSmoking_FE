"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Users,
    Calendar,
    TrendingUp,
    MessageSquare,
    BarChart3,
    Target,
    Heart,
    DollarSign,
    Activity,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    Sun,
    Moon,
} from "lucide-react"
import { AdminDashboard } from "./component/AdminDashBoard"
import { UserManagement } from "./component/UserManagement"
import { PlanManagement } from "./component/PlanManagement"
import { ContentManagement } from "./component/ContentManagement"
import { AnalyticsSection } from "./component/AnalyticsSection"
import { useTheme } from "@/context/ThemeContext"
import { useAuth } from "@/context/AuthContext"

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState("dashboard")
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { theme, toggleTheme } = useTheme()
    const { user } = useAuth();

    const navItems = [
        { id: "dashboard", label: "Tổng Quan", icon: BarChart3 },
        { id: "users", label: "Người Dùng", icon: Users },
        { id: "plans", label: "Kế Hoạch", icon: Calendar },
        { id: "content", label: "Nội Dung", icon: MessageSquare },
        { id: "analytics", label: "Phân Tích", icon: TrendingUp },
    ]

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return <AdminDashboard />
            case "users":
                return <UserManagement />
            case "plans":
                return <PlanManagement />
            case "content":
                return <ContentManagement />
            case "analytics":
                return <AnalyticsSection />
            default:
                return <AdminDashboard />
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
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
                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">QS</span>
                            </div>
                            <div>
                                <h2 className="text-slate-900 dark:text-white font-semibold">Admin Panel</h2>
                                <p className="text-slate-600 dark:text-slate-400 text-xs">Quản lý hệ thống</p>
                            </div>
                        </div>
                    )}

                    {/* Collapse Button - Desktop */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="hidden lg:flex text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50"
                    >
                        {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </Button>

                    {/* Close Button - Mobile */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setMobileMenuOpen(false)}
                        className="lg:hidden text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50"
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
                                    ? "bg-gradient-to-r from-green-500/20 to-blue-500/20 text-slate-900 dark:text-white border border-green-500/30"
                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50"
                                    }`}
                            >
                                <Icon size={20} className={isActive ? "text-green-500" : ""} />
                                {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
                            </button>
                        )
                    })}
                </nav>

                {/* Theme Toggle */}
                <div className="px-4 mb-4">
                    <Button
                        onClick={toggleTheme}
                        variant="outline"
                        size={sidebarCollapsed ? "sm" : "default"}
                        className={`${sidebarCollapsed ? "w-8 h-8 p-0" : "w-full"} bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300`}
                    >
                        {theme === "light" ? (
                            <>
                                <Moon size={16} />
                                {!sidebarCollapsed && <span className="ml-2">Light</span>}
                            </>
                        ) : (
                            <>
                                <Sun size={16} />
                                {!sidebarCollapsed && <span className="ml-2">Dark</span>}
                            </>
                        )}
                    </Button>
                </div>

                {/* User Profile - Bottom */}
                <div className="absolute bottom-4 left-4 right-4">
                    <div
                        className={`flex items-center space-x-3 p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg ${sidebarCollapsed ? "justify-center" : ""}`}
                    >
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg?height=32&width=32" />
                            <AvatarFallback className="bg-green-500 text-white">QT</AvatarFallback>
                        </Avatar>
                        {!sidebarCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-slate-900 dark:text-white text-sm font-medium truncate">{user?.username || "Admin"}</p>
                                <p className="text-slate-600 dark:text-slate-400 text-xs truncate">{user?.email || "admin@example.com"}</p>
                            </div>
                        )}
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
                                className="lg:hidden text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50"
                            >
                                <Menu size={20} />
                            </Button>

                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    Quản lý nền tảng cai thuốc lá của bạn
                                </h1>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">Bảng điều khiển quản trị hệ thống</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Desktop Theme Toggle */}
                            <Button
                                onClick={toggleTheme}
                                variant="outline"
                                size="sm"
                                className="hidden lg:flex bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300"
                            >
                                {theme === "light" ? (
                                    <>
                                        <Moon size={16} />
                                        {/* <span className="ml-2"></span> */}
                                    </>
                                ) : (
                                    <>
                                        <Sun size={16} />
                                        {/* <span className="ml-2"></span> */}
                                    </>
                                )}
                            </Button>

                            <Badge
                                variant="outline"
                                className="px-3 py-1 border-green-500/30 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10"
                            >
                                <Activity className="w-4 h-4 mr-2" />
                                Hệ Thống Hoạt Động
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="p-6">
                    {activeTab === "dashboard" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700/50">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Tổng Người Dùng
                                    </CardTitle>
                                    <Users className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">2,847</div>
                                    <p className="text-xs text-green-600 dark:text-green-400">+12% so với tháng trước</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700/50">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Kế Hoạch Đang Hoạt Động
                                    </CardTitle>
                                    <Target className="h-4 w-4 text-green-500 dark:text-green-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">1,234</div>
                                    <p className="text-xs text-green-600 dark:text-green-400">+8% so với tháng trước</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700/50">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Tỷ Lệ Thành Công
                                    </CardTitle>
                                    <Heart className="h-4 w-4 text-red-500 dark:text-red-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">73%</div>
                                    <p className="text-xs text-green-600 dark:text-green-400">+5% so với tháng trước</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700/50">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Doanh Thu</CardTitle>
                                    <DollarSign className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">$12,847</div>
                                    <p className="text-xs text-green-600 dark:text-green-400">+15% so với tháng trước</p>
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
