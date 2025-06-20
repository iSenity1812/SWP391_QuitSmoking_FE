"use client"

import { useState, useEffect } from "react"
import { blogService } from "@/services/blogService"
import type { BlogPost, SpringPageResponse, BlogListParams, BlogStatus, BlogRequestDTO } from "@/types/blog"

// Hook để lấy published blogs (public)
export const useBlogPosts = (params?: BlogListParams) => {
  const [data, setData] = useState<SpringPageResponse<BlogPost> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBlogs = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await blogService.getPublishedBlogs(params)
      if (response.success) {
        setData(response.data) // response.data đã là SpringPageResponse<BlogPost>
      } else {
        setError(response.message)
      }
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi tải blog")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [JSON.stringify(params)]) // Use JSON.stringify to properly compare params object

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
        const response = await blogService.getBlogById(id)
        if (response.success) {
          setData(response.data)
        } else {
          setError(response.message)
        }
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

// Hook để lấy blogs của user hiện tại
export const useMyBlogs = (params?: BlogListParams) => {
  const [data, setData] = useState<SpringPageResponse<BlogPost> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMyBlogs = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await blogService.getMyBlogs(params)
      if (response.success) {
        setData(response.data)
      } else {
        setError(response.message)
      }
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi tải blog của bạn")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyBlogs()
  }, [JSON.stringify(params)])

  return { data, loading, error, refetch: fetchMyBlogs }
}

// Hook cho admin - lấy tất cả blogs
export const useAdminBlogs = (params?: BlogListParams) => {
  const [data, setData] = useState<SpringPageResponse<BlogPost> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAdminBlogs = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await blogService.getAllBlogsForAdmin(params)
      if (response.success) {
        setData(response.data)
      } else {
        setError(response.message)
      }
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi tải blog")
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
        const response = await blogService.getBlogsByStatusForAdmin(status, params)
        if (response.success) {
          setData(response.data)
        } else {
          setError(response.message)
        }
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

  const createBlog = async (blogData: BlogRequestDTO) => {
    setLoading(true)
    setError(null)
    try {
      const response = await blogService.createBlog(blogData)
      if (response.success) {
        return response.data
      } else {
        throw new Error(response.message)
      }
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
      const response = await blogService.updateBlog(id, blogData)
      if (response.success) {
        return response.data
      } else {
        throw new Error(response.message)
      }
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
      const response = await blogService.deleteBlog(id)
      if (response.success) {
        return true
      } else {
        throw new Error(response.message)
      }
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi xóa blog")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createBlog, updateBlog, deleteBlog, loading, error }
}

// Hook cho admin actions
export const useAdminBlogActions = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const approveBlog = async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      const response = await blogService.approveBlog(id)
      if (response.success) {
        return response.data
      } else {
        throw new Error(response.message)
      }
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
      const response = await blogService.rejectBlog(id, adminNotes)
      if (response.success) {
        return response.data
      } else {
        throw new Error(response.message)
      }
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi từ chối blog")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { approveBlog, rejectBlog, loading, error }
}
