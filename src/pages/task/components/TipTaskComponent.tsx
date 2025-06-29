"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Bookmark, Share2, Lightbulb, CheckCircle } from "lucide-react"
import type { TaskResponseDTO, TipResponseDTO } from "@/types/task"

interface TipTaskComponentProps {
    task: TaskResponseDTO
    tip: TipResponseDTO
    onComplete: () => void
}

export function TipTaskComponent({ task, tip, onComplete }: TipTaskComponentProps) {
    const [isLiked, setIsLiked] = useState(false)
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)

    const handleLike = () => {
        setIsLiked(!isLiked)
    }

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked)
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: "Mẹo hay từ QuitSmoking",
                text: tip.content,
                url: window.location.href,
            })
        } else {
            navigator.clipboard.writeText(`Mẹo hay từ QuitSmoking:\n\n${tip.content}`)
        }
    }

    const handleComplete = () => {
        setIsCompleted(true)
        setTimeout(() => {
            onComplete()
        }, 1000)
    }

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <Card className="max-w-3xl mx-auto shadow-xl border-0 bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-slate-900">
                <CardHeader className="text-center pb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 4 }}
                        >
                            <Lightbulb className="h-6 w-6 text-yellow-500" />
                        </motion.div>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                            Mẹo hay
                        </Badge>
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">
                        Mẹo vượt qua cơn thèm thuốc lá
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-center"
                    >
                        <div className="bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-lg p-6 mb-6 border border-green-200/50 dark:border-green-800/30">
                            <p className="text-lg text-slate-700 dark:text-slate-200 leading-relaxed">{tip.content}</p>
                        </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-wrap justify-center gap-3"
                    >
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLike}
                            className={`${isLiked ? "bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20" : ""}`}
                        >
                            <Heart className={`h-4 w-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
                            {isLiked ? "Đã thích" : "Thích"}
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleBookmark}
                            className={`${isBookmarked ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20" : ""}`}
                        >
                            <Bookmark className={`h-4 w-4 mr-2 ${isBookmarked ? "fill-current" : ""}`} />
                            {isBookmarked ? "Đã lưu" : "Lưu"}
                        </Button>

                        <Button variant="outline" size="sm" onClick={handleShare}>
                            <Share2 className="h-4 w-4 mr-2" />
                            Chia sẻ
                        </Button>
                    </motion.div>

                    {/* Complete Button */}
                    {!isCompleted ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-center pt-4"
                        >
                            <Button
                                onClick={handleComplete}
                                size="lg"
                                className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                            >
                                <CheckCircle className="h-5 w-5 mr-2" />
                                Đã hiểu rồi! ✨
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center pt-4"
                        >
                            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-4 py-2 rounded-full">
                                <CheckCircle className="h-5 w-5" />
                                <span className="font-semibold">Hoàn thành! 🎉</span>
                            </div>
                        </motion.div>
                    )}

                    {/* Motivational Message */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-center text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg"
                    >
                        💪 Mỗi mẹo nhỏ đều góp phần vào thành công lớn của bạn!
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
