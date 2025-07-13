export interface UserProfile {
  userId: string
  username: string
  displayName?: string
  email?: string
  profilePicture?: string
  createdAt: string
  role: "NORMAL_MEMBER" | "PREMIUM_MEMBER"
  streakCount: number
  totalAchievements?: number
  followerCount?: number
  followingCount?: number
}

export interface UserProfileSearchResult {
  userId: string
  username: string
  profilePicture?: string
  createdAt: string
  role: "NORMAL_MEMBER" | "PREMIUM_MEMBER"
  streakCount: number
}

export interface SearchResponse {
  status: number
  data: UserProfileSearchResult[]
}
