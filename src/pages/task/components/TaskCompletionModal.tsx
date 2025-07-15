"use client"

import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Target, Sparkles, RefreshCw } from "lucide-react"

interface TaskCompletionModalProps {
    isOpen: boolean;
    onClose: () => void;
    completionData: {
        type: 'QUIZ' | 'TIP';
        correctAnswersCount?: number;
        totalQuestions?: number;
        message: string;
    } | null;
    onNewTask: () => void;
    onResetSession: () => void;
}

export function TaskCompletionModal({ isOpen, onClose, completionData, onNewTask, onResetSession }: TaskCompletionModalProps) {
    if (!completionData) return null

    const isSuccess = completionData.type === 'QUIZ' ? (completionData.correctAnswersCount || 0) > 0 : true;
    const accuracy = completionData.type === 'QUIZ' && completionData.totalQuestions
        ? Math.round(((completionData.correctAnswersCount || 0) / completionData.totalQuestions) * 100)
        : null;

    const handleNewTask = () => {
        onNewTask()
    }

    const handleResetSession = () => {
        onResetSession();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-2xl">
                <DialogHeader className="text-center pb-2">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="flex justify-center mb-4"
                    >
                        <div className={`p-3 rounded-full ${isSuccess ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"}`}>
                            {isSuccess ? (
                                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                            ) : (
                                <Target className="h-8 w-8 text-red-600 dark:text-red-400" />
                            )}
                        </div>
                    </motion.div>
                    <DialogTitle className="text-2xl font-bold text-slate-800 dark:text-white">
                        {completionData.message}
                    </DialogTitle>
                </DialogHeader>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center space-y-4"
                >
                    {completionData.type === 'QUIZ' && (
                        <div className="flex justify-center gap-2">
                            <Badge variant={isSuccess ? "default" : "secondary"} className="px-3 py-1">
                                {(completionData.correctAnswersCount || 0)}/{(completionData.totalQuestions || 0)} đúng
                            </Badge>
                            {accuracy !== null && (
                                <Badge variant="outline" className="px-3 py-1">
                                    Độ chính xác: {accuracy}%
                                </Badge>
                            )}
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        <Button
                            onClick={handleNewTask}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                        >
                            <Sparkles className="h-4 w-4 mr-2" />
                            Thử thách mới
                        </Button>
                        <Button variant="outline" onClick={handleResetSession} className="flex-1 bg-transparent">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reset phiên (có thể lặp lại thử thách)
                        </Button>
                        <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                            Đóng
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
