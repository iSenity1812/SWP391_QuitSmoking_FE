"use client"

import { useState, useCallback, useEffect } from "react"
import { TaskService } from "@/services/taskService"
import type { Task, Quiz, QuizResult, QuizSequenceState, QuizAttemptRequest, QuizAttemptResponse } from "@/types/task"

// ==================== ANIMATION HOOK ====================
export interface AnimationState {
    isAnimating: boolean
    animationType: "correct" | "incorrect" | "appear" | null
}

export const useTaskAnimation = () => {
    const [animationState, setAnimationState] = useState<AnimationState>({
        isAnimating: false,
        animationType: null,
    })

    const triggerAnimation = useCallback((type: "correct" | "incorrect" | "appear") => {
        setAnimationState({
            isAnimating: true,
            animationType: type,
        })
    }, [])

    const resetAnimation = useCallback(() => {
        setAnimationState({
            isAnimating: false,
            animationType: null,
        })
    }, [])

    // Auto reset animation after duration
    useEffect(() => {
        if (animationState.isAnimating) {
            const duration = animationState.animationType === "appear" ? 500 : 2000
            const timer = setTimeout(() => {
                resetAnimation()
            }, duration)

            return () => clearTimeout(timer)
        }
    }, [animationState.isAnimating, animationState.animationType, resetAnimation])

    return {
        animationState,
        triggerAnimation,
        resetAnimation,
    }
}

// ==================== RANDOM TASK HOOK ====================
export const useRandomTask = () => {
    const [data, setData] = useState<Task | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const generateTask = async () => {
        setLoading(true)
        setError(null)

        try {
            console.log("🎯 Generating random task...")
            const task = await TaskService.generateRandomTask()
            console.log("✅ Generated task:", task)
            setData(task)
            return task
        } catch (err: any) {
            console.error("❌ Error generating task:", err)
            setError(err.message || "Có lỗi xảy ra khi tạo nhiệm vụ")
            throw err
        } finally {
            setLoading(false)
        }
    }

    const resetTask = () => {
        setData(null)
        setError(null)
    }

    return {
        task: data,
        loading,
        error,
        generateTask,
        resetTask,
    }
}

// ==================== QUIZ ATTEMPT HOOK ====================
export const useQuizAttempt = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const submitAttempt = async (request: QuizAttemptRequest): Promise<QuizAttemptResponse> => {
        setLoading(true)
        setError(null)

        try {
            console.log("📝 Submitting quiz attempt:", request)
            const result = await TaskService.submitQuizAttempt(request)
            console.log("✅ Quiz attempt result:", result)
            return result
        } catch (err: any) {
            console.error("❌ Error submitting quiz attempt:", err)
            setError(err.message || "Có lỗi xảy ra khi nộp bài quiz")
            throw err
        } finally {
            setLoading(false)
        }
    }

    return { submitAttempt, loading, error }
}

