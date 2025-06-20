import axiosConfig from "../config/axiosConfig"
import type {
    Blog,
    CreateBlogRequest,
    UpdateBlogRequest,
    ApiResponse,
    SpringPageResponse,
    BlogResponseDTO,
} from "../types/blog"

export class BlogService {
    private static readonly BASE_PATH = "/blogs"

    /**
     * Get all blogs - PUBLIC endpoint
     */
    static async getAllBlogs(): Promise<Blog[]> {
        try {
            console.log("Fetching blogs from:", `${axiosConfig.defaults.baseURL}${this.BASE_PATH}`)

            // Backend trả về ApiResponse<Page<BlogResponseDTO>>
            const response = await axiosConfig.get<ApiResponse<SpringPageResponse<BlogResponseDTO>>>(this.BASE_PATH)
            console.log("Raw response:", response.data)

            // Kiểm tra structure của response
            if (response.data.success === false) {
                throw new Error(response.data.message || "API call failed")
            }

            const pageData = response.data.data
            console.log("Page data:", pageData)

            if (!pageData) {
                console.warn("No page data in response")
                return []
            }

            // Kiểm tra xem pageData có phải là array không (trường hợp backend trả về array trực tiếp)
            if (Array.isArray(pageData)) {
                console.log("Response is direct array")
                // Convert BlogResponseDTO[] to Blog[]
                const blogs: Blog[] = pageData.map((dto: BlogResponseDTO) => ({
                    blogId: dto.blogId,
                    id: dto.blogId, // Add fallback
                    title: dto.title,
                    content: dto.content,
                    authorId: dto.author?.userId || dto.author?.username || "Unknown",
                    authorName: dto.author?.username || dto.author?.name || "Unknown Author",
                    status: dto.status,
                    createdAt: dto.createdAt,
                    lastUpdated: dto.lastUpdated,
                    approvedBy: dto.approvedBy?.name || dto.approvedBy?.username,
                    approvedAt: dto.approvedAt,
                    viewCount: 0,
                    likeCount: 0,
                    commentCount: dto.commentCount || 0,
                    comments: dto.comments || [], // Include comments from backend
                }))
                return blogs
            }

            // Kiểm tra xem có content không (trường hợp pagination)
            if (!pageData.content) {
                console.warn("No content in page data:", pageData)
                return []
            }

            // Convert BlogResponseDTO[] to Blog[]
            const blogs: Blog[] = pageData.content.map((dto: BlogResponseDTO) => {
                console.log("Converting DTO:", dto)
                console.log("DTO comments:", dto.comments)
                return {
                    blogId: dto.blogId,
                    id: dto.blogId,
                    title: dto.title,
                    content: dto.content,
                    authorId: dto.author?.userId || dto.author?.username || "Unknown",
                    authorName: dto.author?.username || dto.author?.name || "Unknown Author",
                    status: dto.status,
                    createdAt: dto.createdAt,
                    lastUpdated: dto.lastUpdated,
                    approvedBy: dto.approvedBy?.name || dto.approvedBy?.username,
                    approvedAt: dto.approvedAt,
                    viewCount: 0,
                    likeCount: 0,
                    commentCount: dto.commentCount || 0,
                    comments: dto.comments || [], // Include comments from backend
                }
            })

            console.log("Converted blogs:", blogs)
            return blogs
        } catch (error: any) {
            console.error("Error fetching blogs:", error)

            // Kiểm tra xem có phải lỗi từ response không
            if (error.response) {
                console.error("Response error:", error.response.status, error.response.data)

                if (error.response.status === 403) {
                    throw new Error(
                        "Backend không cho phép truy cập endpoint /blogs. Vui lòng kiểm tra cấu hình Spring Security.",
                    )
                }

                if (error.response.status === 404) {
                    throw new Error("Endpoint /api/blogs không tồn tại. Vui lòng kiểm tra backend.")
                }

                // Nếu có message từ backend
                if (error.response.data?.message) {
                    throw new Error(`Backend error: ${error.response.data.message}`)
                }
            }

            // Nếu là network error
            if (error.code === "ERR_NETWORK") {
                throw new Error("Không thể kết nối tới backend. Vui lòng kiểm tra backend có đang chạy không.")
            }

            throw error
        }
    }

    /**
     * Get a blog by ID - PUBLIC endpoint
     */
    static async getBlogById(id: number): Promise<Blog> {
        try {
            const response = await axiosConfig.get<ApiResponse<BlogResponseDTO>>(`${this.BASE_PATH}/${id}`)

            if (response.data.success === false) {
                throw new Error(response.data.message || "Failed to get blog")
            }

            const dto = response.data.data
            console.log("Single blog DTO:", dto)
            console.log("Single blog comments:", dto.comments)

            return {
                blogId: dto.blogId,
                id: dto.blogId,
                title: dto.title,
                content: dto.content,
                authorId: dto.author?.userId || dto.author?.username || "Unknown",
                authorName: dto.author?.username || dto.author?.name || "Unknown Author",
                status: dto.status,
                createdAt: dto.createdAt,
                lastUpdated: dto.lastUpdated,
                approvedBy: dto.approvedBy?.name || dto.approvedBy?.username,
                approvedAt: dto.approvedAt,
                viewCount: 0,
                likeCount: 0,
                commentCount: dto.commentCount || 0,
                comments: dto.comments || [], // Include comments from backend
            }
        } catch (error: any) {
            console.error(`Error fetching blog ${id}:`, error)
            throw error
        }
    }

