export type UserRole = "Normal member" | "Premium member" | "Coach" | "Content Admin"

export interface PublicAchievement {
  id: string
  title: string
  description: string
  icon: string
  category: "streak" | "health" | "social" | "milestone"
  earnedDate: string
}

export interface PublicUser {
  id: string
  name: string
  avatar?: string
  joinDate: string
  currentStreak: number
  totalPlans: number
  achievements: PublicAchievement[]
  followersCount: number
  followingCount: number
  isFollowing?: boolean
  role?: UserRole
}

export interface UserReportFormData {
  reason: string
  reportType: "User Report"
  reportedUserType: "User" | "Coach"
  additionalDetails?: string
}
