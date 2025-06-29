export interface Achievement {
    id: number
    name: string
    description: string
    category: string
    completed: boolean
    date?: string
    points: number
    icon: string
    daysRequired?: number
    moneyRequired?: number
    cigarettesAvoided?: number
    healthImprovement?: number
    comebackStreak?: number
    friendsHelped?: number
    likesReceived?: number
    weekendsCompleted?: number
    isDaily?: boolean
    isSpecial?: boolean
}

export interface AchievementCategory {
    id: string
    name: string
    count: number
}

export interface NextMilestone {
    name: string
    daysLeft: number
    reward: string
}

export interface HealthBenefit {
    name: string
    improvement: number
    description: string
}

export interface WeeklyProgress {
    day: string
    cigarettes: number
    mood: number
}

// Updated to support follow system
export interface Friend {
    name: string
    avatar: string
    streak: number
    status: "online" | "offline"
    isFollowing?: boolean // Added to track follow status
    followersCount?: number // Added follower count
    followingCount?: number // Added following count
}

export interface RecentActivity {
    type: "achievement" | "milestone" | "social" | "health"
    message: string
    time: string
}

export interface Subscription {
    type: "free" | "premium"
    startDate?: Date
    endDate?: Date
    plan?: string
}

export interface Challenge {
    id: string
    name: string
    description: string
    requirements: string
    reward: string
    category: "health" | "mindfulness" | "social" | "streak" | "financial" | "other"
    targetValue: number
    currentValue: number
    status: "not-started" | "in-progress" | "completed" | "failed"
    isPremium: true
    icon: string // Icon name for Lucide React
    isUserCreated?: boolean // New: To distinguish user-created challenges
}

export interface User {
    name: string
    email: string
    avatar: string
    joinDate: string
    daysSmokeFreee: number
    cigarettesAvoided: number
    moneySaved: string
    healthImprovement: number
    level: string
    streak: number
    subscription?: Subscription
    achievements: Achievement[]
    achievementCategories: AchievementCategory[]
    nextMilestone: NextMilestone
    healthBenefits: HealthBenefit[]
    weeklyProgress: WeeklyProgress[]
    friends: Friend[] // Keep original friends array but with follow functionality
    recentActivities: RecentActivity[]
    challenges: Challenge[]
    // Add follow counts
    followersCount?: number
    followingCount?: number
}

export interface UserProfileProps {
    className?: string
}

export interface AchievementNotification {
    show: boolean
    achievement: Achievement | null
}