// ==================== QUIZ SEQUENCE HOOK ====================
export const useQuizSequence = (taskId: number, quizzes: Quiz[]) => {
    const [state, setState] = useState<QuizSequenceState>({
        currentQuizIndex: 0,
        quizResults: [],
        isSequenceComplete: false,
        totalScore: 0,
        isSubmitting: false,
        showResult: false,
    })

    const [selectedOption, setSelectedOption] = useState<number | null>(null)

    // Computed values
    const currentQuiz = quizzes[state.currentQuizIndex]
    const progress = `${state.currentQuizIndex + 1}/${quizzes.length}`
    const progressPercentage = ((state.currentQuizIndex + 1) / quizzes.length) * 100
    const currentResult = state.quizResults[state.currentQuizIndex]
    const canSubmit = selectedOption !== null && !state.showResult && !state.isSubmitting

    const submitCurrentQuiz = useCallback(async () => {
        if (!selectedOption || !currentQuiz) return

        setState((prev) => ({ ...prev, isSubmitting: true }))

        try {
            const request: QuizAttemptRequest = {
                taskId,
                quizId: currentQuiz.quizId,
                userAnswers: [{ selectedOptionId: selectedOption }],
            }

            const result: QuizAttemptResponse = await TaskService.submitQuizAttempt(request)

            const quizResult: QuizResult = {
                quizId: currentQuiz.quizId,
                isCorrect: result.correctAnswersCount > 0,
                selectedOptionId: selectedOption,
                score: result.totalScore,
                userAnswer: currentQuiz.options.find((opt) => opt.optionId === selectedOption)?.content || "",
            }

            setState((prev) => ({
                ...prev,
                quizResults: [...prev.quizResults, quizResult],
                totalScore: prev.totalScore + result.totalScore,
                showResult: true,
                isSubmitting: false,
            }))

            // Auto advance to next quiz or complete sequence
            setTimeout(() => {
                if (state.currentQuizIndex < quizzes.length - 1) {
                    setState((prev) => ({
                        ...prev,
                        currentQuizIndex: prev.currentQuizIndex + 1,
                        showResult: false,
                    }))
                    setSelectedOption(null)
                } else {
                    setState((prev) => ({
                        ...prev,
                        isSequenceComplete: true,
                    }))
                }
            }, 2500) // 2.5 seconds to show result

            return result
        } catch (error: any) {
            console.error("❌ Error submitting quiz:", error)
            setState((prev) => ({
                ...prev,
                isSubmitting: false,
            }))
            throw error
        }
    }, [selectedOption, currentQuiz, taskId, state.currentQuizIndex, quizzes.length])

    const selectOption = useCallback(
        (optionId: number) => {
            if (state.showResult || state.isSubmitting) return
            setSelectedOption(optionId)
        },
        [state.showResult, state.isSubmitting],
    )

    const resetSequence = useCallback(() => {
        setState({
            currentQuizIndex: 0,
            quizResults: [],
            isSequenceComplete: false,
            totalScore: 0,
            isSubmitting: false,
            showResult: false,
        })
        setSelectedOption(null)
    }, [])

    const goToNextQuiz = useCallback(() => {
        if (state.currentQuizIndex < quizzes.length - 1) {
            setState((prev) => ({
                ...prev,
                currentQuizIndex: prev.currentQuizIndex + 1,
                showResult: false,
            }))
            setSelectedOption(null)
        } else {
            setState((prev) => ({
                ...prev,
                isSequenceComplete: true,
            }))
        }
    }, [state.currentQuizIndex, quizzes.length])

    const isOptionSelected = useCallback(
        (optionId: number): boolean => {
            return selectedOption === optionId
        },
        [selectedOption],
    )

    const isCorrectAnswer = useCallback(
        (optionId: number): boolean => {
            if (!state.showResult || !currentResult) return false
            return currentResult.isCorrect && currentResult.selectedOptionId === optionId
        },
        [state.showResult, currentResult],
    )

    const isWrongAnswer = useCallback(
        (optionId: number): boolean => {
            if (!state.showResult || !currentResult) return false
            return !currentResult.isCorrect && currentResult.selectedOptionId === optionId
        },
        [state.showResult, currentResult],
    )

    return {
        // State
        currentQuiz,
        currentQuizIndex: state.currentQuizIndex,
        quizResults: state.quizResults,
        isSequenceComplete: state.isSequenceComplete,
        totalScore: state.totalScore,
        isSubmitting: state.isSubmitting,
        showResult: state.showResult,
        selectedOption,
        progress,
        progressPercentage,
        currentResult,
        canSubmit,

        // Actions
        selectOption,
        submitCurrentQuiz,
        resetSequence,
        goToNextQuiz,

        // Helpers
        isOptionSelected,
        isCorrectAnswer,
        isWrongAnswer,
    }
}

