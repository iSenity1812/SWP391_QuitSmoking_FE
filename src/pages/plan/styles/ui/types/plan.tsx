export interface Plan {
    id: number
    title: string
    description: string
    startDate: Date
    targetDate: Date
    dailyCigarettes: number
    motivation: string
    cigaretteType: string
}

export interface PlanFormData {
    title: string
    description: string
    startDate: Date
    targetDate: Date
    dailyCigarettes: number
    motivation: string
    cigaretteType: string
}

export interface UserSubscription {
    type: "free" | "premium"
    duration?: string
    expiryDate?: Date
}

export interface PlanCalculations {
    days: number
    saved: number
    progress: number
}
