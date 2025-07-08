"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Receipt,
    Search,
    Download,
    Eye,
    RefreshCw,
    MoreHorizontal,
    TrendingUp,
    DollarSign,
    AlertCircle,
    CheckCircle,
    Clock,
    XCircle,
    RotateCcw,
    X,
    Activity,
    Loader2,
} from "lucide-react"
import {
    getSubscriptionReceipts,
    getReceiptStats,
    updateReceiptStatus,
    processRefund,
    formatCurrency,
    getPaymentMethodLabel,
    getSubscriptionTypeLabel,
    getPaymentStatusLabel,
} from "../data/receipt-data"
import type { SubscriptionReceipt, ReceiptFilters } from "../types/receipt-types"
import { ChartContainer, LineChartComponent } from "@/components/ui/Chart"
import { useTheme } from "@/context/ThemeContext"
import { dashboardService } from "@/services/api/dashboardService"
import {
    transformRevenueData,
    calculateDateRange,
    generateFallbackData,
    formatCurrency as formatCurrencyUtil,
    calculateTotalRevenue
} from "@/utils/chartUtils"
import type { RevenueChartState } from "@/types/dashboard"

export function ReceiptManagement() {
    const [filteredReceipts, setFilteredReceipts] = useState<SubscriptionReceipt[]>([])
    const [stats, setStats] = useState(getReceiptStats())
    const [loading, setLoading] = useState(true)
    const [selectedReceipt, setSelectedReceipt] = useState<SubscriptionReceipt | null>(null)
    const [refundDialogOpen, setRefundDialogOpen] = useState(false)
    const [refundAmount, setRefundAmount] = useState("")
    const [refundReason, setRefundReason] = useState("")
    const { theme } = useTheme()

    // Revenue chart state with time period selection
    const [revenueChart, setRevenueChart] = useState<RevenueChartState>({
        data: [],
        loading: true,
        error: null,
        lastUpdated: null
    })

    // Chart time period selector
    const [chartPeriod, setChartPeriod] = useState<'DAY' | 'WEEK' | 'MONTH' | 'YEAR'>('MONTH')

    // Auto-refresh settings
    const [autoRefresh, setAutoRefresh] = useState(false)
    const [refreshInterval, setRefreshInterval] = useState(30) // seconds

    // Smart chart settings
    const [smartMode, setSmartMode] = useState(false) // Auto-adjust time period based on data
    const [adaptiveRefresh, setAdaptiveRefresh] = useState(false) // Adjust refresh based on activity

    const [filters, setFilters] = useState<ReceiptFilters>({
        status: "all",
        subscriptionType: "all",
        search: "",
    })

    // Fetch revenue data function
    const fetchRevenueData = useCallback(async () => {
        try {
            setRevenueChart(prev => ({ ...prev, loading: true, error: null }))

            const dateRange = calculateDateRange(chartPeriod)
            console.log(`📅 Fetching revenue data for ${chartPeriod} period:`, dateRange)

            const apiRevenueData = await dashboardService.getRevenueByPeriod({
                groupBy: chartPeriod,
                startDate: dateRange.startDate,
                endDate: dateRange.endDate
            })

            console.log('📊 Raw revenue API response:', apiRevenueData)

            let chartData = transformRevenueData(apiRevenueData, chartPeriod)
            console.log('🔄 Transformed revenue chart data:', chartData)

            // If we have very little data, supplement with fallback data
            if (chartData.length < 3) {
                console.log('⚠️ Limited data detected, supplementing with fallback data')
                const fallbackData = generateFallbackData(chartPeriod)

                // Merge real data with fallback data
                const mergedData = fallbackData.map(fallback => {
                    const realData = chartData.find(real => real.month === fallback.month)
                    return realData || fallback
                })

                chartData = mergedData
                console.log('🔄 Merged chart data:', chartData)
            }

            setRevenueChart({
                data: chartData,
                loading: false,
                error: null,
                lastUpdated: new Date()
            })

            // Update stats with real data
            const totalRevenue = calculateTotalRevenue(chartData)
            console.log('💰 Total revenue calculated:', totalRevenue)

        } catch (error) {
            console.error('❌ Error fetching revenue data:', error)

            setRevenueChart({
                data: [], // Use empty array instead of fallback data
                loading: false,
                error: error instanceof Error ? error.message : 'Lỗi không xác định',
                lastUpdated: null
            })
        }
    }, [chartPeriod])

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const receiptsData = getSubscriptionReceipts()
                setFilteredReceipts(receiptsData)
            } catch (error) {
                console.error("Error fetching receipts:", error)
            } finally {
                setLoading(false)
            }
        }

        // Fetch both receipt data and revenue data
        const fetchAllData = async () => {
            await Promise.all([
                fetchData(),
                fetchRevenueData()
            ])
        }

        fetchAllData()
    }, [fetchRevenueData])

    // Auto-refresh effect
    useEffect(() => {
        if (!autoRefresh) return

        console.log(`🔄 Auto-refresh enabled: ${refreshInterval}s interval`)
        const interval = setInterval(async () => {
            console.log('🔄 Auto-refreshing data...')
            await fetchRevenueData()
        }, refreshInterval * 1000)

        return () => {
            console.log('🔄 Auto-refresh disabled')
            clearInterval(interval)
        }
    }, [autoRefresh, refreshInterval, fetchRevenueData])

    // Chart period change effect
    useEffect(() => {
        console.log(`📊 Chart period changed to: ${chartPeriod}`)
        fetchRevenueData()
    }, [chartPeriod, fetchRevenueData])

    useEffect(() => {
        const filtered = getSubscriptionReceipts(filters)
        setFilteredReceipts(filtered)
    }, [filters])

    const handleFilterChange = (key: keyof ReceiptFilters, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }))
    }

    const handleStatusUpdate = async (receiptId: number, newStatus: string) => {
        const success = updateReceiptStatus(receiptId, newStatus)
        if (success) {
            const updatedReceipts = getSubscriptionReceipts(filters)
            setFilteredReceipts(updatedReceipts)
            setStats(getReceiptStats())
        }
    }

    const handleRefund = async () => {
        if (!selectedReceipt || !refundAmount || !refundReason) return

        const success = processRefund(selectedReceipt.id, Number.parseFloat(refundAmount), refundReason)
        if (success) {
            const updatedReceipts = getSubscriptionReceipts(filters)
            setFilteredReceipts(updatedReceipts)
            setStats(getReceiptStats())
            setRefundDialogOpen(false)
            setRefundAmount("")
            setRefundReason("")
            setSelectedReceipt(null)
        }
    }

    // Handle period change
    const handlePeriodChange = (newPeriod: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR') => {
        setChartPeriod(newPeriod)
    }

    // Handle auto-refresh toggle
    const handleAutoRefreshToggle = () => {
        setAutoRefresh(prev => !prev)
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed":
                return <CheckCircle className="w-4 h-4 text-green-500" />
            case "pending":
                return <Clock className="w-4 h-4 text-yellow-500" />
            case "failed":
                return <XCircle className="w-4 h-4 text-red-500" />
            case "refunded":
                return <RotateCcw className="w-4 h-4 text-blue-500" />
            default:
                return <AlertCircle className="w-4 h-4 text-gray-500" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            case "pending":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            case "failed":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            case "refunded":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
        }
    }

    const chartColors = {
        primary: theme === "dark" ? "#60a5fa" : "#3b82f6",
        success: theme === "dark" ? "#34d399" : "#10b981",
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-8 h-8 animate-spin text-gray-600 dark:text-gray-300" />
                <span className="ml-2 text-gray-600 dark:text-gray-300">Đang tải dữ liệu...</span>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Tổng Quan</TabsTrigger>
                    <TabsTrigger value="receipts">Danh Sách Hóa Đơn</TabsTrigger>
                    <TabsTrigger value="analytics">Phân Tích</TabsTrigger>
                    {/* Uncomment to show debug tab when needed */}
                    {/* <TabsTrigger value="debug">Debug</TabsTrigger> */}
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Tổng Doanh Thu</CardTitle>
                                <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {formatCurrency(stats.totalRevenue)}
                                </div>
                                <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                                    <TrendingUp className="w-3 h-3 mr-1" />+{stats.revenueGrowth}% so với tháng trước
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Tổng Hóa Đơn</CardTitle>
                                <Receipt className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalReceipts}</div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Trung bình: {formatCurrency(stats.averageTransactionValue)}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Thanh Toán Thành Công
                                </CardTitle>
                                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedPayments}</div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {Math.round((stats.completedPayments / stats.totalReceipts) * 100)}% tỷ lệ thành công
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Chờ Xử Lý</CardTitle>
                                <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingPayments}</div>
                                <p className="text-xs text-red-600 dark:text-red-400">{stats.failedPayments} thanh toán thất bại</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Revenue Chart with Controls */}
                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    <CardTitle className="text-gray-900 dark:text-gray-100">Doanh Thu Theo Thời Gian</CardTitle>
                                </div>

                                {/* Chart Controls */}
                                <div className="flex items-center space-x-4">
                                    {/* Time Period Selector */}
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Khoảng thời gian:</span>
                                        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                                            {(['DAY', 'WEEK', 'MONTH', 'YEAR'] as const).map((period) => (
                                                <button
                                                    key={period}
                                                    onClick={() => handlePeriodChange(period)}
                                                    className={`px-3 py-1 text-xs rounded-md transition-colors ${chartPeriod === period
                                                            ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                                                        }`}
                                                >
                                                    {period === 'DAY' ? 'Ngày' :
                                                        period === 'WEEK' ? 'Tuần' :
                                                            period === 'MONTH' ? 'Tháng' : 'Năm'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Auto-refresh Toggle */}
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={handleAutoRefreshToggle}
                                            className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-xs transition-colors ${autoRefresh
                                                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                                }`}
                                        >
                                            <Activity className="w-3 h-3" />
                                            <span>Tự động ({refreshInterval}s)</span>
                                        </button>
                                    </div>

                                    {/* Manual Refresh */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={fetchRevenueData}
                                        disabled={revenueChart.loading}
                                        className="h-8"
                                    >
                                        {revenueChart.loading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <RefreshCw className="w-4 h-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <CardDescription className="text-gray-600 dark:text-gray-400">
                                {revenueChart.loading ? 'Đang tải dữ liệu...' :
                                    revenueChart.error ? `Lỗi: ${revenueChart.error}` :
                                        `Dữ liệu doanh thu theo ${chartPeriod.toLowerCase()} - ${revenueChart.data.length} điểm dữ liệu - Cập nhật lần cuối: ${revenueChart.lastUpdated ? revenueChart.lastUpdated.toLocaleString('vi-VN') : 'Chưa có'
                                        }`}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {revenueChart.loading ? (
                                <div className="h-[300px] flex items-center justify-center">
                                    <div className="flex items-center space-x-2">
                                        <Loader2 className="w-6 h-6 animate-spin text-gray-600 dark:text-gray-300" />
                                        <span className="text-gray-600 dark:text-gray-300">Đang tải biểu đồ...</span>
                                    </div>
                                </div>
                            ) : revenueChart.error ? (
                                <div className="h-[300px] flex items-center justify-center">
                                    <div className="text-center">
                                        <AlertCircle className="w-8 h-8 mx-auto text-red-500 mb-2" />
                                        <p className="text-red-600 dark:text-red-400">Không thể tải dữ liệu biểu đồ</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{revenueChart.error}</p>
                                    </div>
                                </div>
                            ) : revenueChart.data.length === 0 ? (
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
                                            onClick={fetchRevenueData}
                                            className="mt-4"
                                        >
                                            <RefreshCw className="w-4 h-4 mr-2" />
                                            Thử lại
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Revenue Summary */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Tổng doanh thu</p>
                                            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                {formatCurrencyUtil(calculateTotalRevenue(revenueChart.data))}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Số kỳ có dữ liệu</p>
                                            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                {revenueChart.data.length}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Trung bình/kỳ</p>
                                            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                {formatCurrencyUtil(
                                                    revenueChart.data.length > 0
                                                        ? calculateTotalRevenue(revenueChart.data) / revenueChart.data.length
                                                        : 0
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Chart */}
                                    <ChartContainer className="h-[300px]">
                                        <LineChartComponent
                                            dataset={revenueChart.data}
                                            xAxis={[{
                                                scaleType: "point",
                                                dataKey: "month",
                                                tickLabelStyle: {
                                                    fontSize: 11,
                                                    angle: chartPeriod === 'DAY' ? -45 : 0
                                                }
                                            }]}
                                            series={[
                                                {
                                                    dataKey: "revenue",
                                                    label: `Doanh thu (VND) - ${chartPeriod}`,
                                                    color: chartColors.primary,
                                                    curve: "linear",
                                                    area: true,
                                                    showMark: true
                                                },
                                            ]}
                                            width={800}
                                            height={300}
                                            margin={{ top: 20, right: 30, left: 60, bottom: 60 }}
                                            slotProps={{
                                                legend: {
                                                    hidden: false,
                                                    position: {
                                                        vertical: 'top',
                                                        horizontal: 'left',
                                                    },
                                                }
                                            }}
                                        />
                                    </ChartContainer>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Receipts */}
                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-gray-900 dark:text-gray-100">Hóa Đơn Gần Đây</CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">
                                5 giao dịch thanh toán mới nhất
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {filteredReceipts.slice(0, 5).map((receipt) => (
                                    <div
                                        key={receipt.id}
                                        className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={receipt.userAvatar || "/placeholder.svg"} />
                                                <AvatarFallback>{receipt.userName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">{receipt.userName}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{receipt.subscriptionPlan}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(receipt.amount)}</p>
                                            <Badge className={`${getStatusColor(receipt.paymentStatus)} text-xs`}>
                                                {getPaymentStatusLabel(receipt.paymentStatus)}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="receipts" className="space-y-6">
                    {/* Filters */}
                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-gray-900 dark:text-gray-100">Bộ Lọc</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="search">Tìm kiếm</Label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input
                                            id="search"
                                            placeholder="Tên, email, mã hóa đơn..."
                                            value={filters.search}
                                            onChange={(e) => handleFilterChange("search", e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Trạng thái</Label>
                                    <select
                                        id="status"
                                        value={filters.status}
                                        onChange={(e) => handleFilterChange("status", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    >
                                        <option value="all">Tất cả</option>
                                        <option value="completed">Hoàn thành</option>
                                        <option value="pending">Chờ xử lý</option>
                                        <option value="failed">Thất bại</option>
                                        <option value="refunded">Đã hoàn tiền</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subscriptionType">Loại gói</Label>
                                    <select
                                        id="subscriptionType"
                                        value={filters.subscriptionType}
                                        onChange={(e) => handleFilterChange("subscriptionType", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    >
                                        <option value="all">Tất cả</option>
                                        <option value="basic">Cơ Bản</option>
                                        <option value="premium">Premium</option>
                                        <option value="pro">Pro</option>
                                    </select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Receipts List */}
                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-gray-900 dark:text-gray-100">Danh Sách Hóa Đơn</CardTitle>
                                    <CardDescription className="text-gray-600 dark:text-gray-400">
                                        Hiển thị {filteredReceipts.length} hóa đơn
                                    </CardDescription>
                                </div>
                                <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                                    <Download className="w-4 h-4" />
                                    <span>Xuất Excel</span>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {filteredReceipts.map((receipt) => (
                                    <div
                                        key={receipt.id}
                                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <Avatar className="h-12 w-12">
                                                    <AvatarImage src={receipt.userAvatar || "/placeholder.svg"} />
                                                    <AvatarFallback>{receipt.userName.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="flex items-center space-x-2">
                                                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{receipt.userName}</h3>
                                                        <Badge variant="outline" className="text-xs">
                                                            {getSubscriptionTypeLabel(receipt.subscriptionType)}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{receipt.userEmail}</p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{receipt.subscriptionPlan}</p>
                                                </div>
                                            </div>

                                            <div className="text-right space-y-2">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                                        {formatCurrency(receipt.amount)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    {getStatusIcon(receipt.paymentStatus)}
                                                    <Badge className={`${getStatusColor(receipt.paymentStatus)} text-xs`}>
                                                        {getPaymentStatusLabel(receipt.paymentStatus)}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {new Date(receipt.paymentDate).toLocaleDateString("vi-VN")}
                                                </p>
                                            </div>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                                    <DropdownMenuItem
                                                        onClick={() => setSelectedReceipt(receipt)}
                                                        className="flex items-center space-x-2"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        <span>Xem chi tiết</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    {receipt.paymentStatus === "pending" && (
                                                        <DropdownMenuItem
                                                            onClick={() => handleStatusUpdate(receipt.id, "completed")}
                                                            className="flex items-center space-x-2"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                            <span>Xác nhận thanh toán</span>
                                                        </DropdownMenuItem>
                                                    )}
                                                    {receipt.paymentStatus === "completed" && (
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setSelectedReceipt(receipt)
                                                                setRefundDialogOpen(true)
                                                            }}
                                                            className="flex items-center space-x-2"
                                                        >
                                                            <RotateCcw className="w-4 h-4" />
                                                            <span>Hoàn tiền</span>
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        {receipt.discount && (
                                            <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded text-sm">
                                                <span className="text-green-700 dark:text-green-300">
                                                    Giảm giá: {receipt.discount.code} -{" "}
                                                    {receipt.discount.type === "percentage"
                                                        ? `${receipt.discount.amount}%`
                                                        : formatCurrency(receipt.discount.amount)}
                                                </span>
                                            </div>
                                        )}

                                        {receipt.refundInfo && (
                                            <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
                                                <span className="text-blue-700 dark:text-blue-300">
                                                    Đã hoàn tiền {formatCurrency(receipt.refundInfo.refundAmount)} vào{" "}
                                                    {new Date(receipt.refundInfo.refundDate).toLocaleDateString("vi-VN")}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Uncomment Debug Tab when needed */}
                {/*
                <TabsContent value="debug" className="space-y-6">
                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-gray-900 dark:text-gray-100">Debug Information</CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">
                                Thông tin debug cho revenue chart
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Chart State</h4>
                                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-sm">
                                        <p><strong>Period:</strong> {chartPeriod}</p>
                                        <p><strong>Loading:</strong> {revenueChart.loading ? 'Yes' : 'No'}</p>
                                        <p><strong>Error:</strong> {revenueChart.error || 'None'}</p>
                                        <p><strong>Data Points:</strong> {revenueChart.data.length}</p>
                                        <p><strong>Last Updated:</strong> {revenueChart.lastUpdated?.toLocaleString('vi-VN') || 'Never'}</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Date Range</h4>
                                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-sm">
                                        {(() => {
                                            const dateRange = calculateDateRange(chartPeriod);
                                            return (
                                                <>
                                                    <p><strong>Start Date:</strong> {dateRange.startDate}</p>
                                                    <p><strong>End Date:</strong> {dateRange.endDate}</p>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Chart Data</h4>
                                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-sm max-h-60 overflow-y-auto">
                                    <pre className="whitespace-pre-wrap text-xs">
                                        {JSON.stringify(revenueChart.data, null, 2)}
                                    </pre>
                                </div>
                            </div>
                            
                            <div className="flex gap-2">
                                <Button 
                                    onClick={fetchRevenueData}
                                    disabled={revenueChart.loading}
                                    size="sm"
                                >
                                    {revenueChart.loading ? 'Loading...' : 'Refresh Data'}
                                </Button>
                                <Button 
                                    onClick={() => {
                                        const fallbackData = generateFallbackData(chartPeriod);
                                        setRevenueChart({
                                            data: fallbackData,
                                            loading: false,
                                            error: null,
                                            lastUpdated: new Date()
                                        });
                                    }}
                                    variant="outline"
                                    size="sm"
                                >
                                    Load Fallback Data
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                */}

                {/* Analytics Tab */}
                <TabsContent value="analytics" className="space-y-6">
                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-gray-900 dark:text-gray-100">Phân Tích Nâng Cao</CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">
                                Cài đặt biểu đồ và phân tích thông minh
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base">Cài Đặt Biểu Đồ</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="smart-mode" className="text-sm">
                                                Chế độ thông minh
                                            </Label>
                                            <input
                                                id="smart-mode"
                                                type="checkbox"
                                                checked={smartMode}
                                                onChange={(e) => setSmartMode(e.target.checked)}
                                                className="rounded"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="adaptive-refresh" className="text-sm">
                                                Tự động điều chỉnh refresh
                                            </Label>
                                            <input
                                                id="adaptive-refresh"
                                                type="checkbox"
                                                checked={adaptiveRefresh}
                                                onChange={(e) => setAdaptiveRefresh(e.target.checked)}
                                                className="rounded"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm">Khoảng thời gian refresh (giây)</Label>
                                            <Input
                                                type="number"
                                                value={refreshInterval}
                                                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                                                min="10"
                                                max="300"
                                                className="w-full"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base">Thống Kê Hiệu Suất</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Thời gian tải dữ liệu</span>
                                                <span className="font-mono">~1.2s</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Tần suất cập nhật</span>
                                                <span className="font-mono">{refreshInterval}s</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Kích thước dữ liệu</span>
                                                <span className="font-mono">{revenueChart.data.length} điểm</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Receipt Detail Dialog */}
            <Dialog open={!!selectedReceipt} onOpenChange={() => setSelectedReceipt(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader className="flex flex-row items-center justify-between">
                        <div>
                            <DialogTitle>Chi Tiết Hóa Đơn</DialogTitle>
                            <DialogDescription>Thông tin chi tiết về giao dịch thanh toán</DialogDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedReceipt(null)} className="h-8 w-8 p-0">
                            <X className="h-4 w-4" />
                        </Button>
                    </DialogHeader>
                    {selectedReceipt && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium">Mã hóa đơn</Label>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedReceipt.receiptNumber}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Mã giao dịch</Label>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedReceipt.transactionId}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Khách hàng</Label>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedReceipt.userName}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Email</Label>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedReceipt.userEmail}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Gói đăng ký</Label>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedReceipt.subscriptionPlan}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Phương thức thanh toán</Label>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {getPaymentMethodLabel(selectedReceipt.paymentMethod)}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Số tiền</Label>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{formatCurrency(selectedReceipt.amount)}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Trạng thái</Label>
                                    <Badge className={`${getStatusColor(selectedReceipt.paymentStatus)} text-xs`}>
                                        {getPaymentStatusLabel(selectedReceipt.paymentStatus)}
                                    </Badge>
                                </div>
                            </div>
                            {selectedReceipt.notes && (
                                <div>
                                    <Label className="text-sm font-medium">Ghi chú</Label>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedReceipt.notes}</p>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Refund Dialog */}
            <Dialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
                <DialogContent>
                    <DialogHeader className="flex flex-row items-center justify-between">
                        <div>
                            <DialogTitle>Hoàn Tiền</DialogTitle>
                            <DialogDescription>Xử lý hoàn tiền cho khách hàng</DialogDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setRefundDialogOpen(false)} className="h-8 w-8 p-0">
                            <X className="h-4 w-4" />
                        </Button>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="refundAmount">Số tiền hoàn</Label>
                            <Input
                                id="refundAmount"
                                type="number"
                                placeholder="Nhập số tiền hoàn..."
                                value={refundAmount}
                                onChange={(e) => setRefundAmount(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="refundReason">Lý do hoàn tiền</Label>
                            <Textarea
                                id="refundReason"
                                placeholder="Nhập lý do hoàn tiền..."
                                value={refundReason}
                                onChange={(e) => setRefundReason(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRefundDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleRefund} disabled={!refundAmount || !refundReason}>
                            Xác Nhận Hoàn Tiền
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
