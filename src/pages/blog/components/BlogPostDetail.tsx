import type React from "react"
import { Calendar, Clock, CheckCircle, MoreVertical, Edit, Trash2, Flag } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { BlogPost } from "@/types/blog"
import type { Comment } from "@/types/comment"
import { formatDate } from "../utils/blog-utils"
import { getStatusBadge, getRoleBadge, getRoleIcon } from "./UserBadges"
import CommentSection from "./CommentSection"
import type { BlogUser } from "@/types/blog"

interface BlogPostDetailProps {
    post: BlogPost
    currentUser: BlogUser | null
    comments: Comment[]
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
    return (
        <>
            <Button variant="outline" className="mb-6" onClick={handleBackToList}>
                ← Quay lại danh sách bài viết
            </Button>
            <Card className="border-2 border-emerald-100 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            {getStatusBadge(post.status)}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-500 dark:text-slate-400">Tác giả: {post.authorId}</span>

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
                    <div className="prose dark:prose-invert max-w-none">
                        <div className="text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{post.content}</div>
                    </div>
                </CardContent>

                {/* Phần bình luận */}
                <CardFooter>
                    <CommentSection
                        blogId={post.blogId || 0}
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
