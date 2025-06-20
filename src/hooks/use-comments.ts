"use client"

import { useState, useEffect } from "react"
import { CommentService } from "../services/commentService"
import type { Comment, CommentTree } from "../types/comment"

export const useComments = () => {
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchComments = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await CommentService.getAllComments()
            setComments(data)
        } catch (err: any) {
            setError(err.message || "Failed to fetch comments")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchComments()
    }, [])

    return {
        comments,
        loading,
        error,
        refetch: fetchComments,
    }
}

export const useCommentsByBlog = (blogId: number) => {
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchCommentsByBlog = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await CommentService.getCommentsByBlogId(blogId)
            setComments(data)
        } catch (err: any) {
            setError(err.message || "Failed to fetch comments for blog")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (blogId) {
            fetchCommentsByBlog()
        }
    }, [blogId])

    return {
        comments,
        loading,
        error,
        refetch: fetchCommentsByBlog,
    }
}

export const useCommentTree = (blogId: number) => {
    const [commentTree, setCommentTree] = useState<CommentTree[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchCommentTree = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await CommentService.getCommentTree(blogId)
            setCommentTree(data)
        } catch (err: any) {
            setError(err.message || "Failed to fetch comment tree")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (blogId) {
            fetchCommentTree()
        }
    }, [blogId])

    return {
        commentTree,
        loading,
        error,
        refetch: fetchCommentTree,
    }
}

export const useComment = (id: number) => {
    const [comment, setComment] = useState<Comment | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchComment = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await CommentService.getCommentById(id)
            setComment(data)
        } catch (err: any) {
            setError(err.message || "Failed to fetch comment")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) {
            fetchComment()
        }
    }, [id])

    return {
        comment,
        loading,
        error,
        refetch: fetchComment,
    }
}
