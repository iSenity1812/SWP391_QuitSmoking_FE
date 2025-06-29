"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Users,
    MessageCircle,
    Trophy,
    Flame,
    UserPlus,
    UserMinus,
    Crown,
    Medal,
    Award,
    Target,
    TrendingUp,
    Heart,
    Share2,
    UserCheck,
} from "lucide-react"
import type { User, Friend } from "../../types/user-types"

interface SocialTabProps {
    user: User
}

export function SocialTab({ user }: SocialTabProps) {
    const [friends, setFriends] = useState<Friend[]>(user.friends)

    const handleFollowToggle = (friendName: string) => {
        setFriends((prevFriends) =>
            prevFriends.map((friend) =>
                friend.name === friendName
                    ? {
                        ...friend,
                        isFollowing: !friend.isFollowing,
                        followersCount: friend.isFollowing ? (friend.followersCount || 0) - 1 : (friend.followersCount || 0) + 1,
                    }
                    : friend,
            ),
        )
    }

    const handleStartChat = (friendName: string) => {
        console.log(`Starting chat with ${friendName}`)
        // Implement chat functionality here
    }

    // Mock leaderboard data
    const leaderboard = [
        { rank: 1, name: "Lê Văn C", streak: 67, avatar: "/placeholder.svg", level: "Kim cương" },
        { rank: 2, name: "Nguyễn Văn A", streak: 45, avatar: "/placeholder.svg", level: "Bạc" },
        { rank: 3, name: "Trần Thị B", streak: 32, avatar: "/placeholder.svg", level: "Đồng" },
        { rank: 4, name: "Phạm Thị D", streak: 21, avatar: "/placeholder.svg", level: "Đồng" },
        { rank: 5, name: "Hoàng Văn E", streak: 18, avatar: "/placeholder.svg", level: "Đồng" },
    ]

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Crown className="h-5 w-5 text-yellow-500" />
            case 2:
                return <Medal className="h-5 w-5 text-gray-400" />
            case 3:
                return <Award className="h-5 w-5 text-amber-600" />
            default:
                return <Target className="h-5 w-5 text-slate-400" />
        }
    }

    const getLevelColor = (level: string) => {
        switch (level.toLowerCase()) {
            case "kim cương":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
            case "bạc":
                return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
            case "đồng":
                return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
            default:
                return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400"
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Cộng đồng</h2>
                <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                        <UserCheck className="h-4 w-4" />
                        <span>{user.followingCount || 0} Đang theo dõi</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{user.followersCount || 0} Người theo dõi</span>
                    </div>
                </div>
            </div>

            {/* Social Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                    <CardContent className="p-6 text-center">
                        <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <Users className="h-8 w-8" />
                        </div>
                        <p className="text-3xl font-bold mb-2">{friends.length}</p>
                        <p className="text-blue-100 text-sm">Bạn bè</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg">
                    <CardContent className="p-6 text-center">
                        <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <Trophy className="h-8 w-8" />
                        </div>
                        <p className="text-3xl font-bold mb-2">2</p>
                        <p className="text-emerald-100 text-sm">Thứ hạng</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
                    <CardContent className="p-6 text-center">
                        <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <Heart className="h-8 w-8" />
                        </div>
                        <p className="text-3xl font-bold mb-2">127</p>
                        <p className="text-purple-100 text-sm">Lượt thích</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Friends List */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Bạn bè ({friends.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {friends.map((friend, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={friend.avatar || "/placeholder.svg"} alt={friend.name} />
                                            <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div
                                            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${friend.status === "online" ? "bg-emerald-500" : "bg-slate-400"
                                                }`}
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-white">{friend.name}</p>
                                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                            <Flame className="h-4 w-4 text-orange-500" />
                                            <span>{friend.streak} ngày</span>
                                            {friend.followersCount && (
                                                <>
                                                    <span>•</span>
                                                    <span>{friend.followersCount} người theo dõi</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleFollowToggle(friend.name)}
                                        className={
                                            friend.isFollowing
                                                ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400"
                                                : ""
                                        }
                                    >
                                        {friend.isFollowing ? (
                                            <>
                                                <UserMinus className="h-4 w-4 mr-1" />
                                                Bỏ theo dõi
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="h-4 w-4 mr-1" />
                                                Theo dõi
                                            </>
                                        )}
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleStartChat(friend.name)}>
                                        <MessageCircle className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Leaderboard */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="h-5 w-5" />
                            Bảng xếp hạng tuần
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {leaderboard.map((user, index) => (
                            <div
                                key={index}
                                className={`flex items-center justify-between p-3 rounded-lg ${user.name === "Nguyễn Văn A"
                                        ? "bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800"
                                        : "bg-slate-50 dark:bg-slate-800"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        {getRankIcon(user.rank)}
                                        <span className="font-bold text-lg text-slate-700 dark:text-slate-300">#{user.rank}</span>
                                    </div>
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-white">{user.name}</p>
                                        <Badge variant="secondary" className={getLevelColor(user.level)}>
                                            {user.level}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                                        <Flame className="h-4 w-4" />
                                        <span className="font-bold">{user.streak}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">ngày</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Recent Community Activity */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Hoạt động cộng đồng gần đây
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[
                        {
                            user: "Trần Thị B",
                            action: "đã đạt được thành tựu 'Tuần đầu tiên'",
                            time: "2 giờ trước",
                            type: "achievement",
                        },
                        {
                            user: "Lê Văn C",
                            action: "đã chia sẻ kinh nghiệm cai thuốc",
                            time: "4 giờ trước",
                            type: "share",
                        },
                        {
                            user: "Phạm Thị D",
                            action: "đã hoàn thành 21 ngày không hút thuốc",
                            time: "6 giờ trước",
                            type: "milestone",
                        },
                        {
                            user: "Hoàng Văn E",
                            action: "đã tham gia thử thách 'Tiết kiệm 1 triệu'",
                            time: "8 giờ trước",
                            type: "challenge",
                        },
                    ].map((activity, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src="/placeholder.svg" alt={activity.user} />
                                <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="text-sm text-slate-900 dark:text-white">
                                    <span className="font-medium">{activity.user}</span> {activity.action}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{activity.time}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                    <Heart className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                    <Share2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
