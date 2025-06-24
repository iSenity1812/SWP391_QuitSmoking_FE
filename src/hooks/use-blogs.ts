"use client"

import { useState, useEffect } from "react"
import { BlogService } from "@/services/blogService"
import type {
  BlogPost,
  SpringPageResponse,
  BlogListParams,
  BlogStatus,
  BlogRequestDTO,
  CreateBlogRequest,
  UpdateBlogRequest,
} from "@/types/blog"

// Hook để lấy published blogs (public) - using getAllBlogs and filtering
export const useBlogPosts = (params?: BlogListParams) => {
  const [data, setData] = useState<SpringPageResponse<BlogPost> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBlogs = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log("Fetching blogs for guest/public access...")
      const blogs = await BlogService.getAllBlogs()
      console.log("Blogs received:", blogs)

      // Ensure blogs is an array
      if (!Array.isArray(blogs)) {
        console.error("Expected array but got:", typeof blogs, blogs)
        throw new Error("Invalid response format: expected array of blogs")
      }

      // Filter for published/approved blogs only for public access
      const publishedBlogs = blogs.filter((blog) => blog.status === "PUBLISHED")

      // Apply search filter if provided
      const filteredBlogs = params?.keyword
        ? publishedBlogs.filter(
          (blog) =>
            blog.title.toLowerCase().includes(params.keyword!.toLowerCase()) ||
            blog.content.toLowerCase().includes(params.keyword!.toLowerCase()),
        )
        : publishedBlogs

      // Create a mock SpringPageResponse structure
      const mockResponse: SpringPageResponse<BlogPost> = {
        content: filteredBlogs,
        totalElements: filteredBlogs.length,
        totalPages: Math.ceil(filteredBlogs.length / (params?.size || 10)),
        size: params?.size || 10,
        number: params?.page || 0,
        first: (params?.page || 0) === 0,
        last: (params?.page || 0) >= Math.ceil(filteredBlogs.length / (params?.size || 10)) - 1,
        numberOfElements: filteredBlogs.length,
        empty: filteredBlogs.length === 0,
        pageable: {
          sort: { empty: true, sorted: false, unsorted: true },
          offset: (params?.page || 0) * (params?.size || 10),
          pageSize: params?.size || 10,
          pageNumber: params?.page || 0,
          paged: true,
          unpaged: false,
        },
        sort: { empty: true, sorted: false, unsorted: true },
      }

      setData(mockResponse)
    } catch (err: any) {
      console.error("Error fetching blogs:", err)
      setError(err.message || "Có lỗi xảy ra khi tải blog")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [JSON.stringify(params)])

  return { data, loading, error, refetch: fetchBlogs }
}

// Hook để lấy single blog
export const useBlogPost = (id: number) => {
  const [data, setData] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchBlog = async () => {
      setLoading(true)
      setError(null)
      try {
        const blog = await BlogService.getBlogById(id)
        setData(blog)
      } catch (err: any) {
        setError(err.message || "Có lỗi xảy ra khi tải blog")
      } finally {
        setLoading(false)
      }
    }

    fetchBlog()
  }, [id])

  return { data, loading, error }
}

// Hook để lấy blogs của user hiện tại - using getBlogsByAuthor
export const useMyBlogs = (authorId: string, params?: BlogListParams) => {
  const [data, setData] = useState<SpringPageResponse<BlogPost> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMyBlogs = async () => {
    console.log(`[useMyBlogs] Attempting to fetch blogs for authorId: ${authorId}`) // This is what you need to see
    setLoading(true)
    setError(null)
    try {
      const blogs = await BlogService.getBlogsByAuthor(authorId)
      console.log("[useMyBlogs] Fetched blogs (all statuses from service):", blogs) // Thêm dòng này nếu chưa có

      // Create a mock SpringPageResponse structure
      const mockResponse: SpringPageResponse<BlogPost> = {
        content: blogs,
        totalElements: blogs.length,
        totalPages: Math.ceil(blogs.length / 10),
        size: 10,
        number: 0,
        first: true,
        last: true,
        numberOfElements: blogs.length,
        empty: blogs.length === 0,
        pageable: {
          sort: { empty: true, sorted: false, unsorted: true },
          offset: 0,
          pageSize: 10,
          pageNumber: 0,
          paged: true,
          unpaged: false,
        },
        sort: { empty: true, sorted: false, unsorted: true },
      }

      setData(mockResponse)
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi tải blog của bạn")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authorId) {
      console.log(`[useMyBlogs] useEffect triggered for authorId: ${authorId}`) // Add this
      fetchMyBlogs()
    } else {
      console.log("[useMyBlogs] useEffect triggered but authorId is falsy, not fetching.") // Add this
    }
  }, [authorId, JSON.stringify(params)])

  return { data, loading, error, refetch: fetchMyBlogs }
}

