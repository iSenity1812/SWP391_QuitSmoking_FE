"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
    TrendingUp,
    BarChart3,
    PieChart,
    Activity,
    Loader2,
    Users,
    CreditCard,
    Award,
    Download,
    RefreshCw,
    Filter,
    ChevronDown,
    Zap,
    Target,
    BarChart,
    Clock,
    Percent,
} from "lucide-react"
import { adminService } from "@/pages/admin/component/service/adminService"
import { ChartContainer, BarChart as BarChartComponent, PieChart as PieChartComponent } from "@/components/ui/Chart"
import { useTheme } from "@/context/ThemeContext"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface AnalyticsData {
    monthlyActiveUsers: number
    successRate: number
    monthlyRevenue: number
    averageSessionTime: number
    totalUsers: number
    activePlans: number
    userRetention: number
    premiumConversion: number
    monthlyData: Array<{
        month: string
        users: number
        plans: number
        revenue: number
    }>
    successMetrics: Array<{
        metric: string
        value: number
        target: number
        color: string
    }>
    userDemographics: Array<{
        age: string
        percentage: number
    }>
    deviceUsage: Array<{
        device: string
        percentage: number
    }>
}

export function AnalyticsSection() {
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [timeRange, setTimeRange] = useState("30days")
    const { theme } = useTheme()
    const [activeTab, setActiveTab] = useState("overview")

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true)
                const data = await adminService.getAnalyticsData(timeRange)
                setAnalyticsData(data)
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu phân tích:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchAnalytics()

        // Auto refresh every 5 minutes
        const interval = setInterval(fetchAnalytics, 300000)
        return () => clearInterval(interval)
    }, [timeRange])

    const chartColors = {
        primary: theme === "dark" ? "#60a5fa" : "#3b82f6",
        success: theme === "dark" ? "#34d399" : "#10b981",
        warning: theme === "dark" ? "#fbbf24" : "#f59e0b",
        purple: theme === "dark" ? "#a78bfa" : "#8b5cf6",
        red: theme === "dark" ? "#f87171" : "#ef4444",
        gray: theme === "dark" ? "#9ca3af" : "#6b7280",
        cyan: theme === "dark" ? "#22d3ee" : "#06b6d4",
        pink: theme === "dark" ? "#ec4899" : "#db2777",
    }

    const handleRefresh = async () => {
        setLoading(true)
        try {
            const data = await adminService.getAnalyticsData(timeRange)
            setAnalyticsData(data)
        } catch (error) {
            console.error("Lỗi khi tải lại dữ liệu:", error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-gray-900 dark:text-gray-100">Đang tải dữ liệu phân tích...</span>
            </div>
        )
    }

    if (!analyticsData) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-900 dark:text-gray-100">Không thể tải dữ liệu phân tích</p>
                <Button onClick={handleRefresh} variant="outline" className="mt-4">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Thử lại
                </Button>
            </div>
        )
    }

    const topPerformingContent = [
        {
            title: "10 Mẹo Cho Tuần Đầu Tiên",
            views: Math.floor(Math.random() * 5000) + 10000,
            engagement: Math.floor(Math.random() * 20) + 80,
        },
        {
            title: "Hiểu Về Cơn Thèm",
            views: Math.floor(Math.random() * 4000) + 8000,
            engagement: Math.floor(Math.random() * 15) + 70,
        },
        {
            title: "Lịch Trình Lợi Ích Sức Khỏe",
            views: Math.floor(Math.random() * 3000) + 7000,
            engagement: Math.floor(Math.random() * 18) + 75,
        },
        {
            title: "Đối Phó Với Cơn Thèm",
            views: Math.floor(Math.random() * 2500) + 6000,
            engagement: Math.floor(Math.random() * 12) + 65,
        },
    ]

    return (
        <div className="space-y-6">
            {/* Dashboard Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Phân Tích Dữ Liệu</h1>
                    <p className="text-gray-600 dark:text-gray-400">Theo dõi hiệu suất và xu hướng của nền tảng</p>
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="text-gray-900 dark:text-gray-100">
                                <Filter className="w-4 h-4 mr-2" />
                                {timeRange === "7days"
                                    ? "7 ngày qua"
                                    : timeRange === "30days"
                                        ? "30 ngày qua"
                                        : timeRange === "90days"
                                            ? "90 ngày qua"
                                            : "Tùy chỉnh"}
                                <ChevronDown className="w-4 h-4 ml-2" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800">
                            <DropdownMenuItem onClick={() => setTimeRange("7days")} className="text-gray-900 dark:text-gray-100">
                                7 ngày qua
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTimeRange("30days")} className="text-gray-900 dark:text-gray-100">
                                30 ngày qua
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTimeRange("90days")} className="text-gray-900 dark:text-gray-100">
                                90 ngày qua
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="outline" onClick={handleRefresh} className="text-gray-900 dark:text-gray-100">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Làm mới
                    </Button>
                    <Button variant="outline" className="text-gray-900 dark:text-gray-100">
                        <Download className="w-4 h-4 mr-2" />
                        Xuất báo cáo
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <Badge
                                variant="outline"
                                className="text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                            >
                                +12% so với tháng trước
                            </Badge>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng Người Dùng</h3>
                            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">2,847</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                                <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <Badge
                                variant="outline"
                                className="text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                            >
                                +8% so với tháng trước
                            </Badge>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Kế Hoạch Đang Hoạt Động</h3>
                            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">1,234</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                                <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <Badge
                                variant="outline"
                                className="text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                            >
                                +5% so với tháng trước
                            </Badge>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Tỷ Lệ Thành Công</h3>
                            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">73%</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full">
                                <CreditCard className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <Badge
                                variant="outline"
                                className="text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                            >
                                +15% so với tháng trước
                            </Badge>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Doanh Thu</h3>
                            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">$12,847</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Analytics Tabs */}
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 md:grid-cols-4 lg:w-[600px] mb-6 bg-gray-100 dark:bg-gray-800">
                    <TabsTrigger
                        value="overview"
                        className="text-gray-900 dark:text-gray-100 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                    >
                        Tổng quan
                    </TabsTrigger>
                    <TabsTrigger
                        value="performance"
                        className="text-gray-900 dark:text-gray-100 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                    >
                        Hiệu suất
                    </TabsTrigger>
                    <TabsTrigger
                        value="users"
                        className="text-gray-900 dark:text-gray-100 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                    >
                        Người dùng
                    </TabsTrigger>
                    <TabsTrigger
                        value="content"
                        className="text-gray-900 dark:text-gray-100 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                    >
                        Nội dung
                    </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    {/* Success Metrics */}
                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                                <BarChart3 className="w-5 h-5 text-green-600 dark:text-green-400" />
                                <span>Chỉ số hiệu suất chính</span>
                            </CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">
                                Các chỉ số hiệu suất chính và mục tiêu
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            Tỷ Lệ Thành Công 30 Ngày
                                        </span>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-900 dark:text-gray-100">78%</span>
                                            <Badge className="bg-green-500 dark:bg-green-600">
                                                <span className="text-white dark:text-white">Mục tiêu: 75%</span>
                                            </Badge>
                                        </div>
                                    </div>
                                    <Progress
                                        value={78}
                                        className="h-2"
                                        indicatorClassName="bg-gradient-to-r from-emerald-400 to-emerald-600 dark:from-emerald-500 dark:to-emerald-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Giữ Chân Người Dùng</span>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-900 dark:text-gray-100">65%</span>
                                            <Badge variant="secondary" className="bg-yellow-500 dark:bg-yellow-600">
                                                <span className="text-white dark:text-white">Mục tiêu: 70%</span>
                                            </Badge>
                                        </div>
                                    </div>
                                    <Progress
                                        value={65}
                                        className="h-2"
                                        indicatorClassName="bg-gradient-to-r from-amber-400 to-amber-600 dark:from-amber-500 dark:to-amber-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Hoàn Thành Kế Hoạch</span>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-900 dark:text-gray-100">84%</span>
                                            <Badge className="bg-green-500 dark:bg-green-600">
                                                <span className="text-white dark:text-white">Mục tiêu: 80%</span>
                                            </Badge>
                                        </div>
                                    </div>
                                    <Progress
                                        value={84}
                                        className="h-2"
                                        indicatorClassName="bg-gradient-to-r from-emerald-400 to-emerald-600 dark:from-emerald-500 dark:to-emerald-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Chuyển Đổi Premium</span>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-900 dark:text-gray-100">16%</span>
                                            <Badge variant="secondary" className="bg-yellow-500 dark:bg-yellow-600">
                                                <span className="text-white dark:text-white">Mục tiêu: 20%</span>
                                            </Badge>
                                        </div>
                                    </div>
                                    <Progress
                                        value={16}
                                        className="h-2"
                                        indicatorClassName="bg-gradient-to-r from-amber-400 to-amber-600 dark:from-amber-500 dark:to-amber-700"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Monthly Growth Chart */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    <span>Tăng Trưởng Hàng Tháng</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer className="h-[300px]">
                                    <BarChartComponent
                                        dataset={analyticsData.monthlyData}
                                        xAxis={[{ scaleType: "point", dataKey: "month" }]}
                                        series={[
                                            { dataKey: "users", label: "Người dùng", color: chartColors.primary },
                                            { dataKey: "plans", label: "Kế hoạch", color: chartColors.success },
                                            { dataKey: "revenue", label: "Doanh thu", color: chartColors.warning },
                                        ]}
                                        width={500}
                                        height={300}
                                        colors={theme === "dark" ? "dark" : "light"}
                                        slotProps={{
                                            legend: {
                                                labelStyle: {
                                                    fill: theme === "dark" ? "#e5e7eb" : "#1f2937",
                                                },
                                            },
                                            axisLabel: {
                                                style: {
                                                    fill: theme === "dark" ? "#e5e7eb" : "#1f2937",
                                                },
                                            },
                                        }}
                                    />
                                </ChartContainer>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                                    <PieChart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    <span>Nội Dung Hiệu Suất Cao</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer className="h-[300px]">
                                    <BarChartComponent
                                        dataset={topPerformingContent}
                                        xAxis={[{ scaleType: "point", dataKey: "title" }]}
                                        series={[
                                            { dataKey: "views", label: "Lượt xem", color: chartColors.purple },
                                            { dataKey: "engagement", label: "Tương tác (%)", color: chartColors.warning },
                                        ]}
                                        width={500}
                                        height={300}
                                        colors={theme === "dark" ? "dark" : "light"}
                                        slotProps={{
                                            legend: {
                                                labelStyle: {
                                                    fill: theme === "dark" ? "#e5e7eb" : "#1f2937",
                                                },
                                            },
                                            axisLabel: {
                                                style: {
                                                    fill: theme === "dark" ? "#e5e7eb" : "#1f2937",
                                                },
                                            },
                                        }}
                                    />
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* User Behavior Analytics */}
                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                                <Activity className="w-5 h-5 text-red-600 dark:text-red-400" />
                                <span>Thông Tin Hành Vi Người Dùng</span>
                            </CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">
                                Hiểu cách người dùng tương tác với nền tảng
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                    <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Giờ Cao Điểm</h3>
                                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">19-21h</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Thời gian hoạt động nhất</p>
                                </div>
                                <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                    <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Thời Gian Kế Hoạch Trung Bình</h3>
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        {Math.floor(Math.random() * 20) + 35} ngày
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Từ bắt đầu đến hoàn thành</p>
                                </div>
                                <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                    <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Yêu Cầu Hỗ Trợ</h3>
                                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                        {Math.floor(Math.random() * 8) + 8}%
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Của người dùng hoạt động</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Performance Tab */}
                <TabsContent value="performance" className="space-y-6">
                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                                <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                <span>Hiệu Suất Theo Thời Gian</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            Thời Gian Phản Hồi Trung Bình
                                        </span>
                                        <span className="text-sm text-gray-900 dark:text-gray-100">1.2s</span>
                                    </div>
                                    <Progress
                                        value={80}
                                        className="h-2"
                                        indicatorClassName="bg-gradient-to-r from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Tỷ Lệ Lỗi</span>
                                        <span className="text-sm text-gray-900 dark:text-gray-100">0.05%</span>
                                    </div>
                                    <Progress
                                        value={5}
                                        className="h-2"
                                        indicatorClassName="bg-gradient-to-r from-red-400 to-red-600 dark:from-red-500 dark:to-red-700"
                                    />
                                </div>
                            </div>

                            <ChartContainer className="h-[300px]">
                                <BarChartComponent
                                    dataset={[
                                        { day: "T2", load: 85, errors: 2 },
                                        { day: "T3", load: 78, errors: 1 },
                                        { day: "T4", load: 92, errors: 3 },
                                        { day: "T5", load: 88, errors: 2 },
                                        { day: "T6", load: 95, errors: 4 },
                                        { day: "T7", load: 65, errors: 1 },
                                        { day: "CN", load: 60, errors: 1 },
                                    ]}
                                    xAxis={[{ scaleType: "band", dataKey: "day" }]}
                                    series={[
                                        { dataKey: "load", label: "Tải hệ thống (%)", color: chartColors.primary },
                                        { dataKey: "errors", label: "Lỗi (%)", color: chartColors.red },
                                    ]}
                                    width={500}
                                    height={300}
                                    colors={theme === "dark" ? "dark" : "light"}
                                    slotProps={{
                                        legend: {
                                            labelStyle: {
                                                fill: theme === "dark" ? "#e5e7eb" : "#1f2937",
                                            },
                                        },
                                        axisLabel: {
                                            style: {
                                                fill: theme === "dark" ? "#e5e7eb" : "#1f2937",
                                            },
                                        },
                                    }}
                                />
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                                <Clock className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                                <span>Thời Gian Phản Hồi API</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">/api/users</span>
                                        <span className="text-sm text-gray-900 dark:text-gray-100">245ms</span>
                                    </div>
                                    <Progress
                                        value={24.5}
                                        className="h-2"
                                        indicatorClassName="bg-gradient-to-r from-green-400 to-green-600 dark:from-green-500 dark:to-green-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">/api/plans</span>
                                        <span className="text-sm text-gray-900 dark:text-gray-100">320ms</span>
                                    </div>
                                    <Progress
                                        value={32}
                                        className="h-2"
                                        indicatorClassName="bg-gradient-to-r from-green-400 to-green-600 dark:from-green-500 dark:to-green-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">/api/analytics</span>
                                        <span className="text-sm text-gray-900 dark:text-gray-100">580ms</span>
                                    </div>
                                    <Progress
                                        value={58}
                                        className="h-2"
                                        indicatorClassName="bg-gradient-to-r from-yellow-400 to-yellow-600 dark:from-yellow-500 dark:to-yellow-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">/api/content</span>
                                        <span className="text-sm text-gray-900 dark:text-gray-100">410ms</span>
                                    </div>
                                    <Progress
                                        value={41}
                                        className="h-2"
                                        indicatorClassName="bg-gradient-to-r from-yellow-400 to-yellow-600 dark:from-yellow-500 dark:to-yellow-700"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Users Tab */}
                <TabsContent value="users" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    <span>Phân Bố Độ Tuổi</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer className="h-[300px]">
                                    <PieChartComponent
                                        series={[
                                            {
                                                data: [
                                                    { id: 0, value: 15, label: "18-24" },
                                                    { id: 1, value: 35, label: "25-34" },
                                                    { id: 2, value: 25, label: "35-44" },
                                                    { id: 3, value: 15, label: "45-54" },
                                                    { id: 4, value: 10, label: "55+" },
                                                ],
                                                highlightScope: { faded: "global", highlighted: "item" },
                                                faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
                                                arcLabel: (item) => `${item.value}%`,
                                            },
                                        ]}
                                        height={300}
                                        width={500}
                                        colors={
                                            theme === "dark"
                                                ? ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa"]
                                                : ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]
                                        }
                                        slotProps={{
                                            legend: {
                                                labelStyle: {
                                                    fill: theme === "dark" ? "#e5e7eb" : "#1f2937",
                                                },
                                            },
                                        }}
                                    />
                                </ChartContainer>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                                    <Percent className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    <span>Tỷ Lệ Giữ Chân Người Dùng</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer className="h-[300px]">
                                    <BarChartComponent
                                        dataset={[
                                            { week: "Tuần 1", rate: 100 },
                                            { week: "Tuần 2", rate: 85 },
                                            { week: "Tuần 3", rate: 75 },
                                            { week: "Tuần 4", rate: 68 },
                                            { week: "Tuần 5", rate: 65 },
                                            { week: "Tuần 6", rate: 62 },
                                            { week: "Tuần 7", rate: 60 },
                                            { week: "Tuần 8", rate: 58 },
                                        ]}
                                        xAxis={[{ scaleType: "point", dataKey: "week" }]}
                                        series={[{ dataKey: "rate", label: "Tỷ lệ giữ chân (%)", color: chartColors.success }]}
                                        width={500}
                                        height={300}
                                        colors={theme === "dark" ? "dark" : "light"}
                                        slotProps={{
                                            legend: {
                                                labelStyle: {
                                                    fill: theme === "dark" ? "#e5e7eb" : "#1f2937",
                                                },
                                            },
                                            axisLabel: {
                                                style: {
                                                    fill: theme === "dark" ? "#e5e7eb" : "#1f2937",
                                                },
                                            },
                                        }}
                                    />
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                                <BarChart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                                <span>Hoạt Động Người Dùng</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer className="h-[300px]">
                                <BarChartComponent
                                    dataset={[
                                        { hour: "00:00", users: 120 },
                                        { hour: "03:00", users: 60 },
                                        { hour: "06:00", users: 180 },
                                        { hour: "09:00", users: 450 },
                                        { hour: "12:00", users: 320 },
                                        { hour: "15:00", users: 380 },
                                        { hour: "18:00", users: 520 },
                                        { hour: "21:00", users: 350 },
                                    ]}
                                    xAxis={[{ scaleType: "band", dataKey: "hour" }]}
                                    series={[{ dataKey: "users", label: "Người dùng hoạt động", color: chartColors.primary }]}
                                    width={500}
                                    height={300}
                                    colors={theme === "dark" ? "dark" : "light"}
                                    slotProps={{
                                        legend: {
                                            labelStyle: {
                                                fill: theme === "dark" ? "#e5e7eb" : "#1f2937",
                                            },
                                        },
                                        axisLabel: {
                                            style: {
                                                fill: theme === "dark" ? "#e5e7eb" : "#1f2937",
                                            },
                                        },
                                    }}
                                />
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Content Tab */}
                <TabsContent value="content" className="space-y-6">
                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                                <BarChart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                <span>Hiệu Suất Nội Dung</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {topPerformingContent.map((content, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{content.title}</span>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm text-gray-900 dark:text-gray-100">
                                                    {content.views.toLocaleString()} lượt xem
                                                </span>
                                                <Badge
                                                    className={
                                                        content.engagement > 75
                                                            ? "bg-green-500 dark:bg-green-600"
                                                            : "bg-yellow-500 dark:bg-yellow-600"
                                                    }
                                                >
                                                    <span className="text-white dark:text-white">{content.engagement}% tương tác</span>
                                                </Badge>
                                            </div>
                                        </div>
                                        <Progress
                                            value={content.engagement}
                                            className="h-2"
                                            indicatorClassName={
                                                content.engagement > 75
                                                    ? "bg-gradient-to-r from-emerald-400 to-emerald-600 dark:from-emerald-500 dark:to-emerald-700"
                                                    : "bg-gradient-to-r from-amber-400 to-amber-600 dark:from-amber-500 dark:to-amber-700"
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                                    <PieChart className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                                    <span>Phân Bố Loại Nội Dung</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer className="h-[300px]">
                                    <PieChartComponent
                                        series={[
                                            {
                                                data: [
                                                    { id: 0, value: 40, label: "Bài viết" },
                                                    { id: 1, value: 25, label: "Video" },
                                                    { id: 2, value: 20, label: "Infographic" },
                                                    { id: 3, value: 15, label: "Podcast" },
                                                ],
                                                highlightScope: { faded: "global", highlighted: "item" },
                                                faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
                                                arcLabel: (item) => `${item.value}%`,
                                            },
                                        ]}
                                        height={300}
                                        width={500}
                                        colors={
                                            theme === "dark"
                                                ? ["#60a5fa", "#34d399", "#fbbf24", "#f87171"]
                                                : ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]
                                        }
                                        slotProps={{
                                            legend: {
                                                labelStyle: {
                                                    fill: theme === "dark" ? "#e5e7eb" : "#1f2937",
                                                },
                                            },
                                        }}
                                    />
                                </ChartContainer>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                                    <Activity className="w-5 h-5 text-red-600 dark:text-red-400" />
                                    <span>Tương Tác Theo Thời Gian</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer className="h-[300px]">
                                    <BarChartComponent
                                        dataset={[
                                            { time: "00:00", engagement: 15 },
                                            { time: "03:00", engagement: 10 },
                                            { time: "06:00", engagement: 25 },
                                            { time: "09:00", engagement: 45 },
                                            { time: "12:00", engagement: 35 },
                                            { time: "15:00", engagement: 40 },
                                            { time: "18:00", engagement: 65 },
                                            { time: "21:00", engagement: 50 },
                                        ]}
                                        xAxis={[{ scaleType: "point", dataKey: "time" }]}
                                        series={[{ dataKey: "engagement", label: "Tỷ lệ tương tác (%)", color: chartColors.red }]}
                                        width={500}
                                        height={300}
                                        colors={theme === "dark" ? "dark" : "light"}
                                        slotProps={{
                                            legend: {
                                                labelStyle: {
                                                    fill: theme === "dark" ? "#e5e7eb" : "#1f2937",
                                                },
                                            },
                                            axisLabel: {
                                                style: {
                                                    fill: theme === "dark" ? "#e5e7eb" : "#1f2937",
                                                },
                                            },
                                        }}
                                    />
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
