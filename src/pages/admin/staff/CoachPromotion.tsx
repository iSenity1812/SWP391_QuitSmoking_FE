"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { UserPlus, Star, Calendar, Award, CheckCircle, Clock, Mail, Phone } from "lucide-react"

interface EligibleUser {
    id: number
    name: string
    email: string
    phone: string
    joinDate: string
    successRate: number
    completedPlans: number
    helpedUsers: number
    avatar?: string
    status: "active" | "inactive"
}

interface CoachApplication {
    id: number
    user: EligibleUser
    applicationDate: string
    motivation: string
    experience: string
    specialization: string[]
    status: "pending" | "approved" | "rejected"
}

const mockEligibleUsers: EligibleUser[] = [
    {
        id: 1,
        name: "Nguyễn Văn An",
        email: "an.nguyen@example.com",
        phone: "+84 901 234 567",
        joinDate: "2023-01-15",
        successRate: 95,
        completedPlans: 3,
        helpedUsers: 12,
        avatar: "/placeholder.svg?height=40&width=40",
        status: "active",
    },
    {
        id: 2,
        name: "Trần Thị Bình",
        email: "binh.tran@example.com",
        phone: "+84 902 345 678",
        joinDate: "2023-02-20",
        successRate: 88,
        completedPlans: 2,
        helpedUsers: 8,
        avatar: "/placeholder.svg?height=40&width=40",
        status: "active",
    },
    {
        id: 3,
        name: "Lê Văn Cường",
        email: "cuong.le@example.com",
        phone: "+84 903 456 789",
        joinDate: "2023-03-10",
        successRate: 92,
        completedPlans: 4,
        helpedUsers: 15,
        avatar: "/placeholder.svg?height=40&width=40",
        status: "active",
    },
]

const mockApplications: CoachApplication[] = [
    {
        id: 1,
        user: mockEligibleUsers[0],
        applicationDate: "2024-01-15",
        motivation: "Tôi muốn giúp đỡ những người khác vượt qua thói quen hút thuốc như tôi đã làm.",
        experience: "Đã thành công cai thuốc được 2 năm, từng hỗ trợ bạn bè và gia đình.",
        specialization: ["Cai thuốc dần dần", "Hỗ trợ tâm lý"],
        status: "pending",
    },
    {
        id: 2,
        user: mockEligibleUsers[1],
        applicationDate: "2024-01-10",
        motivation: "Muốn chia sẻ kinh nghiệm và động lực để giúp cộng đồng.",
        experience: "Cai thuốc thành công, có kinh nghiệm tư vấn sức khỏe.",
        specialization: ["Phương pháp tự nhiên", "Dinh dưỡng"],
        status: "approved",
    },
]

