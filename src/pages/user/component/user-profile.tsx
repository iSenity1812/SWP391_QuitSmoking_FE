"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    Award,
    Clock,
    Settings,
    LogOut,
    Target,
    Heart,
    Coins,
    Trophy,
    Calendar,
    MessageCircle,
    BookOpen,
    Bell,
    Share2,
    Download,
    Users,
    Plus,
    Filter,
    Search,
    LayoutDashboard,
    BarChartIcon as ChartBar,
    Menu,
    X,
} from "lucide-react"

interface UserProfileProps {
    className?: string
}

export function UserProfile({ className }: UserProfileProps) {
    const [activeTab, setActiveTab] = useState("overview")
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const [achievementNotification, setAchievementNotification] = useState<{
        show: boolean
        achievement: any
    }>({ show: false, achievement: null })

    const [user] = useState({
        name: "Nguyễn Văn A",
        email: "nguyenvana@example.com",
        avatar: "/placeholder.svg?height=100&width=100",
        joinDate: "15/04/2023",
        daysSmokeFreee: 45,
        cigarettesAvoided: 450,
        moneySaved: "2.250.000",
        healthImprovement: 65,
        level: "Bạc",
        streak: 45,
        achievements: [
            // Thời gian (Time-based achievements)
            {
                id: 1,
                name: "Good Start",
                description: "Không hút thuốc 1 ngày",
                category: "time",
                completed: true,
                date: "22/04/2023",
                points: 50,
                icon: "calendar",
                daysRequired: 1,
            },
            {
                id: 2,
                name: "Tuần Đầu Tiên",
                description: "Hoàn thành 7 ngày không hút thuốc",
                category: "time",
                completed: true,
                date: "28/04/2023",
                points: 100,
                icon: "trophy",
                daysRequired: 7,
            },
            {
                id: 3,
                name: "First Month",
                description: "Kiên trì không hút thuốc trong 1 tháng",
                category: "time",
                completed: true,
                date: "15/05/2023",
                points: 500,
                icon: "award",
                daysRequired: 30,
            },
            {
                id: 4,
                name: "Quý Đầu Tiên",
                description: "3 tháng không hút thuốc - thói quen mới!",
                category: "time",
                completed: false,
                points: 1000,
                icon: "medal",
                daysRequired: 90,
            },
            {
                id: 5,
                name: "Nửa Năm Chiến Thắng",
                description: "6 tháng không hút thuốc",
                category: "time",
                completed: false,
                points: 2000,
                icon: "crown",
                daysRequired: 180,
            },
            {
                id: 6,
                name: "365 Days Warrior",
                description: "Không hút thuốc trong vòng 1 năm",
                category: "time",
                completed: false,
                points: 5000,
                icon: "flame",
                daysRequired: 365,
            },

            // Tiết kiệm (Money-based achievements)
            {
                id: 7,
                name: "Pocket Saver",
                description: "Tiết kiệm được 100,000đ",
                category: "saving",
                completed: true,
                date: "25/04/2023",
                points: 100,
                icon: "coins",
                moneyRequired: 100000,
            },
            {
                id: 8,
                name: "Budget Booster",
                description: "Tiết kiệm được 500,000đ",
                category: "saving",
                completed: true,
                date: "10/05/2023",
                points: 300,
                icon: "piggy-bank",
                moneyRequired: 500000,
            },
            {
                id: 9,
                name: "Smart Spender",
                description: "Tiết kiệm được 1,000,000đ",
                category: "saving",
                completed: true,
                date: "01/06/2023",
                points: 500,
                icon: "banknote",
                moneyRequired: 1000000,
            },
            {
                id: 10,
                name: "Wealth Builder",
                description: "Tiết kiệm được 5,000,000đ",
                category: "saving",
                completed: false,
                points: 1500,
                icon: "gem",
                moneyRequired: 5000000,
            },
            {
                id: 11,
                name: "Vacation Funded",
                description: "Tiết kiệm trên 5,000,000đ - đủ tiền đi du lịch!",
                category: "saving",
                completed: false,
                points: 3000,
                icon: "plane",
                moneyRequired: 5000000,
            },

            // Số lượng (Quantity-based achievements)
            {
                id: 12,
                name: "Great Effort",
                description: "Hôm nay bạn không hút thuốc",
                category: "daily",
                completed: true,
                date: "Hôm nay",
                points: 10,
                icon: "check-circle",
                isDaily: true,
            },
            {
                id: 13,
                name: "Keep Going",
                description: "Giảm số điếu thuốc hút so với hôm qua",
                category: "progress",
                completed: true,
                date: "Hôm qua",
                points: 20,
                icon: "trending-down",
                isDaily: true,
            },
            {
                id: 14,
                name: "Hundred Club",
                description: "Tránh được 100 điếu thuốc",
                category: "quantity",
                completed: true,
                date: "30/04/2023",
                points: 200,
                icon: "target",
                cigarettesAvoided: 100,
            },
            {
                id: 15,
                name: "Five Hundred Strong",
                description: "Tránh được 500 điếu thuốc",
                category: "quantity",
                completed: false,
                points: 500,
                icon: "shield",
                cigarettesAvoided: 500,
            },

            // Comeback & Resilience
            {
                id: 16,
                name: "Comeback King",
                description: "Quay lại chuỗi > 10 ngày sau khi bị gián đoạn",
                category: "resilience",
                completed: false,
                points: 800,
                icon: "refresh-cw",
                comebackStreak: 10,
            },
            {
                id: 17,
                name: "Phoenix Rising",
                description: "Bắt đầu lại và đạt streak 30 ngày sau thất bại",
                category: "resilience",
                completed: false,
                points: 1200,
                icon: "sunrise",
                comebackStreak: 30,
            },

            // Sức khỏe (Health-based achievements)
            {
                id: 18,
                name: "Breath of Fresh Air",
                description: "Chức năng phổi cải thiện 25%",
                category: "health",
                completed: true,
                date: "20/05/2023",
                points: 400,
                icon: "heart",
                healthImprovement: 25,
            },
            {
                id: 19,
                name: "Healthy Heart",
                description: "Sức khỏe tim mạch cải thiện 50%",
                category: "health",
                completed: false,
                points: 600,
                icon: "activity",
                healthImprovement: 50,
            },

            // Cộng đồng (Social achievements)
            {
                id: 20,
                name: "Motivator",
                description: "Giúp đỡ 5 người bạn trong hành trình cai thuốc",
                category: "social",
                completed: false,
                points: 300,
                icon: "users",
                friendsHelped: 5,
            },
            {
                id: 21,
                name: "Community Leader",
                description: "Chia sẻ kinh nghiệm và nhận 50 lượt thích",
                category: "social",
                completed: false,
                points: 400,
                icon: "heart",
                likesReceived: 50,
            },

            // Đặc biệt (Special achievements)
            {
                id: 22,
                name: "New Year, New Me",
                description: "Bắt đầu hành trình cai thuốc vào đầu năm",
                category: "special",
                completed: false,
                points: 200,
                icon: "sparkles",
                isSpecial: true,
            },
            {
                id: 23,
                name: "Birthday Gift",
                description: "Không hút thuốc trong ngày sinh nhật",
                category: "special",
                completed: false,
                points: 150,
                icon: "gift",
                isSpecial: true,
            },
            {
                id: 24,
                name: "Weekend Warrior",
                description: "Hoàn thành 10 cuối tuần không hút thuốc",
                category: "special",
                completed: false,
                points: 350,
                icon: "calendar-days",
                weekendsCompleted: 10,
            },
        ],
        achievementCategories: [
            { id: "all", name: "Tất cả", count: 24 },
            { id: "time", name: "Thời gian", count: 6 },
            { id: "saving", name: "Tiết kiệm", count: 5 },
            { id: "quantity", name: "Số lượng", count: 3 },
            { id: "health", name: "Sức khỏe", count: 2 },
            { id: "social", name: "Cộng đồng", count: 2 },
            { id: "resilience", name: "Kiên cường", count: 2 },
            { id: "special", name: "Đặc biệt", count: 3 },
            { id: "daily", name: "Hàng ngày", count: 1 },
        ],
        nextMilestone: {
            name: "50 ngày không hút thuốc",
            daysLeft: 5,
            reward: "Huy hiệu Vàng",
        },
        healthBenefits: [
            { name: "Tuần hoàn máu", improvement: 78, description: "Cải thiện đáng kể" },
            { name: "Phổi", improvement: 65, description: "Đang phục hồi tốt" },
            { name: "Tim mạch", improvement: 85, description: "Rất tốt" },
            { name: "Năng lượng", improvement: 90, description: "Tuyệt vời" },
        ],
        weeklyProgress: [
            { day: "T2", cigarettes: 0, mood: 8 },
            { day: "T3", cigarettes: 0, mood: 9 },
            { day: "T4", cigarettes: 0, mood: 8 },
            { day: "T5", cigarettes: 0, mood: 9 },
            { day: "T6", cigarettes: 0, mood: 10 },
        ],
        friends: [
            { name: "Trần Thị B", avatar: "/placeholder.svg", streak: 32, status: "online" },
            { name: "Lê Văn C", avatar: "/placeholder.svg", streak: 67, status: "offline" },
            { name: "Phạm Thị D", avatar: "/placeholder.svg", streak: 21, status: "online" },
        ],
        recentActivities: [
            { type: "achievement", message: "Đạt được thành tựu 'Một tháng không hút thuốc'", time: "2 giờ trước" },
            { type: "milestone", message: "Hoàn thành 45 ngày không hút thuốc", time: "1 ngày trước" },
            { type: "social", message: "Trần Thị B đã thích bài viết của bạn", time: "2 ngày trước" },
            { type: "health", message: "Sức khỏe tim mạch cải thiện 5%", time: "3 ngày trước" },
        ],
    })

    // Simulate achievement checking
    useEffect(() => {
        const checkAchievements = () => {
            // Check for new achievements based on current progress
            const newAchievements = user.achievements.filter((achievement) => {
                if (achievement.completed) return false

                // Check time-based achievements
                if (achievement.daysRequired && user.daysSmokeFreee >= achievement.daysRequired) {
                    return true
                }

                // Check money-based achievements
                if (
                    achievement.moneyRequired &&
                    Number.parseInt(user.moneySaved.replace(/\./g, "")) >= achievement.moneyRequired
                ) {
                    return true
                }

                // Check cigarette-based achievements
                if (achievement.cigarettesAvoided && user.cigarettesAvoided >= achievement.cigarettesAvoided) {
                    return true
                }

                // Check health-based achievements
                if (achievement.healthImprovement && user.healthImprovement >= achievement.healthImprovement) {
                    return true
                }

                return false
            })

            // Show notification for the first new achievement
            if (newAchievements.length > 0) {
                setAchievementNotification({
                    show: true,
                    achievement: newAchievements[0],
                })
            }
        }

        // Check achievements when component mounts or user data changes
        const timer = setTimeout(checkAchievements, 1000)
        return () => clearTimeout(timer)
    }, [user.daysSmokeFreee, user.moneySaved, user.cigarettesAvoided, user.healthImprovement])

    const sidebarItems = [
        { id: "overview", label: "Tổng quan", icon: LayoutDashboard },
        { id: "progress", label: "Tiến trình", icon: ChartBar },
        { id: "achievements", label: "Thành tựu", icon: Award },
        { id: "health", label: "Sức khỏe", icon: Heart },
        { id: "social", label: "Cộng đồng", icon: Users },
    ]

    return (
        <div
            className={`w-full min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 ${className}`}
        >
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                className="md:hidden p-2 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                            >
                                <Menu className="h-5 w-5" />
                            </button>
                            <Avatar className="h-12 w-12 border-2 border-emerald-200">
                                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                <AvatarFallback className="bg-emerald-500 text-white">{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Chào mừng, {user.name}!</h1>
                            </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-3">
                            <Button variant="outline" size="sm">
                                <Bell className="h-4 w-4 mr-2" />
                                Thông báo
                            </Button>
                            <Button variant="outline" size="sm">
                                <Settings className="h-4 w-4 mr-2" />
                                Cài đặt
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Achievement Notification Modal */}
            {achievementNotification.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-md mx-4 shadow-2xl border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-300">
                        <div className="text-center">
                            {/* Celebration Animation */}
                            <div className="relative mb-6">
                                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-6 inline-block animate-bounce">
                                    <Trophy className="h-16 w-16 text-white" />
                                </div>
                                {/* Sparkle effects */}
                                <div className="absolute -top-2 -right-2 text-yellow-400 animate-pulse">✨</div>
                                <div className="absolute -bottom-2 -left-2 text-yellow-400 animate-pulse delay-150">⭐</div>
                                <div className="absolute top-1/2 -right-4 text-yellow-400 animate-pulse delay-300">🎉</div>
                            </div>

                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Chúc mừng!</h2>

                            <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">Bạn đã đạt được thành tựu</p>

                            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-xl p-4 mb-6 border border-emerald-200 dark:border-emerald-800">
                                <div className="flex items-center justify-center gap-3 mb-3">
                                    <Award className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                                    <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                                        {achievementNotification.achievement?.name}
                                    </h3>
                                </div>
                                <p className="text-emerald-600 dark:text-emerald-400 text-sm mb-3">
                                    {achievementNotification.achievement?.description}
                                </p>
                                <div className="flex items-center justify-center gap-2">
                                    <Coins className="h-5 w-5 text-yellow-500" />
                                    <span className="font-semibold text-yellow-600">
                                        +{achievementNotification.achievement?.points} điểm
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    onClick={() => {
                                        setAchievementNotification({ show: false, achievement: null })
                                        setActiveTab("achievements")
                                    }}
                                    className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                                >
                                    <Award className="h-4 w-4 mr-2" />
                                    Xem thành tựu
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setAchievementNotification({ show: false, achievement: null })}
                                    className="flex-1"
                                >
                                    Đóng
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar - Mobile Overlay */}
                    <div
                        className={`
                        fixed inset-0 z-40 md:hidden bg-black/50 transition-opacity duration-200 ease-in-out
                        ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
                    `}
                        onClick={() => setSidebarOpen(false)}
                    />

                    {/* Sidebar */}
                    <div
                        className={`
                        fixed md:sticky top-0 left-0 z-50 md:z-0 h-screen md:h-auto w-64 md:w-64 
                        bg-white dark:bg-slate-900 shadow-lg md:shadow-none border-r border-slate-200 dark:border-slate-700
                        transform transition-transform duration-200 ease-in-out md:transform-none
                        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                    `}
                    >
                        <div className="flex items-center justify-between p-4 md:hidden">
                            <h2 className="font-bold text-lg text-slate-900 dark:text-white">Menu</h2>
                            <button
                                className="p-2 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-4">
                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                        <AvatarFallback className="bg-emerald-500 text-white">{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-white">{user.name}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                {sidebarItems.map((item) => (
                                    <button
                                        key={item.id}
                                        className={`
                                            w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left
                                            ${activeTab === item.id
                                                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium"
                                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                            }
                                        `}
                                        onClick={() => {
                                            setActiveTab(item.id)
                                            setSidebarOpen(false)
                                        }}
                                    >
                                        <item.icon
                                            className={`h-5 w-5 ${activeTab === item.id ? "text-emerald-600 dark:text-emerald-400" : ""}`}
                                        />
                                        {item.label}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                                <Button variant="outline" className="w-full justify-start" size="sm">
                                    <Share2 className="h-4 w-4 mr-2" />
                                    Chia sẻ tiến trình
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start mt-2 text-rose-600 dark:text-rose-400"
                                    size="sm"
                                    onClick={() => {
                                        // Clear any user session data
                                        localStorage.removeItem("user_session")
                                        localStorage.removeItem("auth_token")
                                        // Redirect to homepage
                                        window.location.href = "/"
                                    }}
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Đăng xuất
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Main Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-emerald-100 text-sm font-medium">Ngày không hút thuốc</p>
                                            <p className="text-3xl font-bold mt-1">{user.daysSmokeFreee}</p>
                                            <p className="text-emerald-100 text-xs mt-1">Streak hiện tại</p>
                                        </div>
                                        <div className="bg-white/20 rounded-full p-3">
                                            <Clock className="h-8 w-8" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-blue-100 text-sm font-medium">Điếu thuốc đã tránh</p>
                                            <p className="text-3xl font-bold mt-1">{user.cigarettesAvoided}</p>
                                            <p className="text-blue-100 text-xs mt-1">~10 điếu/ngày</p>
                                        </div>
                                        <div className="bg-white/20 rounded-full p-3">
                                            <Target className="h-8 w-8" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-purple-100 text-sm font-medium">Tiền tiết kiệm</p>
                                            <p className="text-3xl font-bold mt-1">{user.moneySaved}đ</p>
                                            <p className="text-purple-100 text-xs mt-1">~50.000đ/ngày</p>
                                        </div>
                                        <div className="bg-white/20 rounded-full p-3">
                                            <Coins className="h-8 w-8" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-rose-500 to-rose-600 text-white border-0 shadow-lg">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-rose-100 text-sm font-medium">Sức khỏe cải thiện</p>
                                            <p className="text-3xl font-bold mt-1">{user.healthImprovement}%</p>
                                            <p className="text-rose-100 text-xs mt-1">Tuyệt vời!</p>
                                        </div>
                                        <div className="bg-white/20 rounded-full p-3">
                                            <Heart className="h-8 w-8" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Tab Content */}
                        <div className="space-y-6">
                            {/* Overview Tab */}
                            {activeTab === "overview" && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Next Milestone */}
                                        <Card className="lg:col-span-2">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Target className="h-5 w-5 text-emerald-600" />
                                                    Cột mốc tiếp theo
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex items-center gap-6">
                                                    <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 rounded-full p-6">
                                                        <Trophy className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-xl font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
                                                            {user.nextMilestone.name}
                                                        </h3>
                                                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                                                            {user.nextMilestone.daysLeft} ngày nữa
                                                        </p>
                                                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                                                            Phần thưởng: {user.nextMilestone.reward}
                                                        </p>
                                                        <Progress
                                                            value={(user.daysSmokeFreee / (user.daysSmokeFreee + user.nextMilestone.daysLeft)) * 100}
                                                            className="h-3"
                                                        />
                                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                                                            {Math.round(
                                                                (user.daysSmokeFreee / (user.daysSmokeFreee + user.nextMilestone.daysLeft)) * 100,
                                                            )}
                                                            % hoàn thành
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Quick Actions */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Hành động nhanh</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    <Button className="w-full justify-start" variant="outline">
                                                        <Calendar className="h-4 w-4 mr-3" />
                                                        Cập nhật kế hoạch
                                                    </Button>
                                                    <Button className="w-full justify-start" variant="outline">
                                                        <BookOpen className="h-4 w-4 mr-3" />
                                                        Viết nhật ký
                                                    </Button>
                                                    <Button className="w-full justify-start" variant="outline">
                                                        <MessageCircle className="h-4 w-4 mr-3" />
                                                        Nhận hỗ trợ
                                                    </Button>
                                                    <Button className="w-full justify-start" variant="outline">
                                                        <Download className="h-4 w-4 mr-3" />
                                                        Xuất báo cáo
                                                    </Button>
                                                    <Button
                                                        className="w-full justify-start"
                                                        variant="outline"
                                                        onClick={() => {
                                                            // Simulate unlocking a random incomplete achievement
                                                            const incompleteAchievements = user.achievements.filter((a) => !a.completed)
                                                            if (incompleteAchievements.length > 0) {
                                                                const randomAchievement =
                                                                    incompleteAchievements[Math.floor(Math.random() * incompleteAchievements.length)]
                                                                setAchievementNotification({
                                                                    show: true,
                                                                    achievement: randomAchievement,
                                                                })
                                                            }
                                                        }}
                                                    >
                                                        <Trophy className="h-4 w-4 mr-3" />
                                                        Test Achievement
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Recent Activities */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center justify-between">
                                                <span>Hoạt động gần đây</span>
                                                <Button variant="outline" size="sm">
                                                    Xem tất cả
                                                </Button>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {user.recentActivities.map((activity, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                                                    >
                                                        <div
                                                            className={`rounded-full p-2 ${activity.type === "achievement"
                                                                    ? "bg-yellow-100 dark:bg-yellow-900"
                                                                    : activity.type === "milestone"
                                                                        ? "bg-green-100 dark:bg-green-900"
                                                                        : activity.type === "social"
                                                                            ? "bg-blue-100 dark:bg-blue-900"
                                                                            : "bg-purple-100 dark:bg-purple-900"
                                                                }`}
                                                        >
                                                            {activity.type === "achievement" && <Trophy className="h-4 w-4 text-yellow-600" />}
                                                            {activity.type === "milestone" && <Target className="h-4 w-4 text-green-600" />}
                                                            {activity.type === "social" && <Users className="h-4 w-4 text-blue-600" />}
                                                            {activity.type === "health" && <Heart className="h-4 w-4 text-purple-600" />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-medium text-slate-900 dark:text-white">{activity.message}</p>
                                                            <p className="text-sm text-slate-500 dark:text-slate-400">{activity.time}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {/* Progress Tab */}
                            {activeTab === "progress" && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Total Plan Days */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Tổng Số Ngày Theo Kế Hoạch</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-center mb-6">
                                                    <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-full p-8 inline-block mb-4">
                                                        <Calendar className="h-16 w-16 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <h3 className="text-4xl font-bold text-blue-700 dark:text-blue-400 mb-2">
                                                        {user.daysSmokeFreee * 3} ngày
                                                    </h3>
                                                    <p className="text-slate-600 dark:text-slate-400">
                                                        Tổng số ngày bạn đã thực hiện theo kế hoạch
                                                    </p>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                        <span className="font-medium text-slate-900 dark:text-white">Kế hoạch đã tạo</span>
                                                        <span className="text-blue-600 dark:text-blue-400 font-semibold">3 kế hoạch</span>
                                                    </div>
                                                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                        <span className="font-medium text-slate-900 dark:text-white">Kế hoạch hoàn thành</span>
                                                        <span className="text-green-600 dark:text-green-400 font-semibold">2 kế hoạch</span>
                                                    </div>
                                                    <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                                        <span className="font-medium text-slate-900 dark:text-white">Kế hoạch đang thực hiện</span>
                                                        <span className="text-orange-600 dark:text-orange-400 font-semibold">1 kế hoạch</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Highest Streak Achieved */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Streak Cao Nhất Đạt Được</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-center mb-6">
                                                    <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 rounded-full p-8 inline-block mb-4">
                                                        <Trophy className="h-16 w-16 text-emerald-600 dark:text-emerald-400" />
                                                    </div>
                                                    <h3 className="text-4xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">
                                                        {Math.max(user.daysSmokeFreee, 67)} ngày
                                                    </h3>
                                                    <p className="text-slate-600 dark:text-slate-400">Kỷ lục streak dài nhất của bạn</p>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                                        <span className="font-medium text-slate-900 dark:text-white">Streak hiện tại</span>
                                                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                                            {user.daysSmokeFreee} ngày
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                                        <span className="font-medium text-slate-900 dark:text-white">Lần thử lại</span>
                                                        <span className="text-yellow-600 dark:text-yellow-400 font-semibold">2 lần</span>
                                                    </div>
                                                    <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                                        <span className="font-medium text-slate-900 dark:text-white">Tỷ lệ thành công</span>
                                                        <span className="text-purple-600 dark:text-purple-400 font-semibold">85%</span>
                                                    </div>
                                                </div>

                                                <div className="mt-6">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                            Tiến độ đến kỷ lục mới
                                                        </span>
                                                        <span className="text-sm text-slate-500 dark:text-slate-400">
                                                            {user.daysSmokeFreee}/{Math.max(user.daysSmokeFreee, 67) + 10}
                                                        </span>
                                                    </div>
                                                    <Progress
                                                        value={(user.daysSmokeFreee / (Math.max(user.daysSmokeFreee, 67) + 10)) * 100}
                                                        className="h-3"
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            )}

                            {/* Achievements Tab */}
                            {activeTab === "achievements" && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Thành tựu của bạn</h2>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">
                                                <Filter className="h-4 w-4 mr-2" />
                                                Lọc
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Search className="h-4 w-4 mr-2" />
                                                Tìm kiếm
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Achievement Categories */}
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {user.achievementCategories.map((category) => (
                                            <Button key={category.id} variant="outline" size="sm" className="text-xs">
                                                {category.name} ({category.count})
                                            </Button>
                                        ))}
                                    </div>

                                    {/* Achievement Stats */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                        <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                                            <CardContent className="p-4 text-center">
                                                <Trophy className="h-8 w-8 mx-auto mb-2" />
                                                <p className="text-2xl font-bold">{user.achievements.filter((a) => a.completed).length}</p>
                                                <p className="text-sm opacity-90">Đã hoàn thành</p>
                                            </CardContent>
                                        </Card>
                                        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                                            <CardContent className="p-4 text-center">
                                                <Target className="h-8 w-8 mx-auto mb-2" />
                                                <p className="text-2xl font-bold">{user.achievements.filter((a) => !a.completed).length}</p>
                                                <p className="text-sm opacity-90">Chưa hoàn thành</p>
                                            </CardContent>
                                        </Card>
                                        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                                            <CardContent className="p-4 text-center">
                                                <Coins className="h-8 w-8 mx-auto mb-2" />
                                                <p className="text-2xl font-bold">
                                                    {user.achievements.filter((a) => a.completed).reduce((sum, a) => sum + a.points, 0)}
                                                </p>
                                                <p className="text-sm opacity-90">Tổng điểm</p>
                                            </CardContent>
                                        </Card>
                                        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                                            <CardContent className="p-4 text-center">
                                                <Award className="h-8 w-8 mx-auto mb-2" />
                                                <p className="text-2xl font-bold">
                                                    {Math.round(
                                                        (user.achievements.filter((a) => a.completed).length / user.achievements.length) * 100,
                                                    )}
                                                    %
                                                </p>
                                                <p className="text-sm opacity-90">Hoàn thành</p>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {user.achievements.map((achievement) => (
                                            <Card
                                                key={achievement.id}
                                                className={`relative ${achievement.completed
                                                        ? "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 border-emerald-200 dark:border-emerald-800"
                                                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                                    }`}
                                            >
                                                <CardContent className="p-6">
                                                    <div className="text-center">
                                                        {/* Category Badge */}
                                                        <div className="absolute top-2 right-2">
                                                            <Badge
                                                                variant="outline"
                                                                className={`text-xs ${achievement.category === "time"
                                                                        ? "border-blue-300 text-blue-600"
                                                                        : achievement.category === "saving"
                                                                            ? "border-green-300 text-green-600"
                                                                            : achievement.category === "health"
                                                                                ? "border-red-300 text-red-600"
                                                                                : achievement.category === "social"
                                                                                    ? "border-purple-300 text-purple-600"
                                                                                    : "border-gray-300 text-gray-600"
                                                                    }`}
                                                            >
                                                                {achievement.category === "time"
                                                                    ? "Thời gian"
                                                                    : achievement.category === "saving"
                                                                        ? "Tiết kiệm"
                                                                        : achievement.category === "health"
                                                                            ? "Sức khỏe"
                                                                            : achievement.category === "social"
                                                                                ? "Cộng đồng"
                                                                                : achievement.category === "resilience"
                                                                                    ? "Kiên cường"
                                                                                    : achievement.category === "special"
                                                                                        ? "Đặc biệt"
                                                                                        : achievement.category === "quantity"
                                                                                            ? "Số lượng"
                                                                                            : "Hàng ngày"}
                                                            </Badge>
                                                        </div>

                                                        <div
                                                            className={`rounded-full p-4 mb-4 inline-block ${achievement.completed
                                                                    ? "bg-emerald-100 dark:bg-emerald-900"
                                                                    : "bg-slate-100 dark:bg-slate-700"
                                                                }`}
                                                        >
                                                            <Award
                                                                className={`h-8 w-8 ${achievement.completed
                                                                        ? "text-emerald-600 dark:text-emerald-400"
                                                                        : "text-slate-400 dark:text-slate-500"
                                                                    }`}
                                                            />
                                                        </div>
                                                        <h3
                                                            className={`font-semibold mb-2 ${achievement.completed
                                                                    ? "text-emerald-700 dark:text-emerald-400"
                                                                    : "text-slate-500 dark:text-slate-400"
                                                                }`}
                                                        >
                                                            {achievement.name}
                                                        </h3>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{achievement.description}</p>
                                                        <div className="flex items-center justify-center gap-2 mb-3">
                                                            <Coins className="h-4 w-4 text-yellow-500" />
                                                            <span className="text-sm font-medium text-yellow-600">{achievement.points} điểm</span>
                                                        </div>
                                                        {achievement.completed ? (
                                                            <Badge
                                                                variant="secondary"
                                                                className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400"
                                                            >
                                                                Hoàn thành {achievement.date}
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="dark:border-slate-600 dark:text-slate-400">
                                                                Chưa hoàn thành
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </CardContent>

                                                {/* Progress indicator for incomplete achievements */}
                                                {!achievement.completed && achievement.daysRequired && (
                                                    <div className="absolute bottom-0 left-0 right-0 bg-slate-200 dark:bg-slate-700 h-1">
                                                        <div
                                                            className="bg-emerald-500 h-1 transition-all duration-300"
                                                            style={{
                                                                width: `${Math.min((user.daysSmokeFreee / achievement.daysRequired) * 100, 100)}%`,
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Health Tab */}
                            {activeTab === "health" && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Tổng quan sức khỏe</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-center mb-6">
                                                    <div className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-full p-8 inline-block mb-4">
                                                        <Heart className="h-16 w-16 text-green-600 dark:text-green-400" />
                                                    </div>
                                                    <h3 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">
                                                        Sức khỏe tuyệt vời!
                                                    </h3>
                                                    <p className="text-slate-600 dark:text-slate-400">
                                                        Cơ thể bạn đang phục hồi rất tốt sau khi bỏ hút thuốc
                                                    </p>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                        <span className="font-medium text-slate-900 dark:text-white">Nguy cơ ung thư phổi</span>
                                                        <span className="text-green-600 dark:text-green-400 font-semibold">-25%</span>
                                                    </div>
                                                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                        <span className="font-medium text-slate-900 dark:text-white">Chức năng phổi</span>
                                                        <span className="text-blue-600 dark:text-blue-400 font-semibold">+30%</span>
                                                    </div>
                                                    <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                                        <span className="font-medium text-slate-900 dark:text-white">Tuần hoàn máu</span>
                                                        <span className="text-purple-600 dark:text-purple-400 font-semibold">+45%</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Lịch sử sức khỏe</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    <div className="border-l-4 border-green-500 pl-4">
                                                        <h4 className="font-semibold text-slate-900 dark:text-white">Tuần 1-2</h4>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                                            Giảm ho, cải thiện hương vị và mùi
                                                        </p>
                                                    </div>
                                                    <div className="border-l-4 border-blue-500 pl-4">
                                                        <h4 className="font-semibold text-slate-900 dark:text-white">Tuần 3-4</h4>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">Tăng năng lượng, giảm khó thở</p>
                                                    </div>
                                                    <div className="border-l-4 border-purple-500 pl-4">
                                                        <h4 className="font-semibold text-slate-900 dark:text-white">Tháng 2-3</h4>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                                            Cải thiện tuần hoàn, giảm nguy cơ tim mạch
                                                        </p>
                                                    </div>
                                                    <div className="border-l-4 border-orange-500 pl-4">
                                                        <h4 className="font-semibold text-slate-900 dark:text-white">Tháng 6-12</h4>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                                            Phục hồi chức năng phổi đáng kể
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            )}

                            {/* Social Tab */}
                            {activeTab === "social" && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center justify-between">
                                                    <span>Bạn bè</span>
                                                    <Button size="sm">
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        Thêm bạn
                                                    </Button>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    {user.friends.map((friend, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="relative">
                                                                    <Avatar className="h-10 w-10">
                                                                        <AvatarImage src={friend.avatar || "/placeholder.svg"} alt={friend.name} />
                                                                        <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                                                                    </Avatar>
                                                                    <div
                                                                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800 ${friend.status === "online" ? "bg-green-500" : "bg-slate-400"
                                                                            }`}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-slate-900 dark:text-white">{friend.name}</p>
                                                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                                                        {friend.streak} ngày streak
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Button variant="outline" size="sm">
                                                                <MessageCircle className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Bảng xếp hạng</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                                                            1
                                                        </div>
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarFallback>LC</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1">
                                                            <p className="font-medium text-slate-900 dark:text-white">Lê Văn C</p>
                                                            <p className="text-sm text-slate-500 dark:text-slate-400">67 ngày</p>
                                                        </div>
                                                        <Trophy className="h-5 w-5 text-yellow-500" />
                                                    </div>

                                                    <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                                                            2
                                                        </div>
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1">
                                                            <p className="font-medium text-slate-900 dark:text-white">{user.name} (Bạn)</p>
                                                            <p className="text-sm text-slate-500 dark:text-slate-400">{user.daysSmokeFreee} ngày</p>
                                                        </div>
                                                        <Badge variant="secondary" className="dark:bg-slate-700 dark:text-slate-300">
                                                            Bạn
                                                        </Badge>
                                                    </div>

                                                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                        <div className="w-8 h-8 bg-slate-500 rounded-full flex items-center justify-center text-white font-bold">
                                                            3
                                                        </div>
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarFallback>TTB</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1">
                                                            <p className="font-medium text-slate-900 dark:text-white">Trần Thị B</p>
                                                            <p className="text-sm text-slate-500 dark:text-slate-400">32 ngày</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
