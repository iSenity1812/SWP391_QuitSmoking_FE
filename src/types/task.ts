// API Response wrapper
export interface ApiResponse<T> {
    success: boolean
    status: number
    message: string
    data: T
}

// Task DTOs
export interface TaskCreationRequestDTO {
    taskName: string
    description?: string
}

export interface TaskResponseDTO {
    taskId: number
    createdAt: string
    typeId: number // 1 for Quiz, 2 for Tip
    quizzes: QuizResponseDTO[] // Array of quizzes
    tips: TipResponseDTO // Single tip object
}

// Quiz DTOs
export interface QuizCreationRequestDTO {
    title: string
    description?: string
    scorePossible: number
    options: OptionRequest[]
}

export interface OptionRequest {
    content: string
    isCorrect: boolean
}

export interface QuizResponseDTO {
    quizId: string // UUID as string
    title: string
    description?: string
    scorePossible: number
    options: OptionResponseDTO[]
}

export interface OptionResponseDTO {
    optionId: number
    content: string
    // Note: isCorrect is not included in response for security
}

// Quiz Attempt DTOs
export interface SubmitQuizAttemptRequestDTO {
    taskId: number
    quizId: string // UUID as string
    userAnswers: QuizAttemptDetail[]
}

export interface QuizAttemptDetail {
    selectedOptionId: number
}

export interface QuizAttemptResponseDTO {
    taskId: number
    totalScore: number
    correctAnswersCount: number
    totalQuestions: number
    quizResults: Record<string, boolean> // UUID QuizID -> boolean result
    message: string
}

// Tip DTOs
export interface TipCreationRequestDTO {
    content: string
}

export interface TipResponseDTO {
    tipId: string // UUID as string
    content: string
}

// Frontend-specific types
export interface TaskState {
    currentTask: TaskResponseDTO | null
    isLoading: boolean
    error: string | null
    completedTasks: number[]
    stats: TaskStats
}

export interface TaskStats {
    totalCompleted: number
    quizzesCompleted: number
    tipsCompleted: number
    correctAnswers: number
    totalQuizAttempts: number
    accuracy: number
    streak: number
}

// UI Helper types
export interface QuizUIState {
    selectedOptionId: number | null
    timeLeft: number
    isSubmitted: boolean
    showResult: boolean
    startTime: number
}

export interface TaskCompletionData {
    taskId: number
    type: "quiz" | "tip"
    isCorrect?: boolean
    score?: number
    totalScore?: number
    message?: string
    timeSpent: number
}

// Constants
export const TASK_TYPES = {
    QUIZ: 1,
    TIP: 2,
} as const

export type TaskType = (typeof TASK_TYPES)[keyof typeof TASK_TYPES]
