"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
    Clock,
    User,
    Calendar,
    Phone,
    Video,
    MapPin,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Search,
    Users,
    Zap,
    MessageSquare,
    TrendingUp,
} from "lucide-react"
import { getConsultationRequests, getPendingConsultationRequests } from "../data/consultation-data"
import type { ConsultationRequest, ConsultationFilters } from "../types/consultation-types"

export function ConsultationRequests() {
    const [requests, setRequests] = useState<ConsultationRequest[]>(getConsultationRequests())
    const [selectedRequest, setSelectedRequest] = useState<ConsultationRequest | null>(null)
    const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false)
    const [responseType, setResponseType] = useState<"accept" | "reject">("accept")
    const [searchTerm, setSearchTerm] = useState("")
    const [filters, setFilters] = useState<ConsultationFilters>({
        status: "all",
        urgency: "all",
        type: "all",
        dateRange: "all",
    })

    const [responseForm, setResponseForm] = useState({
        scheduledDateTime: "",
        coachNotes: "",
        rejectionReason: "",
        alternativeSlots: [""],
    })

    const pendingRequests = getPendingConsultationRequests()

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case "emergency":
                return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
            case "high":
                return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
            case "medium":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
            case "low":
                return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
            case "accepted":
                return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
            case "rejected":
                return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
            case "completed":
                return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getMethodIcon = (method: string) => {
        switch (method) {
            case "phone":
                return <Phone className="w-4 h-4" />
            case "video":
                return <Video className="w-4 h-4" />
            case "in-person":
                return <MapPin className="w-4 h-4" />
            default:
                return <MessageSquare className="w-4 h-4" />
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "individual":
                return <User className="w-4 h-4" />
            case "group":
                return <Users className="w-4 h-4" />
            case "emergency":
                return <Zap className="w-4 h-4" />
            default:
                return <MessageSquare className="w-4 h-4" />
        }
    }

    const handleResponse = (request: ConsultationRequest, type: "accept" | "reject") => {
        setSelectedRequest(request)
        setResponseType(type)
        setResponseForm({
            scheduledDateTime: type === "accept" ? `${request.preferredDate}T${request.preferredTime}` : "",
            coachNotes: "",
            rejectionReason: "",
            alternativeSlots: [""],
        })
        setIsResponseDialogOpen(true)
    }

    const submitResponse = () => {
        if (!selectedRequest) return

        const updatedRequest: ConsultationRequest = {
            ...selectedRequest,
            status: responseType === "accept" ? "accepted" : "rejected",
            scheduledDateTime: responseType === "accept" ? responseForm.scheduledDateTime : undefined,
            coachNotes: responseForm.coachNotes,
            rejectionReason: responseType === "reject" ? responseForm.rejectionReason : undefined,
            updatedAt: new Date().toISOString(),
        }

        setRequests((prev) => prev.map((req) => (req.id === selectedRequest.id ? updatedRequest : req)))

        setIsResponseDialogOpen(false)
        setSelectedRequest(null)

        const action = responseType === "accept" ? "chấp nhận" : "từ chối"
        alert(`Đã ${action} yêu cầu tư vấn từ ${selectedRequest.memberName}`)
    }

    const filteredRequests = requests.filter((request) => {
        const matchesSearch =
            request.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.subject.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = filters.status === "all" || request.status === filters.status
        const matchesUrgency = filters.urgency === "all" || request.urgencyLevel === filters.urgency
        const matchesType = filters.type === "all" || request.consultationType === filters.type

        return matchesSearch && matchesStatus && matchesUrgency && matchesType
    })

    return (
        <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{pendingRequests.length}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Chờ phản hồi</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {requests.filter((r) => r.status === "accepted").length}
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Đã chấp nhận</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {requests.filter((r) => r.urgencyLevel === "emergency" || r.urgencyLevel === "high").length}
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Khẩn cấp</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {requests.filter((r) => r.status === "completed").length}
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Hoàn thành</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <Input
                                    placeholder="Tìm kiếm theo tên thành viên hoặc chủ đề..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <select
                                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="pending">Chờ phản hồi</option>
                                <option value="accepted">Đã chấp nhận</option>
                                <option value="rejected">Đã từ chối</option>
                                <option value="completed">Hoàn thành</option>
                            </select>
                            <select
                                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                value={filters.urgency}
                                onChange={(e) => setFilters({ ...filters, urgency: e.target.value as any })}
                            >
                                <option value="all">Tất cả mức độ</option>
                                <option value="emergency">Khẩn cấp</option>
                                <option value="high">Cao</option>
                                <option value="medium">Trung bình</option>
                                <option value="low">Thấp</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Consultation Requests List */}
            <div className="space-y-4">
                {filteredRequests.map((request) => (
                    <Card key={request.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4 flex-1">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={request.memberAvatar || "/placeholder.svg"} />
                                        <AvatarFallback>{request.memberName.charAt(0)}</AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <h3 className="font-semibold text-slate-900 dark:text-white">{request.memberName}</h3>
                                            <Badge className={getUrgencyColor(request.urgencyLevel)}>
                                                {request.urgencyLevel === "emergency"
                                                    ? "Khẩn cấp"
                                                    : request.urgencyLevel === "high"
                                                        ? "Cao"
                                                        : request.urgencyLevel === "medium"
                                                            ? "Trung bình"
                                                            : "Thấp"}
                                            </Badge>
                                            <Badge className={getStatusColor(request.status)}>
                                                {request.status === "pending"
                                                    ? "Chờ phản hồi"
                                                    : request.status === "accepted"
                                                        ? "Đã chấp nhận"
                                                        : request.status === "rejected"
                                                            ? "Đã từ chối"
                                                            : "Hoàn thành"}
                                            </Badge>
                                        </div>

                                        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">{request.subject}</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                                            {request.description}
                                        </p>

                                        <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                                            <div className="flex items-center space-x-1">
                                                {getTypeIcon(request.consultationType)}
                                                <span>
                                                    {request.consultationType === "individual"
                                                        ? "Cá nhân"
                                                        : request.consultationType === "group"
                                                            ? "Nhóm"
                                                            : "Khẩn cấp"}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                {getMethodIcon(request.consultationMethod)}
                                                <span>
                                                    {request.consultationMethod === "phone"
                                                        ? "Điện thoại"
                                                        : request.consultationMethod === "video"
                                                            ? "Video"
                                                            : "Trực tiếp"}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>
                                                    {request.preferredDate} - {request.preferredTime}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Clock className="w-4 h-4" />
                                                <span>{request.duration} phút</span>
                                            </div>
                                        </div>

                                        {/* Member Progress */}
                                        <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tiến độ thành viên:</p>
                                            <div className="grid grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <span className="text-slate-500 dark:text-slate-400">Streak hiện tại:</span>
                                                    <span className="ml-2 font-medium text-slate-900 dark:text-white">
                                                        {request.memberProgress.currentStreak} ngày
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-500 dark:text-slate-400">Tổng kế hoạch:</span>
                                                    <span className="ml-2 font-medium text-slate-900 dark:text-white">
                                                        {request.memberProgress.totalPlans}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-500 dark:text-slate-400">Mốc hoàn thành:</span>
                                                    <span className="ml-2 font-medium text-slate-900 dark:text-white">
                                                        {request.memberProgress.completedMilestones}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col space-y-2 ml-4">
                                    {request.status === "pending" && (
                                        <>
                                            <Button
                                                size="sm"
                                                onClick={() => handleResponse(request, "accept")}
                                                className="bg-green-600 hover:bg-green-700 text-white"
                                            >
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Chấp nhận
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleResponse(request, "reject")}
                                                className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400"
                                            >
                                                <XCircle className="w-4 h-4 mr-2" />
                                                Từ chối
                                            </Button>
                                        </>
                                    )}
                                    {request.status === "accepted" && request.scheduledDateTime && (
                                        <div className="text-sm text-green-600 dark:text-green-400">
                                            <p className="font-medium">Đã lên lịch:</p>
                                            <p>{new Date(request.scheduledDateTime).toLocaleString("vi-VN")}</p>
                                        </div>
                                    )}
                                    {request.status === "rejected" && request.rejectionReason && (
                                        <div className="text-sm text-red-600 dark:text-red-400">
                                            <p className="font-medium">Lý do từ chối:</p>
                                            <p className="max-w-xs">{request.rejectionReason}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {filteredRequests.length === 0 && (
                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                        <CardContent className="p-8 text-center">
                            <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                            <p className="text-slate-500 dark:text-slate-400">Không có yêu cầu tư vấn nào phù hợp với bộ lọc</p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Response Dialog */}
            <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {responseType === "accept" ? "Chấp nhận yêu cầu tư vấn" : "Từ chối yêu cầu tư vấn"}
                        </DialogTitle>
                    </DialogHeader>

                    {selectedRequest && (
                        <div className="space-y-4">
                            <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                <p className="font-medium text-slate-900 dark:text-white">{selectedRequest.memberName}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{selectedRequest.subject}</p>
                            </div>

                            {responseType === "accept" ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Thời gian lên lịch *
                                        </label>
                                        <Input
                                            type="datetime-local"
                                            value={responseForm.scheduledDateTime}
                                            onChange={(e) => setResponseForm({ ...responseForm, scheduledDateTime: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Ghi chú của coach
                                        </label>
                                        <Textarea
                                            placeholder="Thêm ghi chú cho buổi tư vấn..."
                                            value={responseForm.coachNotes}
                                            onChange={(e) => setResponseForm({ ...responseForm, coachNotes: e.target.value })}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Lý do từ chối *
                                    </label>
                                    <Textarea
                                        placeholder="Vui lòng cho biết lý do từ chối yêu cầu này..."
                                        value={responseForm.rejectionReason}
                                        onChange={(e) => setResponseForm({ ...responseForm, rejectionReason: e.target.value })}
                                    />
                                </div>
                            )}

                            <div className="flex space-x-2">
                                <Button
                                    onClick={submitResponse}
                                    className="flex-1"
                                    disabled={responseType === "accept" ? !responseForm.scheduledDateTime : !responseForm.rejectionReason}
                                >
                                    {responseType === "accept" ? "Chấp nhận" : "Từ chối"}
                                </Button>
                                <Button variant="outline" onClick={() => setIsResponseDialogOpen(false)} className="flex-1">
                                    Hủy
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
