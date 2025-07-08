import axiosConfig from "../config/axiosConfig"
import type {
    BlogPost,
    CreateBlogRequest,
    UpdateBlogRequest,
    ApiResponse,
    SpringPageResponse,
    BlogResponseDTO,
} from "../types/blog"

export class BlogService {
    private static readonly BASE_PATH = "/blogs"
    private static readonly MY_PATH = "/my-blogs"
    private static readonly ADMIN_PATH = "/admin"

    /**
     * Check if response is successful based on backend format
     */
    private static isSuccessResponse(response: ApiResponse<any>): boolean {
        // Backend returns status 200 for success, not a success boolean
        return response.status === 200 || (response.success !== undefined ? response.success : true)
    }

    /**
     * Get all blogs - PUBLIC endpoint
     */
    static async getAllBlogs(): Promise<BlogPost[]> {
        try {
            console.log("Fetching blogs from:", `${axiosConfig.defaults.baseURL}${this.BASE_PATH}`)

            // Backend trả về ApiResponse<Page<BlogResponseDTO>>
            const response = await axiosConfig.get<ApiResponse<SpringPageResponse<BlogResponseDTO>>>(this.BASE_PATH)
            console.log("Raw response:", response.data)

            // Kiểm tra structure của response - use new success check
            if (!this.isSuccessResponse(response.data)) {
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
                const blogs: BlogPost[] = pageData.map((dto: BlogResponseDTO) => {
                    console.log("Processing blog DTO (direct array):", dto)
                    console.log("DTO imageUrl:", dto.imageUrl)
                    return this.mapBlogDtoToFrontendBlog(dto)
                })
                return blogs
            }

            // Kiểm tra xem có content không (trường hợp pagination)
            if (!pageData.content) {
                console.warn("No content in page data:", pageData)
                return []
            }

            // Convert BlogResponseDTO[] to Blog[]
            const blogs: BlogPost[] = pageData.content.map((dto: BlogResponseDTO) => {
                console.log("Processing blog DTO (paginated):", dto)
                console.log("DTO imageUrl:", dto.imageUrl)
                return this.mapBlogDtoToFrontendBlog(dto)
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

    private static mapBlogDtoToFrontendBlog(dto: BlogResponseDTO): BlogPost {
        console.log("=== Mapping Blog DTO ===")
        console.log("Input DTO:", dto)
        console.log("DTO imageUrl:", dto.imageUrl)

        // Process image URL - handle both relative and absolute URLs
        let imageUrl = dto.imageUrl
        console.log("Raw imageUrl from DTO:", imageUrl)

        if (imageUrl) {
            if (!imageUrl.startsWith("http")) {
                // If it's a relative URL starting with /uploads/, construct the full URL
                // Don't use axiosConfig.defaults.baseURL because it includes /api
                const baseUrl = axiosConfig.defaults.baseURL?.replace("/api", "") || "http://localhost:8080"

                if (imageUrl.startsWith("/uploads/")) {
                    imageUrl = `${baseUrl}${imageUrl}`
                } else {
                    imageUrl = `${baseUrl}/${imageUrl.startsWith("/") ? imageUrl.substring(1) : imageUrl}`
                }
                console.log("Processed imageUrl:", imageUrl)
            }
        } else {
            console.log("No imageUrl in DTO")
            imageUrl = undefined
        }

        const mappedBlog = {
            blogId: dto.blogId,
            id: dto.blogId,
            title: dto.title,
            content: dto.content,
            imageUrl: imageUrl, // Use processed imageUrl
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
            comments: dto.comments || [],
        }

        console.log("Mapped blog:", mappedBlog)
        console.log("Final imageUrl:", mappedBlog.imageUrl)
        console.log("=== End Mapping ===")

        return mappedBlog
    }

    static async getMyBlogs(page = 0, size = 10, sort = "createdAt,desc"): Promise<BlogPost[]> {
        try {
            console.log("Fetching my blogs from:", `${axiosConfig.defaults.baseURL}${this.BASE_PATH}${this.MY_PATH}`)

            const response = await axiosConfig.get<ApiResponse<SpringPageResponse<BlogResponseDTO>>>(
                `${this.BASE_PATH}${this.MY_PATH}`,
                {
                    params: { page, size, sort },
                },
            )
            console.log("Raw response (MyBlogs):", response.data)

            if (!this.isSuccessResponse(response.data)) {
                throw new Error(response.data.message || "Lỗi gọi API khi lấy bài viết của tôi.")
            }

            const pageData = response.data.data
            console.log("Page data (MyBlogs):", pageData)

            if (!pageData) {
                console.warn("Không có dữ liệu trang trong phản hồi (MyBlogs).")
                return []
            }

            let blogs: BlogPost[] = []

            if (Array.isArray(pageData.content)) {
                console.log("Phản hồi là đối tượng phân trang với content là mảng (MyBlogs).")
                blogs = pageData.content.map((dto: BlogResponseDTO) => {
                    console.log("Processing my blog DTO:", dto)
                    console.log("My blog DTO imageUrl:", dto.imageUrl)
                    return BlogService.mapBlogDtoToFrontendBlog(dto)
                })
            } else if (Array.isArray(pageData)) {
                console.warn(
                    "[MyBlogs] Backend trả về mảng trực tiếp, không phải SpringPageResponse. Vui lòng kiểm tra backend.",
                )
                blogs = pageData.map((dto: BlogResponseDTO) => {
                    console.log("Processing my blog DTO (direct array):", dto)
                    return BlogService.mapBlogDtoToFrontendBlog(dto)
                })
            } else {
                console.warn("[MyBlogs] Dữ liệu phản hồi không phù hợp với cấu trúc mong đợi:", pageData)
                return []
            }

            console.log("Converted blogs (MyBlogs):", blogs)
            return blogs
        } catch (error: any) {
            console.error("Lỗi khi lấy bài viết của tôi:", error)

            if (error.response) {
                console.error("Response error (MyBlogs):", error.response.status, error.response.data)

                if (error.response.status === 403) {
                    throw new Error(
                        "Backend không cho phép truy cập endpoint /my-blogs. Vui lòng kiểm tra cấu hình Spring Security cho endpoint này.",
                    )
                }

                if (error.response.status === 404) {
                    throw new Error("Endpoint /api/blogs/my-blogs không tồn tại. Vui lòng kiểm tra backend.")
                }

                if (error.response.data?.message) {
                    throw new Error(`Lỗi Backend: ${error.response.data.message}`)
                }
            }

            if (error.code === "ERR_NETWORK") {
                throw new Error("Không thể kết nối tới backend. Vui lòng kiểm tra backend có đang chạy không.")
            }

            throw error
        }
    }

    /**
     * Get all blogs for admin (including PENDING, REJECTED) - REQUIRES CONTENT_ADMIN
     */
    static async getAllBlogsForAdmin(
        page = 0,
        size = 100,
        sort = "createdAt,desc",
    ): Promise<SpringPageResponse<BlogPost>> {
        try {
            console.log(
                "Fetching all blogs for admin from:",
                `${axiosConfig.defaults.baseURL}${this.BASE_PATH}${this.ADMIN_PATH}/all`,
            )

            const response = await axiosConfig.get<ApiResponse<SpringPageResponse<BlogResponseDTO>>>(
                `${this.BASE_PATH}${this.ADMIN_PATH}/all`,
                {
                    params: { page, size, sort },
                },
            )

            console.log("Raw admin blogs response:", response.data)

            if (!this.isSuccessResponse(response.data)) {
                throw new Error(response.data.message || "Failed to get admin blogs")
            }

            const pageData = response.data.data
            if (!pageData) {
                throw new Error("No page data in admin blogs response")
            }

            // Convert BlogResponseDTO[] to BlogPost[]
            const blogs: BlogPost[] = pageData.content.map(this.mapBlogDtoToFrontendBlog)

            // Return SpringPageResponse with converted blogs
            const result: SpringPageResponse<BlogPost> = {
                ...pageData,
                content: blogs,
            }

            console.log("Converted admin blogs:", result)
            return result
        } catch (error: any) {
            console.error("Error fetching admin blogs:", error)

            if (error.response) {
                if (error.response.status === 403) {
                    throw new Error(
                        "Bạn không có quyền truy cập chức năng này. Chỉ Content Admin mới có thể xem tất cả bài viết.",
                    )
                }
                if (error.response.data?.message) {
                    throw new Error(`Backend error: ${error.response.data.message}`)
                }
            }

            throw error
        }
    }

    /**
     * Approve a blog - REQUIRES CONTENT_ADMIN
     */
    static async approveBlog(id: number): Promise<BlogPost> {
        try {
            console.log(`Approving blog ${id}`)

            const response = await axiosConfig.put<ApiResponse<BlogResponseDTO>>(`${this.BASE_PATH}/${id}/approve`)

            if (!this.isSuccessResponse(response.data)) {
                throw new Error(response.data.message || "Failed to approve blog")
            }

            const dto = response.data.data
            return this.mapBlogDtoToFrontendBlog(dto)
        } catch (error: any) {
            console.error(`Error approving blog ${id}:`, error)

            if (error.response) {
                if (error.response.status === 403) {
                    throw new Error("Bạn không có quyền duyệt bài viết. Chỉ Content Admin mới có thể duyệt bài viết.")
                }
                if (error.response.data?.message) {
                    throw new Error(`Backend error: ${error.response.data.message}`)
                }
            }

            throw error
        }
    }

    /**
     * Reject a blog - REQUIRES CONTENT_ADMIN
     */
    static async rejectBlog(id: number, adminNotes?: string): Promise<BlogPost> {
        try {
            console.log(`Rejecting blog ${id} with notes:`, adminNotes)

            const response = await axiosConfig.put<ApiResponse<BlogResponseDTO>>(`${this.BASE_PATH}/${id}/reject`, null, {
                params: adminNotes ? { adminNotes } : {},
            })

            if (!this.isSuccessResponse(response.data)) {
                throw new Error(response.data.message || "Failed to reject blog")
            }

            const dto = response.data.data
            return this.mapBlogDtoToFrontendBlog(dto)
        } catch (error: any) {
            console.error(`Error rejecting blog ${id}:`, error)

            if (error.response) {
                if (error.response.status === 403) {
                    throw new Error("Bạn không có quyền từ chối bài viết. Chỉ Content Admin mới có thể từ chối bài viết.")
                }
                if (error.response.data?.message) {
                    throw new Error(`Backend error: ${error.response.data.message}`)
                }
            }

            throw error
        }
    }

    /**
     * Get a blog by ID - PUBLIC endpoint
     */
    static async getBlogById(id: number): Promise<BlogPost> {
        try {
            const response = await axiosConfig.get<ApiResponse<BlogResponseDTO>>(`${this.BASE_PATH}/${id}`)

            if (!this.isSuccessResponse(response.data)) {
                throw new Error(response.data.message || "Failed to get blog")
            }

            const dto = response.data.data
            console.log("Single blog DTO:", dto)
            console.log("Single blog imageUrl:", dto.imageUrl)

            return this.mapBlogDtoToFrontendBlog(dto)
        } catch (error: any) {
            console.error(`Error fetching blog ${id}:`, error)
            throw error
        }
    }

    /**
     * Create a new blog with image upload - REQUIRES AUTH
     */
    static async createBlog(blogData: CreateBlogRequest): Promise<BlogPost> {
        try {
            console.log("=== BlogService.createBlog ===")
            console.log("Input blogData:", blogData)
            console.log("imageUrl:", blogData.imageUrl)
            console.log("imageUrl type:", typeof blogData.imageUrl)
            console.log("Is File?", blogData.imageUrl instanceof File)

            // Create FormData for multipart upload
            const formData = new FormData()
            formData.append("title", blogData.title)
            formData.append("content", blogData.content)

            // Backend expects field name "imageUrl" based on BlogRequestDTO
            if (blogData.imageUrl && blogData.imageUrl instanceof File) {
                formData.append("imageUrl", blogData.imageUrl)
                console.log("Added imageUrl file to FormData:", blogData.imageUrl.name)
                console.log("File size:", blogData.imageUrl.size)
                console.log("File type:", blogData.imageUrl.type)
                console.log("File last modified:", new Date(blogData.imageUrl.lastModified))
            } else {
                console.log("No valid imageUrl file to add")
            }

            console.log("=== FormData Debug ===")
            console.log("FormData entries:")
            for (const [key, value] of formData.entries()) {
                if (value instanceof File) {
                    console.log(`${key}: File {`)
                    console.log(`  name: ${value.name}`)
                    console.log(`  size: ${value.size}`)
                    console.log(`  type: ${value.type}`)
                    console.log(`  lastModified: ${new Date(value.lastModified)}`)
                    console.log(`}`)
                } else {
                    console.log(`${key}: "${value}"`)
                }
            }
            console.log("=== End FormData Debug ===")

            // Make sure we're sending the request with proper headers
            const response = await axiosConfig.post<ApiResponse<BlogResponseDTO>>(this.BASE_PATH, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                // Add timeout for large file uploads
                timeout: 30000, // 30 seconds
                // Add progress tracking
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        console.log(`Upload progress: ${percentCompleted}%`)
                    }
                },
            })

            console.log("=== Response Debug ===")
            console.log("Response status:", response.status)
            console.log("Response headers:", response.headers)
            console.log("Full response data:", JSON.stringify(response.data, null, 2))
            console.log("Response message:", response.data.message)
            console.log("Response data payload:", response.data.data)

            // Check if response.data.data exists and has imageUrl
            if (response.data.data) {
                console.log("Backend returned blog data:")
                console.log("- blogId:", response.data.data.blogId)
                console.log("- title:", response.data.data.title)
                console.log("- imageUrl:", response.data.data.imageUrl)
                console.log("- imageUrl type:", typeof response.data.data.imageUrl)
            }
            console.log("=== End Response Debug ===")

            // Check for success response structure - use new success check
            if (!this.isSuccessResponse(response.data)) {
                throw new Error(response.data.message || "Failed to create blog")
            }

            const dto = response.data.data
            if (!dto) {
                throw new Error("No data returned from backend")
            }

            console.log("=== DTO Processing ===")
            console.log("Created blog DTO:", dto)
            console.log("Created blog imageUrl from backend:", dto.imageUrl)
            console.log("DTO imageUrl type:", typeof dto.imageUrl)
            console.log("=== End DTO Processing ===")

            const mappedBlog = this.mapBlogDtoToFrontendBlog(dto)
            console.log("=== Final Result ===")
            console.log("Final mapped blog:", mappedBlog)
            console.log("Final mapped imageUrl:", mappedBlog.imageUrl)
            console.log("=== End Final Result ===")

            return mappedBlog
        } catch (error: any) {
            console.error("=== Error Debug ===")
            console.error("Error creating blog:", error)
            console.error("Error name:", error.name)
            console.error("Error message:", error.message)

            if (error.response) {
                console.error("Response status:", error.response.status)
                console.error("Response statusText:", error.response.statusText)
                console.error("Response data:", error.response.data)
                console.error("Response headers:", error.response.headers)

                if (error.response.status === 403) {
                    throw new Error("Không có quyền tạo bài viết. Vui lòng đăng nhập lại.")
                }

                if (error.response.status === 400) {
                    // Bad request - could be validation error or wrong field name
                    const errorMessage = error.response.data?.message || "Dữ liệu không hợp lệ"
                    console.error("400 Error details:", error.response.data)
                    throw new Error(`Lỗi validation: ${errorMessage}`)
                }

                if (error.response.data?.message) {
                    throw new Error(`Backend error: ${error.response.data.message}`)
                }
            }

            if (error.code === "ECONNABORTED") {
                throw new Error("Timeout: File quá lớn hoặc kết nối chậm")
            }

            if (error.request) {
                console.error("Request was made but no response received:", error.request)
                throw new Error("Không nhận được phản hồi từ server")
            }

            console.error("=== End Error Debug ===")
            throw error
        }
    }

    /**
     * Update an existing blog with optional image upload - REQUIRES AUTH
     */
    static async updateBlog(id: number, blogData: UpdateBlogRequest): Promise<BlogPost> {
        try {
            console.log("=== BlogService.updateBlog ===")
            console.log("Blog ID:", id)
            console.log("Input blogData:", blogData)
            console.log("imageUrl:", blogData.imageUrl)
            console.log("imageUrl type:", typeof blogData.imageUrl)
            console.log("Is File?", blogData.imageUrl instanceof File)
            console.log("removeImage flag:", (blogData as any).removeImage)

            // Create FormData for multipart upload
            const formData = new FormData()

            if (blogData.title) {
                formData.append("title", blogData.title)
            }

            if (blogData.content) {
                formData.append("content", blogData.content)
            }

            // Handle image update - use imageUrl to match backend
            if ((blogData as any).removeImage === true) {
                // User wants to remove image - send special flag
                formData.append("removeImage", "true")
                console.log("Added removeImage flag to FormData")
            } else if (blogData.imageUrl instanceof File) {
                // New image file to upload
                formData.append("imageUrl", blogData.imageUrl)
                console.log("Added new imageUrl file to FormData:", blogData.imageUrl.name)
            } else if (typeof blogData.imageUrl === "string") {
                // Keep existing image URL - don't send anything, backend will keep existing
                console.log("Keeping existing imageUrl:", blogData.imageUrl)
            }

            console.log("FormData contents:")
            for (const [key, value] of formData.entries()) {
                console.log(`${key}:`, value instanceof File ? `File: ${value.name}` : value)
            }

            const response = await axiosConfig.put<ApiResponse<BlogResponseDTO>>(`${this.BASE_PATH}/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            console.log("Update blog response:", response.data)

            if (!this.isSuccessResponse(response.data)) {
                throw new Error(response.data.message || "Failed to update blog")
            }

            const dto = response.data.data
            console.log("Updated blog DTO:", dto)
            console.log("Updated blog imageUrl:", dto.imageUrl)

            return this.mapBlogDtoToFrontendBlog(dto)
        } catch (error: any) {
            console.error(`Error updating blog ${id}:`, error)
            if (error.response) {
                console.error("Response status:", error.response.status)
                console.error("Response data:", error.response.data)
            }
            throw error
        }
    }

    /**
     * Delete a blog - REQUIRES AUTH
     */
    static async deleteBlog(id: number): Promise<void> {
        try {
            const response = await axiosConfig.delete<ApiResponse<void>>(`${this.BASE_PATH}/${id}`)

            if (!this.isSuccessResponse(response.data)) {
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
    static async getBlogsByAuthor(authorId: string): Promise<BlogPost[]> {
        try {
            const allBlogs = await this.getMyBlogs()
            return allBlogs.filter((blog) => blog.authorId === authorId)
        } catch (error: any) {
            console.error(`Error fetching blogs by author ${authorId}:`, error)
            throw error
        }
    }

    /**
     * Get blogs by status - REQUIRES AUTH
     */
    static async getBlogsByStatus(status: string): Promise<BlogPost[]> {
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
    static async searchBlogs(query: string): Promise<BlogPost[]> {
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
