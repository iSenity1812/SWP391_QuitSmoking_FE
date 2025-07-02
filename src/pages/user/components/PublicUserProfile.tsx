"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
    ArrowLeft,
    Calendar,
    Flame,
    Target,
    Trophy,
    Users,
    UserPlus,
    UserMinus,
    Award,
    Heart,
    Star,
} from "lucide-react"
import { getPublicUserById } from "../data/public-user-data"
import type { PublicUser } from "../types/public-user-types"

export function PublicUserProfile() {
    const { userId } = useParams<{ userId: string }>()
    const navigate = useNavigate()
    const [user, setUser] = useState<PublicUser | null>(null)
    const [isFollowing, setIsFollowing] = useState(false)

    useEffect(() => {
        if (userId) {
            const userData = getPublicUserById(userId)
            if (userData) {
                setUser(userData)
                setIsFollowing(userData.isFollowing || false)
            }
        }
    }, [userId])

    const handleFollowToggle = () => {
        setIsFollowing(!isFollowing)
        if (user) {
            setUser({
                ...user,
                followersCount: isFollowing ? user.followersCount - 1 : user.followersCount + 1,
            })
        }
    }

    const handleGoHome = () => {
        navigate("/")
    }

    const getAchievementIcon = (icon: string) => {
        switch (icon) {
            case "flame":
                return <Flame className="h-5 w-5 text-orange-500" />
            case "users":
                return <Users className="h-5 w-5 text-blue-500" />
            case "target":
                return <Target className="h-5 w-5 text-green-500" />
            case "calendar":
                return <Calendar className="h-5 w-5 text-purple-500" />
            default:
                return <Award className="h-5 w-5 text-yellow-500" />
        }
    }

    const getCategoryColor = (category: string) => {
        switch (category) {
            case "streak":
                return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
            case "health":
                return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            case "social":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
            case "milestone":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
        }
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-4">
                <div className="max-w-4xl mx-auto">
                    <Button variant="ghost" onClick={handleGoHome} className="mb-6">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại
                    </Button>
                    <Card>
                        <CardContent className="p-8 text-center">
                            <p className="text-slate-600 dark:text-slate-400">Không tìm thấy người dùng</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-4">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        onClick={handleGoHome}
                        className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại
                    </Button>
                </div>

                {/* Profile Header */}
                <Card className="overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32"></div>
                    <CardContent className="relative pt-0 pb-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16 px-6">
                            <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>

                            <div className="flex-1 sm:mt-16">
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{user.name}</h1>

                                {/* Social Stats moved here - right next to name */}
                                <div className="flex items-center gap-6 mb-3">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-blue-500" />
                                        <span className="font-semibold text-slate-900 dark:text-white">{user.followersCount}</span>
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Người theo dõi</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Heart className="h-4 w-4 text-red-500" />
                                        <span className="font-semibold text-slate-900 dark:text-white">{user.followingCount}</span>
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Đang theo dõi</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>Tham gia {new Date(user.joinDate).toLocaleDateString("vi-VN")}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Button
                                        onClick={handleFollowToggle}
                                        className={
                                            isFollowing
                                                ? "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300"
                                                : "bg-blue-600 text-white hover:bg-blue-700"
                                        }
                                    >
                                        {isFollowing ? (
                                            <>
                                                <UserMinus className="h-4 w-4 mr-2" />
                                                Bỏ theo dõi
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="h-4 w-4 mr-2" />
                                                Theo dõi
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Cards - Only showing streak, plans, and achievements */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
                        <CardContent className="p-6 text-center">
                            <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <Flame className="h-8 w-8" />
                            </div>
                            <p className="text-3xl font-bold mb-2">{user.currentStreak}</p>
                            <p className="text-orange-100 text-sm">Ngày streak hiện tại</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0">
                        <CardContent className="p-6 text-center">
                            <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <Target className="h-8 w-8" />
                            </div>
                            <p className="text-3xl font-bold mb-2">{user.totalPlans}</p>
                            <p className="text-green-100 text-sm">Tổng số kế hoạch</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0">
                        <CardContent className="p-6 text-center">
                            <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <Trophy className="h-8 w-8" />
                            </div>
                            <p className="text-3xl font-bold mb-2">{user.achievements.length}</p>
                            <p className="text-purple-100 text-sm">Thành tích đạt được</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Achievements */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-yellow-500" />
                            Thành tích công khai ({user.achievements.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {user.achievements.length === 0 ? (
                            <div className="text-center py-8">
                                <Star className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-600 dark:text-slate-400">Chưa có thành tích công khai nào</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {user.achievements.map((achievement) => (
                                    <div
                                        key={achievement.id}
                                        className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                                    >
                                        <div className="bg-white dark:bg-slate-700 p-3 rounded-full shadow-sm">
                                            {getAchievementIcon(achievement.icon)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="font-semibold text-slate-900 dark:text-white">{achievement.title}</h4>
                                                <Badge className={getCategoryColor(achievement.category)}>
                                                    {achievement.category === "streak" && "Streak"}
                                                    {achievement.category === "health" && "Sức khỏe"}
                                                    {achievement.category === "social" && "Xã hội"}
                                                    {achievement.category === "milestone" && "Cột mốc"}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{achievement.description}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-500">
                                                Đạt được: {new Date(achievement.earnedDate).toLocaleDateString("vi-VN")}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
