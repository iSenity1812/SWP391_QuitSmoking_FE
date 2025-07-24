"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useBlogPosts, useBlogActions, useMyBlogs } from "@/hooks/use-blogs"
import { commentService } from "@/services/commentService"
import type { BlogPost as BackendBlogPost, BlogUser, CreateBlogRequest, UpdateBlogRequest } from "@/types/blog"
import type { CommentRequestDTO, CommentResponseDTO, CommentApiResponse } from "@/types/comment"
import { toast } from "react-toastify"

// Components
import BlogHeader from "./components/BlogHeader"
import BlogPostList from "./components/BlogPostList"
import BlogPostDetail from "./components/BlogPostDetail"
import UserAuthSection from "./components/UserAuthSection"
import MyPostsList from "./components/MyPostList"

// Dialogs
import LoginPromptDialog from "./dialogs/LoginPromptDialog"
import BlogFormDialog from "./dialogs/BlogFormDialog"
// import ReportDialog from "./dialogs/ReportDialog"
import DeleteConfirmDialog from "./dialogs/DeleteConfirmDialog"
// import { userInfo } from "@/utils/userInfo"

// Form data interfaces
interface BlogFormData {
    title: string
    content: string
    imageUrl?: File | string // Đổi từ image thành imageUrl
    removeImage?: boolean // Add removeImage field
}

interface ReportFormData {
    reason: string
    reportType: string
    reportedContentType: string
}
export type Role = "NORMAL_MEMBER" | "PREMIUM_MEMBER" | "SUPER_ADMIN" | "CONTENT_ADMIN" | "COACH"

type ViewMode = "list" | "detail" | "myPosts"

