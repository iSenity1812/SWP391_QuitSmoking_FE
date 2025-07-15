"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { useTask } from "@/hooks/use-task"
import { TaskHeader } from "./components/TaskHeader"
import { QuizTaskComponent } from "./components/QuizTaskComponent"
import { TipTaskComponent } from "./components/TipTaskComponent"
import { TaskLoadingState } from "./components/TaskLoadingState"
import { TaskErrorState } from "./components/TaskErrorState"
import { TaskEmptyState } from "./components/TaskEmptyState"
import { TaskCompletionModal } from "./components/TaskCompletionModal"

export default function TaskPage() {
    const {
        currentTask,
        isLoading,
        error,
        stats,
        generateNewTask,
        handleQuizAnswer,
        markQuizTaskCompleted,
        markTipTaskCompleted,
        resetTask,
        isQuizTask,
        isTipTask,
        currentQuizIndex,
        quizResults,
        totalCorrectAnswers,
        goToNextQuiz,
        resetSession,
        isDataLoaded,
    } = useTask()

    const [showCompletionModal, setShowCompletionModal] = useState(false)
    const [completionData, setCompletionData] = useState<{
        type: 'QUIZ' | 'TIP';
        correctAnswersCount?: number;
        totalQuestions?: number;
        message: string;
    } | null>(null)

    useEffect(() => {
        // Auto-generate a task when page loads if no current task and data is loaded
        if (!currentTask && !isLoading && !error && isDataLoaded) {
            generateNewTask()
        }
    }, [currentTask, isLoading, error, isDataLoaded, generateNewTask])

    // Xử lý khi một câu hỏi quiz được trả lời
    const handleAnswerAndAdvance = useCallback((quizId: string, selectedOptionId: number | null) => {
        // Step 1: Update the quiz result in the hook's state
        // This will cause TaskPage to re-render, and QuizTaskComponent will receive the updated quizAttemptResult prop.
        handleQuizAnswer(quizId, selectedOptionId || 0); // Pass 0 if null for consistency with BE logic

        // Step 2: After a delay, advance to the next quiz or complete the task
        setTimeout(() => {
            if (currentTask && currentTask.type === 'QUIZ' && currentTask.quizzes) {
                if (currentQuizIndex < currentTask.quizzes.length - 1) {
                    goToNextQuiz(); // Move to the next quiz
                } else {
                    // All quizzes in the task are completed
                    markQuizTaskCompleted();
                    setCompletionData({
                        type: 'QUIZ',
                        correctAnswersCount: totalCorrectAnswers + (quizResults.get(quizId) ? 1 : 0), // Ensure final correct count is accurate
                        totalQuestions: currentTask.quizzes.length,
                        message: "Bạn đã hoàn thành thử thách Quiz!",
                    });
                    setShowCompletionModal(true);
                }
            }
        }, 1500); // Wait 1.5 seconds before advancing
    }, [currentTask, currentQuizIndex, handleQuizAnswer, goToNextQuiz, markQuizTaskCompleted, quizResults, totalCorrectAnswers]);


    // Xử lý khi tip task hoàn thành
    const handleTipComplete = useCallback(() => {
        markTipTaskCompleted();
        setCompletionData({
            type: 'TIP',
            message: "Bạn đã hoàn thành thử thách Tip!",
        });
        setShowCompletionModal(true);
    }, [markTipTaskCompleted]);

    const handleCloseModal = useCallback(() => {
        setShowCompletionModal(false);
        setCompletionData(null);
        resetTask(); // Reset task hiện tại sau khi đóng modal
    }, [resetTask]);

    const handleNewTaskFromModal = useCallback(() => {
        handleCloseModal(); // Đóng modal
        generateNewTask(); // Tạo thử thách mới
    }, [handleCloseModal, generateNewTask]);

    const handleResetSessionFromModal = useCallback(() => {
        handleCloseModal(); // Đóng modal
        resetSession(); // Reset phiên
        // Chờ một chút để state được cập nhật trước khi tạo task mới
        setTimeout(() => {
            generateNewTask(); // Tạo thử thách mới
        }, 100);
    }, [handleCloseModal, resetSession, generateNewTask]);


    if (isLoading) {
        return <TaskLoadingState />
    }

    if (error) {
        return <TaskErrorState error={error} onRetry={generateNewTask} />
    }

    if (!currentTask) {
        return <TaskEmptyState onCreateTask={generateNewTask} />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-950 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="w-full max-w-4xl">
                <TaskHeader />

                <div className="mt-8">
                    <AnimatePresence mode="wait">
                        {currentTask && (
                            <motion.div
                                key={`${currentTask.type}-${currentQuizIndex}`} // Key để kích hoạt animation khi task hoặc quiz index thay đổi
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                {isQuizTask && currentTask.quizzes && currentTask.quizzes.length > 0 && (
                                    <QuizTaskComponent
                                        quiz={currentTask.quizzes[currentQuizIndex]} // Truyền câu hỏi hiện tại
                                        onAnswerSelected={handleAnswerAndAdvance} // Callback khi chọn đáp án
                                        isLastQuiz={currentQuizIndex === currentTask.quizzes.length - 1} // Kiểm tra có phải câu cuối không
                                        quizAttemptResult={quizResults.get(currentTask.quizzes[currentQuizIndex].quizId)} // Truyền kết quả của câu hiện tại
                                    />
                                )}

                                {isTipTask && currentTask.tips && currentTask.tips.length > 0 && (
                                    <TipTaskComponent
                                        tips={currentTask.tips} // Truyền danh sách tips
                                        onComplete={handleTipComplete}
                                    />
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
                        <Card className="p-4 text-center bg-white dark:bg-slate-800 shadow-md rounded-lg">
                            <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">Tổng số thử thách đã hoàn thành</h4>
                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{stats.totalCompleted}</p>
                        </Card>
                        <Card className="p-4 text-center bg-white dark:bg-slate-800 shadow-md rounded-lg">
                            <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">Độ chính xác Quiz</h4>
                            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{stats.accuracy.toFixed(0)}%</p>
                        </Card>
                        <Card className="p-4 text-center bg-white dark:bg-slate-800 shadow-md rounded-lg">
                            <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">Chuỗi hoàn thành</h4>
                            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">{stats.streak} ngày</p>
                        </Card>
                    </motion.div>
                </div>

                {/* Completion Modal */}
                <TaskCompletionModal
                    isOpen={showCompletionModal}
                    onClose={handleCloseModal}
                    completionData={completionData}
                    onNewTask={handleNewTaskFromModal}
                    onResetSession={handleResetSessionFromModal}
                />
            </div>
        </div>
    )
}
