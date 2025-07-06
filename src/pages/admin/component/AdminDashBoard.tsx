"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { TrendingUp, Users, Calendar, Target, Clock, Star, Loader2, BarChart3, AlertCircle, RefreshCw, ChevronDown, DollarSign, Receipt } from "lucide-react"
import { adminService, type DashboardStats, type Activity, type SystemAlert } from "@/pages/admin/component/service/adminService"
import { ChartContainer, LineChartComponent } from "@/components/ui/Chart"
import { useTheme } from "@/context/ThemeContext"
import { formatCurrency } from "@/utils/chartUtils"
import type { PeriodType } from "@/types/dashboard"
import { useMultiPeriodRevenueData } from "@/hooks/useRevenueData"
import TransactionTable from "@/pages/admin/transactions/components/TransactionTable"
import { PlanAnalyticsDashboard } from "@/pages/admin/plans/components/PlanAnalyticsDashboard"

export function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [activities, setActivities] = useState<Activity[]>([])
    const [alerts, setAlerts] = useState<SystemAlert[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<string>('overview')
    const { theme } = useTheme()

    // Suppress unused variable warnings for future features
    console.log('Dashboard alerts count:', alerts.length)

    // Revenue chart state with React Query
    const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('MONTH')
    const {
        activeData: revenueChartData,
        isLoading: revenueLoading,
        error: revenueError,
        lastUpdated,
        refetch: refetchRevenue
    } = useMultiPeriodRevenueData(selectedPeriod)

    // Handle period change - instant switch with cached data
    const handlePeriodChange = (period: PeriodType) => {
        setSelectedPeriod(period)
        // No need to fetch - React Query handles this automatically
    }

    // Handle retry button click
    const handleRetry = () => {
        refetchRevenue()
    }

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true)
                const [statsData, activitiesData, alertsData] = await Promise.all([
                    adminService.getDashboardStats(),
                    adminService.getRecentActivities(5),
                    adminService.getSystemAlerts(),
                ])

                setStats(statsData)
                setActivities(activitiesData)
                setAlerts(alertsData)
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu dashboard:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()

        // Auto refresh every 30 seconds for dashboard data only
        const interval = setInterval(fetchDashboardData, 30000)
        return () => clearInterval(interval)
    }, []) // Revenue data is handled by React Query

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-gray-600 dark:text-gray-300" />
                <span className="ml-2 text-gray-600 dark:text-gray-300">Đang tải dữ liệu...</span>
            </div>
        )
    }

    if (!stats) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-300">Không thể tải dữ liệu dashboard</p>
                <Button onClick={() => window.location.reload()} className="mt-4">
                    Thử lại
                </Button>
            </div>
        )
    }

    // COMMENT: Fake data for demo charts - uncomment when needed for testing
    /*
    // Generate chart data
    const weeklyGrowthData = Array.from({ length: 7 }, (_, i) => ({
        day: `Ngày ${i + 1}`,
        users: Math.floor(Math.random() * 100) + 50,
        plans: Math.floor(Math.random() * 80) + 30,
        success: Math.floor(Math.random() * 60) + 20,
    }))

    const dailyActivityData = Array.from({ length: 24 }, (_, i) => ({
        hour: `${i}h`,
        activity: Math.floor(Math.random() * 200) + 50,
    }))

    // Generate monthly data for each metric
    const monthlyUsersData = Array.from({ length: 12 }, (_, i) => ({
        month: `T${i + 1}`,
        users: Math.floor(Math.random() * 500) + 200 + i * 50, // Growing trend
    }))

    const monthlyPlansData = Array.from({ length: 12 }, (_, i) => ({
        month: `T${i + 1}`,
        plans: Math.floor(Math.random() * 200) + 80 + i * 20, // Growing trend
    }))

    const monthlySuccessData = Array.from({ length: 12 }, (_, i) => ({
        month: `T${i + 1}`,
        rate: Math.floor(Math.random() * 15) + 65 + i * 1, // Improving trend
    }))
    */

    // Empty data arrays - replace with real API data when available
    const weeklyGrowthData: Array<{ day: string, users: number, plans: number, success: number }> = []
    const dailyActivityData: Array<{ hour: string, activity: number }> = []
    const monthlyUsersData: Array<{ month: string, users: number }> = []
    const monthlyPlansData: Array<{ month: string, plans: number }> = []
    const monthlySuccessData: Array<{ month: string, rate: number }> = []

    // Clean console logging for production
    if (revenueError) {
        console.log('⚠️ Revenue chart error:', revenueError)
    }

    // Theme-aware colors
    const chartColors = {
        primary: theme === "dark" ? "#60a5fa" : "#3b82f6",
        success: theme === "dark" ? "#34d399" : "#10b981",
        warning: theme === "dark" ? "#fbbf24" : "#f59e0b",
        purple: theme === "dark" ? "#a78bfa" : "#8b5cf6",
        red: theme === "dark" ? "#f87171" : "#ef4444",
    }

    return (
        <div className="space-y-6">
            {/* Dashboard Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview" className="flex items-center space-x-2">
                        <BarChart3 className="w-4 h-4" />
                        <span>Tổng quan</span>
                    </TabsTrigger>
                    <TabsTrigger value="transactions" className="flex items-center space-x-2">
                        <Receipt className="w-4 h-4" />
                        <span>Giao dịch</span>
                    </TabsTrigger>
                    <TabsTrigger value="plans" className="flex items-center space-x-2">
                        <Target className="w-4 h-4" />
                        <span>Phân tích gói</span>
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4" />
                        <span>Phân tích</span>
                    </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    {/* Monthly Metrics Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Total Users Chart */}
                        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    <span>Tổng Người Dùng Theo Tháng</span>
                                </CardTitle>
                                <CardDescription className="text-gray-600 dark:text-gray-400">
                                    {monthlyUsersData.length === 0 ?
                                        'Chưa có dữ liệu người dùng' :
                                        `Tổng năm 2024: ${monthlyUsersData.reduce((sum, item) => sum + item.users, 0).toLocaleString()} người dùng`
                                    }
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {monthlyUsersData.length === 0 ? (
                                    <div className="h-[300px] flex items-center justify-center">
                                        <div className="text-center">
                                            <Users className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                            <p className="text-gray-600 dark:text-gray-400">Không có dữ liệu người dùng</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                Dữ liệu sẽ được hiển thị khi có API tích hợp
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <ChartContainer className="h-[300px]">
                                        <LineChartComponent
                                            dataset={monthlyUsersData}
                                            xAxis={[{ scaleType: "point", dataKey: "month" }]}
                                            series={[{ dataKey: "users", label: "Người dùng", color: chartColors.primary }]}
                                            width={500}
                                            height={300}
                                        />
                                    </ChartContainer>
                                )}
                            </CardContent>
                        </Card>

                        {/* Active Plans Chart */}
                        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                                    <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    <span>Kế Hoạch Hoạt Động Theo Tháng</span>
                                </CardTitle>
                                <CardDescription className="text-gray-600 dark:text-gray-400">
                                    {monthlyPlansData.length === 0 ?
                                        'Chưa có dữ liệu kế hoạch' :
                                        `Tổng năm 2024: ${monthlyPlansData.reduce((sum, item) => sum + item.plans, 0).toLocaleString()} kế hoạch`
                                    }
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {monthlyPlansData.length === 0 ? (
                                    <div className="h-[300px] flex items-center justify-center">
                                        <div className="text-center">
                                            <Target className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                            <p className="text-gray-600 dark:text-gray-400">Không có dữ liệu kế hoạch</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                Dữ liệu sẽ được hiển thị khi có API tích hợp
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <ChartContainer className="h-[300px]">
                                        <LineChartComponent
                                            dataset={monthlyPlansData}
                                            xAxis={[{ scaleType: "point", dataKey: "month" }]}
                                            series={[{ dataKey: "plans", label: "Kế hoạch", color: chartColors.success }]}
                                            width={500}
                                            height={300}
                                        />
                                    </ChartContainer>
                                )}
                            </CardContent>
                        </Card>

                        {/* Success Rate Chart */}
                        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                                    <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    <span>Tỷ Lệ Thành Công Theo Tháng</span>
                                </CardTitle>
                                <CardDescription className="text-gray-600 dark:text-gray-400">
                                    {monthlySuccessData.length === 0 ?
                                        'Chưa có dữ liệu tỷ lệ thành công' :
                                        `Trung bình năm 2024: ${Math.round(monthlySuccessData.reduce((sum, item) => sum + item.rate, 0) / 12)}%`
                                    }
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {monthlySuccessData.length === 0 ? (
                                    <div className="h-[300px] flex items-center justify-center">
                                        <div className="text-center">
                                            <TrendingUp className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                            <p className="text-gray-600 dark:text-gray-400">Không có dữ liệu tỷ lệ thành công</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                Dữ liệu sẽ được hiển thị khi có API tích hợp
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <ChartContainer className="h-[300px]">
                                        <LineChartComponent
                                            dataset={monthlySuccessData}
                                            xAxis={[{ scaleType: "point", dataKey: "month" }]}
                                            series={[{ dataKey: "rate", label: "Tỷ lệ (%)", color: chartColors.purple }]}
                                            width={500}
                                            height={300}
                                        />
                                    </ChartContainer>
                                )}
                            </CardContent>
                        </Card>

                        {/* Revenue Chart */}
                        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                                        <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                        <span>Doanh Thu Theo Kỳ</span>
                                        {revenueLoading && (
                                            <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                                        )}
                                    </CardTitle>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                {selectedPeriod === 'DAY' ? 'Theo ngày' :
                                                    selectedPeriod === 'WEEK' ? 'Theo tuần' :
                                                        selectedPeriod === 'MONTH' ? 'Theo tháng' : 'Theo năm'}
                                                <ChevronDown className="ml-2 w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handlePeriodChange('DAY')}>
                                                Theo ngày
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handlePeriodChange('WEEK')}>
                                                Theo tuần
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handlePeriodChange('MONTH')}>
                                                Theo tháng
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handlePeriodChange('YEAR')}>
                                                Theo năm
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <CardDescription className="text-gray-600 dark:text-gray-400">
                                    {revenueError ? (
                                        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>Lỗi: {revenueError.message || 'Lỗi không xác định'}</span>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={handleRetry}
                                                className="ml-2"
                                            >
                                                Thử lại
                                            </Button>
                                        </div>
                                    ) : (!revenueChartData || revenueChartData.length === 0) && !revenueLoading ? (
                                        <span className="text-gray-500">Chưa có dữ liệu doanh thu</span>
                                    ) : revenueChartData ? (
                                        <>
                                            Tổng doanh thu: {formatCurrency(revenueChartData.reduce((sum: number, item: { revenue: number }) => sum + item.revenue, 0))}
                                            {lastUpdated && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Cập nhật lần cuối: {new Date(lastUpdated).toLocaleTimeString('vi-VN')}
                                                </div>
                                            )}
                                        </>
                                    ) : null}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {revenueLoading ? (
                                    <div className="h-[300px] flex items-center justify-center">
                                        <div className="text-center">
                                            <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-500">Đang tải dữ liệu doanh thu...</p>
                                        </div>
                                    </div>
                                ) : revenueError ? (
                                    <div className="h-[300px] flex items-center justify-center">
                                        <div className="text-center">
                                            <AlertCircle className="w-8 h-8 mx-auto text-red-500 mb-2" />
                                            <p className="text-red-600 dark:text-red-400">Không thể tải dữ liệu biểu đồ</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{revenueError.message || 'Lỗi không xác định'}</p>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleRetry}
                                                className="mt-4"
                                            >
                                                <RefreshCw className="w-4 h-4 mr-2" />
                                                Thử lại
                                            </Button>
                                        </div>
                                    </div>
                                ) : !revenueChartData || revenueChartData.length === 0 ? (
                                    <div className="h-[300px] flex items-center justify-center">
                                        <div className="text-center">
                                            <TrendingUp className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                            <p className="text-gray-600 dark:text-gray-400">Không có dữ liệu doanh thu</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                Chưa có giao dịch nào trong khoảng thời gian này
                                            </p>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleRetry}
                                                className="mt-4"
                                            >
                                                <RefreshCw className="w-4 h-4 mr-2" />
                                                Thử lại
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <ChartContainer className="h-[300px]">
                                        <LineChartComponent
                                            dataset={revenueChartData}
                                            xAxis={[{ scaleType: "point", dataKey: "month" }]}
                                            series={[{ dataKey: "revenue", label: "Doanh thu (VNĐ)", color: chartColors.warning }]}
                                            width={500}
                                            height={300}
                                        />
                                    </ChartContainer>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Weekly Growth Chart */}
                        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                                    <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    <span>Tăng Trưởng Tuần</span>
                                </CardTitle>
                                <CardDescription className="text-gray-600 dark:text-gray-400">
                                    {weeklyGrowthData.length === 0 ?
                                        'Chưa có dữ liệu tăng trưởng tuần' :
                                        'Người dùng, kế hoạch và thành công theo ngày'
                                    }
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {weeklyGrowthData.length === 0 ? (
                                    <div className="h-[300px] flex items-center justify-center">
                                        <div className="text-center">
                                            <BarChart3 className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                            <p className="text-gray-600 dark:text-gray-400">Không có dữ liệu tăng trưởng</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                Dữ liệu sẽ được hiển thị khi có API tích hợp
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <ChartContainer className="h-[300px]">
                                        <LineChartComponent
                                            dataset={weeklyGrowthData}
                                            xAxis={[{ scaleType: "point", dataKey: "day" }]}
                                            series={[
                                                { dataKey: "users", label: "Người dùng", color: chartColors.primary },
                                                { dataKey: "plans", label: "Kế hoạch", color: chartColors.success },
                                                { dataKey: "success", label: "Thành công", color: chartColors.warning },
                                            ]}
                                            width={500}
                                            height={300}
                                        />
                                    </ChartContainer>
                                )}
                            </CardContent>
                        </Card>

                        {/* Daily Activity Chart */}
                        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                                    <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    <span>Hoạt Động Theo Giờ</span>
                                </CardTitle>
                                <CardDescription className="text-gray-600 dark:text-gray-400">
                                    {dailyActivityData.length === 0 ?
                                        'Chưa có dữ liệu hoạt động theo giờ' :
                                        'Phân bố hoạt động người dùng trong 24 giờ'
                                    }
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {dailyActivityData.length === 0 ? (
                                    <div className="h-[300px] flex items-center justify-center">
                                        <div className="text-center">
                                            <Clock className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                            <p className="text-gray-600 dark:text-gray-400">Không có dữ liệu hoạt động</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                Dữ liệu sẽ được hiển thị khi có API tích hợp
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <ChartContainer className="h-[300px]">
                                        <LineChartComponent
                                            dataset={dailyActivityData}
                                            xAxis={[{ scaleType: "point", dataKey: "hour" }]}
                                            series={[{ dataKey: "activity", label: "Hoạt động", color: chartColors.purple }]}
                                            width={800}
                                            height={300}
                                        />
                                    </ChartContainer>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Activity */}
                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                                <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                <span>Hoạt Động Gần Đây</span>
                            </CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">
                                Các hoạt động mới nhất của người dùng và hệ thống
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {activities.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div
                                                className={`w-3 h-3 rounded-full ${activity.type === "success"
                                                    ? "bg-green-500"
                                                    : activity.type === "warning"
                                                        ? "bg-yellow-500"
                                                        : activity.type === "error"
                                                            ? "bg-red-500"
                                                            : "bg-blue-500"
                                                    }`}
                                            />
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">{activity.user}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{activity.action}</p>
                                            </div>
                                        </div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-gray-900 dark:text-gray-100">Thao Tác Nhanh</CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">
                                Các tác vụ quản trị thường dùng
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Button
                                    variant="outline"
                                    className="h-20 flex flex-col space-y-2 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <Users className="w-6 h-6" />
                                    <span>Thêm Người Dùng</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-20 flex flex-col space-y-2 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <Calendar className="w-6 h-6" />
                                    <span>Tạo Kế Hoạch</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-20 flex flex-col space-y-2 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <Target className="w-6 h-6" />
                                    <span>Xem Báo Cáo</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-20 flex flex-col space-y-2 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <Star className="w-6 h-6" />
                                    <span>Gửi Thông Báo</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Transactions Tab */}
                <TabsContent value="transactions" className="space-y-6">
                    <TransactionTable />
                </TabsContent>

                {/* Plans Tab */}
                <TabsContent value="plans" className="space-y-6">
                    <PlanAnalyticsDashboard />
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                                    <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    <span>Phân tích chi tiết</span>
                                </CardTitle>
                                <CardDescription className="text-gray-600 dark:text-gray-400">
                                    Phân tích doanh thu và giao dịch chi tiết
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] flex items-center justify-center">
                                    <div className="text-center">
                                        <TrendingUp className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                        <p className="text-gray-600 dark:text-gray-400">Đang phát triển</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            Tính năng phân tích chi tiết sẽ có trong phiên bản tiếp theo
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
