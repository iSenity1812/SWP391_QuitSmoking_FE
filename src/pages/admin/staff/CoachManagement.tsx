"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserCheck, Search, Filter, Edit, Trash2, Star, Calendar, MessageSquare } from "lucide-react"

interface Coach {
    id: number
    name: string
    email: string
    avatar?: string
    specialization: string
    experience: number
    rating: number
    totalSessions: number
    activeClients: number
    status: "active" | "inactive" | "on-leave"
    joinDate: string
    lastActive: string
    certifications: string[]
}

export function CoachManagement() {
    const [coaches, setCoaches] = useState<Coach[]>([
        {
            id: 1,
            name: "Dr. Nguyễn Văn A",
            email: "dr.nguyenvana@email.com",
            avatar: "/placeholder.svg?height=40&width=40",
            specialization: "Tâm lý học lâm sàng",
            experience: 8,
            rating: 4.9,
            totalSessions: 234,
            activeClients: 15,
            status: "active",
            joinDate: "2023-06-15T00:00:00Z",
            lastActive: "2024-01-20T10:30:00Z",
            certifications: ["Chứng chỉ tâm lý học", "Chứng chỉ cai nghiện"],
        },
        {
            id: 2,
            name: "Dr. Trần Thị B",
            email: "dr.tranthib@email.com",
            specialization: "Y học gia đình",
            experience: 12,
            rating: 4.8,
            totalSessions: 456,
            activeClients: 20,
            status: "active",
            joinDate: "2023-03-10T00:00:00Z",
            lastActive: "2024-01-19T15:20:00Z",
            certifications: ["Bác sĩ đa khoa", "Chuyên khoa hô hấp"],
        },
    ])

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
            case "inactive":
                return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
            case "on-leave":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
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
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-slate-900 dark:text-white">Quản Lý Coach</CardTitle>
                            <CardDescription className="text-slate-600 dark:text-slate-400">
                                Quản lý đội ngũ coach và chuyên gia tư vấn
                            </CardDescription>
                        </div>
                        <div className="flex space-x-2">
                            <Button>
                                <UserCheck className="w-4 h-4 mr-2" />
                                Thêm Coach
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
                <CardContent>
                    <div className="space-y-4">
                        {coaches.map((coach) => (
                            <div
                                key={coach.id}
                                className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4 flex-1">
                                        <Avatar className="h-16 w-16">
                                            <AvatarImage src={coach.avatar || "/placeholder.svg"} />
                                            <AvatarFallback>{coach.name.split(" ").pop()?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <h4 className="font-medium text-slate-900 dark:text-white text-lg">{coach.name}</h4>
                                                <Badge className={getStatusColor(coach.status)}>
                                                    {coach.status === "active"
                                                        ? "Hoạt động"
                                                        : coach.status === "inactive"
                                                            ? "Không hoạt động"
                                                            : "Nghỉ phép"}
                                                </Badge>
                                            </div>
                                            <p className="text-slate-600 dark:text-slate-400 mb-2">{coach.email}</p>
                                            <p className="text-slate-700 dark:text-slate-300 mb-3">
                                                <strong>Chuyên môn:</strong> {coach.specialization} • {coach.experience} năm kinh nghiệm
                                            </p>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                                                <div className="text-center p-3 bg-white dark:bg-slate-600/50 rounded">
                                                    <div className="flex items-center justify-center space-x-1 mb-1">
                                                        {getRatingStars(coach.rating)}
                                                    </div>
                                                    <div className="text-lg font-semibold text-slate-900 dark:text-white">{coach.rating}</div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">Đánh giá</div>
                                                </div>
                                                <div className="text-center p-3 bg-white dark:bg-slate-600/50 rounded">
                                                    <div className="text-lg font-semibold text-slate-900 dark:text-white">
                                                        {coach.totalSessions}
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">Buổi tư vấn</div>
                                                </div>
                                                <div className="text-center p-3 bg-white dark:bg-slate-600/50 rounded">
                                                    <div className="text-lg font-semibold text-slate-900 dark:text-white">
                                                        {coach.activeClients}
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">Khách hàng</div>
                                                </div>
                                                <div className="text-center p-3 bg-white dark:bg-slate-600/50 rounded">
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">Tham gia</div>
                                                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                                                        {new Date(coach.joinDate).toLocaleDateString("vi-VN")}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <h5 className="text-sm font-medium text-slate-900 dark:text-white mb-2">Chứng chỉ:</h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {coach.certifications.map((cert, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs">
                                                            {cert}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
                                                <span className="flex items-center">
                                                    <Calendar className="w-3 h-3 mr-1" />
                                                    Hoạt động cuối: {new Date(coach.lastActive).toLocaleDateString("vi-VN")}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
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
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
