"use client"
import { useState, useEffect } from "react"
import { useBlogPosts, useBlogActions, useMyBlogs } from "@/hooks/use-blogs"
import { commentService } from "@/services/commentService"
import { CardDescription, CardTitle } from "@/components/ui/card"
import type { BlogRequestDTO, BlogPost as BackendBlogPost, BlogUser, UpdateBlogRequest, CreateBlogRequest } from "@/types/blog"
import type { CommentRequestDTO, CommentResponseDTO, CommentApiResponse } from "@/types/comment"
import { Search } from "lucide-react"

// Components
import BlogPostList from "@/pages/blog/components/BlogPostList"
import BlogPostDetail from "@/pages/blog/components/BlogPostDetail"
import UserAuthSection from "@/pages/blog/components/UserAuthSection"
import MyPostsList from "@/pages/blog/components/MyPostList"
import { Input } from "@/components/ui/input"
import { toast } from "react-toastify"
// Dialogs
import LoginPromptDialog from "@/pages/blog/dialogs/LoginPromptDialog"
import BlogFormDialog from "@/pages/blog/dialogs/BlogFormDialog"
import DeleteConfirmDialog from "@/pages/blog/dialogs/DeleteConfirmDialog"

// Form data interfaces
interface BlogFormData {
    title: string
    content: string
    imageUrl?: File | string // Đổi từ image thành imageUrl
    removeImage?: boolean
}

interface ReportFormData {
    reason: string
    reportType: string
    reportedContentType: string
}

export type Role = "NORMAL_MEMBER" | "PREMIUM_MEMBER" | "SUPER_ADMIN" | "CONTENT_ADMIN" | "COACH"

type ViewMode = "list" | "detail" | "myPosts"

export function CoachBlogManagement() {
    // State
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedPost, setSelectedPost] = useState<BackendBlogPost | null>(null)
    const [selectedPostComments, setSelectedPostComments] = useState<CommentResponseDTO[]>([])
    const [viewMode, setViewMode] = useState<ViewMode>("list")

    // User state (null for guest) - In real app, get from AuthContext
    const [currentUser, setCurrentUser] = useState<BlogUser | null>(null)

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

    // Backend hooks
    const {
        data: blogsData,
        loading: blogsLoading,
        error: blogsError,
        refetch: refetchBlogs,
    } = useBlogPosts({
        page: 0,
        size: 20,
        keyword: searchTerm || undefined,
    })

    // My posts hook - only fetch when user is logged in and viewing my posts
    console.log("Rendering component. currentUser.id passed to useMyBlogs:", currentUser?.id || "")
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

    // Get blog posts from API response
    const blogPosts = blogsData?.content || []
    const myPosts = myPostsData?.content || []

    // Filter posts based on search term
    const filteredPosts = blogPosts.filter((post) => {
        if (!searchTerm) return true
        return (
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })

    // Helper function to get root comments for a blog
    const getRootComments = (blogId: number): CommentResponseDTO[] => {
        if (!selectedPost || !selectedPost.comments) return []
        return selectedPost.comments.filter((comment) => comment.blogId === blogId && !comment.parentCommentId)
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
            // Change this part - use CreateBlogRequest structure
            const blogData: CreateBlogRequest = {
                authorId: currentUser.id,
                title: formData.title,
                content: formData.content,
                imageUrl: formData.imageUrl instanceof File ? formData.imageUrl : undefined, // Đổi từ formData.image
                status: currentUser.role === "COACH" ? "PENDING" : "PUBLISHED",
            }

            console.log("Submitting blog data:", blogData)
            console.log("Image file:", blogData.imageUrl)

            await createBlog(blogData, currentUser.id)
            setIsCreateDialogOpen(false)
            refetchBlogs()
            refetchMyPosts() // Also refresh my posts

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
            console.log("=== BlogPage.handleUpdateBlog ===")
            console.log("Received formData:", formData)
            console.log("formData.removeImage:", formData.removeImage)
            console.log("formData.imageUrl:", formData.imageUrl)
            console.log("formData.imageUrl type:", typeof formData.imageUrl)

            // Change this part - use UpdateBlogRequest structure and include removeImage
            const blogData: UpdateBlogRequest = {
                title: formData.title,
                content: formData.content,
                imageUrl: formData.imageUrl, // Keep as is - can be File or string
                removeImage: formData.removeImage, // IMPORTANT: Add this line to pass removeImage flag
            }

            console.log("=== Prepared blogData for service ===")
            console.log("blogData:", blogData)
            console.log("blogData.removeImage:", blogData.removeImage)
            console.log("blogData.imageUrl:", blogData.imageUrl)

            const blogIdToUpdate = editingPost.blogId
            if (!blogIdToUpdate) {
                alert("Không thể xác định ID của bài viết")
                return
            }

            await updateBlog(blogIdToUpdate, blogData)

            // Update selected post if it's the one being edited
            if (selectedPost?.blogId === editingPost.blogId) {
                setSelectedPost({
                    ...editingPost,
                    title: formData.title,
                    content: formData.content,
                    imageUrl: formData.removeImage
                        ? undefined
                        : typeof formData.imageUrl === "string"
                            ? formData.imageUrl
                            : editingPost.imageUrl, // Handle removeImage case
                    lastUpdated: new Date().toISOString(),
                })
            }

            setEditingPost(null)
            setIsEditDialogOpen(false)
            refetchBlogs()
            refetchMyPosts() // Also refresh my posts
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
                <CardTitle className="text-slate-900 dark:text-white mb-2">Trang Blog</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                    Trang Blog Cá Nhân của Huấn Luyện Viên
                </CardDescription>
            </div>

            {/* Custom Search Section - Only Search Bar */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
                <div className="max-w-2xl mx-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <Input
                            type="text"
                            placeholder="Tìm kiếm bài viết..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-3 rounded-xl border-2 border-emerald-200 dark:border-slate-600 focus:border-emerald-400 dark:focus:border-emerald-500 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
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
                    <BlogPostList
                        posts={filteredPosts}
                        currentUser={currentUser}
                        comments={selectedPostComments}
                        handleViewPost={handleViewPost}
                        handleEditPost={handleEditPost}
                        handleDeletePost={handleDeletePost}
                        handleReportPost={handleReportPost}
                        canEditPost={canEditPost}
                        canDeletePost={canDeletePost}
                        canReportPost={canReportPost}
                        getRootComments={getRootComments}
                    />
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
                            imageUrl: editingPost.imageUrl, // Add image field
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
        </div>
    )
}
