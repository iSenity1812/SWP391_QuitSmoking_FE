"use client"
import { useState, useEffect } from "react"
import { useAdminBlogs, useBlogActions, useMyBlogs, useAdminBlogActions } from "@/hooks/use-blogs"
import { commentService } from "@/services/commentService"
import type { BlogRequestDTO, BlogPost as BackendBlogPost, BlogUser, BlogStatus } from "@/types/blog"
import type { CommentRequestDTO, CommentResponseDTO, CommentApiResponse } from "@/types/comment"
import { Search, CheckCircle, XCircle, Clock, Eye, Trash2 } from "lucide-react"
import BlogPostDetail from "@/pages/blog/components/BlogPostDetail"
import UserAuthSection from "@/pages/blog/components/UserAuthSection"
import MyPostsList from "@/pages/blog/components/MyPostList"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "react-toastify"

// Helper function to convert status to Vietnamese
const getStatusText = (status: BlogStatus) => {
    const statusMap = {
        PENDING: "Chờ duyệt",
        PUBLISHED: "Đã xuất bản",
        REJECTED: "Đã từ chối",
    }
    return statusMap[status] || status
}

// Dialogs
import LoginPromptDialog from "@/pages/blog/dialogs/LoginPromptDialog"
import BlogFormDialog from "@/pages/blog/dialogs/BlogFormDialog"
import DeleteConfirmDialog from "@/pages/blog/dialogs/DeleteConfirmDialog"

// Form data interfaces
interface BlogFormData {
    title: string
    content: string
}

interface ReportFormData {
    reason: string
    reportType: string
    reportedContentType: string
}

export type Role = "NORMAL_MEMBER" | "PREMIUM_MEMBER" | "SUPER_ADMIN" | "CONTENT_ADMIN" | "COACH"

type ViewMode = "list" | "detail" | "myPosts"

