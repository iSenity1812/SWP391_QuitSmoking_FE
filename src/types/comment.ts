export interface Comment {
    commentId?: number
    blogId: number
    userId: string
    parentCommentId?: number
    content: string
    commentDate?: string // ISO date string
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
