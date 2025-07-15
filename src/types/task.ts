// API Response wrapper
export interface ApiResponse<T> {
    success: boolean
    status: number
    message: string
    data: T
}

// Constants
export const TASK_TYPES = {
    QUIZ: 1,
    TIP: 2,
} as const

export type TaskType = (typeof TASK_TYPES)[keyof typeof TASK_TYPES]

// Frontend interfaces (used in components)
export interface QuizCreationRequestDTO {
    title: string
    description?: string
    options: FrontendOptionRequest[]
}

export interface FrontendOptionRequest {
    content: string
    correct: boolean // Frontend uses 'correct'
}

// Backend interfaces (for API communication)
export interface OptionRequest {
    content: string
    isCorrect: boolean // Backend expects 'isCorrect'
}

export interface QuizResponseDTO {
    quizId: string // UUID as string
    title: string
    description?: string
    options: OptionResponseDTO[]
}

export interface OptionResponseDTO {
    optionId: number
    content: string
    correct: boolean // API trả về 'correct' chứ không phải 'isCorrect'
}

// Tip DTOs
export interface TipCreationRequestDTO {
    content: string
}

export interface TipResponseDTO {
    tipId: string // UUID as string
    content: string
}