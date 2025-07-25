"use client"

import type React from "react"
import { Calendar, Clock, CheckCircle, MoreVertical, Edit, Trash2, Flag, ImageIcon } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import type { BlogPost } from "@/types/blog"
import type { CommentResponseDTO } from "@/types/comment"
import { formatDate } from "../utils/blog-utils"
import { getStatusBadge } from "./UserBadges"
import CommentSection from "./CommentSection"
import type { BlogUser } from "@/types/blog"

interface BlogPostDetailProps {
    post: BlogPost
    currentUser: BlogUser | null
    comments: CommentResponseDTO[]
    handleBackToList: () => void
    handleEditPost: (post: BlogPost) => void
    handleDeletePost: (post: BlogPost) => void
    handleReportPost: (post: BlogPost) => void
    canEditPost: (post: BlogPost) => boolean
    canDeletePost: (post: BlogPost) => boolean
    canReportPost: (post: BlogPost) => boolean
    handleAddComment: (blogId: number, content: string, parentCommentId?: number) => void
    setIsLoginPromptOpen: (isOpen: boolean) => void
}

const BlogPostDetail: React.FC<BlogPostDetailProps> = ({
    post,
    currentUser,
    comments,
    handleBackToList,
    handleEditPost,
    handleDeletePost,
    handleReportPost,
    canEditPost,
    canDeletePost,
    canReportPost,
    handleAddComment,
    setIsLoginPromptOpen,
}) => {
    // Get the correct blog ID
    const blogId = post.blogId || post.blogId || 0

    console.log("BlogPostDetail - Post:", post)
    console.log("BlogPostDetail - BlogId:", blogId)
    console.log("BlogPostDetail - ImageUrl:", post.imageUrl)
    console.log("BlogPostDetail - Comments:", comments)

    // Function to render HTML content safely
    const renderHTMLContent = (htmlContent: string) => {
        return (
            <div
                className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-slate-800 dark:prose-headings:text-white prose-p:text-slate-700 dark:prose-p:text-slate-200 prose-strong:text-slate-800 dark:prose-strong:text-white prose-a:text-emerald-600 dark:prose-a:text-emerald-400"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
        )
    }

    // Function to handle image error
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        console.error("Detail image failed to load:", post.imageUrl)
        const target = e.target as HTMLImageElement
        target.style.display = "none"
    }

    return (
        <>
            <Button variant="outline" className="mb-6 bg-transparent" onClick={handleBackToList}>
                ← Quay lại danh sách bài viết
            </Button>
            <Card className="border-2 border-emerald-100 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex items-center justify-between mb-4">
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
                            <span className="text-sm text-slate-500 dark:text-slate-400">Tác giả: {post.authorName}</span>

                            {/* Action Menu */}
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
                    <CardTitle className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">{post.title}</CardTitle>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mt-4">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Đăng: {formatDate(post.createdAt || new Date().toISOString())}
                        </span>
                        {post.lastUpdated && (
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                Cập nhật: {formatDate(post.lastUpdated)}
                            </span>
                        )}
                        {post.approvedBy && post.approvedAt && (
                            <span className="flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                Phê duyệt: {formatDate(post.approvedAt)} bởi {post.approvedBy}
                            </span>
                        )}
                    </div>
                </CardHeader>
                <CardContent>



                    {/* Render HTML content */}
                    {renderHTMLContent(post.content)}
                </CardContent>

                {/* Phần bình luận */}
                <CardFooter>
                    <CommentSection
                        blogId={blogId}
                        comments={comments}
                        currentUser={currentUser}
                        handleAddComment={handleAddComment}
                        setIsLoginPromptOpen={setIsLoginPromptOpen}
                    />
                </CardFooter>
            </Card>
        </>
    )
}

export default BlogPostDetail
