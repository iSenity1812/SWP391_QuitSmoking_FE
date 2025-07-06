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
    AlertTriangle,
    Search,
    Eye,
    RefreshCw,
    MoreHorizontal,
    Clock,
    CheckCircle,
    XCircle,
    MessageSquare,
    Shield,
    UserX,
    AlertCircle,
} from "lucide-react"
import { getUserReports, getReportStats, updateUserReportStatus } from "../data/report-data"
import type { UserReport, ReportFilters } from "../types/report-types"

export function ReportsOverview() {
    const [reports, setReports] = useState<UserReport[]>([])
    const [filteredReports, setFilteredReports] = useState<UserReport[]>([])
    const [stats, setStats] = useState(getReportStats())
    const [loading, setLoading] = useState(true)
    const [selectedReport, setSelectedReport] = useState<UserReport | null>(null)
    const [actionDialogOpen, setActionDialogOpen] = useState(false)
    const [adminNote, setAdminNote] = useState("")
    const [actionType, setActionType] = useState<"investigating" | "resolved" | "dismissed">("investigating")

    const [filters, setFilters] = useState<ReportFilters>({
        status: "all",
        priority: "all", // This filter is still present in the state, but not used in UI
        search: "",
    })

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const reportsData = getUserReports()
                setReports(reportsData)
                setFilteredReports(reportsData)
            } catch (error) {
                console.error("Error fetching reports:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    useEffect(() => {
        // Apply filters, excluding priority as it's no longer displayed
        const filtered = getUserReports({
            status: filters.status,
            search: filters.search,
            priority: "all", // Always filter by all priorities since the UI element is removed
        })
        setFilteredReports(filtered)
    }, [filters])

    const handleFilterChange = (key: keyof ReportFilters, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }))
    }

    const handleStatusUpdate = async () => {
        if (!selectedReport) return

        const success = updateUserReportStatus(selectedReport.id, actionType, adminNote)
        if (success) {
            const updatedReports = getUserReports(filters)
            setFilteredReports(updatedReports)
            setStats(getReportStats())
            setActionDialogOpen(false)
            setAdminNote("")
            setSelectedReport(null)
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "resolved":
                return <CheckCircle className="w-4 h-4 text-green-500" />
            case "investigating":
                return <AlertCircle className="w-4 h-4 text-yellow-500" />
            case "dismissed":
                return <XCircle className="w-4 h-4 text-gray-500" />
            case "pending":
                return <Clock className="w-4 h-4 text-blue-500" />
            default:
                return <AlertTriangle className="w-4 h-4 text-red-500" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "resolved":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            case "investigating":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            case "dismissed":
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
            case "pending":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            default:
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
        }
    }

    // Removed getPriorityColor function as per user request
    // const getPriorityColor = (priority: string) => {
    //     switch (priority) {
    //         case "critical":
    //             return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    //         case "high":
    //             return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
    //         case "medium":
    //             return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    //         case "low":
    //             return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    //         default:
    //             return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    //     }
    // }

    const getReportReasonIcon = (reason: string) => {
        switch (reason.toLowerCase()) {
            case "spam":
                return <MessageSquare className="w-4 h-4" />
            case "quấy rối":
                return <UserX className="w-4 h-4" />
            case "lừa đảo":
                return <Shield className="w-4 h-4" />
            default:
                return <AlertTriangle className="w-4 h-4" />
        }
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
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="overview">Tổng Quan</TabsTrigger>
                    <TabsTrigger value="reports">Báo Cáo Người Dùng</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {" "}
                        {/* Changed grid-cols-4 to grid-cols-2 */}
                        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Tổng Báo Cáo</CardTitle>
                                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUserReports}</div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">{stats.reportsToday} báo cáo hôm nay</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Đã Giải Quyết</CardTitle>
                                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.resolvedUserReports}</div>
                                <p className="text-xs text-green-600 dark:text-green-400">
                                    {Math.round((stats.resolvedUserReports / stats.totalUserReports) * 100)}% tỷ lệ giải quyết
                                </p>
                            </CardContent>
                        </Card>

                    </div>

                    {/* Critical Reports */}
                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                <span>Báo Cáo Nghiêm Trọng</span>
                            </CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">
                                Các báo cáo cần xử lý ưu tiên
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {filteredReports
                                    .filter((report) => report.priority === "critical" || report.priority === "high")
                                    .slice(0, 5)
                                    .map((report) => (
                                        <div
                                            key={report.id}
                                            className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={report.reporterAvatar || "/placeholder.svg"} />
                                                    <AvatarFallback>{report.reporterName.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                                        {report.reporterName} báo cáo {report.reportedUserName}
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{report.reportReason}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {/* Removed priority badge here */}
                                                <Badge className={`${getStatusColor(report.status)} text-xs`}>{report.status}</Badge>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-gray-900 dark:text-gray-100">Hoạt Động Gần Đây</CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">
                                Các báo cáo mới nhất từ người dùng
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {filteredReports.slice(0, 5).map((report) => (
                                    <div
                                        key={report.id}
                                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center space-x-2">
                                                {getReportReasonIcon(report.reportReason)}
                                                {getStatusIcon(report.status)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                                    {report.reporterName} → {report.reportedUserName}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{report.reportReason}</p>
                                            </div>
                                        </div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(report.createdAt).toLocaleDateString("vi-VN")}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="reports" className="space-y-6">
                    {/* Filters */}

                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-gray-900 dark:text-gray-100">Bộ Lọc</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="search">Tìm kiếm</Label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input
                                            id="search"
                                            placeholder="Tên người dùng, lý do..."
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
                                        <option value="pending">Chờ xử lý</option>
                                        <option value="investigating">Đang điều tra</option>
                                        <option value="resolved">Đã giải quyết</option>
                                        <option value="dismissed">Đã bỏ qua</option>
                                    </select>
                                </div>

                                {/* Removed priority filter dropdown as per user request */}
                                {/* <div className="space-y-2">
                                    <Label htmlFor="priority">Mức độ ưu tiên</Label>
                                    <select
                                        id="priority"
                                        value={filters.priority}
                                        onChange={(e) => handleFilterChange("priority", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    >
                                        <option value="all">Tất cả</option>
                                        <option value="critical">Nghiêm trọng</option>
                                        <option value="high">Cao</option>
                                        <option value="medium">Trung bình</option>
                                        <option value="low">Thấp</option>
                                    </select>
                                </div> */}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Reports List */}
                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-gray-900 dark:text-gray-100">Danh Sách Báo Cáo</CardTitle>
                                    <CardDescription className="text-gray-600 dark:text-gray-400">
                                        Hiển thị {filteredReports.length} báo cáo
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {filteredReports.map((report) => (
                                    <div
                                        key={report.id}
                                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start space-x-4">
                                                <Avatar className="h-12 w-12">
                                                    <AvatarImage src={report.reporterAvatar || "/placeholder.svg"} />
                                                    <AvatarFallback>{report.reporterName.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{report.reporterName}</h3>
                                                        <span className="text-gray-500 dark:text-gray-400">báo cáo</span>
                                                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                                                            {report.reportedUserName}
                                                        </span>
                                                        <Badge variant="outline" className="text-xs">
                                                            {report.reportedUserType === "coach" ? "Coach" : "Người dùng"}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        {getReportReasonIcon(report.reportReason)}
                                                        <span className="font-medium text-gray-900 dark:text-gray-100">{report.reportReason}</span>
                                                        {/* Removed priority badge here */}
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{report.reportDescription}</p>
                                                    {report.evidence && report.evidence.length > 0 && (
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">Bằng chứng:</span>
                                                            {report.evidence.map((evidence, index) => (
                                                                <Badge key={index} variant="outline" className="text-xs">
                                                                    {evidence}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {report.adminNote && (
                                                        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
                                                            <span className="font-medium text-blue-700 dark:text-blue-300">Ghi chú admin:</span>
                                                            <p className="text-blue-600 dark:text-blue-400">{report.adminNote}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <div className="text-right">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        {getStatusIcon(report.status)}
                                                        <Badge className={`${getStatusColor(report.status)} text-xs`}>{report.status}</Badge>
                                                    </div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {new Date(report.createdAt).toLocaleDateString("vi-VN")}
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
                                                            onClick={() => setSelectedReport(report)}
                                                            className="flex items-center space-x-2"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                            <span>Xem chi tiết</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        {report.status === "pending" && (
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    setSelectedReport(report)
                                                                    setActionType("investigating")
                                                                    setActionDialogOpen(true)
                                                                }}
                                                                className="flex items-center space-x-2"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                                <span>Bắt đầu điều tra</span>
                                                            </DropdownMenuItem>
                                                        )}
                                                        {(report.status === "pending" || report.status === "investigating") && (
                                                            <>
                                                                <DropdownMenuItem
                                                                    onClick={() => {
                                                                        setSelectedReport(report)
                                                                        setActionType("resolved")
                                                                        setActionDialogOpen(true)
                                                                    }}
                                                                    className="flex items-center space-x-2"
                                                                >
                                                                    <CheckCircle className="w-4 h-4" />
                                                                    <span>Giải quyết</span>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => {
                                                                        setSelectedReport(report)
                                                                        setActionType("dismissed")
                                                                        setActionDialogOpen(true)
                                                                    }}
                                                                    className="flex items-center space-x-2"
                                                                >
                                                                    <XCircle className="w-4 h-4" />
                                                                    <span>Bỏ qua</span>
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Report Detail Dialog */}
            <Dialog open={!!selectedReport && !actionDialogOpen} onOpenChange={() => setSelectedReport(null)}>

                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Chi Tiết Báo Cáo</DialogTitle>
                        <DialogDescription>Thông tin chi tiết về báo cáo vi phạm</DialogDescription>
                    </DialogHeader>
                    {selectedReport && (

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">

                                <div>
                                    <Label className="text-sm font-medium">Người báo cáo</Label>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedReport.reporterName}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Người bị báo cáo</Label>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {selectedReport.reportedUserName} ({selectedReport.reportedUserType})
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Lý do</Label>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedReport.reportReason}</p>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium">Trạng thái</Label>
                                    <Badge className={`${getStatusColor(selectedReport.status)} text-xs`}>{selectedReport.status}</Badge>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Ngày tạo</Label>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {new Date(selectedReport.createdAt).toLocaleString("vi-VN")}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">Mô tả chi tiết</Label>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedReport.reportDescription}</p>
                            </div>
                            {selectedReport.evidence && selectedReport.evidence.length > 0 && (
                                <div>
                                    <Label className="text-sm font-medium">Bằng chứng</Label>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {selectedReport.evidence.map((evidence, index) => (
                                            <Badge key={index} variant="outline" className="text-xs">
                                                {evidence}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {selectedReport.adminNote && (
                                <div>
                                    <Label className="text-sm font-medium">Ghi chú admin</Label>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedReport.adminNote}</p>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Action Dialog */}
            <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>

                            {actionType === "resolved" && "Giải Quyết Báo Cáo"}
                            {actionType === "dismissed" && "Bỏ Qua Báo Cáo"}
                        </DialogTitle>
                        <DialogDescription>
                            {actionType === "resolved" && "Đánh dấu báo cáo đã được giải quyết"}
                            {actionType === "dismissed" && "Bỏ qua báo cáo này vì không có căn cứ"}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="adminNote">Ghi chú admin</Label>
                            <Textarea
                                id="adminNote"
                                placeholder="Nhập ghi chú về hành động này..."
                                value={adminNote}
                                onChange={(e) => setAdminNote(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleStatusUpdate} disabled={!adminNote.trim()}>
                            Xác Nhận
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
