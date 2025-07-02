export interface UserReport {
    id: number
    reporterId: string
    reporterName: string
    reporterAvatar?: string
    reportedUserId: string
    reportedUserName: string
    reportedUserType: "user" | "coach"
    reportReason: string
    reportDescription: string
    status: "pending" | "resolved" | "dismissed" | "investigating"
    priority: "low" | "medium" | "high" | "critical"
    createdAt: string
    resolvedAt?: string
    adminId?: string
    adminName?: string
    adminNote?: string
    evidence?: string[]
}

export interface ReportStats {
    totalUserReports: number
    pendingUserReports: number
    resolvedUserReports: number
    criticalReports: number
    reportsToday: number
    averageResolutionTime: number
}

export interface ReportFilters {
    status?: string
    priority?: string
    dateRange?: {
        start: string
        end: string
    }
    search?: string
}
