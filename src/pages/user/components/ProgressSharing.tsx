"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Target, DollarSign, Cigarette, Calendar, Heart, CheckCircle, Clipboard, LinkIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { User } from "../types/user-types"

interface ProgressSharingProps {
    user: User
    isOpen: boolean
    onClose: () => void
}

export function ProgressSharing({ user, isOpen, onClose }: ProgressSharingProps) {
    const [customMessage, setCustomMessage] = useState("")
    const [shareType, setShareType] = useState<"achievement" | "milestone" | "stats">("stats")
    const [isSharing, setIsSharing] = useState(false)
    const [generatedShareLink, setGeneratedShareLink] = useState<string | null>(null)
    const [shareSuccess, setShareSuccess] = useState(false)

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

    const handleGenerateLink = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (isSharing) return

        setIsSharing(true)
        setGeneratedShareLink(null)

        try {
            const uniqueId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
            const linkContent = encodeURIComponent(generateShareContent())
            // Removed recipient parameter from the link
            const link = `https://your-app.com/share/progress/${uniqueId}?content=${linkContent}`

            await new Promise((resolve) => setTimeout(resolve, 1500))

            setGeneratedShareLink(link)
            setIsSharing(false)
            setShareSuccess(true)
        } catch (error) {
            console.error("Failed to generate share link:", error)
            setIsSharing(false)
            setShareSuccess(false)
        }
    }

    const handleCopyLink = () => {
        if (generatedShareLink) {
            navigator.clipboard.writeText(generatedShareLink)
            // Optionally, add a toast notification for "Copied!"
        }
    }

    const handleClose = () => {
        if (!isSharing) {
            setCustomMessage("")
            setShareType("stats")
            setGeneratedShareLink(null)
            setShareSuccess(false)
            onClose()
        }
    }

    if (shareSuccess && generatedShareLink) {
        return (
            <Dialog open={isOpen} onOpenChange={handleClose}>
                <DialogContent className="max-w-md">
                    <div className="text-center py-8">
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Liên kết đã được tạo!</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                            Sao chép liên kết dưới đây để chia sẻ tiến trình của bạn.
                        </p>
                        <div className="flex items-center space-x-2 mb-6">
                            <Input
                                type="text"
                                value={generatedShareLink}
                                readOnly
                                className="flex-1"
                                onClick={(e) => (e.target as HTMLInputElement).select()}
                            />
                            <Button size="icon" onClick={handleCopyLink} className="flex-shrink-0">
                                <Clipboard className="h-4 w-4" />
                                <span className="sr-only">Sao chép liên kết</span>
                            </Button>
                        </div>
                        <Button onClick={handleClose} className="w-full">
                            Hoàn tất
                        </Button>
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
                        <LinkIcon className="h-5 w-5" />
                        Tạo liên kết chia sẻ tiến trình
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Preview Card */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">Xem trước nội dung chia sẻ</h3>
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
                                            <p className="text-sm opacity-80">Bây giờ</p>
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
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sharing Options */}
                    <div className="space-y-6">
                        {/* Share Type */}
                        <div>
                            <h3 className="font-semibold mb-3">Loại nội dung chia sẻ</h3>
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

                        {/* Removed Recipient Input */}
                        {/* <div>
                                  <h3 className="font-semibold mb-3">Gửi liên kết cho ai?</h3>
                                  <Input
                                      placeholder="Nhập tên người dùng hoặc ID"
                                      value={recipientIdentifier}
                                      onChange={(e) => setRecipientIdentifier(e.target.value)}
                                      disabled={isSharing}
                                  />
                              </div> */}

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
                                onClick={handleGenerateLink}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                                disabled={isSharing} // No longer depends on recipientIdentifier
                                type="button"
                            >
                                {isSharing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Đang tạo liên kết...
                                    </>
                                ) : (
                                    <>
                                        <LinkIcon className="h-4 w-4 mr-2" />
                                        Tạo liên kết chia sẻ
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
