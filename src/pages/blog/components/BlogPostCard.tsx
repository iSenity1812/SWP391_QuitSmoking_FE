"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, ArrowRight, MoreVertical, Edit, Trash2, Flag, ImageIcon } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import type { BlogPost, BlogUser } from "@/types/blog"
import type { CommentResponseDTO } from "@/types/comment"
import { formatDate } from "../utils/blog-utils"
import { getStatusBadge } from "./UserBadges"

interface BlogPostCardProps {
    post: BlogPost
    index: number
    currentUser: BlogUser | null
    comments: CommentResponseDTO[]
    handleViewPost: (post: BlogPost) => void
    handleEditPost: (post: BlogPost) => void
    handleDeletePost: (post: BlogPost) => void
    handleReportPost: (post: BlogPost) => void
    canEditPost: (post: BlogPost) => boolean
    canDeletePost: (post: BlogPost) => boolean
    canReportPost: (post: BlogPost) => boolean
    getRootComments: (blogId: number) => CommentResponseDTO[]
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({
    post,
    index,
    currentUser,
    comments,
    handleViewPost,
    handleEditPost,
    handleDeletePost,
    handleReportPost,
    canEditPost,
    canDeletePost,
    canReportPost,
    getRootComments,
}) => {
    const blogId = post.blogId || 0

    // Debug image URL - use imageUrl field to match backend
    console.log("=== BlogPostCard Debug ===")
    console.log("Post:", post.title)
    console.log("Post imageUrl:", post.imageUrl)
    console.log("=== End Debug ===")

    // Function to strip HTML tags and get plain text preview
    const getTextPreview = (htmlContent: string, maxLength = 150) => {
        const tmp = document.createElement("div")
        tmp.innerHTML = htmlContent
        const text = tmp.textContent || tmp.innerText || ""
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
    }

    // Function to handle image error
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        console.error("Image failed to load:", post.imageUrl)
        const target = e.target as HTMLImageElement
        target.style.display = "none"
    }

    return (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: index * 0.1 }}>
            <Card className="group overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-500 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            {getStatusBadge(post.status)}
                            {post.imageUrl && (
                                <Badge variant="outline" className="text-xs">
                                    <ImageIcon className="w-3 h-3 mr-1" />
                                    Có hình ảnh
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-500 dark:text-slate-400">{post.authorName}</span>

                            {/* Action Menu for List View */}
                            {currentUser && (canEditPost(post) || canDeletePost(post) || canReportPost(post)) && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {canEditPost(post) && (
                                            <DropdownMenuItem onClick={() => handleEditPost(post)}>
                                                <Edit className="w-4 h-4 mr-2" />
                                                Chỉnh sửa
                                            </DropdownMenuItem>
                                        )}
                                        {canDeletePost(post) && (
                                            <DropdownMenuItem
                                                onClick={() => handleDeletePost(post)}
                                                className="text-red-600 focus:text-red-600"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Xóa
                                            </DropdownMenuItem>
                                        )}
                                        {canReportPost(post) && (
                                            <>
                                                {(canEditPost(post) || canDeletePost(post)) && <DropdownMenuSeparator />}
                                                <DropdownMenuItem
                                                    onClick={() => handleReportPost(post)}
                                                    className="text-orange-600 focus:text-orange-600"
                                                >
                                                    <Flag className="w-4 h-4 mr-2" />
                                                    Báo cáo
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {post.title}
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-300 line-clamp-2">
                        {getTextPreview(post.content)}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Debug Panel - Only show in development */}
                    {process.env.NODE_ENV === "development" && (
                        <div className="mb-4 p-2 bg-yellow-100 dark:bg-yellow-900 rounded text-xs">
                            <strong>Debug Info:</strong>
                            <br />
                            ImageUrl: {post.imageUrl || "undefined"}
                        </div>
                    )}

                    {/* Image Preview */}
                    {post.imageUrl && (
                        <div className="mb-4 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                            <img
                                src={post.imageUrl || "/placeholder.svg"}
                                alt={post.title}
                                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                                onError={handleImageError}
                                onLoad={() => console.log("Image loaded successfully:", post.imageUrl)}
                            />
                        </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-4">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(post.createdAt || new Date().toISOString())}
                            </span>
                            {post.lastUpdated && (
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    Cập nhật: {formatDate(post.lastUpdated)}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold"
                            onClick={() => handleViewPost(post)}
                        >
                            Đọc thêm
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

export default BlogPostCard
