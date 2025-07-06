"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
    Bell,
    Plus,
    Send,
    Users,
    Mail,
    Calendar,
    BarChart3,
    Edit,
    Trash2,
    Eye,
    Clock,
    MessageSquare,
    AlarmClock,
    X,
} from "lucide-react"
import { useNotifications } from "@/components/ui/NotificationProvider"

interface NotificationTemplate {
    id: string
    name: string
    title: string
    message: string
    type: "motivational" | "reminder" | "achievement" | "milestone" | "health"
    category: string
    variables: string[]
}

interface NotificationCampaign {
    id: string
    title: string
    message: string
    type: "system" | "email" | "both"
    targetAudience: "all" | "premium" | "free" | "specific"
    priority: "low" | "medium" | "high" | "urgent"
    status: "draft" | "scheduled" | "sent" | "failed"
    scheduledFor?: Date
    sentAt?: Date
    recipientCount: number
    openRate?: number
    clickRate?: number
    createdAt: Date
}

const sampleCampaigns: NotificationCampaign[] = [
    {
        id: "1",
        title: "Chúc mừng cột mốc 7 ngày",
        message: "Chúc mừng bạn đã hoàn thành 7 ngày không hút thuốc! Đây là một thành tựu tuyệt vời.",
        type: "both",
        targetAudience: "all",
        priority: "high",
        status: "sent",
        sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        recipientCount: 1250,
        openRate: 78,
        clickRate: 45,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
        id: "2",
        title: "Nhắc nhở tập thể dục hàng ngày",
        message: "Đã đến lúc thực hiện 15 phút tập thể dục để giảm căng thẳng và cải thiện sức khỏe!",
        type: "system",
        targetAudience: "premium",
        priority: "medium",
        status: "scheduled",
        scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000),
        recipientCount: 450,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
        id: "3",
        title: "Mẹo sức khỏe tuần này",
        message: "Uống nhiều nước giúp cơ thể loại bỏ độc tố từ thuốc lá nhanh hơn. Hãy uống ít nhất 8 ly nước mỗi ngày!",
        type: "email",
        targetAudience: "all",
        priority: "low",
        status: "draft",
        recipientCount: 0,
        createdAt: new Date(),
    },
]

