"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, Eye } from "lucide-react"
import type { BlogPost as BackendBlogPost, BlogUser } from "@/types/blog"
import { formatDate } from "../utils/blog-utils"
import type { BlogStatus } from "@/types/blog"


interface MyPostsListProps {
    posts: BackendBlogPost[]
    currentUser: BlogUser | null
    loading: boolean
    onBack: () => void
    onViewPost: (post: BackendBlogPost) => void
    onEditPost: (post: BackendBlogPost) => void
    onDeletePost: (post: BackendBlogPost) => void
}

const getStatusBadgeColors = (status: BlogStatus) => {
    switch (status) {
        case "PUBLISHED":
            return "bg-emerald-100 text-emerald-800"; // Xanh lá cây đậm hơn
        case "PENDING":
            return "bg-amber-100 text-amber-800"; // Vàng
        case "REJECTED":
            return "bg-red-100 text-red-800";     // Đỏ
        default:
            return "bg-gray-100 text-gray-800";   // Mặc định cho các trạng thái không xác định
    }
};

const getVietnameseStatus = (status: BlogStatus) => {
    switch (status) {
        case "PUBLISHED":
            return "Đã xuất bản";
        case "PENDING":
            return "Chờ phê duyệt";
        case "REJECTED":
            return "Bị từ chối";
        default:
            return status; // Trả về nguyên trạng nếu không khớp
    }
};

const MyPostsList: React.FC<MyPostsListProps> = ({
    posts,
    currentUser,
    loading,
    onBack,
    onViewPost,
    onEditPost,
    onDeletePost,
}) => {
    console.log("[MyPostsList] Received posts prop:", posts);
    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
                <p className="mt-4 text-slate-600 dark:text-slate-300">Đang tải bài viết của bạn...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Quay lại
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Bài viết của tôi</h2>
                    </div>
                </div>
            </div>

            {/* Posts List */}
            {posts.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <div className="text-slate-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Chưa có bài viết nào</h3>
                        <p className="text-slate-600 dark:text-slate-300">
                            Bạn chưa có bài viết đã xuất bản nào. Hãy tạo bài viết đầu tiên!
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {posts.map((post) => (
                        <Card key={post.blogId} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-xl mb-2 line-clamp-2">{post.title}</CardTitle>
                                        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
                                            <span>
                                                Đăng {formatDate(post.createdAt || new Date().toISOString())}
                                            </span>
                                            {post.lastUpdated && post.lastUpdated !== post.createdAt && (
                                                <span className="text-amber-600">
                                                    • Đã chỉnh sửa{" "}
                                                    {formatDate(post.lastUpdated || new Date().toISOString())}
                                                </span>
                                            )}
                                            <Badge variant="secondary" className={getStatusBadgeColors(post.status)}>
                                                {/* HIỂN THỊ TRẠNG THÁI BẰNG TIẾNG VIỆT */}
                                                {getVietnameseStatus(post.status)}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-700 dark:text-slate-300 mb-4 line-clamp-3">{post.content}</p>

                                {/* Stats */}
                                <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 mb-4">
                                    <span className="flex items-center gap-1">
                                        <Eye className="w-4 h-4" />
                                        {post.viewCount || 0} lượt xem
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                            />
                                        </svg>
                                        {post.commentCount || 0} bình luận
                                    </span>

                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onViewPost(post)}
                                        className="flex items-center gap-2"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Xem
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onEditPost(post)}
                                        className="flex items-center gap-2"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Chỉnh sửa
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onDeletePost(post)}
                                        className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:border-red-300"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Xóa
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MyPostsList
