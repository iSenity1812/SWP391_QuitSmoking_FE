// Core Task Types
export interface Task {
    taskId: number
    createdAt: string
    typeId: number
    quizzes?: Quiz[]
    tips?: Tip
}

export interface Quiz {
    quizId: string
    title: string
    description?: string
    scorePossible: number
    options: Option[]
}

export interface Option {
    optionId: number
    content: string
}

export interface Tip {
    tipId: string
    content: string
}

// Quiz Sequence Types
export interface QuizResult {
    quizId: string
    isCorrect: boolean
    selectedOptionId: number
    score: number
    userAnswer: string
    correctAnswer?: string
}

export interface QuizSequenceState {
    currentQuizIndex: number
    quizResults: QuizResult[]
    isSequenceComplete: boolean
    totalScore: number
    isSubmitting: boolean
    showResult: boolean
}

// API Request/Response Types
export interface QuizAttemptRequest {
    taskId: number
    quizId: string
    userAnswers: {
        selectedOptionId: number
    }[]
}

export interface QuizAttemptResponse {
    taskId: number
    totalScore: number
    correctAnswersCount: number
    totalQuestions: number
    quizResults: Record<string, boolean>
    message: string
}

export interface ApiResponse<T> {
    status: number
    message: string
    data: T
    error?: any
    errorCode?: string
    timestamp: string
}

// Constants
export const TASK_TYPE = {
    QUIZ: 1,
    TIP: 2,
} as const

export type TaskType = (typeof TASK_TYPE)[keyof typeof TASK_TYPE]

// Performance Types
export interface PerformanceLevel {
    message: string
    color: string
    emoji: string
}

export interface QuizSummaryData {
    totalScore: number
    totalQuizzes: number
    percentage: number
    performance: PerformanceLevel
    completedAt: string
}
