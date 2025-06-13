"use client"

import { useState } from "react"
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
    Star,
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
            { id: 1, name: "Tuần đầu tiên", completed: true, date: "22/04/2023", points: 100 },
            { id: 2, name: "Một tháng không hút thuốc", completed: true, date: "15/05/2023", points: 500 },
            { id: 3, name: "Ba tháng không hút thuốc", completed: false, points: 1000 },
            { id: 4, name: "Sáu tháng không hút thuốc", completed: false, points: 2000 },
            { id: 5, name: "Một năm không hút thuốc", completed: false, points: 5000 },
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
            { day: "T4", cigarettes: 0, mood: 7 },
            { day: "T5", cigarettes: 0, mood: 8 },
            { day: "T6", cigarettes: 0, mood: 9 },
            { day: "T7", cigarettes: 0, mood: 10 },
            { day: "CN", cigarettes: 0, mood: 9 },
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

    const sidebarItems = [
        { id: "overview", label: "Tổng quan", icon: LayoutDashboard },
        { id: "progress", label: "Tiến trình", icon: ChartBar },
        { id: "achievements", label: "Thành tựu", icon: Award },
        { id: "health", label: "Sức khỏe", icon: Heart },
        { id: "social", label: "Cộng đồng", icon: Users },
        { id: "analytics", label: "Phân tích", icon: Target },
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
                                <p className="text-slate-600 dark:text-slate-400">
                                    {user.daysSmokeFreee} ngày không hút thuốc • Cấp độ {user.level}
                                </p>
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

                                <div className="space-y-1 mb-6">
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Streak hiện tại</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                            {user.daysSmokeFreee}
                                        </span>
                                        <span className="text-sm text-slate-600 dark:text-slate-400">ngày</span>
                                    </div>
                                    <Progress value={user.daysSmokeFreee} max={50} className="h-2" />
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
                                <Button variant="outline" className="w-full justify-start mt-2" size="sm">
                                    <Settings className="h-4 w-4 mr-2" />
                                    Cài đặt tài khoản
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start mt-2 text-rose-600 dark:text-rose-400"
                                    size="sm"
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
                                        {/* Weekly Progress */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Tiến trình tuần này</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    {user.weeklyProgress.map((day, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                                                                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                                                        {day.day}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-slate-900 dark:text-white">0 điếu thuốc</p>
                                                                    <p className="text-sm text-slate-500 dark:text-slate-400">Tâm trạng: {day.mood}/10</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-1">
                                                                {Array.from({ length: day.mood }).map((_, i) => (
                                                                    <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Health Benefits */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Lợi ích sức khỏe</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    {user.healthBenefits.map((benefit, index) => (
                                                        <div key={index} className="space-y-2">
                                                            <div className="flex justify-between items-center">
                                                                <span className="font-medium text-slate-900 dark:text-white">{benefit.name}</span>
                                                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                                                    {benefit.improvement}%
                                                                </span>
                                                            </div>
                                                            <Progress value={benefit.improvement} className="h-2" />
                                                            <p className="text-sm text-slate-500 dark:text-slate-400">{benefit.description}</p>
                                                        </div>
                                                    ))}
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

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {user.achievements.map((achievement) => (
                                            <Card
                                                key={achievement.id}
                                                className={`${achievement.completed
                                                        ? "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 border-emerald-200 dark:border-emerald-800"
                                                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                                    }`}
                                            >
                                                <CardContent className="p-6">
                                                    <div className="text-center">
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
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{achievement.points} điểm</p>
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

                            {/* Analytics Tab */}
                            {activeTab === "analytics" && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Thống kê tổng quan</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                                            {user.daysSmokeFreee}
                                                        </p>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">Ngày không hút thuốc</p>
                                                    </div>
                                                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                            {user.cigarettesAvoided}
                                                        </p>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">Điếu thuốc đã tránh</p>
                                                    </div>
                                                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                                            {user.moneySaved}đ
                                                        </p>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">Tiền tiết kiệm</p>
                                                    </div>
                                                    <div className="text-center p-4 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
                                                        <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                                                            {user.healthImprovement}%
                                                        </p>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">Sức khỏe cải thiện</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Dự báo</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                                                        <h4 className="font-semibold text-green-700 dark:text-green-400">Trong 1 tháng tới</h4>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                                            Bạn sẽ tiết kiệm thêm 1.500.000đ
                                                        </p>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">Tránh được thêm 300 điếu thuốc</p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                                                        <h4 className="font-semibold text-blue-700 dark:text-blue-400">Trong 6 tháng tới</h4>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">Chức năng phổi cải thiện 50%</p>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">Nguy cơ tim mạch giảm 40%</p>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                                                        <h4 className="font-semibold text-purple-700 dark:text-purple-400">Trong 1 năm tới</h4>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                                            Tiết kiệm tổng cộng 18.000.000đ
                                                        </p>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">Nguy cơ ung thư phổi giảm 50%</p>
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