// Hook cho admin - lấy tất cả blogs (bao gồm PENDING, REJECTED)
export const useAdminBlogs = (params?: BlogListParams & { status?: BlogStatus }) => {
  const [data, setData] = useState<SpringPageResponse<BlogPost> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAdminBlogs = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log("Fetching admin blogs with params:", params)

      const response = await BlogService.getAllBlogsForAdmin(
        params?.page || 0,
        params?.size || 100,
        params?.sort || "createdAt,desc",
      )

      // Apply status filter if provided
      let filteredContent = response.content
      if (params?.status) {
        filteredContent = response.content.filter((blog) => blog.status === params.status)
      }

      // Apply search filter if provided
      if (params?.keyword) {
        filteredContent = filteredContent.filter(
          (blog) =>
            blog.title.toLowerCase().includes(params.keyword!.toLowerCase()) ||
            blog.content.toLowerCase().includes(params.keyword!.toLowerCase()),
        )
      }

      const filteredResponse: SpringPageResponse<BlogPost> = {
        ...response,
        content: filteredContent,
        totalElements: filteredContent.length,
        numberOfElements: filteredContent.length,
        empty: filteredContent.length === 0,
      }

      setData(filteredResponse)
    } catch (err: any) {
      console.error("Error fetching admin blogs:", err)
      setError(err.message || "Có lỗi xảy ra khi tải blog cho admin")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdminBlogs()
  }, [JSON.stringify(params)])

  return { data, loading, error, refetch: fetchAdminBlogs }
}

// Hook cho admin - lấy blogs theo status
export const useBlogsByStatus = (status: BlogStatus, params?: BlogListParams) => {
  const [data, setData] = useState<SpringPageResponse<BlogPost> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBlogsByStatus = async () => {
      setLoading(true)
      setError(null)
      try {
        const blogs = await BlogService.getBlogsByStatus(status)

        // Create a mock SpringPageResponse structure
        const mockResponse: SpringPageResponse<BlogPost> = {
          content: blogs,
          totalElements: blogs.length,
          totalPages: Math.ceil(blogs.length / 10),
          size: 10,
          number: 0,
          first: true,
          last: true,
          numberOfElements: blogs.length,
          empty: blogs.length === 0,
          pageable: {
            sort: { empty: true, sorted: false, unsorted: true },
            offset: 0,
            pageSize: 10,
            pageNumber: 0,
            paged: true,
            unpaged: false,
          },
          sort: { empty: true, sorted: false, unsorted: true },
        }

        setData(mockResponse)
      } catch (err: any) {
        setError(err.message || "Có lỗi xảy ra khi tải blog")
      } finally {
        setLoading(false)
      }
    }

    fetchBlogsByStatus()
  }, [status, JSON.stringify(params)])

  return { data, loading, error }
}

// Hook cho blog actions (CRUD)
export const useBlogActions = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createBlog = async (blogData: BlogRequestDTO, authorId: string) => {
    setLoading(true)
    setError(null)
    try {
      // Convert BlogRequestDTO to CreateBlogRequest by adding authorId
      const createRequest: CreateBlogRequest = {
        ...blogData,
        authorId,
        status: "PENDING", // Default status for new blogs
      }

      const blog = await BlogService.createBlog(createRequest)
      return blog
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi tạo blog")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateBlog = async (id: number, blogData: BlogRequestDTO) => {
    setLoading(true)
    setError(null)
    try {
      // Convert BlogRequestDTO to UpdateBlogRequest
      const updateRequest: UpdateBlogRequest = {
        title: blogData.title,
        content: blogData.content,
      }

      const blog = await BlogService.updateBlog(id, updateRequest)
      return blog
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi cập nhật blog")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteBlog = async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      await BlogService.deleteBlog(id)
      return true
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi xóa blog")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createBlog, updateBlog, deleteBlog, loading, error }
}

// Hook cho admin actions - approve/reject blogs
export const useAdminBlogActions = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const approveBlog = async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      const blog = await BlogService.approveBlog(id)
      return blog
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi duyệt blog")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const rejectBlog = async (id: number, adminNotes?: string) => {
    setLoading(true)
    setError(null)
    try {
      const blog = await BlogService.rejectBlog(id, adminNotes)
      return blog
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi từ chối blog")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { approveBlog, rejectBlog, loading, error }
}
