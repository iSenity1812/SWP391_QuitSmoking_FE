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

    /**
     * Get all blogs - PUBLIC endpoint
     */
    static async getAllBlogs(): Promise<BlogPost[]> {
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
                const blogs: BlogPost[] = pageData.map((dto: BlogResponseDTO) => ({
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
            const blogs: BlogPost[] = pageData.content.map((dto: BlogResponseDTO) => {
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

    private static mapBlogDtoToFrontendBlog(dto: BlogResponseDTO): BlogPost {
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
        };
    }

    static async getMyBlogs(
        // Giữ lại các tham số phân trang nếu bạn muốn có khả năng kiểm soát trên frontend
        // Mặc dù kết quả cuối cùng là một mảng phẳng.
        page: number = 0,
        size: number = 10,
        sort: string = "createdAt,desc"
    ): Promise<BlogPost[]> { // Thay đổi kiểu trả về sang Promise<FrontendBlogPost[]>
        try {
            // Sử dụng this.BASE_PATH và this.MY_PATH để tạo URL đầy đủ
            console.log("Fetching my blogs from:", `${axiosConfig.defaults.baseURL}${this.BASE_PATH}${this.MY_PATH}`);

            // Backend trả về ApiResponse<Page<BlogResponseDTO>>
            const response = await axiosConfig.get<ApiResponse<SpringPageResponse<BlogResponseDTO>>>(
                `${this.BASE_PATH}${this.MY_PATH}`, // Kết hợp BASE_PATH và MY_PATH
                {
                    params: { page, size, sort }, // Truyền các tham số phân trang
                }
            );
            console.log("Raw response (MyBlogs):", response.data);

            if (response.data.success === false) {
                throw new Error(response.data.message || "Lỗi gọi API khi lấy bài viết của tôi.");
            }

            const pageData = response.data.data;
            console.log("Page data (MyBlogs):", pageData);

            if (!pageData) {
                console.warn("Không có dữ liệu trang trong phản hồi (MyBlogs).");
                return []; // Trả về mảng rỗng nếu không có dữ liệu
            }

            let blogs: BlogPost[] = [];

            // Backend của /my-blogs trả về SpringPageResponse, nên tập trung vào pageData.content
            if (Array.isArray(pageData.content)) {
                console.log("Phản hồi là đối tượng phân trang với content là mảng (MyBlogs).");
                blogs = pageData.content.map(BlogService.mapBlogDtoToFrontendBlog);
            }
            // Trường hợp dự phòng nếu backend trả về thẳng một mảng (ít xảy ra với Spring Page)
            else if (Array.isArray(pageData)) {
                console.warn("[MyBlogs] Backend trả về mảng trực tiếp, không phải SpringPageResponse. Vui lòng kiểm tra backend.");
                blogs = pageData.map(BlogService.mapBlogDtoToFrontendBlog);
            } else {
                console.warn("[MyBlogs] Dữ liệu phản hồi không phù hợp với cấu trúc mong đợi:", pageData);
                // Trường hợp này có thể xảy ra nếu backend trả về một đối tượng khác không có 'content'
                // hoặc 'content' không phải mảng. Chúng ta sẽ trả về mảng rỗng.
                return [];
            }

            console.log("Converted blogs (MyBlogs):", blogs);
            return blogs; // Trả về mảng BlogPost đã được "lấy phẳng"

        } catch (error: any) {
            console.error("Lỗi khi lấy bài viết của tôi:", error);

            // Xử lý lỗi chi tiết tương tự getAllBlogs
            if (error.response) {
                console.error("Response error (MyBlogs):", error.response.status, error.response.data);

                if (error.response.status === 403) {
                    throw new Error(
                        "Backend không cho phép truy cập endpoint /my-blogs. Vui lòng kiểm tra cấu hình Spring Security cho endpoint này."
                    );
                }

                if (error.response.status === 404) {
                    throw new Error("Endpoint /api/blogs/my-blogs không tồn tại. Vui lòng kiểm tra backend.");
                }

                if (error.response.data?.message) {
                    throw new Error(`Lỗi Backend: ${error.response.data.message}`);
                }
            }

            if (error.code === "ERR_NETWORK") {
                throw new Error("Không thể kết nối tới backend. Vui lòng kiểm tra backend có đang chạy không.");
            }

            throw error;
        }
    }



    /**
     * Get a blog by ID - PUBLIC endpoint
     */
    static async getBlogById(id: number): Promise<BlogPost> {
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
    static async createBlog(blogData: CreateBlogRequest): Promise<BlogPost> {
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
    static async updateBlog(id: number, blogData: UpdateBlogRequest): Promise<BlogPost> {
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
