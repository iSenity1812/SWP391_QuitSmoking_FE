"use client"

import { useState, useEffect } from "react"
import { commentService } from "../services/commentService"
import type { CommentResponseDTO, CommentTree } from "../types/comment"

export const useComments = () => {
    const [comments, setComments] = useState<CommentResponseDTO[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchComments = async () => {
        try {
            setLoading(true)
            setError(null)
            // This would need to be implemented in your backend
            // const response = await commentService.getAllComments()
            // setComments(response.data)
            setComments([])
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
    const [comments, setComments] = useState<CommentResponseDTO[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchCommentsByBlog = async () => {
        if (!blogId) {
            setComments([])
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            setError(null)
            const response = await commentService.getCommentsByBlogId(blogId)
            if (response.success) {
                setComments(response.data.content)
            } else {
                setError(response.message)
            }
        } catch (err: any) {
            setError(err.message || "Failed to fetch comments for blog")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCommentsByBlog()
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
            // This would build a tree structure from flat comments
            const response = await commentService.getCommentsByBlogId(blogId)
            if (response.success) {
                // Convert flat comments to tree structure
                const flatComments = response.data.content
                const tree = buildCommentTree(flatComments)
                setCommentTree(tree)
            } else {
                setError(response.message)
            }
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
    const [comment, setComment] = useState<CommentResponseDTO | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchComment = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await commentService.getCommentById(id)
            if (response.success) {
                setComment(response.data)
            } else {
                setError(response.message)
            }
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

// Helper function to build comment tree from flat array
function buildCommentTree(comments: CommentResponseDTO[]): CommentTree[] {
    const commentMap = new Map<number, CommentTree>()
    const rootComments: CommentTree[] = []

    // First pass: create all comment objects
    comments.forEach((comment) => {
        commentMap.set(comment.commentId, {
            ...comment,
            replies: [],
        })
    })

    // Second pass: build the tree structure
    comments.forEach((comment) => {
        const commentNode = commentMap.get(comment.commentId)!

        if (comment.parentCommentId) {
            const parentNode = commentMap.get(comment.parentCommentId)
            if (parentNode) {
                parentNode.replies.push(commentNode)
            }
        } else {
            rootComments.push(commentNode)
        }
    })

    return rootComments
}
