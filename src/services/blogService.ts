import axiosConfig from "../config/axiosConfig"
import type { Blog, CreateBlogRequest, UpdateBlogRequest } from "../types/blog"

export class BlogService {
    private static readonly BASE_PATH = "/blogs"

    /**
     * Get all blogs
     */
    static async getAllBlogs(): Promise<Blog[]> {
        const response = await axiosConfig.get<Blog[]>(this.BASE_PATH)
        return response.data
    }

    /**
     * Get a blog by ID
     */
    static async getBlogById(id: number): Promise<Blog> {
        const response = await axiosConfig.get<Blog>(`${this.BASE_PATH}/${id}`)
        return response.data
    }

    /**
     * Create a new blog
     */
    static async createBlog(blogData: CreateBlogRequest): Promise<Blog> {
        const response = await axiosConfig.post<Blog>(this.BASE_PATH, blogData)
        return response.data
    }

    /**
     * Update an existing blog
     */
    static async updateBlog(id: number, blogData: UpdateBlogRequest): Promise<Blog> {
        const response = await axiosConfig.put<Blog>(`${this.BASE_PATH}/${id}`, blogData)
        return response.data
    }

    /**
     * Delete a blog
     */
    static async deleteBlog(id: number): Promise<void> {
        await axiosConfig.delete(`${this.BASE_PATH}/${id}`)
    }

    /**
     * Get blogs by author
     */
    static async getBlogsByAuthor(authorId: string): Promise<Blog[]> {
        const allBlogs = await this.getAllBlogs()
        return allBlogs.filter((blog) => blog.authorId === authorId)
    }

    /**
     * Get blogs by status
     */
    static async getBlogsByStatus(status: string): Promise<Blog[]> {
        const allBlogs = await this.getAllBlogs()
        return allBlogs.filter((blog) => blog.status === status)
    }

    /**
     * Search blogs by title or content
     */
    static async searchBlogs(query: string): Promise<Blog[]> {
        const allBlogs = await this.getAllBlogs()
        const lowercaseQuery = query.toLowerCase()
        return allBlogs.filter(
            (blog) =>
                blog.title.toLowerCase().includes(lowercaseQuery) || blog.content.toLowerCase().includes(lowercaseQuery),
        )
    }
}
