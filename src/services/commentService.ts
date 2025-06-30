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

    // Get all comments for a blog (public access)
    async getCommentsByBlog(blogId: number): Promise<CommentResponseDTO[]> {
        try {
            console.log(`Fetching comments for blog ${blogId}...`)

            const response = await axiosConfig.get(`/comments/blog/${blogId}`)
            console.log("Comments API Response:", response.data)

            // Handle different response formats
            if (response.data.success !== undefined) {
                // Backend returns ApiResponse<Page<CommentResponseDTO>>
                if (response.data.success === false) {
                    throw new Error(response.data.message || "Failed to fetch comments")
                }

                const pageData = response.data.data
                if (pageData && pageData.content && Array.isArray(pageData.content)) {
                    console.log("Comments found:", pageData.content.length)
                    return pageData.content
                }

                console.log("No comments content found in page data")
                return []
            } else if (Array.isArray(response.data)) {
                // Direct array response
                console.log("Direct array response:", response.data.length)
                return response.data
            } else {
                console.log("Unexpected response format:", response.data)
                return []
            }
        } catch (error: any) {
            console.error("Error fetching comments:", error)

            if (error.response) {
                console.error("Response status:", error.response.status)
                console.error("Response data:", error.response.data)
            }

            // Return empty array instead of throwing error for guest users
            return []
        }
    }

    // Get comments with pagination
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
    async addComment(commentData: CommentRequestDTO): Promise<CommentApiResponse<CommentResponseDTO>> {
        try {
            const response = await axiosConfig.post("/comments", commentData)

            // Check for successful status codes (200, 201)
            if (response.status === 200 || response.status === 201) {
                // If response has data structure with success field
                if (response.data && typeof response.data === "object" && "success" in response.data) {
                    return response.data as CommentApiResponse<CommentResponseDTO>
                }

                // If response data is the comment directly, wrap it in success structure
                return {
                    success: true,
                    message: "Thêm bình luận thành công",
                    data: response.data,
                } as CommentApiResponse<CommentResponseDTO>
            }

            return response.data
        } catch (error: any) {
            console.error("Error in addComment:", error)
            throw error
        }
    }

    // Delete comment (soft delete)
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
export const { getCommentsByBlog, getCommentsByBlogId, getCommentById, addComment, deleteComment } = commentService
