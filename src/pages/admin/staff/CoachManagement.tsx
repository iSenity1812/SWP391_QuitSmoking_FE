"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    UserCheck,
    Search,
    Filter,
    Edit,
    Trash2,
    Star,
    MessageSquare,
    FileText,
    Eye,
    Users,
    Download,
    Plus,
    X,
    Upload,
} from "lucide-react"

interface Certificate {
    id: number
    name: string
    issuer: string
    issueDate: string
    expiryDate?: string
    type: "health" | "psychology" | "counseling" | "other"
    status: "verified" | "pending" | "rejected"
    fileUrl: string
    fileName: string
    uploadDate: string
    adminNotes?: string
}

interface Coach {
    id: number
    name: string
    email: string
    phone: string
    avatar?: string
    specialization: string
    experience: number
    rating: number
    totalSessions: number
    activeClients: number
    status: "active" | "inactive" | "on-leave"
    joinDate: string
    lastActive: string
    certifications: Certificate[]
}

interface CreateCoachForm {
    name: string
    email: string
    phone: string
    password: string
    specialization: string
    experience: string
    certificates: Certificate[]
}

export function CoachManagement() {
    const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null)
    const [coachDetailDialogOpen, setCoachDetailDialogOpen] = useState(false)
    const [createCoachDialogOpen, setCreateCoachDialogOpen] = useState(false)

    // Create Coach Form State
    const [createCoachForm, setCreateCoachForm] = useState<CreateCoachForm>({
        name: "",
        email: "",
        phone: "",
        password: "",
        specialization: "",
        experience: "",
        certificates: [],
    })

    // Mock data for active coaches
    const [coaches, setCoaches] = useState<Coach[]>([
        {
            id: 1,
            name: "Dr. Nguyễn Văn A",
            email: "dr.nguyenvana@email.com",
            phone: "+84 901 234 567",
            avatar: "/placeholder.svg?height=40&width=40",
            specialization: "Tâm lý học lâm sàng",
            experience: 8,
            rating: 4.9,
            totalSessions: 234,
            activeClients: 15,
            status: "active",
            joinDate: "2023-06-15",
            lastActive: "2024-01-20T10:30:00Z",
            certifications: [
                {
                    id: 10,
                    name: "Chứng chỉ tâm lý học",
                    issuer: "Đại học Y Hà Nội",
                    issueDate: "2020-05-15",
                    expiryDate: "2025-05-15",
                    status: "verified",
                    type: "psychology",
                    fileUrl: "/certificates/psychology-cert.pdf",
                    fileName: "psychology-certificate.pdf",
                    uploadDate: "2023-06-10",
                },
            ],
        },
    ])

    const handleCreateCoach = () => {
        if (!createCoachForm.name || !createCoachForm.email || !createCoachForm.phone || !createCoachForm.password) {
            alert("Vui lòng điền đầy đủ thông tin bắt buộc")
            return
        }

        const newCoach: Coach = {
            id: Date.now(),
            name: createCoachForm.name,
            email: createCoachForm.email,
            phone: createCoachForm.phone,
            specialization: createCoachForm.specialization,
            experience: Number.parseInt(createCoachForm.experience) || 0,
            rating: 0,
            totalSessions: 0,
            activeClients: 0,
            status: "active",
            joinDate: new Date().toISOString(),
            lastActive: new Date().toISOString(),
            certifications: createCoachForm.certificates,
        }

        setCoaches((prev) => [...prev, newCoach])
        setCreateCoachDialogOpen(false)

        // Reset form
        setCreateCoachForm({
            name: "",
            email: "",
            phone: "",
            password: "",
            specialization: "",
            experience: "",
            certificates: [],
        })
    }

    const handleAddCertificate = () => {
        const newCertificate: Certificate = {
            id: Date.now(),
            name: "",
            issuer: "",
            issueDate: new Date().toISOString().split("T")[0],
            type: "other",
            status: "verified",
            fileUrl: "",
            fileName: "",
            uploadDate: new Date().toISOString().split("T")[0],
        }

        setCreateCoachForm((prev) => ({
            ...prev,
            certificates: [...prev.certificates, newCertificate],
        }))
    }

    const handleUpdateCertificate = (index: number, field: keyof Certificate, value: string) => {
        setCreateCoachForm((prev) => ({
            ...prev,
            certificates: prev.certificates.map((cert, i) => (i === index ? { ...cert, [field]: value } : cert)),
        }))
    }

    const handleRemoveCertificate = (index: number) => {
        setCreateCoachForm((prev) => ({
            ...prev,
            certificates: prev.certificates.filter((_, i) => i !== index),
        }))
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
            case "approved":
            case "verified":
                return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
            case "inactive":
            case "rejected":
                return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
            case "pending":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
            case "on-leave":
                return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
        }
    }

    const getRatingStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-3 h-3 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
            />
        ))
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-slate-900 dark:text-white flex items-center space-x-2">
                                <UserCheck className="w-5 h-5 text-blue-600" />
                                <span>Quản Lý Coach</span>
                            </CardTitle>
                            <CardDescription className="text-slate-600 dark:text-slate-400">
                                Quản lý đội ngũ coach và tạo tài khoản coach mới
                            </CardDescription>
                        </div>
                        <div className="flex space-x-2">
                            <Button onClick={() => setCreateCoachDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Tạo Coach
                            </Button>
                            <Button variant="outline" size="sm">
                                <Filter className="w-4 h-4 mr-2" />
                                Lọc
                            </Button>
                            <Button variant="outline" size="sm">
                                <Search className="w-4 h-4 mr-2" />
                                Tìm kiếm
                            </Button>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Coaches Section */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                    <Users className="w-5 h-5 text-blue-600" />
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Coach hoạt động ({coaches.length})</h2>
                </div>

                {coaches.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-8">
                            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">Chưa có coach nào</p>
                        </CardContent>
                    </Card>
                ) : (
                    coaches.map((coach) => (
                        <Card key={coach.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-start space-x-4 flex-1">
                                        <Avatar className="h-16 w-16">
                                            <AvatarImage src={coach.avatar || "/placeholder.svg"} />
                                            <AvatarFallback className="text-lg font-semibold">
                                                {coach.name.split(" ").pop()?.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{coach.name}</h3>
                                                <Badge className={getStatusColor(coach.status)}>
                                                    {coach.status === "active"
                                                        ? "Hoạt động"
                                                        : coach.status === "inactive"
                                                            ? "Không hoạt động"
                                                            : "Nghỉ phép"}
                                                </Badge>
                                            </div>
                                            <p className="text-slate-600 dark:text-slate-400 mb-1">{coach.email}</p>
                                            <p className="text-slate-600 dark:text-slate-400 mb-2">{coach.phone}</p>
                                            <p className="text-slate-700 dark:text-slate-300 mb-4">
                                                <strong>Chuyên môn:</strong> {coach.specialization}
                                            </p>

                                            {/* Stats */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                                    <div className="flex items-center justify-center space-x-1 mb-1">
                                                        {getRatingStars(coach.rating)}
                                                    </div>
                                                    <div className="text-lg font-semibold text-slate-900 dark:text-white">
                                                        {coach.rating || "N/A"}
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">Đánh giá</div>
                                                </div>
                                                <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                                    <div className="text-lg font-semibold text-slate-900 dark:text-white">
                                                        {coach.totalSessions}
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">Buổi tư vấn</div>
                                                </div>
                                                <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                                    <div className="text-lg font-semibold text-slate-900 dark:text-white">
                                                        {coach.activeClients}
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">Khách hàng</div>
                                                </div>
                                                <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">Tham gia</div>
                                                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                                                        {new Date(coach.joinDate).toLocaleDateString("vi-VN")}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setSelectedCoach(coach)
                                                setCoachDetailDialogOpen(true)
                                            }}
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Button size="sm" variant="ghost">
                                            <MessageSquare className="w-4 h-4" />
                                        </Button>
                                        <Button size="sm" variant="ghost">
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Certifications */}
                                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center space-x-2 mb-3">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                        <span>Chứng chỉ ({coach.certifications.length})</span>
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {coach.certifications.map((cert) => (
                                            <div
                                                key={cert.id}
                                                className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600"
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <h5 className="font-medium text-slate-900 dark:text-white text-sm">{cert.name}</h5>
                                                    <Badge className={getStatusColor(cert.status)} variant="outline">
                                                        {cert.status === "verified"
                                                            ? "Đã xác minh"
                                                            : cert.status === "pending"
                                                                ? "Chờ xác minh"
                                                                : "Bị từ chối"}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Cấp bởi: {cert.issuer}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    Ngày cấp: {new Date(cert.issueDate).toLocaleDateString("vi-VN")}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Create Coach Dialog */}
            <Dialog open={createCoachDialogOpen} onOpenChange={setCreateCoachDialogOpen}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <DialogTitle>Tạo tài khoản Coach mới</DialogTitle>
                                <DialogDescription>Nhập thông tin để tạo tài khoản coach mới</DialogDescription>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setCreateCoachDialogOpen(false)} className="h-8 w-8 p-0">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Họ và tên *</Label>
                                <Input
                                    id="name"
                                    value={createCoachForm.name}
                                    onChange={(e) => setCreateCoachForm((prev) => ({ ...prev, name: e.target.value }))}
                                    placeholder="Nhập họ và tên"
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={createCoachForm.email}
                                    onChange={(e) => setCreateCoachForm((prev) => ({ ...prev, email: e.target.value }))}
                                    placeholder="Nhập email"
                                />
                            </div>
                            <div>
                                <Label htmlFor="phone">Số điện thoại *</Label>
                                <Input
                                    id="phone"
                                    value={createCoachForm.phone}
                                    onChange={(e) => setCreateCoachForm((prev) => ({ ...prev, phone: e.target.value }))}
                                    placeholder="Nhập số điện thoại"
                                />
                            </div>
                            <div>
                                <Label htmlFor="password">Mật khẩu *</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={createCoachForm.password}
                                    onChange={(e) => setCreateCoachForm((prev) => ({ ...prev, password: e.target.value }))}
                                    placeholder="Nhập mật khẩu"
                                />
                            </div>
                            <div>
                                <Label htmlFor="experience">Kinh nghiệm (năm)</Label>
                                <Input
                                    id="experience"
                                    type="number"
                                    value={createCoachForm.experience}
                                    onChange={(e) => setCreateCoachForm((prev) => ({ ...prev, experience: e.target.value }))}
                                    placeholder="Nhập số năm kinh nghiệm"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="specialization">Chuyên môn</Label>
                            <Textarea
                                id="specialization"
                                value={createCoachForm.specialization}
                                onChange={(e) => setCreateCoachForm((prev) => ({ ...prev, specialization: e.target.value }))}
                                placeholder="Nhập chuyên môn của coach"
                                rows={3}
                            />
                        </div>

                        {/* Certificates Section */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <Label className="text-base font-medium">Chứng chỉ</Label>
                                <Button type="button" variant="outline" size="sm" onClick={handleAddCertificate}>
                                    <Plus className="w-4 h-4 mr-1" />
                                    Thêm chứng chỉ
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {createCoachForm.certificates.map((cert, index) => (
                                    <div key={cert.id} className="p-4 border rounded-lg">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-medium">Chứng chỉ {index + 1}</h4>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveCertificate(index)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div>
                                                <Label>Tên chứng chỉ</Label>
                                                <Input
                                                    value={cert.name}
                                                    onChange={(e) => handleUpdateCertificate(index, "name", e.target.value)}
                                                    placeholder="Nhập tên chứng chỉ"
                                                />
                                            </div>
                                            <div>
                                                <Label>Đơn vị cấp</Label>
                                                <Input
                                                    value={cert.issuer}
                                                    onChange={(e) => handleUpdateCertificate(index, "issuer", e.target.value)}
                                                    placeholder="Nhập đơn vị cấp"
                                                />
                                            </div>
                                            <div>
                                                <Label>Ngày cấp</Label>
                                                <Input
                                                    type="date"
                                                    value={cert.issueDate}
                                                    onChange={(e) => handleUpdateCertificate(index, "issueDate", e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label>Ngày hết hạn (tùy chọn)</Label>
                                                <Input
                                                    type="date"
                                                    value={cert.expiryDate || ""}
                                                    onChange={(e) => handleUpdateCertificate(index, "expiryDate", e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label>Loại chứng chỉ</Label>
                                                <select
                                                    value={cert.type}
                                                    onChange={(e) => handleUpdateCertificate(index, "type", e.target.value)}
                                                    className="w-full p-2 border rounded-md"
                                                >
                                                    <option value="health">Y tế</option>
                                                    <option value="psychology">Tâm lý học</option>
                                                    <option value="counseling">Tư vấn</option>
                                                    <option value="other">Khác</option>
                                                </select>
                                            </div>
                                            <div>
                                                <Label>File chứng chỉ</Label>
                                                <div className="flex items-center space-x-2">
                                                    <Input
                                                        type="file"
                                                        accept=".pdf,.jpg,.jpeg,.png"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0]
                                                            if (file) {
                                                                handleUpdateCertificate(index, "fileName", file.name)
                                                                handleUpdateCertificate(index, "fileUrl", URL.createObjectURL(file))
                                                            }
                                                        }}
                                                        className="flex-1"
                                                    />
                                                    <Button type="button" variant="outline" size="sm">
                                                        <Upload className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-2 pt-4 border-t">
                            <Button variant="outline" onClick={() => setCreateCoachDialogOpen(false)}>
                                Hủy
                            </Button>
                            <Button onClick={handleCreateCoach} className="bg-blue-600 hover:bg-blue-700">
                                Tạo Coach
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Coach Detail Dialog */}
            <Dialog open={coachDetailDialogOpen} onOpenChange={setCoachDetailDialogOpen}>
                <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <DialogTitle>Chi tiết Coach</DialogTitle>
                                <DialogDescription>Thông tin chi tiết về Coach và chứng chỉ</DialogDescription>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setCoachDetailDialogOpen(false)} className="h-8 w-8 p-0">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </DialogHeader>

                    {selectedCoach && (
                        <div className="space-y-6">
                            {/* Coach Info */}
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={selectedCoach.avatar || "/placeholder.svg"} />
                                    <AvatarFallback>{selectedCoach.name.split(" ").pop()?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-lg font-semibold">{selectedCoach.name}</h3>
                                    <p className="text-slate-600 dark:text-slate-400">{selectedCoach.email}</p>
                                    <p className="text-slate-600 dark:text-slate-400">{selectedCoach.phone}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        Chuyên môn: {selectedCoach.specialization}
                                    </p>
                                </div>
                            </div>

                            {/* Performance Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                        {selectedCoach.rating || "N/A"}
                                    </div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400">Đánh giá</div>
                                </div>
                                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{selectedCoach.totalSessions}</div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400">Buổi tư vấn</div>
                                </div>
                                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{selectedCoach.activeClients}</div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400">Khách hàng</div>
                                </div>
                                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <div className="text-sm text-slate-500 dark:text-slate-400">Tham gia</div>
                                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                                        {new Date(selectedCoach.joinDate).toLocaleDateString("vi-VN")}
                                    </div>
                                </div>
                            </div>

                            {/* Certifications */}
                            <div>
                                <Label className="text-base font-medium">Chứng chỉ</Label>
                                <div className="mt-2 space-y-3">
                                    {selectedCoach.certifications.map((cert) => (
                                        <div key={cert.id} className="p-4 border rounded-lg">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h4 className="font-medium">{cert.name}</h4>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">Cấp bởi: {cert.issuer}</p>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                                        Ngày cấp: {new Date(cert.issueDate).toLocaleDateString("vi-VN")}
                                                    </p>
                                                    {cert.expiryDate && (
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                                            Hết hạn: {new Date(cert.expiryDate).toLocaleDateString("vi-VN")}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Badge className={getStatusColor(cert.status)}>
                                                        {cert.status === "verified"
                                                            ? "Đã xác minh"
                                                            : cert.status === "pending"
                                                                ? "Chờ xác minh"
                                                                : "Bị từ chối"}
                                                    </Badge>
                                                    <Button variant="outline" size="sm">
                                                        <Download className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-2 pt-4 border-t">
                                <Button variant="outline" onClick={() => setCoachDetailDialogOpen(false)}>
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
