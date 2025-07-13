import axiosInstance from "@/config/axiosConfig"

export interface UserSearchResult {
  userId: string
  username: string
  email: string
  profilePicture?: string | null
  role: "NORMAL_MEMBER" | "PREMIUM_MEMBER"
  createdAt: string
  streakCount: number
  subscriptions?: unknown[]
  quitPlans?: unknown
  active: boolean
}

export interface FollowRelation {
  followerId: string
  followedId: string
  followerUsername: string
  followedUsername: string
  followerProfilePicture?: string | null
  followedProfilePicture?: string | null
  createdAt: string
}

export interface PaginatedResponse<T> {
  content: T[]
  pageable: {
    pageNumber: number
    pageSize: number
    sort: {
      empty: boolean
      sorted: boolean
      unsorted: boolean
    }
    offset: number
    paged: boolean
    unpaged: boolean
  }
  last: boolean
  totalElements: number
  totalPages: number
  size: number
  number: number
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
  first: boolean
  numberOfElements: number
  empty: boolean
}

export interface ApiResponse<T> {
  status: number
  message: string
  data: T
  error?: unknown
  errorCode?: string
  timestamp: string
}

class FollowService {
  // Search users
  async searchUsers(query: string): Promise<UserSearchResult[]> {
    try {
      const response = await axiosInstance.get<ApiResponse<UserSearchResult[]>>(
        `/public/users/search?query=${encodeURIComponent(query)}`
      )
      return response.data.data || []
    } catch (error) {
      console.error("Error searching users:", error)
      return []
    }
  }

  // Follow a user
  async followUser(followedUserId: string): Promise<FollowRelation | null> {
    try {
      const response = await axiosInstance.post<ApiResponse<FollowRelation>>(
        "/follows",
        { followedUserId }
      )
      return response.data.data
    } catch (error) {
      console.error("Error following user:", error)
      throw error
    }
  }

  // Unfollow a user (assuming DELETE endpoint exists)
  async unfollowUser(followedUserId: string): Promise<boolean> {
    try {
      await axiosInstance.delete(`/follows/${followedUserId}`)
      return true
    } catch (error) {
      console.error("Error unfollowing user:", error)
      throw error
    }
  }

  // Get followers list with pagination
  async getFollowers(page: number = 0, size: number = 20): Promise<PaginatedResponse<FollowRelation>> {
    try {
      const response = await axiosInstance.get<ApiResponse<PaginatedResponse<FollowRelation>>>(
        `/follows/my-followers?page=${page}&size=${size}`
      )
      return response.data.data
    } catch (error) {
      console.error("Error getting followers:", error)
      return {
        content: [],
        pageable: {
          pageNumber: 0,
          pageSize: size,
          sort: { empty: true, sorted: false, unsorted: true },
          offset: 0,
          paged: true,
          unpaged: false
        },
        last: true,
        totalElements: 0,
        totalPages: 0,
        size: size,
        number: 0,
        sort: { empty: true, sorted: false, unsorted: true },
        first: true,
        numberOfElements: 0,
        empty: true
      }
    }
  }

  // Get following list with pagination
  async getFollowing(page: number = 0, size: number = 20): Promise<PaginatedResponse<FollowRelation>> {
    try {
      const response = await axiosInstance.get<ApiResponse<PaginatedResponse<FollowRelation>>>(
        `/follows/my-following?page=${page}&size=${size}`
      )
      return response.data.data
    } catch (error) {
      console.error("Error getting following:", error)
      return {
        content: [],
        pageable: {
          pageNumber: 0,
          pageSize: size,
          sort: { empty: true, sorted: false, unsorted: true },
          offset: 0,
          paged: true,
          unpaged: false
        },
        last: true,
        totalElements: 0,
        totalPages: 0,
        size: size,
        number: 0,
        sort: { empty: true, sorted: false, unsorted: true },
        first: true,
        numberOfElements: 0,
        empty: true
      }
    }
  }

  // Check if user is following another user
  async isFollowing(targetUserId: string): Promise<boolean> {
    try {
      const response = await axiosInstance.get<ApiResponse<boolean>>(
        `/follows/check/${targetUserId}`
      )
      return response.data.data || false
    } catch (error) {
      console.error("Error checking follow status:", error)
      return false
    }
  }
}

export const followService = new FollowService()
