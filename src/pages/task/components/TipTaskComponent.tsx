"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {Bookmark, Lightbulb, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react"
import type { TipResponseDTO } from "@/types/task"

interface TipTaskComponentProps {
    tips: TipResponseDTO[]
    onComplete: () => void
}

export function TipTaskComponent({ tips, onComplete }: TipTaskComponentProps) {
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [currentTipIndex, setCurrentTipIndex] = useState(0) // Để duyệt qua các tips
    const [isCompleted, setIsCompleted] = useState(false)

    const currentTip = tips[currentTipIndex]

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked)
    }

    const handleMarkComplete = () => {
        setIsCompleted(true)
        onComplete() // Gọi callback để đánh dấu task hoàn thành ở parent
    }

    const handleNextTip = () => {
        if (currentTipIndex < tips.length - 1) {
            setCurrentTipIndex(prev => prev + 1);
        }
    };

    const handlePreviousTip = () => {
        if (currentTipIndex > 0) {
            setCurrentTipIndex(prev => prev - 1);
        }
    };

    if (!currentTip) {
        return (
            <Card className="max-w-2xl mx-auto shadow-xl border-0 bg-gradient-to-br from-white to-yellow-50 dark:from-slate-800 dark:to-slate-900">
                <CardContent className="p-8 text-center">
                    <p className="text-slate-600 dark:text-slate-300">Không tìm thấy mẹo nào.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <Card className="max-w-3xl mx-auto shadow-xl border-0 bg-gradient-to-br from-white to-yellow-50 dark:from-slate-800 dark:to-slate-900">
                <CardHeader className="text-center pb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Lightbulb className="h-6 w-6 text-yellow-600" />
                        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                            Mẹo cai thuốc
                        </Badge>
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">
                        Mẹo số {currentTipIndex + 1} / {tips.length}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6 pt-0">
                    <motion.p
                        key={currentTip.tipId} // Key để kích hoạt animation khi tip thay đổi
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-lg text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-700 p-4 rounded-lg shadow-inner"
                    >
                        {currentTip.content}
                    </motion.p>

                    <div className="flex justify-center gap-4 mt-6">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleBookmark}
                            className={isBookmarked ? "text-blue-500" : "text-slate-500 hover:text-blue-500"}
                            title="Lưu lại"
                        >
                            <Bookmark className="h-6 w-6" fill={isBookmarked ? "currentColor" : "none"} />
                        </Button>
                    </div>

                    <div className="flex justify-between gap-3 pt-4">
                        <Button
                            onClick={handlePreviousTip}
                            disabled={currentTipIndex === 0 || isCompleted}
                            variant="outline"
                            className="flex-1 bg-transparent"
                        >
                            <ChevronLeft className="h-5 w-5 mr-2" />
                            Mẹo trước
                        </Button>
                        {currentTipIndex < tips.length - 1 ? (
                            <Button
                                onClick={handleNextTip}
                                disabled={isCompleted}
                                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                            >
                                Mẹo tiếp theo
                                <ChevronRight className="h-5 w-5 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleMarkComplete}
                                disabled={isCompleted}
                                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                            >
                                <CheckCircle className="h-5 w-5 mr-2" />
                                Đã hiểu rồi! ✨
                            </Button>
                        )}
                    </div>

                    {isCompleted ? (
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
                    ) : (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="text-center text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg mt-4"
                        >
                            💪 Mỗi mẹo nhỏ đều góp phần vào thành công lớn của bạn!
                        </motion.p>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    )
}
