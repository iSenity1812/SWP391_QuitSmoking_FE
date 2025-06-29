"use client"

import { useState, useCallback, useEffect } from "react"
import { TaskService } from "@/services/taskService"
import type { TaskState, TaskStats, SubmitQuizAttemptRequestDTO, QuizAttemptResponseDTO } from "@/types/task"

export function useTask() {
    const [state, setState] = useState<TaskState>({
        currentTask: null,
        isLoading: false,
        error: null,
        completedTasks: [],
        stats: {
            totalCompleted: 0,
            quizzesCompleted: 0,
            tipsCompleted: 0,
            correctAnswers: 0,
            totalQuizAttempts: 0,
            accuracy: 0,
            streak: 0,
        },
    })

    // Load stats from localStorage on mount
    useEffect(() => {
        const savedStats = localStorage.getItem("taskStats")
        const savedCompleted = localStorage.getItem("completedTasks")

        if (savedStats) {
            try {
                const stats = JSON.parse(savedStats)
                setState((prev) => ({ ...prev, stats }))
            } catch (error) {
                console.error("Error loading task stats:", error)
            }
        }

        if (savedCompleted) {
            try {
                const completedTasks = JSON.parse(savedCompleted)
                setState((prev) => ({ ...prev, completedTasks }))
            } catch (error) {
                console.error("Error loading completed tasks:", error)
            }
        }
    }, [])

    // Save stats to localStorage whenever they change
    const saveStats = useCallback((newStats: TaskStats, newCompleted: number[]) => {
        localStorage.setItem("taskStats", JSON.stringify(newStats))
        localStorage.setItem("completedTasks", JSON.stringify(newCompleted))
    }, [])

    const generateRandomTask = useCallback(async () => {
        setState((prev) => ({ ...prev, isLoading: true, error: null }))

        try {
            const task = await TaskService.generateRandomTask()
            setState((prev) => ({ ...prev, currentTask: task, isLoading: false }))
            return task
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
            setState((prev) => ({ ...prev, error: errorMessage, isLoading: false }))
            throw error
        }
    }, [])

    const submitQuizAttempt = useCallback(
        async (request: SubmitQuizAttemptRequestDTO): Promise<QuizAttemptResponseDTO> => {
            setState((prev) => ({ ...prev, isLoading: true, error: null }))

            try {
                const result = await TaskService.submitQuizAttempt(request)

                // Update stats based on quiz results
                const isCorrect = result.correctAnswersCount > 0

                setState((prev) => {
                    const newStats = {
                        ...prev.stats,
                        totalCompleted: prev.stats.totalCompleted + 1,
                        quizzesCompleted: prev.stats.quizzesCompleted + 1,
                        totalQuizAttempts: prev.stats.totalQuizAttempts + 1,
                        correctAnswers: isCorrect ? prev.stats.correctAnswers + 1 : prev.stats.correctAnswers,
                        accuracy:
                            ((isCorrect ? prev.stats.correctAnswers + 1 : prev.stats.correctAnswers) /
                                (prev.stats.totalQuizAttempts + 1)) *
                            100,
                        streak: isCorrect ? prev.stats.streak + 1 : 0,
                    }

                    const newCompleted = [...prev.completedTasks, request.taskId]

                    saveStats(newStats, newCompleted)

                    return {
                        ...prev,
                        stats: newStats,
                        completedTasks: newCompleted,
                        isLoading: false,
                    }
                })

                return result
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
                setState((prev) => ({ ...prev, error: errorMessage, isLoading: false }))
                throw error
            }
        },
        [saveStats],
    )

    const markTipCompleted = useCallback(
        (taskId: number) => {
            setState((prev) => {
                const newStats = {
                    ...prev.stats,
                    totalCompleted: prev.stats.totalCompleted + 1,
                    tipsCompleted: prev.stats.tipsCompleted + 1,
                }

                const newCompleted = [...prev.completedTasks, taskId]

                saveStats(newStats, newCompleted)

                return {
                    ...prev,
                    stats: newStats,
                    completedTasks: newCompleted,
                }
            })
        },
        [saveStats],
    )

    const resetTask = useCallback(() => {
        setState((prev) => ({ ...prev, currentTask: null, error: null }))
    }, [])

    const resetStats = useCallback(() => {
        const initialStats: TaskStats = {
            totalCompleted: 0,
            quizzesCompleted: 0,
            tipsCompleted: 0,
            correctAnswers: 0,
            totalQuizAttempts: 0,
            accuracy: 0,
            streak: 0,
        }

        setState((prev) => ({ ...prev, stats: initialStats, completedTasks: [] }))
        saveStats(initialStats, [])
    }, [saveStats])

    const isTaskCompleted = useCallback(
        (taskId: number) => {
            return state.completedTasks.includes(taskId)
        },
        [state.completedTasks],
    )

    // Task type helpers based on typeId
    const isQuizTask = state.currentTask?.typeId === 1
    const isTipTask = state.currentTask?.typeId === 2

    return {
        // State
        currentTask: state.currentTask,
        isLoading: state.isLoading,
        error: state.error,
        completedTasks: state.completedTasks,
        stats: state.stats,

        // Computed
        isQuizTask,
        isTipTask,

        // Actions
        generateRandomTask,
        submitQuizAttempt,
        markTipCompleted,
        resetTask,
        resetStats,
        isTaskCompleted,
    }
}

export type UseTaskReturn = ReturnType<typeof useTask>
