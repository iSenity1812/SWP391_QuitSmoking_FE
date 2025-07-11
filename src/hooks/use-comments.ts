"use client"

import { useState, useEffect } from "react"
import { commentService } from "@/services/commentService"
import type { CommentResponseDTO } from "@/types/comment"

export const useCommentsByBlog = (blogId: number) => {
    const [comments, setComments] = useState<CommentResponseDTO[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchComments = async () => {
        if (!blogId) {
            setComments([])
            return
        }

        try {
            setLoading(true)
            setError(null)
            console.log(`Fetching comments for blog ${blogId}`)

            const response = await commentService.getCommentsByBlog(blogId)
            console.log("Comments response:", response)

            setComments(response)
        } catch (err: any) {
            console.error("Failed to fetch comments:", err)
            setError(err.message || "Có lỗi xảy ra khi tải bình luận")
            setComments([])
        } finally {
            setLoading(false)
        }
    }

    const refetch = () => {
        fetchComments()
    }

    useEffect(() => {
        fetchComments()
    }, [blogId])

    return { comments, loading, error, refetch }
}
