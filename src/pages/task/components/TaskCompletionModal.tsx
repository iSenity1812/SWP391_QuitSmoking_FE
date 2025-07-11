"use client"

import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Target, Sparkles } from "lucide-react"
import type { QuizAttemptResponseDTO } from "@/types/task"

interface TaskCompletionModalProps {
    isOpen: boolean
    onClose: () => void
    completionData: QuizAttemptResponseDTO | null
    onNewTask: () => void
}

export function TaskCompletionModal({ isOpen, onClose, completionData, onNewTask }: TaskCompletionModalProps) {
    if (!completionData) return null

    const isSuccess = completionData.correctAnswersCount > 0
    const accuracy = Math.round((completionData.correctAnswersCount / completionData.totalQuestions) * 100)

    const handleNewTask = () => {
        onClose()
        onNewTask()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-2xl">
                <DialogHeader className="text-center pb-2">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                        className="flex justify-center mb-4"
                    >
                        <div
                            className={`p-4 rounded-full ${isSuccess ? "bg-green-100 dark:bg-green-900/30" : "bg-orange-100 dark:bg-orange-900/30"
                                }`}
                        >
                            {isSuccess ? (
                                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                            ) : (
                                <Target className="h-12 w-12 text-orange-600 dark:text-orange-400" />
                            )}
                        </div>
                    </motion.div>

                    <DialogTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                        {isSuccess ? "Xuất sắc! 🎉" : "Cố gắng lên! 💪"}
                    </DialogTitle>
                </DialogHeader>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                >
                    <div className="text-center">
                        <p className="text-slate-600 dark:text-slate-400 mb-4">{completionData.message}</p>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{completionData.totalScore}</div>
                                <div className="text-xs text-blue-600 dark:text-blue-400">Điểm số</div>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{accuracy}%</div>
                                <div className="text-xs text-green-600 dark:text-green-400">Độ chính xác</div>
                            </div>
                        </div>

                        <div className="flex justify-center gap-2 mb-4">
                            <Badge variant={isSuccess ? "default" : "secondary"} className="px-3 py-1">
                                {completionData.correctAnswersCount}/{completionData.totalQuestions} đúng
                            </Badge>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                            Đóng
                        </Button>
                        <Button
                            onClick={handleNewTask}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                        >
                            <Sparkles className="h-4 w-4 mr-2" />
                            Thử thách mới
                        </Button>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2"
                    >
                        {isSuccess ? "🌟 Bạn đang trên đường thành công!" : "📚 Mỗi lần thử đều là một bước tiến!"}
                    </motion.div>
                </motion.div>
            </DialogContent>
        </Dialog>
    )
}
