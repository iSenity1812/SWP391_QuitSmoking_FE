"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Sparkles } from "lucide-react"
import { useTask } from "@/hooks/use-task"
import { TaskHeader } from "./components/TaskHeader"
import { QuizTaskComponent } from "./components/QuizTaskComponent"
import { TipTaskComponent } from "./components/TipTaskComponent"
import { TaskLoadingState } from "./components/TaskLoadingState"
import { TaskErrorState } from "./components/TaskErrorState"
import { TaskEmptyState } from "./components/TaskEmptyState"
import { TaskCompletionModal } from "./components/TaskCompletionModal"
import type { QuizAttemptResponseDTO } from "@/types/task"

export default function TaskPage() {
    const {
        currentTask,
        isLoading,
        error,
        stats,
        generateRandomTask,
        submitQuizAttempt,
        markTipCompleted,
        resetTask,
        isQuizTask,
        isTipTask,
    } = useTask()

    const [showCompletionModal, setShowCompletionModal] = useState(false)
    const [completionData, setCompletionData] = useState<QuizAttemptResponseDTO | null>(null)

    useEffect(() => {
        // Auto-generate a task when page loads if no current task
        if (!currentTask && !isLoading && !error) {
            generateRandomTask()
        }
    }, [currentTask, isLoading, error, generateRandomTask])

    const handleQuizSubmit = async (selectedOptionId: number, timeSpent = 30) => {
        if (!currentTask || !currentTask.quizzes || currentTask.quizzes.length === 0) return

        try {
            const quiz = currentTask.quizzes[0] // Get first quiz
            const result = await submitQuizAttempt({
                taskId: currentTask.taskId,
                quizId: quiz.quizId,
                userAnswers: [{ selectedOptionId }],
            })

            setCompletionData(result)
            setShowCompletionModal(true)
        } catch (error) {
            console.error("Failed to submit quiz:", error)
        }
    }

    const handleTipComplete = () => {
        if (!currentTask) return

        markTipCompleted(currentTask.taskId)
        // Auto generate new task after completing tip
        setTimeout(() => {
            generateRandomTask()
        }, 1500)
    }

    const handleNewTask = async () => {
        resetTask()
        await generateRandomTask()
    }

    const handleCloseModal = () => {
        setShowCompletionModal(false)
        setCompletionData(null)
        // Auto generate new task after closing modal
        setTimeout(() => {
            generateRandomTask()
        }, 500)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="container mx-auto px-4 py-8 pt-24">
                {/* Header */}
                <TaskHeader />

                {/* Control Panel */}
                <Card className="mb-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <div className="text-center sm:text-left">
                                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Vượt qua cơn thèm thuốc lá</h2>
                                <p className="text-slate-600 dark:text-slate-400 mt-1">
                                    Hãy thử thách bản thân với các câu hỏi và mẹo hay
                                </p>
                            </div>
                            <div className="flex gap-3">
                                {currentTask && (
                                    <Button
                                        variant="outline"
                                        onClick={resetTask}
                                        disabled={isLoading}
                                        className="flex items-center gap-2 bg-transparent"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        Làm mới
                                    </Button>
                                )}
                                <Button
                                    onClick={handleNewTask}
                                    disabled={isLoading}
                                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    {currentTask ? "Tạo task mới" : "Bắt đầu"}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content */}
                <div className="max-w-4xl mx-auto">
                    <AnimatePresence mode="wait">
                        {isLoading && (
                            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <TaskLoadingState />
                            </motion.div>
                        )}

                        {error && (
                            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <TaskErrorState error={error} onRetry={generateRandomTask} />
                            </motion.div>
                        )}

                        {!isLoading && !error && !currentTask && (
                            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <TaskEmptyState onCreateTask={generateRandomTask} />
                            </motion.div>
                        )}

                        {!isLoading && !error && currentTask && (
                            <motion.div
                                key={`task-${currentTask.taskId}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                {isQuizTask && currentTask.quizzes && currentTask.quizzes.length > 0 && (
                                    <QuizTaskComponent task={currentTask} quiz={currentTask.quizzes[0]} onSubmit={handleQuizSubmit} />
                                )}

                                {isTipTask && currentTask.tips && (
                                    <TipTaskComponent task={currentTask} tip={currentTask.tips} onComplete={handleTipComplete} />
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Quick Stats */}
                    <motion.div
                        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >

                    </motion.div>
                </div>

                {/* Completion Modal */}
                <TaskCompletionModal
                    isOpen={showCompletionModal}
                    onClose={handleCloseModal}
                    completionData={completionData}
                    onNewTask={handleNewTask}
                />
            </div>
        </div>
    )
}