export default function CoachPromotion() {
    const [selectedUser, setSelectedUser] = useState<EligibleUser | null>(null)
    const [promoteDialogOpen, setPromoteDialogOpen] = useState(false)
    const [applicationDialogOpen, setApplicationDialogOpen] = useState(false)
    const [selectedApplication, setSelectedApplication] = useState<CoachApplication | null>(null)
    const [applications, setApplications] = useState<CoachApplication[]>(mockApplications)

    const handleDirectPromotion = (user: EligibleUser) => {
        setSelectedUser(user)
        setPromoteDialogOpen(true)
    }

    const handleViewApplication = (application: CoachApplication) => {
        setSelectedApplication(application)
        setApplicationDialogOpen(true)
    }

    const handleApproveApplication = (applicationId: number) => {
        setApplications((prev) =>
            prev.map((app) => (app.id === applicationId ? { ...app, status: "approved" as const } : app)),
        )
        setApplicationDialogOpen(false)
    }

    const handleRejectApplication = (applicationId: number) => {
        setApplications((prev) =>
            prev.map((app) => (app.id === applicationId ? { ...app, status: "rejected" as const } : app)),
        )
        setApplicationDialogOpen(false)
    }

    const getStatusBadge = (status: "pending" | "approved" | "rejected") => {
        switch (status) {
            case "pending":
                return (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Chờ duyệt
                    </Badge>
                )
            case "approved":
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Đã duyệt
                    </Badge>
                )
            case "rejected":
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Từ chối
                    </Badge>
                )
            default:
                return <Badge variant="outline">Không xác định</Badge>
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Thăng cấp Coach</h2>
                    <p className="text-gray-600 dark:text-gray-400">Quản lý việc thăng cấp người dùng thành Coach</p>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <UserPlus className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Ứng viên tiềm năng</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockEligibleUsers.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <Clock className="h-5 w-5 text-yellow-600" />
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Chờ duyệt</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {applications.filter((app) => app.status === "pending").length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Đã duyệt</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {applications.filter((app) => app.status === "approved").length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <Award className="h-5 w-5 text-purple-600" />
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Coach hoạt động</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Eligible Users */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Star className="h-5 w-5 text-yellow-500" />
                            <span>Người dùng tiềm năng</span>
                        </CardTitle>
                        <CardDescription>Những người dùng có thành tích tốt và đủ điều kiện để trở thành Coach</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {mockEligibleUsers.map((user, index) => (
                                <motion.div
                                    key={user.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <div className="flex items-center space-x-4">
                                        <Avatar>
                                            <AvatarImage src={user.avatar || "/placeholder.svg"} />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white">{user.name}</h4>
                                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                                <span className="flex items-center space-x-1">
                                                    <Mail className="h-3 w-3" />
                                                    <span>{user.email}</span>
                                                </span>
                                                <span className="flex items-center space-x-1">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>Tham gia: {user.joinDate}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className="text-right text-sm">
                                            <div className="flex items-center space-x-2">
                                                <Badge variant="outline" className="bg-green-50 text-green-700">
                                                    {user.successRate}% thành công
                                                </Badge>
                                                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                                    {user.completedPlans} kế hoạch
                                                </Badge>
                                                <Badge variant="outline" className="bg-purple-50 text-purple-700">
                                                    Hỗ trợ {user.helpedUsers} người
                                                </Badge>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => handleDirectPromotion(user)}
                                            size="sm"
                                            className="bg-blue-600 hover:bg-blue-700"
                                        >
                                            <UserPlus className="h-4 w-4 mr-2" />
                                            Thăng cấp
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Coach Applications */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Award className="h-5 w-5 text-purple-500" />
                            <span>Đơn đăng ký Coach</span>
                        </CardTitle>
                        <CardDescription>Xem xét và phê duyệt các đơn đăng ký trở thành Coach</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {applications.map((application, index) => (
                                <motion.div
                                    key={application.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <div className="flex items-center space-x-4">
                                        <Avatar>
                                            <AvatarImage src={application.user.avatar || "/placeholder.svg"} />
                                            <AvatarFallback>{application.user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white">{application.user.name}</h4>
                                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                                <span className="flex items-center space-x-1">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>Nộp đơn: {application.applicationDate}</span>
                                                </span>
                                                <span>Chuyên môn: {application.specialization.join(", ")}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        {getStatusBadge(application.status)}
                                        <Button onClick={() => handleViewApplication(application)} variant="outline" size="sm">
                                            Xem chi tiết
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Direct Promotion Dialog */}
            <Dialog open={promoteDialogOpen} onOpenChange={setPromoteDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Thăng cấp thành Coach</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn thăng cấp "{selectedUser?.name}" thành Coach không? Họ sẽ có quyền truy cập vào bảng
                            điều khiển Coach và có thể quản lý khách hàng.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setPromoteDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button
                            onClick={() => {
                                console.log(`Promoting ${selectedUser?.name} to Coach`)
                                setPromoteDialogOpen(false)
                            }}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Xác nhận thăng cấp
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Application Review Dialog */}
            <Dialog open={applicationDialogOpen} onOpenChange={setApplicationDialogOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Chi tiết đơn đăng ký Coach</DialogTitle>
                        <DialogDescription>Xem xét thông tin và quyết định phê duyệt đơn đăng ký</DialogDescription>
                    </DialogHeader>

                    {selectedApplication && (
                        <div className="space-y-6">
                            {/* User Info */}
                            <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={selectedApplication.user.avatar || "/placeholder.svg"} />
                                    <AvatarFallback>{selectedApplication.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">{selectedApplication.user.name}</h4>
                                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                        <span className="flex items-center space-x-1">
                                            <Mail className="h-3 w-3" />
                                            <span>{selectedApplication.user.email}</span>
                                        </span>
                                        <span className="flex items-center space-x-1">
                                            <Phone className="h-3 w-3" />
                                            <span>{selectedApplication.user.phone}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Application Details */}
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium">Động lực</Label>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                                        {selectedApplication.motivation}
                                    </p>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium">Kinh nghiệm</Label>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                                        {selectedApplication.experience}
                                    </p>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium">Chuyên môn</Label>
                                    <div className="mt-1 flex flex-wrap gap-2">
                                        {selectedApplication.specialization.map((spec, index) => (
                                            <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                                                {spec}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-green-600">{selectedApplication.user.successRate}%</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Tỷ lệ thành công</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-blue-600">{selectedApplication.user.completedPlans}</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Kế hoạch hoàn thành</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-purple-600">{selectedApplication.user.helpedUsers}</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Người đã hỗ trợ</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            {selectedApplication.status === "pending" && (
                                <div className="flex justify-end space-x-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => handleRejectApplication(selectedApplication.id)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        Từ chối
                                    </Button>
                                    <Button
                                        onClick={() => handleApproveApplication(selectedApplication.id)}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        Phê duyệt
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
