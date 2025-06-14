"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
    User,
    Edit,
    Save,
    Star,
    Award,
    Calendar,
    Users,
    TrendingUp,
    Mail,
    Phone,
    MapPin,
    Clock,
    CheckCircle,
} from "lucide-react"

interface CoachProfile {
    id: string
    name: string
    email: string
    phone: string
    avatar: string
    title: string
    bio: string
    specializations: string[]
    experience: number
    certifications: string[]
    languages: string[]
    location: string
    availability: {
        monday: string
        tuesday: string
        wednesday: string
        thursday: string
        friday: string
        saturday: string
        sunday: string
    }
    stats: {
        totalClients: number
        successRate: number
        totalSessions: number
        rating: number
        reviewCount: number
    }
}

export function CoachProfile() {
    const [isEditing, setIsEditing] = useState(false)
    const [profile, setProfile] = useState<CoachProfile>({
        id: "coach-001",
        name: "Huấn Luyện Viên Minh",
        email: "coach.minh@quitsmoking.com",
        phone: "+84 901 234 567",
        avatar: "/placeholder.svg?height=120&width=120",
        title: "Chuyên gia Cai Thuốc Lá Cấp Cao",
        bio: "Với hơn 8 năm kinh nghiệm trong lĩnh vực tư vấn cai thuốc lá, tôi đã giúp hơn 500 người thành công trong việc từ bỏ thói quen hút thuốc. Tôi tin rằng mỗi người đều có thể thành công với sự hỗ trợ và phương pháp phù hợp.",
        specializations: ["Tư vấn tâm lý", "Liệu pháp nhận thức hành vi", "Quản lý stress", "Nhóm hỗ trợ"],
        experience: 8,
        certifications: [
            "Chứng chỉ Tư vấn Cai Thuốc Lá Quốc tế",
            "Chứng chỉ Liệu pháp Nhận thức Hành vi",
            "Chứng chỉ Tư vấn Tâm lý Sức khỏe",
        ],
        languages: ["Tiếng Việt", "English"],
        location: "TP. Hồ Chí Minh, Việt Nam",
        availability: {
            monday: "08:00 - 17:00",
            tuesday: "08:00 - 17:00",
            wednesday: "08:00 - 17:00",
            thursday: "08:00 - 17:00",
            friday: "08:00 - 17:00",
            saturday: "09:00 - 15:00",
            sunday: "Nghỉ",
        },
        stats: {
            totalClients: 47,
            successRate: 78,
            totalSessions: 342,
            rating: 4.8,
            reviewCount: 156,
        },
    })

    const [editForm, setEditForm] = useState(profile)

    const handleSave = () => {
        setProfile(editForm)
        setIsEditing(false)
        console.log("Profile updated:", editForm)
    }

    const handleCancel = () => {
        setEditForm(profile)
        setIsEditing(false)
    }

    return (
        <div className="space-y-6">
            {/* Profile Header */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700/50">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={profile.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-2xl">{profile.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{profile.name}</h1>
                                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Chỉnh sửa
                                </Button>
                            </div>
                            <p className="text-lg text-blue-600 dark:text-blue-400 mb-2">{profile.title}</p>
                            <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                                <div className="flex items-center space-x-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>{profile.location}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{profile.experience} năm kinh nghiệm</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Star className="w-4 h-4 text-yellow-500" />
                                    <span>
                                        {profile.stats.rating} ({profile.stats.reviewCount} đánh giá)
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{profile.stats.totalClients}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Tổng khách hàng</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{profile.stats.successRate}%</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Tỷ lệ thành công</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{profile.stats.totalSessions}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Buổi tư vấn</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                                <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{profile.stats.rating}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Đánh giá trung bình</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Information */}
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <User className="w-5 h-5 text-blue-500" />
                            <span>Thông Tin Cá Nhân</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Giới thiệu</label>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{profile.bio}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                            <div className="flex items-center space-x-2 mt-1">
                                <Mail className="w-4 h-4 text-slate-500" />
                                <span className="text-sm">{profile.email}</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Điện thoại</label>
                            <div className="flex items-center space-x-2 mt-1">
                                <Phone className="w-4 h-4 text-slate-500" />
                                <span className="text-sm">{profile.phone}</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Ngôn ngữ</label>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {profile.languages.map((lang, index) => (
                                    <Badge key={index} variant="outline">
                                        {lang}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Specializations & Certifications */}
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Award className="w-5 h-5 text-green-500" />
                            <span>Chuyên Môn & Chứng Chỉ</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Lĩnh vực chuyên môn</label>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {profile.specializations.map((spec, index) => (
                                    <Badge key={index} className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                        {spec}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Chứng chỉ</label>
                            <div className="space-y-2 mt-1">
                                {profile.certifications.map((cert, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span className="text-sm">{cert}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Availability Schedule */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-purple-500" />
                        <span>Lịch Làm Việc</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                        {Object.entries(profile.availability).map(([day, hours]) => (
                            <div key={day} className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                <p className="font-medium text-sm capitalize mb-1">
                                    {day === "monday"
                                        ? "Thứ 2"
                                        : day === "tuesday"
                                            ? "Thứ 3"
                                            : day === "wednesday"
                                                ? "Thứ 4"
                                                : day === "thursday"
                                                    ? "Thứ 5"
                                                    : day === "friday"
                                                        ? "Thứ 6"
                                                        : day === "saturday"
                                                            ? "Thứ 7"
                                                            : "Chủ nhật"}
                                </p>
                                <p className="text-xs text-slate-600 dark:text-slate-400">{hours}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Edit Profile Dialog */}
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Chỉnh Sửa Hồ Sơ</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium">Họ tên</label>
                                <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Chức danh</label>
                                <Input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium">Email</label>
                                <Input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Điện thoại</label>
                                <Input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Giới thiệu</label>
                            <Textarea
                                value={editForm.bio}
                                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                rows={4}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Địa điểm</label>
                            <Input
                                value={editForm.location}
                                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                            />
                        </div>
                        <div className="flex space-x-2">
                            <Button onClick={handleSave} className="flex-1">
                                <Save className="w-4 h-4 mr-2" />
                                Lưu Thay Đổi
                            </Button>
                            <Button onClick={handleCancel} variant="outline" className="flex-1">
                                Hủy
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
