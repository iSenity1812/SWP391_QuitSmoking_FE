export interface BlogPost {
  blogId?: number
  id?: number // Add fallback for backend id field
  authorId: string
  title: string
  content: string
  imageUrl?: string // Match backend field name
  createdAt?: string // ISO date string
  lastUpdated?: string // ISO date string
  status: BlogStatus
  approvedBy?: string
  approvedAt?: string // ISO date string
  authorName?: string
  viewCount?: number
  likeCount?: number
  commentCount?: number
  comments?: import("./comment").CommentResponseDTO[] // Add comments array
}

export interface BlogRequestDTO {
  title: string
  content: string
  imageUrl?: File | string // Match backend field name - File for upload, string for existing URL
}

export type Role = "NORMAL_MEMBER" | "PREMIUM_MEMBER" | "SUPER_ADMIN" | "CONTENT_ADMIN" | "COACH"

export interface BlogUser {
  id: string // Đổi từ blogId sang id để khớp với AccountResponse
  username: string // Đổi từ name sang username để khớp với AccountResponse
  role: Role // Đảm bảo Role được định nghĩa hoặc là string
  // Bạn có thể thêm các trường khác nếu cần như email, profilePicture
  email?: string
  profilePicture?: string | null
}

export type BlogStatus = "PENDING" | "PUBLISHED" | "REJECTED"

// API Response types from backend
export interface ApiResponse<T> {
  status: number // Backend returns status as number
  message: string
  data: T
  error: any
  errorCode: any
  timestamp: string
  success?: boolean // Add optional success field for compatibility
}

export interface SpringPageResponse<T> {
  content: T[]
  pageable: {
    sort: {
      empty: boolean
      sorted: boolean
      unsorted: boolean
    }
    offset: number
    pageSize: number
    pageNumber: number
    paged: boolean
    unpaged: boolean
  }
  last: boolean
  totalPages: number
  totalElements: number
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

export interface BlogListParams {
  page?: number
  size?: number
  sort?: string
  direction?: "ASC" | "DESC"
  keyword?: string
  status?: BlogStatus
}

// For display purposes
export interface BlogWithAuthor extends BlogPost {
  authorName?: string
  authorEmail?: string
}

export interface CreateBlogRequest {
  authorId: string
  title: string
  content: string
  imageUrl?: File // File for upload - match backend field name
  status?: BlogStatus
}

export interface UpdateBlogRequest {
  title?: string
  content?: string
  imageUrl?: File | string // File for new upload or string URL to keep existing
}

// Backend response DTO structure - MATCH actual backend
export interface BlogResponseDTO {
  blogId: number // This is the main ID field
  title: string
  content: string
  imageUrl?: string // Match backend field name exactly
  author?: {
    userId?: string
    username?: string
    name?: string
    email?: string
  }
  status: BlogStatus
  createdAt: string
  lastUpdated?: string
  approvedBy?: {
    userId?: string
    username?: string
    name?: string
  }
  approvedAt?: string
  commentCount: number
  comments?: import("./comment").CommentResponseDTO[] // Add comments array from backend
}
