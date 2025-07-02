"use client"

import { useState, useEffect } from "react"
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
    CreditCard,
    Banknote,
    Smartphone,
    Building2,
    MoreHorizontal,
    TrendingUp,
    DollarSign,
    AlertCircle,
    CheckCircle,
    Clock,
    XCircle,
    RotateCcw,
} from "lucide-react"
import {
    getSubscriptionReceipts,
    getReceiptStats,
    getRevenueData,
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

export function ReceiptManagement() {
    const [receipts, setReceipts] = useState<SubscriptionReceipt[]>([])
    const [filteredReceipts, setFilteredReceipts] = useState<SubscriptionReceipt[]>([])
    const [stats, setStats] = useState(getReceiptStats())
    const [revenueData, setRevenueData] = useState(getRevenueData())
    const [loading, setLoading] = useState(true)
    const [selectedReceipt, setSelectedReceipt] = useState<SubscriptionReceipt | null>(null)
    const [refundDialogOpen, setRefundDialogOpen] = useState(false)
    const [refundAmount, setRefundAmount] = useState("")
    const [refundReason, setRefundReason] = useState("")
    const { theme } = useTheme()

    const [filters, setFilters] = useState<ReceiptFilters>({
        status: "all",
        subscriptionType: "all",
        paymentMethod: "all",
        search: "",
    })

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const receiptsData = getSubscriptionReceipts()
                setReceipts(receiptsData)
                setFilteredReceipts(receiptsData)
            } catch (error) {
                console.error("Error fetching receipts:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

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

    const getPaymentMethodIcon = (method: string) => {
        switch (method) {
            case "credit_card":
                return <CreditCard className="w-4 h-4" />
            case "bank_transfer":
                return <Building2 className="w-4 h-4" />
            case "e_wallet":
                return <Smartphone className="w-4 h-4" />
            case "paypal":
                return <Banknote className="w-4 h-4" />
            default:
                return <DollarSign className="w-4 h-4" />
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

                    {/* Revenue Chart */}
                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                                <span>Doanh Thu Theo Tháng</span>
                            </CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">
                                Biểu đồ doanh thu và số lượng giao dịch 6 tháng gần nhất
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer className="h-[300px]">
                                <LineChartComponent
                                    dataset={revenueData}
                                    xAxis={[{ scaleType: "point", dataKey: "month" }]}
                                    series={[
                                        { dataKey: "revenue", label: "Doanh thu (VND)", color: chartColors.primary },
                                        { dataKey: "transactions", label: "Số giao dịch", color: chartColors.success },
                                    ]}
                                    width={800}
                                    height={300}
                                />
                            </ChartContainer>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

                                <div className="space-y-2">
                                    <Label htmlFor="paymentMethod">Phương thức</Label>
                                    <select
                                        id="paymentMethod"
                                        value={filters.paymentMethod}
                                        onChange={(e) => handleFilterChange("paymentMethod", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    >
                                        <option value="all">Tất cả</option>
                                        <option value="credit_card">Thẻ tín dụng</option>
                                        <option value="bank_transfer">Chuyển khoản</option>
                                        <option value="e_wallet">Ví điện tử</option>
                                        <option value="paypal">PayPal</option>
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
                                                    {getPaymentMethodIcon(receipt.paymentMethod)}
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

                <TabsContent value="analytics" className="space-y-6">
                    <div className="flex justify-center">
                        <div className="w-full max-w-md">
                            {/* Subscription Types */}
                            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-gray-900 dark:text-gray-100">Loại Gói Đăng Ký</CardTitle>
                                    <CardDescription className="text-gray-600 dark:text-gray-400">
                                        Phân bố theo loại gói subscription
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {[
                                            { type: "premium", label: "Premium", count: 52, percentage: 40, color: "bg-purple-600" },
                                            { type: "basic", label: "Cơ Bản", count: 45, percentage: 35, color: "bg-green-600" },
                                            { type: "pro", label: "Pro", count: 32, percentage: 25, color: "bg-blue-600" },
                                        ].map((item) => (
                                            <div key={item.type} className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-4 h-4 rounded ${item.color}`} />
                                                    <span className="text-gray-900 dark:text-gray-100">{item.label}</span>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                        <div
                                                            className={`${item.color} h-2 rounded-full`}
                                                            style={{ width: `${item.percentage}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">{item.count}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Receipt Detail Dialog */}
            <Dialog open={!!selectedReceipt} onOpenChange={() => setSelectedReceipt(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Chi Tiết Hóa Đơn</DialogTitle>
                        <DialogDescription>Thông tin chi tiết về giao dịch thanh toán</DialogDescription>
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
                    <DialogHeader>
                        <DialogTitle>Hoàn Tiền</DialogTitle>
                        <DialogDescription>Xử lý hoàn tiền cho khách hàng</DialogDescription>
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
