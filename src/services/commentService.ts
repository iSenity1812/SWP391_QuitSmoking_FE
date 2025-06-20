import axiosConfig from "@/config/axiosConfig"
import type {
    CommentRequestDTO,
    CommentResponseDTO,
    CommentPageResponse,
    CommentListParams,
    CommentApiResponse,
} from "../types/comment"

export class CommentService {
    // --- PUBLIC ENDPOINTS ---

    // Get all root comments for a blog (with pagination)
    // Backend uses findByBlog_BlogIdAndParentCommentIsNull to get only root comments
    async getCommentsByBlogId(
        blogId: number,
        params?: CommentListParams,
    ): Promise<CommentApiResponse<CommentPageResponse>> {
        const queryParams = this.buildQueryParams(params)

        const endpoint = `/comments/blog/${blogId}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`

        try {
            const response = await axiosConfig.get(endpoint)
            return response.data
        } catch (error: any) {
            throw error
        }
    }

    // Get single comment by ID (with replies)
    async getCommentById(commentId: number): Promise<CommentApiResponse<CommentResponseDTO>> {
        try {
            const response = await axiosConfig.get(`/comments/${commentId}`)
            return response.data
        } catch (error: any) {
            throw error
        }
    }

    // --- MEMBER ENDPOINTS (Authentication required) ---

    // Add new comment (or reply to existing comment)
    // Backend validates: blog must be PUBLISHED, user must be authenticated
    async addComment(commentData: CommentRequestDTO): Promise<CommentApiResponse<CommentResponseDTO>> {
        try {
            const response = await axiosConfig.post("/comments", commentData)
            return response.data
        } catch (error: any) {
            throw error
        }
    }

    // Delete comment (soft delete)
    // Backend checks: user is owner OR blog author OR CONTENT_ADMIN
    async deleteComment(commentId: number): Promise<CommentApiResponse<void>> {
        try {
            const response = await axiosConfig.delete(`/comments/${commentId}`)
            return response.data
        } catch (error: any) {
            throw error
        }
    }

    // --- UTILITY METHODS ---

    // Helper method to build query parameters
    private buildQueryParams(params?: CommentListParams): URLSearchParams {
        const queryParams = new URLSearchParams()

        if (params?.page !== undefined) queryParams.append("page", params.page.toString())
        if (params?.size !== undefined) queryParams.append("size", params.size.toString())
        if (params?.sort) queryParams.append("sort", params.sort)
        if (params?.direction) queryParams.append("direction", params.direction)

        return queryParams
    }
}

export const commentService = new CommentService()

// Export specific methods for easier imports
export const { getCommentsByBlogId, getCommentById, addComment, deleteComment } = commentService