const BlogPage: React.FC = () => {
    // State
    const [searchTerm, setSearchTerm] = useState("")
    const [filterType, setFilterType] = useState<"all" | "coach">("all")
    const [selectedPost, setSelectedPost] = useState<BackendBlogPost | null>(null)
    const [selectedPostComments, setSelectedPostComments] = useState<CommentResponseDTO[]>([])
    const [viewMode, setViewMode] = useState<ViewMode>("list")
    const [currentUser, setCurrentUser] = useState<BlogUser | null>(null)

    // Set mock user on component mount
    useEffect(() => {
        const userInfoString = localStorage.getItem("user_info")
        if (userInfoString) {
            try {
                const accountData = JSON.parse(userInfoString)
                const user: BlogUser = {
                    id: accountData.userId, // Đảm bảo khớp với JSON trong localStorage
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
        filterType: filterType,
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
        size: 50, // Get more posts for user's own posts
    })

    const { createBlog, updateBlog, deleteBlog, loading: actionLoading } = useBlogActions()
    // const { approveBlog, rejectBlog } = useAdminBlogActions()

    // Get blog posts from API response
    const blogPosts = blogsData?.content || []
    const myPosts = myPostsData?.content || []

    // Effect to update selected post when blogs data changes after comment addition

    // Filter posts based on search term and filter type (handled in hook)
    const filteredPosts = blogPosts

    // Helper function to get root comments for a blog
    const getRootComments = (blogId: number): CommentResponseDTO[] => {
        if (!selectedPost || !selectedPost.comments) return []
        return selectedPost.comments.filter((comment) => comment.blogId === blogId && !comment.parentCommentId)
    }

    // Handlers
    const handleViewPost = (post: BackendBlogPost) => {
        console.log("Viewing post:", post)
        console.log("Post blogId:", post.blogId)
        console.log("Post comments:", post.comments)

        setSelectedPost(post)
        setViewMode("detail")

        // Use comments from the blog response
        if (post.comments && Array.isArray(post.comments)) {
            console.log(`Found ${post.comments.length} comments in blog response`)
            setSelectedPostComments(post.comments)
        } else {
            console.log("No comments found in blog response")
            setSelectedPostComments([])
        }

        window.scrollTo(0, 0)
    }

    const handleBackToList = () => {
        setSelectedPost(null)
        setSelectedPostComments([])
        setViewMode("list")
        window.scrollTo(0, 0)
    }

    const handleViewMyPosts = () => {
        if (!currentUser) {
            setIsLoginPromptOpen(true)
            return
        }
        setViewMode("myPosts")
        window.scrollTo(0, 0)
    }

    const handleBackFromMyPosts = () => {
        setViewMode("list")
        window.scrollTo(0, 0)
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

            // If we're viewing the post that's being deleted, go back to the list
            if (selectedPost?.blogId === deletingPost.blogId) {
                setSelectedPost(null)
                setSelectedPostComments([])
                setViewMode("list")
            }

            setDeletingPost(null)
            setIsDeleteConfirmOpen(false)
            refetchBlogs()
            refetchMyPosts() // Also refresh my posts
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

        // In a real app, you would send this report to the server
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
                // Parse the nested response structure: response.data.data.data
                const newComment: CommentResponseDTO = response.data.data
                console.log("🔵 [COMMENT DEBUG] Parsed new comment:", newComment)

                // Optimistic update - immediately add comment to UI
                const updatedComments = [...selectedPostComments, newComment]
                setSelectedPostComments(updatedComments)

                // Update selected post comment count
                if (selectedPost) {
                    setSelectedPost({
                        ...selectedPost,
                        commentCount: (selectedPost.commentCount || 0) + 1,
                        comments: updatedComments,
                    })
                }

                console.log("🔵 [COMMENT DEBUG] Optimistically updated UI with new comment")

                // Also try to fetch fresh comments from comments API as backup
                try {
                    console.log("🔵 [COMMENT DEBUG] Fetching fresh comments from comments API...")
                    const freshComments = await commentService.getCommentsByBlog(blogId)
                    console.log("🔵 [COMMENT DEBUG] Fresh comments from API:", freshComments.length)

                    if (freshComments.length > selectedPostComments.length) {
                        console.log("🔵 [COMMENT DEBUG] Found more comments from API, updating...")
                        setSelectedPostComments(freshComments)

                        if (selectedPost) {
                            setSelectedPost({
                                ...selectedPost,
                                commentCount: freshComments.length,
                                comments: freshComments,
                            })
                        }
                    }
                } catch (commentError) {
                    console.error("🔴 [COMMENT DEBUG] Error fetching fresh comments:", commentError)
                }

                toast.success("Bình luận đã được thêm thành công!")
            } else {
                throw new Error(response.message || "Failed to add comment")
            }
        } catch (error: any) {
            console.error("🔴 [COMMENT DEBUG] Error adding comment:", error)
            toast.error(`Lỗi khi thêm bình luận: ${error.message || "Có lỗi xảy ra"}`)
        }
    }

    // Permission checks
    const canEditPost = (post: BackendBlogPost) => {
        if (!currentUser) return false
        return (
            currentUser.id === post.authorId || // Author can edit their own posts
            currentUser.role === "CONTENT_ADMIN" // Admin can edit any post
        )
    }

    const canDeletePost = (post: BackendBlogPost) => {
        if (!currentUser) return false
        return (
            currentUser.id === post.authorId || // Author can delete their own posts
            currentUser.role === "CONTENT_ADMIN" // Admin can delete any post
        )
    }

    const canReportPost = (post: BackendBlogPost) => {
        if (!currentUser) return false
        return currentUser.id !== post.authorId // Users can't report their own posts
    }

    // Debug logging
    const selectedBlogId = selectedPost?.blogId || 0
    console.log("Debug: BlogId =", selectedBlogId)
    console.log("Total comments:", selectedPostComments.length)
    console.log("Root comments:", getRootComments(selectedBlogId).length)
    console.log("Comments for this blog:", selectedPostComments.filter((c) => c.blogId === selectedBlogId).length)

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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <BlogHeader
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterType={filterType}
                setFilterType={setFilterType}
            />

            <main className="container mx-auto px-6 pb-20">
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
            </main>

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

            {/* <ReportDialog
                isOpen={isReportDialogOpen}
                onClose={() => {
                    setIsReportDialogOpen(false)
                    setReportingPost(null)
                }}
                onSubmit={handleSubmitReport}
                postTitle={reportingPost?.title || ""}
                postAuthor={reportingPost?.authorId || ""}
            /> */}

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

export default BlogPage
