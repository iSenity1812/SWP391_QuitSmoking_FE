export interface Blog {
  blogId?: number
  authorId: string
  title: string
  content: string
  createdAt?: string // ISO date string
  lastUpdated?: string // ISO date string
  status: BlogStatus
  approvedBy?: string
  approvedAt?: string // ISO date string
}

export interface CreateBlogRequest {
  authorId: string
  title: string
  content: string
  status?: BlogStatus
}

export interface UpdateBlogRequest {
  title?: string
  content?: string
  status?: BlogStatus
  approvedBy?: string
  approvedAt?: string
}

export type BlogStatus = "PENDING" | "PUBLISHED" | "REJECTED"


// For display purposes
export interface BlogWithAuthor extends Blog {
  authorName?: string
  authorEmail?: string
}