export function BlogManagement() {
    // State
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<BlogStatus | "ALL">("ALL")
    const [selectedPost, setSelectedPost] = useState<BackendBlogPost | null>(null)
    const [selectedPostComments, setSelectedPostComments] = useState<CommentResponseDTO[]>([])
    const [viewMode, setViewMode] = useState<ViewMode>("list")

    // User state (null for guest) - In real app, get from AuthContext
    const [currentUser, setCurrentUser] = useState<BlogUser | null>(null)

    // Admin action dialogs
    const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
    const [rejectNotes, setRejectNotes] = useState("")
    const [actioningPost, setActioningPost] = useState<BackendBlogPost | null>(null)

    // Set mock user on component mount
    useEffect(() => {
        const userInfoString = localStorage.getItem("user_info")
        if (userInfoString) {
            try {
                const accountData = JSON.parse(userInfoString)
                const user: BlogUser = {
                    id: accountData.userId,
                    username: accountData.username,
                    role: accountData.role,
                }
                setCurrentUser(user)
                console.log("DEBUG: currentUser loaded from localStorage. ID:", user.id)
            } catch (e) {
                console.error("Error parsing user info from localStorage", e)
                setCurrentUser(null)
            }
        } else {
            console.log("DEBUG: No user info found in localStorage.")
            setCurrentUser(null)
        }
    }, [])

    // Dialog states
    const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)

    // Temporary state for editing/deleting/reporting
    const [editingPost, setEditingPost] = useState<BackendBlogPost | null>(null)
    const [reportingPost, setReportingPost] = useState<BackendBlogPost | null>(null)
    const [deletingPost, setDeletingPost] = useState<BackendBlogPost | null>(null)

    // Backend hooks - Always get all blogs, filter on frontend
    const {
        data: blogsData,
        loading: blogsLoading,
        error: blogsError,
        refetch: refetchBlogs,
    } = useAdminBlogs({
        page: 0,
        size: 100,
        keyword: searchTerm || undefined,
        // Remove status filter - always get all blogs
    })

    // My posts hook - only fetch when user is logged in and viewing my posts
    const {
        data: myPostsData,
        loading: myPostsLoading,
        error: myPostsError,
        refetch: refetchMyPosts,
    } = useMyBlogs(currentUser?.id || "", {
        page: 0,
        size: 50,
    })

    const { createBlog, updateBlog, deleteBlog, loading: actionLoading } = useBlogActions()
    const { approveBlog, rejectBlog, loading: adminActionLoading } = useAdminBlogActions()

    // Get blog posts from API response
    const blogPosts = blogsData?.content || []
    const myPosts = myPostsData?.content || []

    // Get all blog posts from API response (unfiltered)
    const allBlogPosts = blogsData?.content || []

    // Get status counts for tabs - always use all data
    const statusCounts = {
        ALL: allBlogPosts.length,
        PENDING: allBlogPosts.filter((p) => p.status === "PENDING").length,
        PUBLISHED: allBlogPosts.filter((p) => p.status === "PUBLISHED").length,
        REJECTED: allBlogPosts.filter((p) => p.status === "REJECTED").length,
    }

    // Filter posts based on search term and status - frontend filtering
    const filteredPosts = allBlogPosts.filter((post) => {
        const matchesSearch =
            !searchTerm ||
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "ALL" || post.status === statusFilter

        return matchesSearch && matchesStatus
    })

    // Helper function to get root comments for a blog
    const getRootComments = (blogId: number): CommentResponseDTO[] => {
        if (!selectedPost || !selectedPost.comments) return []
        return selectedPost.comments.filter((comment) => comment.blogId === blogId && !comment.parentCommentId)
    }

    // Status badge component
    const StatusBadge = ({ status }: { status: BlogStatus }) => {
        const variants = {
            PENDING: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
            PUBLISHED: { color: "bg-green-100 text-green-800", icon: CheckCircle },
            REJECTED: { color: "bg-red-100 text-red-800", icon: XCircle },
        }

        const variant = variants[status]
        const Icon = variant.icon

        return (
            <Badge className={`${variant.color} flex items-center gap-1`}>
                <Icon className="w-3 h-3" />
                {getStatusText(status)}
            </Badge>
        )
    }

    // Admin Blog Card Component
    const AdminBlogCard = ({ post }: { post: BackendBlogPost }) => {
        const canApprove = post.status === "PENDING" || post.status === "REJECTED"
        const canReject = post.status === "PENDING"

        return (
            <Card className="mb-4">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
                            <CardDescription className="flex items-center gap-4 text-sm">
                                <span>Tác giả: {post.authorName || "Unknown"}</span>
                                <span>Ngày tạo: {new Date(post.createdAt || "").toLocaleDateString("vi-VN")}</span>
                                {post.approvedBy && <span>Duyệt bởi: {post.approvedBy}</span>}
                            </CardDescription>
                        </div>
                        <StatusBadge status={post.status} />
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">{post.content.substring(0, 200)}...</p>
                    <div className="flex gap-2 flex-wrap">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewPost(post)}
                            className="flex items-center gap-1"
                        >
                            <Eye className="w-4 h-4" />
                            Xem chi tiết
                        </Button>

                        {canDeletePost(post) && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeletePost(post)}
                                className="flex items-center gap-1 text-red-600 hover:text-red-700"
                            >
                                <Trash2 className="w-4 h-4" />
                                Xóa
                            </Button>
                        )}

                        {canApprove && (
                            <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleApproveBlog(post)}
                                className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                                disabled={adminActionLoading}
                            >
                                <CheckCircle className="w-4 h-4" />
                                Duyệt
                            </Button>
                        )}

                        {canReject && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRejectBlog(post)}
                                className="flex items-center gap-1 text-red-600 hover:text-red-700"
                                disabled={adminActionLoading}
                            >
                                <XCircle className="w-4 h-4" />
                                Từ chối
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Handlers
    const handleViewPost = (post: BackendBlogPost) => {
        console.log("Viewing post:", post)
        setSelectedPost(post)
        setViewMode("detail")

        if (post.comments && Array.isArray(post.comments)) {
            console.log(`Found ${post.comments.length} comments in blog response`)
            setSelectedPostComments(post.comments)
        } else {
            console.log("No comments found in blog response")
            setSelectedPostComments([])
        }
    }

    const handleBackToList = () => {
        setSelectedPost(null)
        setSelectedPostComments([])
        setViewMode("list")
    }

    const handleViewMyPosts = () => {
        if (!currentUser) {
            setIsLoginPromptOpen(true)
            return
        }
        setViewMode("myPosts")
    }

    const handleBackFromMyPosts = () => {
        setViewMode("list")
    }

    const handleCreateBlogClick = () => {
        if (!currentUser) {
            setIsLoginPromptOpen(true)
            return
        }

        setIsCreateDialogOpen(true)
    }

    const handleCreateBlog = async (formData: BlogFormData) => {
        if (!currentUser) {
            setIsLoginPromptOpen(true)
            return
        }

        try {
            const blogData: BlogRequestDTO = {
                title: formData.title,
                content: formData.content,
            }

            await createBlog(blogData, currentUser.id)
            setIsCreateDialogOpen(false)
            refetchBlogs()
            refetchMyPosts()

            const successMessage =
                currentUser.role === "COACH"
                    ? "Bài viết đã được tạo thành công! Bài viết đang chờ phê duyệt."
                    : "Bài viết đã được tạo và xuất bản thành công!"

            toast.success(successMessage)
        } catch (error: any) {
            toast.error(`Lỗi khi tạo bài viết: ${error.message || "Có lỗi xảy ra"}`)
        }
    }

    const handleEditPost = (post: BackendBlogPost) => {
        if (!canEditPost(post)) return
        setEditingPost(post)
        setIsEditDialogOpen(true)
    }

    const handleUpdateBlog = async (formData: BlogFormData) => {
        if (!editingPost || !currentUser) return

        try {
            const blogData: BlogRequestDTO = {
                title: formData.title,
                content: formData.content,
            }

            const blogIdToUpdate = editingPost.blogId
            if (!blogIdToUpdate) {
                alert("Không thể xác định ID của bài viết")
                return
            }

            await updateBlog(blogIdToUpdate, blogData)

            if (selectedPost?.blogId === editingPost.blogId) {
                setSelectedPost({
                    ...editingPost,
                    title: formData.title,
                    content: formData.content,
                    lastUpdated: new Date().toISOString(),
                })
            }

            setEditingPost(null)
            setIsEditDialogOpen(false)
            refetchBlogs()
            refetchMyPosts()
            toast.success("Bài viết đã được cập nhật thành công!")
        } catch (error: any) {
            toast.error(`Lỗi khi cập nhật bài viết: ${error.message || "Có lỗi xảy ra"}`)
        }
    }

    const handleDeletePost = (post: BackendBlogPost) => {
        if (!canDeletePost(post)) return
        setDeletingPost(post)
        setIsDeleteConfirmOpen(true)
    }

    const confirmDeletePost = async () => {
        if (!deletingPost) return

        try {
            const blogIdToDelete = deletingPost.blogId
            if (!blogIdToDelete) {
                alert("Không thể xác định ID của bài viết")
                return
            }

            await deleteBlog(blogIdToDelete)

            if (selectedPost?.blogId === deletingPost.blogId) {
                setSelectedPost(null)
                setSelectedPostComments([])
                setViewMode("list")
            }

            setDeletingPost(null)
            setIsDeleteConfirmOpen(false)
            refetchBlogs()
            refetchMyPosts()
            toast.success("Bài viết đã được xóa thành công!")
        } catch (error: any) {
            toast.error(`Lỗi khi xóa bài viết: ${error.message || "Có lỗi xảy ra"}`)
        }
    }

    const handleReportPost = (post: BackendBlogPost) => {
        if (!canReportPost(post)) return
        setReportingPost(post)
        setIsReportDialogOpen(true)
    }

    const handleSubmitReport = (reportData: ReportFormData) => {
        if (!reportingPost || !currentUser) {
            setIsLoginPromptOpen(true)
            return
        }

        console.log("Report submitted:", {
            reportedBlogId: reportingPost.blogId,
            reportedBy: currentUser.id,
            ...reportData,
        })

        setReportingPost(null)
        setIsReportDialogOpen(false)
        toast.success("Báo cáo đã được gửi thành công! Đội ngũ quản trị sẽ xem xét báo cáo của bạn.")
    }

    // Admin action handlers
    const handleApproveBlog = (post: BackendBlogPost) => {
        setActioningPost(post)
        setIsApproveDialogOpen(true)
    }

    const handleRejectBlog = (post: BackendBlogPost) => {
        setActioningPost(post)
        setIsRejectDialogOpen(true)
    }

    const confirmApproveBlog = async () => {
        if (!actioningPost) return

        try {
            const blogId = actioningPost.blogId
            if (!blogId) {
                alert("Không thể xác định ID của bài viết")
                return
            }

            await approveBlog(blogId)
            setIsApproveDialogOpen(false)
            setActioningPost(null)
            refetchBlogs()
            toast.success("Bài viết đã được duyệt thành công!")
        } catch (error: any) {
            toast.error(`Lỗi khi duyệt bài viết: ${error.message || "Có lỗi xảy ra"}`)
        }
    }

    const confirmRejectBlog = async () => {
        if (!actioningPost) return

        try {
            const blogId = actioningPost.blogId
            if (!blogId) {
                alert("Không thể xác định ID của bài viết")
                return
            }

            await rejectBlog(blogId, rejectNotes)
            setIsRejectDialogOpen(false)
            setActioningPost(null)
            setRejectNotes("")
            refetchBlogs()
            toast.success("Bài viết đã được từ chối!")
        } catch (error: any) {
            toast.error(`Lỗi khi từ chối bài viết: ${error.message || "Có lỗi xảy ra"}`)
        }
    }

    const handleAddComment = async (blogId: number, content: string, parentCommentId?: number) => {
        if (!currentUser) {
            setIsLoginPromptOpen(true)
            return
        }

        try {
            const commentData: CommentRequestDTO = {
                blogId,
                content,
                parentCommentId,
            }

            console.log("🔵 [COMMENT DEBUG] Starting to add comment:", commentData)
            console.log("🔵 [COMMENT DEBUG] Current selectedPost before adding comment:", selectedPost)
            console.log("🔵 [COMMENT DEBUG] Current selectedPostComments before adding comment:", selectedPostComments.length)

            const response: CommentApiResponse<CommentResponseDTO> = await commentService.addComment(commentData)
            console.log("🔵 [COMMENT DEBUG] Comment API response:", response)

            if (response.success && response.data) {
                const newComment = response.data.data
                console.log("🔵 [COMMENT DEBUG] New comment created:", newComment)

                // Optimistic update - immediately add comment to UI
                if (selectedPost?.blogId === blogId) {
                    const updatedComments: CommentResponseDTO[] = [...selectedPostComments, newComment]
                    setSelectedPostComments(updatedComments)

                    setSelectedPost({
                        ...selectedPost,
                        commentCount: (selectedPost.commentCount || 0) + 1,
                        comments: updatedComments,
                    })
                    console.log("🔵 [COMMENT DEBUG] Updated selectedPost and selectedPostComments optimistically")
                }

                toast.success("Bình luận đã được thêm thành công!")
            } else {
                throw new Error(response.message || "Failed to add comment")
            }
        } catch (error: any) {
            console.error("Error adding comment:", error)
            toast.error(`Lỗi khi thêm bình luận: ${error.message || "Có lỗi xảy ra"}`)
        }
    }

    // Permission checks - Admin has more permissions
    const canEditPost = (post: BackendBlogPost) => {
        if (!currentUser) return false
        return (
            currentUser.id === post.authorId || currentUser.role === "CONTENT_ADMIN" || currentUser.role === "SUPER_ADMIN"
        )
    }

    const canDeletePost = (post: BackendBlogPost) => {
        if (!currentUser) return false
        return (
            currentUser.id === post.authorId || currentUser.role === "CONTENT_ADMIN" || currentUser.role === "SUPER_ADMIN"
        )
    }

    const canReportPost = (post: BackendBlogPost) => {
        if (!currentUser) return false
        return currentUser.id !== post.authorId
    }

    // Error handling
    if (blogsError) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Lỗi tải dữ liệu</h2>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">{blogsError}</p>
                    <button
                        onClick={() => refetchBlogs()}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Admin Blog Management Header */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Quản lý Blog</h2>
                <p className="text-slate-600 dark:text-slate-300">Quản lý tất cả bài viết blog trong hệ thống</p>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{statusCounts.ALL}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">Tổng bài viết</div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">{statusCounts.PENDING}</div>
                        <div className="text-sm text-yellow-600 dark:text-yellow-300">Chờ duyệt</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-green-800 dark:text-green-200">{statusCounts.PUBLISHED}</div>
                        <div className="text-sm text-green-600 dark:text-green-300">Đã xuất bản</div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-red-800 dark:text-red-200">{statusCounts.REJECTED}</div>
                        <div className="text-sm text-red-600 dark:text-red-300">Đã từ chối</div>
                    </div>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <Input
                            type="text"
                            placeholder="Tìm kiếm bài viết..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                <UserAuthSection
                    currentUser={currentUser}
                    handleCreateBlogClick={handleCreateBlogClick}
                    handleViewMyPosts={handleViewMyPosts}
                />

                {blogsLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
                        <p className="mt-4 text-slate-600 dark:text-slate-300">Đang tải bài viết...</p>
                    </div>
                ) : viewMode === "detail" && selectedPost ? (
                    <BlogPostDetail
                        post={selectedPost}
                        currentUser={currentUser}
                        comments={selectedPostComments}
                        handleBackToList={handleBackToList}
                        handleEditPost={handleEditPost}
                        handleDeletePost={handleDeletePost}
                        handleReportPost={handleReportPost}
                        canEditPost={canEditPost}
                        canDeletePost={canDeletePost}
                        canReportPost={canReportPost}
                        handleAddComment={handleAddComment}
                        setIsLoginPromptOpen={setIsLoginPromptOpen}
                    />
                ) : viewMode === "myPosts" ? (
                    <MyPostsList
                        posts={myPosts}
                        currentUser={currentUser}
                        loading={myPostsLoading}
                        onBack={handleBackFromMyPosts}
                        onViewPost={handleViewPost}
                        onEditPost={handleEditPost}
                        onDeletePost={handleDeletePost}
                    />
                ) : (
                    <div className="p-6">
                        {/* Status Filter Tabs */}
                        <Tabs
                            value={statusFilter}
                            onValueChange={(value) => setStatusFilter(value as BlogStatus | "ALL")}
                            className="mb-6"
                        >
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="ALL">Tất cả ({statusCounts.ALL})</TabsTrigger>
                                <TabsTrigger value="PENDING">Chờ duyệt ({statusCounts.PENDING})</TabsTrigger>
                                <TabsTrigger value="PUBLISHED">Đã xuất bản ({statusCounts.PUBLISHED})</TabsTrigger>
                                <TabsTrigger value="REJECTED">Đã từ chối ({statusCounts.REJECTED})</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        {/* Blog List */}
                        {filteredPosts.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-slate-600 dark:text-slate-300">
                                    {statusFilter === "ALL"
                                        ? "Không có bài viết nào."
                                        : `Không có bài viết nào với trạng thái ${getStatusText(statusFilter as BlogStatus)}.`}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredPosts.map((post) => (
                                    <AdminBlogCard key={post.blogId} post={post} />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Dialogs */}
            <LoginPromptDialog isOpen={isLoginPromptOpen} onClose={() => setIsLoginPromptOpen(false)} />

            <BlogFormDialog
                isOpen={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
                onSubmit={handleCreateBlog}
                currentUserRole={currentUser?.role}
                loading={actionLoading}
            />

            <BlogFormDialog
                isOpen={isEditDialogOpen}
                onClose={() => {
                    setIsEditDialogOpen(false)
                    setEditingPost(null)
                }}
                onSubmit={handleUpdateBlog}
                initialData={
                    editingPost
                        ? {
                            title: editingPost.title,
                            content: editingPost.content,
                        }
                        : undefined
                }
                isEdit={true}
                loading={actionLoading}
            />

            <DeleteConfirmDialog
                isOpen={isDeleteConfirmOpen}
                onClose={() => {
                    setIsDeleteConfirmOpen(false)
                    setDeletingPost(null)
                }}
                onConfirm={confirmDeletePost}
                postTitle={deletingPost?.title || ""}
            />

            {/* Approve Dialog */}
            <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận duyệt bài viết</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn duyệt bài viết "{actioningPost?.title}"?
                            <br />
                            Bài viết sẽ được chuyển sang trạng thái PUBLISHED và hiển thị công khai.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsApproveDialogOpen(false)
                                setActioningPost(null)
                            }}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={confirmApproveBlog}
                            disabled={adminActionLoading}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {adminActionLoading ? "Đang xử lý..." : "Duyệt bài viết"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Từ chối bài viết</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn từ chối bài viết "{actioningPost?.title}"?
                            <br />
                            Bài viết sẽ được chuyển sang trạng thái REJECTED.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="reject-notes">Ghi chú (tùy chọn)</Label>
                            <Textarea
                                id="reject-notes"
                                placeholder="Nhập lý do từ chối bài viết..."
                                value={rejectNotes}
                                onChange={(e) => setRejectNotes(e.target.value)}
                                className="mt-1"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsRejectDialogOpen(false)
                                setActioningPost(null)
                                setRejectNotes("")
                            }}
                        >
                            Hủy
                        </Button>
                        <Button onClick={confirmRejectBlog} disabled={adminActionLoading} variant="destructive">
                            {adminActionLoading ? "Đang xử lý..." : "Từ chối bài viết"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
    