// Challenge types for frontend
export interface ChallengeRequest {
    challengeName: string
    description?: string
    startDate?: string // ISO string format
    endDate: string // ISO string format
    targetValue: number
    unit: string
}

export interface ChallengeResponse {
    challengeID: number
    memberID: string
    challengeName: string
    description?: string
    startDate: string // ISO string format
    endDate: string // ISO string format
    targetValue: number
    unit: string
    status: string
}

export interface CreateChallengeFormData {
    challengeName: string
    description: string
    startDate: string
    endDate: string
    targetValue: string // Form input as string, will be converted to number
    unit: string
}

export type statusType = "Active" | "Completed" | "Given Up";

export interface Challenge {
    id: string
    name: string
    description: string
    requirements: string
    reward: string
    category: "health" | "mindfulness" | "social" | "streak" | "financial" | "other"
    targetValue: number
    currentValue: number
    status: statusType
    isPremium: true
    icon: string // Icon name for Lucide React
    isUserCreated?: boolean // New: To distinguish user-created challenges
}

// API Response wrapper
export interface ApiResponse<T> {
    status: number
    message: string
    data: T
    error?: any
    errorCode?: string
    timestamp: string
}

// Challenge validation errors
export interface ChallengeValidationErrors {
    challengeName?: string
    description?: string
    startDate?: string
    endDate?: string
    targetValue?: string
    unit?: string
    general?: string
}

// Challenge units type and constant
export type ChallengeUnit = "cigarettes" | "VND" | "days";

export const ChallengeUnitValues = {
    CIGARETTES: "cigarettes",
    VND: "VND",
    DAYS: "days",
} as const;

// Challenge status type and constant
export type ChallengeStatus = "Active" | "Completed" | "Given Up";

export const ChallengeStatusValues = {
    ACTIVE: "Active",
    COMPLETED: "Completed",
    GIVEN_UP: "Given Up",
} as const;
