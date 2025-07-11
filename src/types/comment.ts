export interface Comment {
    commentId?: number
    blogId: number
    userId: string
    parentCommentId?: number
    content: string
    commentDate?: string // ISO date string
    createdAt?: string // Add this for compatibility
    authorName?: string
}

export interface CommentRequestDTO {
    blogId: number
    content: string
    parentCommentId?: number
}

export interface CommentResponseDTO {
    commentId: number
    content: string
    blogId: number
    user: {
        userId: string
        username: string
        email?: string
    }
    parentCommentId?: number
    commentDate: string // LocalDateTime from backend
    replies?: CommentResponseDTO[] // Nested replies
}

// API Response types - Updated to match actual backend response
export interface CommentApiResponse<T> {
    success: boolean
    message: string
    data: {
        status: number
        message: string
        data: T
        error: any
        errorCode: any
        timestamp: string
    }
}

export interface CommentPageResponse {
    content: CommentResponseDTO[]
    blogId: number
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

export interface CommentListParams {
    page?: number
    size?: number
    sort?: string
    direction?: "ASC" | "DESC"
}

export interface CreateCommentRequest {
    blogId: number
    userId: string
    parentCommentId?: number
    content: string
}

export interface UpdateCommentRequest {
    content: string
}

// For nested comment display
export interface CommentTree extends Comment {
    replies: CommentTree[]
}

// For display purposes with user info
export interface CommentWithUser extends Comment {
    userName?: string
    userEmail?: string
}

export interface CommentTreeWithUser extends CommentWithUser {
    replies: CommentTreeWithUser[]
}