// ==================== COMBINED TASK HOOK ====================
export const useTask = () => {
    // Random task generation
    const { task, loading: taskLoading, error: taskError, generateTask, resetTask } = useRandomTask()

    // Quiz attempt submission
    const { submitAttempt, loading: attemptLoading, error: attemptError } = useQuizAttempt()

    // Animation management
    const { animationState, triggerAnimation, resetAnimation } = useTaskAnimation()

    // Task type helpers
    const isQuizTask = task?.typeId === 1
    const isTipTask = task?.typeId === 2

    // Get quizzes from task
    const quizzes = isQuizTask && task?.quizzes ? task.quizzes : []

    // Quiz sequence management (only if it's a quiz task)
    const quizSequence = useQuizSequence(task?.taskId || 0, quizzes)

    // Combined loading state
    const loading = taskLoading || attemptLoading || quizSequence.isSubmitting

    // Combined error state
    const error = taskError || attemptError

    // Reset all states
    const resetAll = useCallback(() => {
        resetTask()
        resetAnimation()
        if (isQuizTask) {
            quizSequence.resetSequence()
        }
    }, [resetTask, resetAnimation, isQuizTask, quizSequence])

    return {
        // Task data
        currentTask: task,
        loading,
        error,

        // Task actions
        generateRandomTask: generateTask,
        resetTask: resetAll,

        // Task type checks
        isQuizTask,
        isTipTask,

        // Quiz sequence (only available for quiz tasks)
        quizSequence: isQuizTask ? quizSequence : null,

        // Animation
        animationState,
        triggerAnimation,
        resetAnimation,

        // Direct quiz submission (for single quiz attempts)
        submitQuizAttempt: submitAttempt,
    }
}

// ==================== TASK UTILS HOOK ====================
export const useTaskUtils = () => {
    const getTaskTypeLabel = useCallback((typeId: number): string => {
        switch (typeId) {
            case 1:
                return "Câu hỏi"
            case 2:
                return "Mẹo hay"
            default:
                return "Không xác định"
        }
    }, [])

    const formatTaskCreatedAt = useCallback((createdAt: string): string => {
        try {
            const date = new Date(createdAt)
            return date.toLocaleString("vi-VN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            })
        } catch (error) {
            return createdAt
        }
    }, [])

    const getMotivationalMessage = useCallback((isCorrect: boolean): string => {
        if (isCorrect) {
            const messages = [
                "Tuyệt vời! Bạn đang kiểm soát được cơn thèm! 🎉",
                "Chính xác! Kiến thức là sức mạnh! 💪",
                "Xuất sắc! Bạn đang trên đường chiến thắng! ⭐",
                "Đúng rồi! Tiếp tục như vậy! 🚀",
            ]
            return messages[Math.floor(Math.random() * messages.length)]
        } else {
            const messages = [
                "Không sao! Học hỏi từ sai lầm cũng là tiến bộ! 🌱",
                "Đừng nản lòng! Mỗi câu sai là một bài học! 📚",
                "Cố gắng lên! Bạn đang học cách vượt qua thử thách! 💫",
                "Không quan trọng! Điều quan trọng là bạn đang cố gắng! 🌟",
            ]
            return messages[Math.floor(Math.random() * messages.length)]
        }
    }, [])

    const getCompletionMessage = useCallback((percentage: number): string => {
        if (percentage >= 80) {
            return "Bạn đã vượt qua cơn thèm một cách xuất sắc! Kiến thức của bạn thật ấn tượng! 🏆"
        }
        if (percentage >= 60) {
            return "Tốt lắm! Bạn đã kiểm soát được cơn thèm bằng kiến thức! 👏"
        }
        if (percentage >= 40) {
            return "Bạn đã cố gắng rất tốt! Hãy tiếp tục học hỏi để mạnh mẽ hơn! 💪"
        }
        return "Đây là bước đầu tuyệt vời! Mỗi lần thử là một lần tiến bộ! 🌱"
    }, [])

    const calculatePercentage = useCallback((score: number, total: number): number => {
        if (total === 0) return 0
        return Math.round((score / total) * 100)
    }, [])

    return {
        getTaskTypeLabel,
        formatTaskCreatedAt,
        getMotivationalMessage,
        getCompletionMessage,
        calculatePercentage,
    }
}

// ==================== EXPORTS ====================
export default useTask

// Individual hook exports for specific use cases
