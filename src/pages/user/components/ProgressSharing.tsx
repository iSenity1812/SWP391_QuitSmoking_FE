"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Users,
    Trophy,
    Target,
    DollarSign,
    Cigarette,
    Calendar,
    Heart,
    Send,
    Globe,
    UserCheck,
    Crown,
    CheckCircle,
} from "lucide-react"
import type { User } from "../types/user-types"

interface ProgressSharingProps {
    user: User
    isOpen: boolean
    onClose: () => void
    onShare?: (shareData: ShareData) => void // New callback for sharing
}

interface ShareData {
    user: User
    content: string
    audience: string
    shareType: string
    timestamp: Date
}

export function ProgressSharing({ user, isOpen, onClose, onShare }: ProgressSharingProps) {
    const [selectedAudience, setSelectedAudience] = useState("community")
    const [customMessage, setCustomMessage] = useState("")
    const [shareType, setShareType] = useState<"achievement" | "milestone" | "stats">("stats")
    const [isSharing, setIsSharing] = useState(false)
    const [shareSuccess, setShareSuccess] = useState(false)

    const audienceOptions = [
        {
            id: "community",
            name: "Cộng đồng",
            description: "Chia sẻ với tất cả thành viên trong cộng đồng",
            icon: Globe,
            color: "bg-blue-500",
            count: "10,000+ thành viên",
        },
        {
            id: "friends",
            name: "Bạn bè",
            description: "Chỉ chia sẻ với bạn bè của bạn",
            icon: UserCheck,
            color: "bg-green-500",
            count: `${user.friends?.length || 0} bạn bè`,
        },
        {
            id: "coaches",
            name: "Chuyên gia",
            description: "Chia sẻ với các chuyên gia và huấn luyện viên",
            icon: Crown,
            color: "bg-purple-500",
            count: "Chuyên gia",
        },
    ]

    const generateShareContent = () => {
        const daysSmokeFreee = Number(user.daysSmokeFreee) || 0
        const moneySaved = Number(user.moneySaved) || 0
        const cigarettesAvoided = Number(user.cigarettesAvoided) || 0

        const baseStats = `🎉 ${daysSmokeFreee} ngày không hút thuốc!\n💰 Tiết kiệm: ${moneySaved.toLocaleString()}đ\n🚭 Tránh được: ${cigarettesAvoided} điếu thuốc`

        switch (shareType) {
            case "achievement":
                return `🏆 Vừa đạt được thành tựu mới!\n\n${baseStats}\n\n${customMessage || "Cảm thấy tự hào về bản thân! 💪"}`
            case "milestone":
                return `🎯 Đạt cột mốc ${user.nextMilestone?.name || "mới"}!\n\n${baseStats}\n\n${customMessage || "Hành trình tiếp tục! 🚀"}`
            default:
                return `${baseStats}\n\n${customMessage || "Mỗi ngày là một chiến thắng! 💪"}`
        }
    }

    const handleShare = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (isSharing) return

        setIsSharing(true)

        try {
            // Create share data object
            const shareData: ShareData = {
                user,
                content: generateShareContent(),
                audience: selectedAudience,
                shareType,
                timestamp: new Date(),
            }

            // Call the onShare callback if provided
            if (onShare) {
                await onShare(shareData)
            }

            // Simulate API call to post to chat/social feed
            await new Promise((resolve) => setTimeout(resolve, 1500))

            // Add to global chat/social feed (you can implement this based on your chat system)
            if (typeof window !== "undefined") {
                // Dispatch custom event for other components to listen
                window.dispatchEvent(
                    new CustomEvent("progressShared", {
                        detail: shareData,
                    }),
                )

                // Store in localStorage for persistence (optional)
                const existingShares = JSON.parse(localStorage.getItem("sharedProgress") || "[]")
                existingShares.unshift(shareData)
                localStorage.setItem("sharedProgress", JSON.stringify(existingShares.slice(0, 50))) // Keep last 50 shares
            }

            setIsSharing(false)
            setShareSuccess(true)

            // Auto close after success
            setTimeout(() => {
                setShareSuccess(false)
                onClose()
            }, 2000)
        } catch (error) {
            console.error("Share failed:", error)
            setIsSharing(false)
        }
    }

    const handleClose = () => {
        if (!isSharing) {
            onClose()
        }
    }

    if (shareSuccess) {
        return (
            <Dialog open={isOpen} onOpenChange={handleClose}>
                <DialogContent className="max-w-md">
                    <div className="text-center py-8">
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Chia sẻ thành công!</h3>
                        <p className="text-slate-600 dark:text-slate-400">
                            Tiến trình của bạn đã được chia sẻ với{" "}
                            {audienceOptions.find((a) => a.id === selectedAudience)?.name.toLowerCase()}
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Chia sẻ tiến trình trong cộng đồng
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Preview Card */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">Xem trước bài đăng</h3>
                        <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {/* User Info */}
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 border-2 border-white/20">
                                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                            <AvatarFallback className="bg-white/20 text-white">{user.name?.charAt(0) || "U"}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">{user.name || "Người dùng"}</p>
                                            <p className="text-sm opacity-80">Vừa xong</p>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="bg-white/10 rounded-lg p-4">
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div className="bg-white/20 rounded-lg p-3 text-center">
                                                <Calendar className="h-5 w-5 mx-auto mb-1" />
                                                <div className="font-bold text-lg">{Number(user.daysSmokeFreee) || 0}</div>
                                                <div className="opacity-80">ngày</div>
                                            </div>
                                            <div className="bg-white/20 rounded-lg p-3 text-center">
                                                <DollarSign className="h-5 w-5 mx-auto mb-1" />
                                                <div className="font-bold text-lg">{Math.floor((Number(user.moneySaved) || 0) / 1000)}K</div>
                                                <div className="opacity-80">tiết kiệm</div>
                                            </div>
                                            <div className="bg-white/20 rounded-lg p-3 text-center">
                                                <Cigarette className="h-5 w-5 mx-auto mb-1" />
                                                <div className="font-bold text-lg">{Number(user.cigarettesAvoided) || 0}</div>
                                                <div className="opacity-80">điếu thuốc</div>
                                            </div>
                                            <div className="bg-white/20 rounded-lg p-3 text-center">
                                                <Heart className="h-5 w-5 mx-auto mb-1" />
                                                <div className="font-bold text-lg">100%</div>
                                                <div className="opacity-80">khỏe mạnh</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div className="text-center">
                                        <p className="whitespace-pre-line text-sm">{generateShareContent()}</p>
                                    </div>

                                    {/* Engagement */}
                                    <div className="flex items-center justify-between pt-2 border-t border-white/20">
                                        <div className="flex items-center gap-4 text-sm opacity-80">
                                            <span>❤️ 24</span>
                                            <span>👏 12</span>
                                            <span>💪 8</span>
                                        </div>
                                        <div className="text-sm opacity-80">5 bình luận</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sharing Options */}
                    <div className="space-y-6">
                        {/* Share Type */}
                        <div>
                            <h3 className="font-semibold mb-3">Loại chia sẻ</h3>
                            <div className="flex gap-2 flex-wrap">
                                <Button
                                    variant={shareType === "stats" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setShareType("stats")}
                                    disabled={isSharing}
                                >
                                    <Target className="h-4 w-4 mr-1" />
                                    Thống kê
                                </Button>
                                <Button
                                    variant={shareType === "achievement" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setShareType("achievement")}
                                    disabled={isSharing}
                                >
                                    <Trophy className="h-4 w-4 mr-1" />
                                    Thành tựu
                                </Button>
                                <Button
                                    variant={shareType === "milestone" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setShareType("milestone")}
                                    disabled={isSharing}
                                >
                                    <Calendar className="h-4 w-4 mr-1" />
                                    Cột mốc
                                </Button>
                            </div>
                        </div>

                        {/* Audience Selection */}
                        <div>
                            <h3 className="font-semibold mb-3">Chia sẻ với</h3>
                            <div className="space-y-3">
                                {audienceOptions.map((option) => (
                                    <button
                                        key={option.id}
                                        type="button"
                                        disabled={isSharing}
                                        className={`w-full p-4 rounded-lg border-2 cursor-pointer transition-all text-left ${selectedAudience === option.id
                                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                            } ${isSharing ? "opacity-50 cursor-not-allowed" : ""}`}
                                        onClick={() => !isSharing && setSelectedAudience(option.id)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div
                                                className={`w-10 h-10 rounded-full ${option.color} flex items-center justify-center flex-shrink-0`}
                                            >
                                                <option.icon className="h-5 w-5 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-medium">{option.name}</h4>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {option.count}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{option.description}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Custom Message */}
                        <div>
                            <h4 className="font-medium mb-2">Tin nhắn cá nhân (tùy chọn)</h4>
                            <Textarea
                                placeholder="Chia sẻ cảm nghĩ của bạn về hành trình bỏ thuốc..."
                                value={customMessage}
                                onChange={(e) => setCustomMessage(e.target.value)}
                                rows={3}
                                disabled={isSharing}
                            />
                        </div>

                        {/* Share Button */}
                        <div className="flex gap-3 pt-4 border-t">
                            <Button onClick={handleClose} variant="outline" className="flex-1" disabled={isSharing} type="button">
                                Hủy
                            </Button>
                            <Button
                                onClick={handleShare}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                                disabled={isSharing}
                                type="button"
                            >
                                {isSharing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Đang chia sẻ...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4 mr-2" />
                                        Chia sẻ ngay
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
