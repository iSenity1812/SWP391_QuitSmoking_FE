"use client"

import type React from "react"
import { useState } from "react"
import { MessageCircle, Send, Reply } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { BlogUser } from "@/types/blog"
import type { CommentResponseDTO } from "@/types/comment"
import { formatDate } from "../utils/blog-utils"

interface CommentSectionProps {
    blogId: number
    comments: CommentResponseDTO[]
    currentUser: BlogUser | null
    handleAddComment: (blogId: number, content: string, parentCommentId?: number) => void
    setIsLoginPromptOpen: (isOpen: boolean) => void
}

const CommentSection: React.FC<CommentSectionProps> = ({
    blogId,
    comments,
    currentUser,
    handleAddComment,
    setIsLoginPromptOpen,
}) => {
    const [commentText, setCommentText] = useState("")
    const [replyingTo, setReplyingTo] = useState<number | null>(null)
    const [replyText, setReplyText] = useState("")

    console.log("CommentSection - blogId:", blogId, "comments:", comments)

    const rootComments = comments.filter((comment) => comment.blogId === blogId && !comment.parentCommentId)

    const handleSubmitComment = () => {
        if (!currentUser) {
            setIsLoginPromptOpen(true)
            return
        }

        if (commentText.trim()) {
            handleAddComment(blogId, commentText)
            setCommentText("")
        }
    }

    const handleReply = (commentId: number) => {
        if (!currentUser) {
            setIsLoginPromptOpen(true)
            return
        }
        setReplyingTo(commentId)
    }

    const handleSubmitReply = (commentId: number) => {
        if (!currentUser) {
            setIsLoginPromptOpen(true)
            return
        }

        if (replyText.trim()) {
            handleAddComment(blogId, replyText, commentId)
            setReplyText("")
            setReplyingTo(null)
        }
    }

    const getCommentReplies = (comments: CommentResponseDTO[], parentId: number): CommentResponseDTO[] => {
        return comments.filter((comment) => comment.parentCommentId === parentId)
    }

    return (
        <div className="w-full flex flex-col items-start border-t pt-6">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Bình luận ({rootComments.length})
            </h3>

            {/* Form bình luận */}
            <div className="w-full mb-6">
                <Textarea
                    placeholder={currentUser ? "Viết bình luận của bạn..." : "Đăng nhập để viết bình luận..."}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="mb-2"
                    disabled={!currentUser}
                />
                <Button
                    onClick={handleSubmitComment}
                    disabled={!commentText.trim() || !currentUser}
                    className="flex items-center gap-2"
                >
                    <Send className="w-4 h-4" />
                    {currentUser ? "Gửi bình luận" : "Đăng nhập để bình luận"}
                </Button>
            </div>

            {/* Debug info */}
            {process.env.NODE_ENV === "development" && (
                <div className="w-full mb-4 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                    <p>Debug: BlogId = {blogId}</p>
                    <p>Total comments: {comments.length}</p>
                    <p>Root comments: {rootComments.length}</p>
                    <p>Comments for this blog: {comments.filter((c) => c.blogId === blogId).length}</p>
                </div>
            )}

            {/* Danh sách bình luận */}
            <div className="w-full space-y-4">
                {rootComments.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                        <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
                    </div>
                ) : (
                    rootComments.map((comment) => (
                        <div key={comment.commentId} className="border rounded-lg p-4 bg-white/50 dark:bg-slate-800/50">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Avatar className="w-8 h-8">
                                        <AvatarFallback>
                                            {(comment.user?.username || "U").slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800 dark:text-white">
                                            {comment.user?.username || "Unknown User"}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {formatDate(comment.commentDate || new Date().toISOString())}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs text-slate-400">#{comment.commentId}</span>
                            </div>
                            <p className="text-slate-700 dark:text-slate-200 mb-2">{comment.content}</p>

                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-500 dark:text-slate-400"
                                onClick={() => handleReply(comment.commentId!)}
                            >
                                <Reply className="w-4 h-4 mr-1" />
                                {currentUser ? "Phản hồi" : "Đăng nhập để phản hồi"}
                            </Button>

                            {/* Form phản hồi */}
                            {replyingTo === comment.commentId && currentUser && (
                                <div className="mt-2 pl-8 border-l-2 border-slate-200 dark:border-slate-700">
                                    <Textarea
                                        placeholder="Viết phản hồi của bạn..."
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        className="mb-2 text-sm"
                                    />
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            onClick={() => handleSubmitReply(comment.commentId!)}
                                            disabled={!replyText.trim()}
                                        >
                                            Gửi
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => setReplyingTo(null)}>
                                            Hủy
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Phản hồi cho bình luận */}
                            {getCommentReplies(comments, comment.commentId!).length > 0 && (
                                <div className="mt-3 pl-8 space-y-3 border-l-2 border-slate-200 dark:border-slate-700">
                                    {getCommentReplies(comments, comment.commentId!).map((reply) => (
                                        <div key={reply.commentId} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="w-6 h-6">
                                                        <AvatarFallback>
                                                            {(reply.user?.username || "U").slice(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-xs font-semibold text-slate-800 dark:text-white">
                                                            {reply.user?.username || "Unknown User"}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            {formatDate(reply.commentDate || new Date().toISOString())}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-slate-400">#{reply.commentId}</span>
                                            </div>
                                            <p className="text-sm text-slate-700 dark:text-slate-200">{reply.content}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default CommentSection