    /**
     * Create a new blog - REQUIRES AUTH
     */
    static async createBlog(blogData: CreateBlogRequest): Promise<Blog> {
        try {
            const response = await axiosConfig.post<ApiResponse<BlogResponseDTO>>(this.BASE_PATH, {
                title: blogData.title,
                content: blogData.content,
            })

            if (response.data.success === false) {
                throw new Error(response.data.message || "Failed to create blog")
            }

            const dto = response.data.data
            return {
                blogId: dto.blogId,
                id: dto.blogId,
                title: dto.title,
                content: dto.content,
                authorId: dto.author?.userId || dto.author?.username || "Unknown",
                authorName: dto.author?.username || dto.author?.name || "Unknown Author",
                status: dto.status,
                createdAt: dto.createdAt,
                lastUpdated: dto.lastUpdated,
                approvedBy: dto.approvedBy?.name || dto.approvedBy?.username,
                approvedAt: dto.approvedAt,
                viewCount: 0,
                likeCount: 0,
                commentCount: dto.commentCount || 0,
                comments: dto.comments || [], // Include comments from backend
            }
        } catch (error: any) {
            console.error("Error creating blog:", error)
            throw error
        }
    }

    /**
     * Update an existing blog - REQUIRES AUTH
     */
    static async updateBlog(id: number, blogData: UpdateBlogRequest): Promise<Blog> {
        try {
            const response = await axiosConfig.put<ApiResponse<BlogResponseDTO>>(`${this.BASE_PATH}/${id}`, {
                title: blogData.title,
                content: blogData.content,
            })

            if (response.data.success === false) {
                throw new Error(response.data.message || "Failed to update blog")
            }

            const dto = response.data.data
            return {
                blogId: dto.blogId,
                id: dto.blogId,
                title: dto.title,
                content: dto.content,
                authorId: dto.author?.userId || dto.author?.username || "Unknown",
                authorName: dto.author?.username || dto.author?.name || "Unknown Author",
                status: dto.status,
                createdAt: dto.createdAt,
                lastUpdated: dto.lastUpdated,
                approvedBy: dto.approvedBy?.name || dto.approvedBy?.username,
                approvedAt: dto.approvedAt,
                viewCount: 0,
                likeCount: 0,
                commentCount: dto.commentCount || 0,
                comments: dto.comments || [], // Include comments from backend
            }
        } catch (error: any) {
            console.error(`Error updating blog ${id}:`, error)
            throw error
        }
    }

    /**
     * Delete a blog - REQUIRES AUTH
     */
    static async deleteBlog(id: number): Promise<void> {
        try {
            const response = await axiosConfig.delete<ApiResponse<void>>(`${this.BASE_PATH}/${id}`)

            if (response.data.success === false) {
                throw new Error(response.data.message || "Failed to delete blog")
            }
        } catch (error: any) {
            console.error(`Error deleting blog ${id}:`, error)
            throw error
        }
    }

    /**
     * Get blogs by author - REQUIRES AUTH
     */
    static async getBlogsByAuthor(authorId: string): Promise<Blog[]> {
        try {
            const allBlogs = await this.getAllBlogs()
            return allBlogs.filter((blog) => blog.authorId === authorId)
        } catch (error: any) {
            console.error(`Error fetching blogs by author ${authorId}:`, error)
            throw error
        }
    }

    /**
     * Get blogs by status - REQUIRES AUTH
     */
    static async getBlogsByStatus(status: string): Promise<Blog[]> {
        try {
            const allBlogs = await this.getAllBlogs()
            return allBlogs.filter((blog) => blog.status === status)
        } catch (error: any) {
            console.error(`Error fetching blogs by status ${status}:`, error)
            throw error
        }
    }

    /**
     * Search blogs by title or content - PUBLIC
     */
    static async searchBlogs(query: string): Promise<Blog[]> {
        try {
            const allBlogs = await this.getAllBlogs()
            const lowercaseQuery = query.toLowerCase()
            return allBlogs.filter(
                (blog) =>
                    blog.title.toLowerCase().includes(lowercaseQuery) || blog.content.toLowerCase().includes(lowercaseQuery),
            )
        } catch (error: any) {
            console.error(`Error searching blogs with query "${query}":`, error)
            throw error
        }
    }
}
