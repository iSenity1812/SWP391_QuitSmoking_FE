"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Trophy, Brain, Lightbulb, BookOpen, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useContentStats } from "@/hooks/useContentStats"

// Helper function to translate achievement types to Vietnamese
const getAchievementTypeLabel = (type: string): string => {
    const typeMap: Record<string, string> = {
        'DAYS_QUIT': 'Chuỗi ngày không hút',
        'MONEY_SAVED': 'Tiết kiệm tiền',
        'CIGARETTES_NOT_SMOKED': 'Điếu thuốc tránh được',
        'CRAVING_RESISTED': 'Chống cơn thèm',
        'RESILIENCE': 'Kiên trì',
        'HEALTH': 'Sức khỏe',
        'SOCIAL': 'Xã hội',
        'SPECIAL': 'Đặc biệt',
        'DAILY': 'Hàng ngày',
        'MILESTONE': 'Cột mốc',
        'STREAK': 'Chuỗi thành tích',
        'PREMIUM': 'Cao cấp',
        'OTHER': 'Khác'
    }
    return typeMap[type] || type
}

// Helper function to translate program types to Vietnamese
const getProgramTypeLabel = (type: string): string => {
    const typeMap: Record<string, string> = {
        'EDUCATIONAL': 'Giáo dục',
        'SUPPORT': 'Hỗ trợ',
        'THERAPY': 'Trị liệu',
        'MEDITATION': 'Thiền định',
        'EXERCISE': 'Thể dục',
        'NUTRITION': 'Dinh dưỡng',
        'COUNSELING': 'Tư vấn',
        'GROUP_THERAPY': 'Trị liệu nhóm',
        'INDIVIDUAL_THERAPY': 'Trị liệu cá nhân',
        'WORKSHOP': 'Hội thảo',
        'WEBINAR': 'Hội thảo trực tuyến',
        'COURSE': 'Khóa học',
        'TRAINING': 'Đào tạo',
        'PREMIUM': 'Cao cấp',
        'FREE': 'Miễn phí',
        'OTHER': 'Khác'
    }
    return typeMap[type] || type
}

export function ContentDashboard() {
    const { stats, loading, error, refresh } = useContentStats()

    const mainStats = [
        {
            title: "Tổng Thành Tựu",
            value: stats.achievements.total.toString(),
            change: `${stats.achievements.active} hoạt động`,
            icon: Trophy,
            color: "text-yellow-500",
        },
        {
            title: "Tổng Bài Viết",
            value: stats.blogs.total.toString(),
            change: `${stats.blogs.pending} chờ duyệt`,
            icon: FileText,
            color: "text-blue-500",
        },
        {
            title: "Tổng Tips",
            value: stats.tips.total.toString(),
            change: "Mẹo hữu ích",
            icon: Lightbulb,
            color: "text-green-500",
        },
        {
            title: "Tổng Quiz",
            value: stats.quizzes.total.toString(),
            change: "Câu hỏi kiểm tra",
            icon: Brain,
            color: "text-purple-500",
        },
        {
            title: "Tổng Chương Trình",
            value: stats.programs.total.toString(),
            change: "Chương trình học",
            icon: BookOpen,
            color: "text-indigo-500",
        },
    ]

    const recentActivity = [
        {
            type: "blog",
            message: `${stats.blogs.pending} bài viết chờ duyệt`,
            description: "Cần xem xét và phê duyệt",
            status: "pending",
            priority: "high",
            count: stats.blogs.pending
        },
        {
            type: "blog",
            message: `${stats.blogs.rejected} bài viết đã từ chối`,
            description: "Có thể cần xem xét lại",
            status: "rejected",
            priority: "medium",
            count: stats.blogs.rejected
        },
        {
            type: "achievement",
            message: `${stats.achievements.total - stats.achievements.active} thành tựu không hoạt động`,
            description: "Cân nhắc kích hoạt hoặc xóa",
            status: "inactive",
            priority: "low",
            count: stats.achievements.total - stats.achievements.active
        },
        {
            type: "content",
            message: `${stats.tips.total + stats.quizzes.total} nội dung học tập`,
            description: "Tips và Quiz đang hoạt động tốt",
            status: "active",
            priority: "info",
            count: stats.tips.total + stats.quizzes.total
        },
    ].filter(item => item.count > 0) // Chỉ hiển thị những item có count > 0

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-400">Đang tải thống kê...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500 mb-4">{error}</p>
                <Button
                    onClick={refresh}
                    className="bg-blue-500 text-white hover:bg-blue-600"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Thử lại
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {mainStats.map((stat, index) => (
                    <Card key={index} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">{stat.title}</CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                            <p className="text-xs text-slate-600 dark:text-slate-400">{stat.change}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Activity */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-slate-900 dark:text-white">Cần Xử Lý</CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">
                        Các vấn đề và nhiệm vụ quan trọng cần được chú ý
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50"
                            >
                                <div className="flex items-center space-x-3">
                                    <div
                                        className={`w-3 h-3 rounded-full ${activity.priority === "high"
                                            ? "bg-red-500"
                                            : activity.priority === "medium"
                                                ? "bg-yellow-500"
                                                : activity.priority === "low"
                                                    ? "bg-orange-500"
                                                    : "bg-green-500"
                                            }`}
                                    />
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-white">{activity.message}</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{activity.description}</p>
                                    </div>
                                </div>
                                <Badge
                                    variant={
                                        activity.priority === "high"
                                            ? "destructive"
                                            : activity.priority === "medium"
                                                ? "secondary"
                                                : activity.priority === "low"
                                                    ? "outline"
                                                    : "default"
                                    }
                                >
                                    {activity.priority === "high"
                                        ? "Ưu tiên cao"
                                        : activity.priority === "medium"
                                            ? "Ưu tiên trung bình"
                                            : activity.priority === "low"
                                                ? "Ưu tiên thấp"
                                                : "Thông tin"}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Blog Status Breakdown */}
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-white">
                            <FileText className="w-5 h-5 text-blue-500" />
                            <span>Trạng Thái Bài Viết</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Đã xuất bản</span>
                                <span className="text-sm font-medium text-green-600">{stats.blogs.published}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Chờ duyệt</span>
                                <span className="text-sm font-medium text-yellow-600">{stats.blogs.pending}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Đã từ chối</span>
                                <span className="text-sm font-medium text-red-600">{stats.blogs.rejected}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Achievement Types */}
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-white">
                            <Trophy className="w-5 h-5 text-yellow-500" />
                            <span>Loại Thành Tựu</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {Object.entries(stats.achievements.byType).slice(0, 4).map(([type, count]) => (
                                <div key={type} className="flex justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">
                                        {getAchievementTypeLabel(type)}
                                    </span>
                                    <span className="text-sm font-medium text-slate-900 dark:text-white">{count}</span>
                                </div>
                            ))}
                            {Object.keys(stats.achievements.byType).length === 0 && (
                                <p className="text-sm text-slate-500">Chưa có thành tựu nào</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Program Types */}
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-white">
                            <BookOpen className="w-5 h-5 text-indigo-500" />
                            <span>Loại Chương Trình</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {Object.entries(stats.programs.byType).slice(0, 4).map(([type, count]) => (
                                <div key={type} className="flex justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">
                                        {getProgramTypeLabel(type)}
                                    </span>
                                    <span className="text-sm font-medium text-slate-900 dark:text-white">{count}</span>
                                </div>
                            ))}
                            {Object.keys(stats.programs.byType).length === 0 && (
                                <p className="text-sm text-slate-500">Chưa có chương trình nào</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
