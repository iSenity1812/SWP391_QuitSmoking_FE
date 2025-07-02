"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
    Heart,
    MessageCircle,
    Share2,
    Calendar,
    DollarSign,
    Cigarette,
    Trophy,
    Target,
    MoreHorizontal,
} from "lucide-react"

interface ShareData {
    user: {
        name: string
        avatar?: string
        daysSmokeFreee: number
        moneySaved: number
        cigarettesAvoided: number
    }
    content: string
    audience: string
    shareType: string
    timestamp: Date
    id?: string
}

interface SocialFeedProps {
    className?: string
}

export function SocialFeed({ className = "" }: SocialFeedProps) {
    const [posts, setPosts] = useState<ShareData[]>([])
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())

    // Sample initial posts - removed recent activity section
    const samplePosts: ShareData[] = [
        {
            id: "1",
            user: {
                name: "Nguyễn Văn A",
                avatar: "/placeholder.svg",
                daysSmokeFreee: 45,
                moneySaved: 450000,
                cigarettesAvoided: 450,
            },
            content:
                "🎉 45 ngày không hút thuốc!\n💰 Tiết kiệm: 450,000đ\n🚭 Tránh được: 450 điếu thuốc\n\nMỗi ngày là một chiến thắng! 💪",
            audience: "community",
            shareType: "stats",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        },
        {
            id: "2",
            user: {
                name: "Trần Thị B",
                avatar: "/placeholder.svg",
                daysSmokeFreee: 30,
                moneySaved: 300000,
                cigarettesAvoided: 300,
            },
            content:
                "🏆 Vừa đạt được thành tựu mới!\n\n🎉 30 ngày không hút thuốc!\n💰 Tiết kiệm: 300,000đ\n🚭 Tránh được: 300 điếu thuốc\n\nCảm thấy tự hào về bản thân! 💪",
            audience: "community",
            shareType: "achievement",
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        },
    ]

    useEffect(() => {
        // Load existing posts from localStorage
        const savedPosts = localStorage.getItem("sharedProgress")
        if (savedPosts) {
            try {
                const parsedPosts = JSON.parse(savedPosts).map((post: any) => ({
                    ...post,
                    timestamp: new Date(post.timestamp),
                    id: post.id || Math.random().toString(36).substr(2, 9),
                }))
                setPosts([...parsedPosts, ...samplePosts])
            } catch (error) {
                console.error("Error parsing saved posts:", error)
                setPosts(samplePosts)
            }
        } else {
            setPosts(samplePosts)
        }

        // Listen for new shared progress
        const handleProgressShared = (event: CustomEvent) => {
            console.log("New progress shared:", event.detail)
            const newPost = {
                ...event.detail,
                id: Math.random().toString(36).substr(2, 9),
            }
            setPosts((prev) => [newPost, ...prev])

            // Update localStorage
            const updatedPosts = [newPost, ...posts]
            localStorage.setItem("sharedProgress", JSON.stringify(updatedPosts.slice(0, 50)))
        }

        window.addEventListener("progressShared", handleProgressShared as EventListener)

        return () => {
            window.removeEventListener("progressShared", handleProgressShared as EventListener)
        }
    }, [])

    const handleLike = (postId: string) => {
        setLikedPosts((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(postId)) {
                newSet.delete(postId)
            } else {
                newSet.add(postId)
            }
            return newSet
        })
    }

    const formatTimeAgo = (timestamp: Date) => {
        const now = new Date()
        const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))

        if (diffInMinutes < 1) return "Vừa xong"
        if (diffInMinutes < 60) return `${diffInMinutes} phút trước`
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`
        return `${Math.floor(diffInMinutes / 1440)} ngày trước`
    }

    const getShareTypeIcon = (shareType: string) => {
        switch (shareType) {
            case "achievement":
                return <Trophy className="h-4 w-4 text-yellow-500" />
            case "milestone":
                return <Target className="h-4 w-4 text-blue-500" />
            default:
                return <Calendar className="h-4 w-4 text-emerald-500" />
        }
    }

    const getShareTypeLabel = (shareType: string) => {
        switch (shareType) {
            case "achievement":
                return "Thành tựu"
            case "milestone":
                return "Cột mốc"
            default:
                return "Thống kê"
        }
    }

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Bảng tin cộng đồng</h2>
                <Badge variant="secondary" className="text-xs">
                    {posts.length} bài đăng
                </Badge>
            </div>

            {/* Removed "Hoạt động cộng đồng gần đây" section - keeping only main posts */}

            {posts.length === 0 ? (
                <Card>
                    <CardContent className="p-8 text-center">
                        <div className="text-slate-400 mb-4">
                            <MessageCircle className="h-12 w-12 mx-auto mb-2" />
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">Chưa có bài đăng nào. Hãy chia sẻ tiến trình của bạn!</p>
                    </CardContent>
                </Card>
            ) : (
                posts.map((post) => (
                    <Card key={post.id} className="overflow-hidden">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={post.user.avatar || "/placeholder.svg"} alt={post.user.name} />
                                        <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-slate-900 dark:text-white">{post.user.name}</p>
                                            <div className="flex items-center gap-1">
                                                {getShareTypeIcon(post.shareType)}
                                                <span className="text-xs text-slate-500">{getShareTypeLabel(post.shareType)}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{formatTimeAgo(post.timestamp)}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="pt-0">
                            {/* Progress Stats */}
                            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-lg p-4 mb-4">
                                <div className="grid grid-cols-3 gap-3 text-center text-sm">
                                    <div className="bg-white/20 rounded-lg p-3">
                                        <Calendar className="h-4 w-4 mx-auto mb-1" />
                                        <div className="font-bold text-lg">{post.user.daysSmokeFreee}</div>
                                        <div className="opacity-80">ngày</div>
                                    </div>
                                    <div className="bg-white/20 rounded-lg p-3">
                                        <DollarSign className="h-4 w-4 mx-auto mb-1" />
                                        <div className="font-bold text-lg">{Math.floor(post.user.moneySaved / 1000)}K</div>
                                        <div className="opacity-80">tiết kiệm</div>
                                    </div>
                                    <div className="bg-white/20 rounded-lg p-3">
                                        <Cigarette className="h-4 w-4 mx-auto mb-1" />
                                        <div className="font-bold text-lg">{post.user.cigarettesAvoided}</div>
                                        <div className="opacity-80">điếu thuốc</div>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="mb-4">
                                <p className="whitespace-pre-line text-slate-700 dark:text-slate-300">{post.content}</p>
                            </div>

                            {/* Engagement */}
                            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                                <div className="flex items-center gap-4">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleLike(post.id!)}
                                        className={`hover:bg-red-50 hover:text-red-600 ${likedPosts.has(post.id!) ? "text-red-600 bg-red-50" : "text-slate-600"
                                            }`}
                                    >
                                        <Heart className={`h-4 w-4 mr-1 ${likedPosts.has(post.id!) ? "fill-current" : ""}`} />
                                        {likedPosts.has(post.id!) ? "Đã thích" : "Thích"}
                                    </Button>
                                    <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-600">
                                        <MessageCircle className="h-4 w-4 mr-1" />
                                        Bình luận
                                    </Button>
                                    <Button variant="ghost" size="sm" className="hover:bg-green-50 hover:text-green-600">
                                        <Share2 className="h-4 w-4 mr-1" />
                                        Chia sẻ
                                    </Button>
                                </div>
                                <div className="text-sm text-slate-500">{Math.floor(Math.random() * 20) + 5} lượt thích</div>
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    )
}
