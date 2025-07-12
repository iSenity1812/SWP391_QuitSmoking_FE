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
import { TrendingUp, Users, Target, Clock, Star, Loader2, BarChart3, AlertCircle, RefreshCw, ChevronDown, DollarSign, Receipt } from "lucide-react"
import { adminService, type DashboardStats, type SystemAlert } from "@/pages/admin/component/service/adminService"
import { ChartContainer, LineChartComponent, BarChartComponent } from "@/components/ui/Chart"
import { useTheme } from "@/context/ThemeContext"
import { formatCurrency } from "@/utils/chartUtils"
import type { PeriodType } from "@/types/dashboard"
import { useMultiPeriodRevenueData } from "@/hooks/useRevenueData"
import { useDailyUsersData } from "@/hooks/useDailyUsersData"
import { useDailyBlogsData } from "@/hooks/useDailyBlogsData"
import TransactionTable from "@/pages/admin/transactions/components/TransactionTable"
import { PlanAnalyticsDashboard } from "@/pages/admin/plans/components/PlanAnalyticsDashboard"

export function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
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

    // Users growth data
    const {
        data: dailyUsersData,
        isLoading: usersLoading,
        error: usersError,
        lastUpdated: usersLastUpdated,
        refetch: refetchUsers
    } = useDailyUsersData()

    // Blogs growth data
    const {
        data: dailyBlogsData,
        statusData: blogsStatusData,
        isLoading: blogsLoading,
        error: blogsError,
        lastUpdated: blogsLastUpdated,
        refetch: refetchBlogs
    } = useDailyBlogsData()

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
                const [statsData, alertsData] = await Promise.all([
                    adminService.getDashboardStats(),
                    adminService.getSystemAlerts(),
                ])

                setStats(statsData)
                setAlerts(alertsData)
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu dashboard:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

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
                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                        {/* Total Users Chart */}
                        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                                        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <span>Tổng Người Dùng Theo 14 Ngày Gần Nhất</span>
                                        {usersLoading && (
                                            <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                                        )}
                                    </CardTitle>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={refetchUsers}
                                        disabled={usersLoading}
                                    >
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Cập nhật
                                    </Button>
                                </div>
                                <CardDescription className="text-gray-600 dark:text-gray-400">
                                    {usersError ? (
                                        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>Lỗi: {usersError.message}</span>
                                        </div>
                                    ) : dailyUsersData.length === 0 && !usersLoading ? (
                                        'Chưa có dữ liệu người dùng'
                                    ) : dailyUsersData.length > 0 ? (
                                        <div>
                                            <span>Tổng hiện tại: {dailyUsersData[dailyUsersData.length - 1]?.users.toLocaleString()} người dùng</span>
                                            <br />
                                            <span className="text-sm">Người dùng mới hôm nay: {dailyUsersData[dailyUsersData.length - 1]?.newUsers.toLocaleString()}</span>
                                            {usersLastUpdated && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Cập nhật: {new Date(usersLastUpdated).toLocaleTimeString('vi-VN')} - {new Date(usersLastUpdated).toLocaleDateString('vi-VN')}
                                                </div>
                                            )}
                                        </div>
                                    ) : null}
                                </CardDescription>

                                {/* Users Statistics Cards */}
                                {dailyUsersData && dailyUsersData.length > 0 && !usersLoading && !usersError && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                                            <div className="flex items-center space-x-2">
                                                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Tổng Người Dùng</span>
                                            </div>
                                            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                                                {dailyUsersData[dailyUsersData.length - 1]?.users.toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                                            <div className="flex items-center space-x-2">
                                                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                                                <span className="text-sm font-medium text-green-800 dark:text-green-200">Hôm Nay</span>
                                            </div>
                                            <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
                                                +{dailyUsersData[dailyUsersData.length - 1]?.newUsers.toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                                            <div className="flex items-center space-x-2">
                                                <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                                <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Số Ngày</span>
                                            </div>
                                            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
                                                {dailyUsersData.length}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent>
                                {usersLoading ? (
                                    <div className="h-[300px] flex items-center justify-center">
                                        <div className="text-center">
                                            <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-500">Đang tải dữ liệu người dùng...</p>
                                        </div>
                                    </div>
                                ) : usersError ? (
                                    <div className="h-[300px] flex items-center justify-center">
                                        <div className="text-center">
                                            <AlertCircle className="w-8 h-8 mx-auto text-red-500 mb-2" />
                                            <p className="text-red-600 dark:text-red-400">Không thể tải dữ liệu người dùng</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{usersError.message}</p>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={refetchUsers}
                                                className="mt-4"
                                            >
                                                <RefreshCw className="w-4 h-4 mr-2" />
                                                Thử lại
                                            </Button>
                                        </div>
                                    </div>
                                ) : dailyUsersData.length === 0 ? (
                                    <div className="h-[300px] flex items-center justify-center">
                                        <div className="text-center">
                                            <Users className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                            <p className="text-gray-600 dark:text-gray-400">Không có dữ liệu người dùng</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                Dữ liệu sẽ được hiển thị khi có người dùng đăng ký
                                            </p>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={refetchUsers}
                                                className="mt-4"
                                            >
                                                <RefreshCw className="w-4 h-4 mr-2" />
                                                Thử lại
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <ChartContainer className="h-[400px]">
                                        <LineChartComponent
                                            dataset={dailyUsersData}
                                            xAxis={[{ scaleType: "point", dataKey: "day" }]}
                                            series={[{ dataKey: "users", label: "Tổng người dùng", color: chartColors.primary }]}
                                            width={800}
                                            height={400}
                                        />
                                    </ChartContainer>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Revenue Chart - Full Width */}
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

                            {/* Revenue Statistics Cards */}
                            {revenueChartData && revenueChartData.length > 0 && !revenueLoading && !revenueError && (
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                                    <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                                        <div className="flex items-center space-x-2">
                                            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                                            <span className="text-sm font-medium text-green-800 dark:text-green-200">Tổng Doanh Thu</span>
                                        </div>
                                        <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
                                            {formatCurrency(revenueChartData.reduce((sum: number, item: { revenue: number }) => sum + item.revenue, 0))}
                                        </p>
                                    </div>

                                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                                        <div className="flex items-center space-x-2">
                                            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Doanh Thu Trung Bình</span>
                                        </div>
                                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                                            {formatCurrency(revenueChartData.reduce((sum: number, item: { revenue: number }) => sum + item.revenue, 0) / revenueChartData.length)}
                                        </p>
                                    </div>

                                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                                        <div className="flex items-center space-x-2">
                                            <Star className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                            <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Cao Nhất</span>
                                        </div>
                                        <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
                                            {formatCurrency(Math.max(...revenueChartData.map((item: { revenue: number }) => item.revenue)))}
                                        </p>
                                    </div>

                                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
                                        <div className="flex items-center space-x-2">
                                            <BarChart3 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                            <span className="text-sm font-medium text-orange-800 dark:text-orange-200">Số Kỳ</span>
                                        </div>
                                        <p className="text-2xl font-bold text-orange-900 dark:text-orange-100 mt-1">
                                            {revenueChartData.length}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <CardDescription className="text-gray-600 dark:text-gray-400 mt-4">
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
                                ) : revenueChartData && lastUpdated ? (
                                    <div className="text-xs text-gray-500">
                                        Cập nhật lần cuối: {new Date(lastUpdated).toLocaleTimeString('vi-VN')} - {new Date(lastUpdated).toLocaleDateString('vi-VN')}
                                    </div>
                                ) : null}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {revenueLoading ? (
                                <div className="h-[400px] flex items-center justify-center">
                                    <div className="text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-500">Đang tải dữ liệu doanh thu...</p>
                                    </div>
                                </div>
                            ) : revenueError ? (
                                <div className="h-[400px] flex items-center justify-center">
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
                                <div className="h-[400px] flex items-center justify-center">
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
                                <ChartContainer className="h-[400px]">
                                    <LineChartComponent
                                        dataset={revenueChartData}
                                        xAxis={[{ scaleType: "point", dataKey: "month" }]}
                                        series={[{ dataKey: "revenue", label: "Doanh thu (VNĐ)", color: chartColors.warning }]}
                                        width={800}
                                        height={400}
                                    />
                                </ChartContainer>
                            )}
                        </CardContent>
                    </Card>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                        {/* Blog Analytics Chart */}
                        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                                        <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <span>Phân Tích Blog Theo 14 Ngày Gần Nhất</span>
                                        {blogsLoading && (
                                            <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                                        )}
                                    </CardTitle>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={refetchBlogs}
                                        disabled={blogsLoading}
                                    >
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Cập nhật
                                    </Button>
                                </div>
                                <CardDescription className="text-gray-600 dark:text-gray-400">
                                    {blogsError ? (
                                        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>Lỗi: {blogsError.message}</span>
                                        </div>
                                    ) : dailyBlogsData.length === 0 && !blogsLoading ? (
                                        'Chưa có dữ liệu blog'
                                    ) : dailyBlogsData.length > 0 ? (
                                        <div>
                                            <span>Tổng hiện tại: {dailyBlogsData[dailyBlogsData.length - 1]?.blogs.toLocaleString()} blog</span>
                                            <br />
                                            <span className="text-sm">Blog mới hôm nay: {dailyBlogsData[dailyBlogsData.length - 1]?.newBlogs.toLocaleString()}</span>
                                            {blogsLastUpdated && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Cập nhật: {new Date(blogsLastUpdated).toLocaleTimeString('vi-VN')} - {new Date(blogsLastUpdated).toLocaleDateString('vi-VN')}
                                                </div>
                                            )}
                                        </div>
                                    ) : null}
                                </CardDescription>

                                {/* Blogs Statistics Cards */}
                                {dailyBlogsData && dailyBlogsData.length > 0 && !blogsLoading && !blogsError && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                                            <div className="flex items-center space-x-2">
                                                <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Tổng Blog</span>
                                            </div>
                                            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                                                {dailyBlogsData[dailyBlogsData.length - 1]?.blogs.toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                                            <div className="flex items-center space-x-2">
                                                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                                                <span className="text-sm font-medium text-green-800 dark:text-green-200">Hôm Nay</span>
                                            </div>
                                            <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
                                                +{dailyBlogsData[dailyBlogsData.length - 1]?.newBlogs.toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                                            <div className="flex items-center space-x-2">
                                                <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                                <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Số Ngày</span>
                                            </div>
                                            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
                                                {dailyBlogsData.length}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent>
                                {blogsLoading ? (
                                    <div className="h-[300px] flex items-center justify-center">
                                        <div className="text-center">
                                            <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-500">Đang tải dữ liệu blog...</p>
                                        </div>
                                    </div>
                                ) : blogsError ? (
                                    <div className="h-[300px] flex items-center justify-center">
                                        <div className="text-center">
                                            <AlertCircle className="w-8 h-8 mx-auto text-red-500 mb-2" />
                                            <p className="text-red-600 dark:text-red-400">Không thể tải dữ liệu blog</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{blogsError.message}</p>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={refetchBlogs}
                                                className="mt-4"
                                            >
                                                <RefreshCw className="w-4 h-4 mr-2" />
                                                Thử lại
                                            </Button>
                                        </div>
                                    </div>
                                ) : dailyBlogsData.length === 0 ? (
                                    <div className="h-[300px] flex items-center justify-center">
                                        <div className="text-center">
                                            <Target className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                            <p className="text-gray-600 dark:text-gray-400">Không có dữ liệu blog</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                Dữ liệu sẽ được hiển thị khi có blog được tạo
                                            </p>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={refetchBlogs}
                                                className="mt-4"
                                            >
                                                <RefreshCw className="w-4 h-4 mr-2" />
                                                Thử lại
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <ChartContainer className="h-[400px]">
                                        <LineChartComponent
                                            dataset={dailyBlogsData.map(item => ({
                                                ...item,
                                                dayLabel: item.day.split(' ')[1]?.replace(/[()]/g, '') || item.day
                                            }))}
                                            xAxis={[{ scaleType: "point", dataKey: "dayLabel" }]}
                                            series={[{ dataKey: "blogs", label: "Tổng blog", color: chartColors.success }]}
                                        // width={700}
                                        // height={400}
                                        />
                                    </ChartContainer>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                                        <BarChart3 className="w-5 h-5 text-green-600 dark:text-green-400" />
                                        <span>Phân Bố Trạng Thái Blog</span>
                                        {blogsLoading && (
                                            <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                                        )}
                                    </CardTitle>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={refetchBlogs}
                                        disabled={blogsLoading}
                                    >
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Cập nhật
                                    </Button>
                                </div>
                                <CardDescription className="text-gray-600 dark:text-gray-400">
                                    {blogsError ? (
                                        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>Lỗi: {blogsError.message}</span>
                                        </div>
                                    ) : blogsStatusData && blogsStatusData.total > 0 ? (
                                        <div>
                                            <span>Tổng blog: {blogsStatusData.total.toLocaleString()}</span>
                                            {blogsLastUpdated && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Cập nhật: {new Date(blogsLastUpdated).toLocaleTimeString('vi-VN')} - {new Date(blogsLastUpdated).toLocaleDateString('vi-VN')}
                                                </div>
                                            )}
                                        </div>
                                    ) : 'Chưa có dữ liệu trạng thái blog'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {blogsLoading ? (
                                    <div className="h-[300px] flex items-center justify-center">
                                        <div className="text-center">
                                            <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-500">Đang tải dữ liệu trạng thái...</p>
                                        </div>
                                    </div>
                                ) : blogsError ? (
                                    <div className="h-[300px] flex items-center justify-center">
                                        <div className="text-center">
                                            <AlertCircle className="w-8 h-8 mx-auto text-red-500 mb-2" />
                                            <p className="text-red-600 dark:text-red-400">Không thể tải dữ liệu trạng thái</p>
                                        </div>
                                    </div>
                                ) : blogsStatusData && blogsStatusData.total > 0 ? (
                                    <div className="space-y-4">
                                        {/* Status Statistics */}
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="p-3 rounded-lg border bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
                                                <div className="text-sm font-medium text-green-800 dark:text-green-200">
                                                    Đã xuất bản
                                                </div>
                                                <div className="text-2xl font-bold mt-1 text-green-900 dark:text-green-100">
                                                    {blogsStatusData.published}
                                                </div>
                                            </div>

                                            <div className="p-3 rounded-lg border bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700">
                                                <div className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                                    Chờ duyệt
                                                </div>
                                                <div className="text-2xl font-bold mt-1 text-yellow-900 dark:text-yellow-100">
                                                    {blogsStatusData.pending}
                                                </div>
                                            </div>

                                            <div className="p-3 rounded-lg border bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700">
                                                <div className="text-sm font-medium text-red-800 dark:text-red-200">
                                                    Bị từ chối
                                                </div>
                                                <div className="text-2xl font-bold mt-1 text-red-900 dark:text-red-100">
                                                    {blogsStatusData.rejected}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bar Chart */}
                                        {(() => {
                                            return blogsStatusData &&
                                                typeof blogsStatusData.published === 'number' &&
                                                typeof blogsStatusData.pending === 'number' &&
                                                typeof blogsStatusData.rejected === 'number'
                                        })() ? (
                                            <ChartContainer className="h-[300px]">
                                                <BarChartComponent
                                                    data={[
                                                        {
                                                            label: 'Đã xuất bản',
                                                            value: blogsStatusData.published,
                                                            color: '#22c55e' // Green
                                                        },
                                                        {
                                                            label: 'Chờ duyệt',
                                                            value: blogsStatusData.pending,
                                                            color: '#eab308' // Yellow
                                                        },
                                                        {
                                                            label: 'Bị từ chối',
                                                            value: blogsStatusData.rejected,
                                                            color: '#ef4444' // Red
                                                        }
                                                    ]}
                                                    width={700}
                                                    height={400}
                                                />
                                            </ChartContainer>
                                        ) : (
                                            <div className="h-[300px] flex items-center justify-center">
                                                <div className="text-center">
                                                    <BarChart3 className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                                    <p className="text-gray-600 dark:text-gray-400">Dữ liệu chưa sẵn sàng</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                        Vui lòng đợi dữ liệu tải xong
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="h-[300px] flex items-center justify-center">
                                        <div className="text-center">
                                            <BarChart3 className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                            <p className="text-gray-600 dark:text-gray-400">Không có dữ liệu trạng thái</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