export function NotificationManagement() {
    const { addNotification } = useNotifications()
    const [campaigns, setCampaigns] = useState<NotificationCampaign[]>(sampleCampaigns)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isCreateReminderOpen, setIsCreateReminderOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        title: "",
        message: "",
        type: "system" as "system" | "email" | "both",
        targetAudience: "all" as "all" | "premium" | "free" | "specific",
        priority: "medium" as "low" | "medium" | "high" | "urgent",
        scheduleType: "now" as "now" | "later",
        scheduledDate: "",
        scheduledTime: "",
    })

    const [reminderData, setReminderData] = useState({
        title: "",
        message: "",
        type: "system" as "system" | "email" | "both",
        targetAudience: "all" as "all" | "premium" | "free" | "specific",
        priority: "medium" as "low" | "medium" | "high" | "urgent",
        scheduleType: "later" as "now" | "later",
        scheduledDate: "",
        scheduledTime: "",
        reminderType: "daily" as "daily" | "weekly" | "custom",
    })

    const handleCreateNotification = async () => {
        if (!formData.title || !formData.message) {
            alert("Vui lòng điền đầy đủ tiêu đề và nội dung!")
            return
        }

        setIsSubmitting(true)

        try {
            const newCampaign: NotificationCampaign = {
                id: Date.now().toString(),
                title: formData.title,
                message: formData.message,
                type: formData.type,
                targetAudience: formData.targetAudience,
                priority: formData.priority,
                status: formData.scheduleType === "now" ? "sent" : "scheduled",
                scheduledFor:
                    formData.scheduleType === "later"
                        ? new Date(`${formData.scheduledDate}T${formData.scheduledTime}`)
                        : undefined,
                sentAt: formData.scheduleType === "now" ? new Date() : undefined,
                recipientCount: formData.targetAudience === "all" ? 1500 : formData.targetAudience === "premium" ? 450 : 1050,
                createdAt: new Date(),
            }

            setCampaigns((prev) => [newCampaign, ...prev])

            if (formData.scheduleType === "now") {
                addNotification({
                    title: formData.title,
                    message: formData.message,
                    type: "motivational",
                    priority: formData.priority,
                    category: "system",
                    targetAudience: formData.targetAudience,
                })
            }

            setFormData({
                title: "",
                message: "",
                type: "system",
                targetAudience: "all",
                priority: "medium",
                scheduleType: "now",
                scheduledDate: "",
                scheduledTime: "",
            })
            setIsCreateDialogOpen(false)
        } catch (error) {
            console.error("Error creating notification:", error)
            alert("Có lỗi xảy ra khi tạo thông báo!")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCreateReminder = async () => {
        if (!reminderData.title || !reminderData.message) {
            alert("Vui lòng điền đầy đủ tiêu đề và nội dung!")
            return
        }

        setIsSubmitting(true)

        try {
            const newReminder: NotificationCampaign = {
                id: Date.now().toString(),
                title: `[Nhắc nhở] ${reminderData.title}`,
                message: reminderData.message,
                type: reminderData.type,
                targetAudience: reminderData.targetAudience,
                priority: reminderData.priority,
                status: "scheduled",
                scheduledFor: new Date(`${reminderData.scheduledDate}T${reminderData.scheduledTime}`),
                recipientCount:
                    reminderData.targetAudience === "all" ? 1500 : reminderData.targetAudience === "premium" ? 450 : 1050,
                createdAt: new Date(),
            }

            setCampaigns((prev) => [newReminder, ...prev])

            setReminderData({
                title: "",
                message: "",
                type: "system",
                targetAudience: "all",
                priority: "medium",
                scheduleType: "later",
                scheduledDate: "",
                scheduledTime: "",
                reminderType: "daily",
            })
            setIsCreateReminderOpen(false)
        } catch (error) {
            console.error("Error creating reminder:", error)
            alert("Có lỗi xảy ra khi tạo nhắc nhở!")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteCampaign = (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa thông báo này?")) {
            setCampaigns((prev) => prev.filter((campaign) => campaign.id !== id))
        }
    }

    const getStatusColor = (status: NotificationCampaign["status"]) => {
        switch (status) {
            case "sent":
                return "bg-green-100 text-green-800"
            case "scheduled":
                return "bg-blue-100 text-blue-800"
            case "draft":
                return "bg-gray-100 text-gray-800"
            case "failed":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getPriorityColor = (priority: NotificationCampaign["priority"]) => {
        switch (priority) {
            case "urgent":
                return "bg-red-100 text-red-800"
            case "high":
                return "bg-orange-100 text-orange-800"
            case "medium":
                return "bg-yellow-100 text-yellow-800"
            case "low":
                return "bg-gray-100 text-gray-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getTypeIcon = (type: NotificationCampaign["type"]) => {
        switch (type) {
            case "system":
                return <Bell className="h-4 w-4" />
            case "email":
                return <Mail className="h-4 w-4" />
            case "both":
                return <MessageSquare className="h-4 w-4" />
            default:
                return <Bell className="h-4 w-4" />
        }
    }

    const totalSent = campaigns.filter((c) => c.status === "sent").length
    const totalScheduled = campaigns.filter((c) => c.status === "scheduled").length
    const totalDrafts = campaigns.filter((c) => c.status === "draft").length
    const avgOpenRate =
        campaigns.filter((c) => c.openRate).reduce((acc, c) => acc + (c.openRate || 0), 0) /
        campaigns.filter((c) => c.openRate).length || 0

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Quản lý Thông báo</h1>
                    <p className="text-slate-600 dark:text-slate-400">Tạo và quản lý thông báo nhắc nhở cho người dùng</p>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700/50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <Send className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Đã gửi</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalSent}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700/50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Đã lên lịch</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalScheduled}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700/50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 dark:bg-gray-700/30 rounded-lg">
                                <Edit className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Bản nháp</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalDrafts}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700/50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Tỷ lệ mở</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{Math.round(avgOpenRate)}%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Add New Notification Button - Prominent placement */}
            <div className="flex justify-center py-4">
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                        >
                            <Plus className="h-6 w-6 mr-3" />
                            Thêm thông báo mới
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                        <DialogHeader>
                            <div className="flex items-center justify-between">
                                <DialogTitle className="text-slate-900 dark:text-white">Tạo thông báo mới</DialogTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsCreateDialogOpen(false)}
                                    className="h-6 w-6 p-0 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="title" className="text-slate-700 dark:text-slate-300">
                                        Tiêu đề *
                                    </Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                                        placeholder="Nhập tiêu đề thông báo..."
                                        className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="type" className="text-slate-700 dark:text-slate-300">
                                        Loại thông báo
                                    </Label>
                                    <select
                                        id="type"
                                        value={formData.type}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value as any }))}
                                        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    >
                                        <option value="system">Thông báo hệ thống</option>
                                        <option value="email">Email</option>
                                        <option value="both">Cả hai</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="message" className="text-slate-700 dark:text-slate-300">
                                    Nội dung *
                                </Label>
                                <Textarea
                                    id="message"
                                    value={formData.message}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                                    placeholder="Nhập nội dung thông báo..."
                                    rows={4}
                                    className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="audience" className="text-slate-700 dark:text-slate-300">
                                        Đối tượng
                                    </Label>
                                    <select
                                        id="audience"
                                        value={formData.targetAudience}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, targetAudience: e.target.value as any }))}
                                        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    >
                                        <option value="all">Tất cả người dùng</option>
                                        <option value="premium">Người dùng Premium</option>
                                        <option value="free">Người dùng miễn phí</option>
                                    </select>
                                </div>
                                <div>
                                    <Label htmlFor="priority" className="text-slate-700 dark:text-slate-300">
                                        Độ ưu tiên
                                    </Label>
                                    <select
                                        id="priority"
                                        value={formData.priority}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, priority: e.target.value as any }))}
                                        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    >
                                        <option value="low">Thấp</option>
                                        <option value="medium">Trung bình</option>
                                        <option value="high">Cao</option>
                                        <option value="urgent">Khẩn cấp</option>
                                    </select>
                                </div>
                                <div>
                                    <Label htmlFor="schedule" className="text-slate-700 dark:text-slate-300">
                                        Lên lịch
                                    </Label>
                                    <select
                                        id="schedule"
                                        value={formData.scheduleType}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, scheduleType: e.target.value as any }))}
                                        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    >
                                        <option value="now">Gửi ngay</option>
                                        <option value="later">Lên lịch</option>
                                    </select>
                                </div>
                            </div>

                            {formData.scheduleType === "later" && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="date" className="text-slate-700 dark:text-slate-300">
                                            Ngày *
                                        </Label>
                                        <Input
                                            id="date"
                                            type="date"
                                            value={formData.scheduledDate}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, scheduledDate: e.target.value }))}
                                            className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="time" className="text-slate-700 dark:text-slate-300">
                                            Giờ *
                                        </Label>
                                        <Input
                                            id="time"
                                            type="time"
                                            value={formData.scheduledTime}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, scheduledTime: e.target.value }))}
                                            className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-2 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsCreateDialogOpen(false)}
                                    className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                >
                                    Hủy
                                </Button>
                                <Button
                                    onClick={handleCreateNotification}
                                    disabled={isSubmitting}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    {isSubmitting ? "Đang xử lý..." : formData.scheduleType === "now" ? "Gửi ngay" : "Lên lịch"}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Main Content */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Danh sách chiến dịch thông báo</h2>

                    <div className="flex gap-2">
                        {/* Create Reminder Button */}
                        <Dialog open={isCreateReminderOpen} onOpenChange={setIsCreateReminderOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-900/20"
                                >
                                    <AlarmClock className="h-4 w-4 mr-2" />
                                    Tạo nhắc nhở
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                                <DialogHeader>
                                    <div className="flex items-center justify-between">
                                        <DialogTitle className="text-slate-900 dark:text-white">Tạo nhắc nhở mới</DialogTitle>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setIsCreateReminderOpen(false)}
                                            className="h-6 w-6 p-0 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="reminder-title" className="text-slate-700 dark:text-slate-300">
                                                Tiêu đề nhắc nhở *
                                            </Label>
                                            <Input
                                                id="reminder-title"
                                                value={reminderData.title}
                                                onChange={(e) => setReminderData((prev) => ({ ...prev, title: e.target.value }))}
                                                placeholder="Nhập tiêu đề nhắc nhở..."
                                                className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="reminder-type-select" className="text-slate-700 dark:text-slate-300">
                                                Loại nhắc nhở
                                            </Label>
                                            <select
                                                id="reminder-type-select"
                                                value={reminderData.reminderType}
                                                onChange={(e) => setReminderData((prev) => ({ ...prev, reminderType: e.target.value as any }))}
                                                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                            >
                                                <option value="daily">Hàng ngày</option>
                                                <option value="weekly">Hàng tuần</option>
                                                <option value="custom">Tùy chỉnh</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="reminder-message" className="text-slate-700 dark:text-slate-300">
                                            Nội dung nhắc nhở *
                                        </Label>
                                        <Textarea
                                            id="reminder-message"
                                            value={reminderData.message}
                                            onChange={(e) => setReminderData((prev) => ({ ...prev, message: e.target.value }))}
                                            placeholder="Nhập nội dung nhắc nhở..."
                                            rows={4}
                                            className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="reminder-date" className="text-slate-700 dark:text-slate-300">
                                                Ngày bắt đầu *
                                            </Label>
                                            <Input
                                                id="reminder-date"
                                                type="date"
                                                value={reminderData.scheduledDate}
                                                onChange={(e) => setReminderData((prev) => ({ ...prev, scheduledDate: e.target.value }))}
                                                className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="reminder-time" className="text-slate-700 dark:text-slate-300">
                                                Giờ nhắc nhở *
                                            </Label>
                                            <Input
                                                id="reminder-time"
                                                type="time"
                                                value={reminderData.scheduledTime}
                                                onChange={(e) => setReminderData((prev) => ({ ...prev, scheduledTime: e.target.value }))}
                                                className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-4">
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsCreateReminderOpen(false)}
                                            className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                        >
                                            Hủy
                                        </Button>
                                        <Button
                                            onClick={handleCreateReminder}
                                            className="bg-orange-500 hover:bg-orange-600 text-white"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Đang tạo..." : "Tạo nhắc nhở"}
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700/50">
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {campaigns.map((campaign) => (
                                <div
                                    key={campaign.id}
                                    className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white/50 dark:bg-slate-800/50"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-semibold text-slate-900 dark:text-white">{campaign.title}</h3>
                                                <Badge className={getStatusColor(campaign.status)}>
                                                    {campaign.status === "sent" && "Đã gửi"}
                                                    {campaign.status === "scheduled" && "Đã lên lịch"}
                                                    {campaign.status === "draft" && "Bản nháp"}
                                                    {campaign.status === "failed" && "Thất bại"}
                                                </Badge>
                                                <Badge className={getPriorityColor(campaign.priority)}>
                                                    {campaign.priority === "urgent" && "Khẩn cấp"}
                                                    {campaign.priority === "high" && "Cao"}
                                                    {campaign.priority === "medium" && "Trung bình"}
                                                    {campaign.priority === "low" && "Thấp"}
                                                </Badge>
                                            </div>
                                            <p className="text-slate-600 dark:text-slate-400 mb-3">{campaign.message}</p>
                                            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                                <div className="flex items-center gap-1">
                                                    {getTypeIcon(campaign.type)}
                                                    <span>
                                                        {campaign.type === "system" && "Hệ thống"}
                                                        {campaign.type === "email" && "Email"}
                                                        {campaign.type === "both" && "Cả hai"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Users className="h-4 w-4" />
                                                    <span>{campaign.recipientCount} người nhận</span>
                                                </div>
                                                {campaign.openRate && (
                                                    <div className="flex items-center gap-1">
                                                        <Eye className="h-4 w-4" />
                                                        <span>{campaign.openRate}% mở</span>
                                                    </div>
                                                )}
                                                {campaign.scheduledFor && (
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>{campaign.scheduledFor.toLocaleDateString("vi-VN")}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteCampaign(campaign.id)}
                                                className="text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
