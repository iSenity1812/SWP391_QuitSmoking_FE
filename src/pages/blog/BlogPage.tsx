"use client"

import type React from "react"
import { useState } from "react"
import { AnimatedSection } from "@/components/ui/AnimatedSection"
import { useBlogPosts, useBlogActions, useAdminBlogActions } from "@/hooks/use-blogs"
import { useCommentsByBlog } from "@/hooks/use-comments"
import { commentService } from "@/services/commentService"
import type { BlogRequestDTO, BlogPost as BackendBlogPost, BlogUser } from "@/types/blog"
import type { CommentRequestDTO, Comment as BackendComment } from "@/types/comment"

// Components
import BlogHeader from "./components/BlogHeader"
import BlogPostList from "./components/BlogPostList"
import BlogPostDetail from "./components/BlogPostDetail"
import UserAuthSection from "./components/UserAuthSection"

// Dialogs
import LoginPromptDialog from "./dialogs/LoginPromptDialog"
import BlogFormDialog from "./dialogs/BlogFormDialog"
// import ReportDialog from "./dialogs/ReportDialog"
import DeleteConfirmDialog from "./dialogs/DeleteConfirmDialog"

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

const BlogPage: React.FC = () => {
    // State
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedPost, setSelectedPost] = useState<BackendBlogPost | null>(null)

    // User state (null for guest) - In real app, get from AuthContext
    const [currentUser, setCurrentUser] = useState<BlogUser | null>(null)

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

    const { createBlog, updateBlog, deleteBlog, loading: actionLoading } = useBlogActions()
    const { approveBlog, rejectBlog } = useAdminBlogActions()

    // Comments for selected post
    const {
        comments: selectedPostComments,
        loading: commentsLoading,
        refetch: refetchComments,
    } = useCommentsByBlog(selectedPost?.blogId || 0)

    // Get blog posts from API response
    const blogPosts = blogsData?.content || []

    // Filter posts based on search term (additional client-side filtering if needed)
    const filteredPosts = blogPosts.filter((post) => {
        if (!searchTerm) return true
        return (
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })

    // Helper function to get root comments for a blog
    const getRootComments = (blogId: number): BackendComment[] => {
        return selectedPostComments.filter((comment) => comment.blogId === blogId && !comment.parentCommentId)
    }

    // Handlers
    const handleViewPost = (post: BackendBlogPost) => {
        setSelectedPost(post)
        window.scrollTo(0, 0)
    }

    const handleBackToList = () => {
        setSelectedPost(null)
        window.scrollTo(0, 0)
    }

    const handleCreateBlogClick = () => {
        if (!currentUser) {
            setIsLoginPromptOpen(true)
            return
        }

        if (currentUser.role === "CONTENT_ADMIN") {
            alert("Content Admin không có quyền tạo bài viết.")
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

            await createBlog(blogData)
            setIsCreateDialogOpen(false)
            refetchBlogs()

            const successMessage =
                currentUser.role === "COACH"
                    ? "Bài viết đã được tạo thành công! Bài viết đang chờ phê duyệt."
                    : "Bài viết đã được tạo và xuất bản thành công!"

            alert(successMessage)
        } catch (error: any) {
            alert(`Lỗi khi tạo bài viết: ${error.message || "Có lỗi xảy ra"}`)
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

            await updateBlog(editingPost.blogId!, blogData)

            // Update selected post if it's the one being edited
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
            alert("Bài viết đã được cập nhật thành công!")
        } catch (error: any) {
            alert(`Lỗi khi cập nhật bài viết: ${error.message || "Có lỗi xảy ra"}`)
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
            await deleteBlog(deletingPost.blogId!)

            // If we're viewing the post that's being deleted, go back to the list
            if (selectedPost?.blogId === deletingPost.blogId) {
                setSelectedPost(null)
            }

            setDeletingPost(null)
            setIsDeleteConfirmOpen(false)
            refetchBlogs()
            alert("Bài viết đã được xóa thành công!")
        } catch (error: any) {
            alert(`Lỗi khi xóa bài viết: ${error.message || "Có lỗi xảy ra"}`)
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
            reportedBy: currentUser.blogId,
            ...reportData,
        })

        setReportingPost(null)
        setIsReportDialogOpen(false)
        alert("Báo cáo đã được gửi thành công! Đội ngũ quản trị sẽ xem xét báo cáo của bạn.")
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

            await commentService.addComment(commentData)
            refetchComments()
        } catch (error: any) {
            alert(`Lỗi khi thêm bình luận: ${error.message || "Có lỗi xảy ra"}`)
        }
    }


    // Permission checks
    const canEditPost = (post: BackendBlogPost) => {
        if (!currentUser) return false
        return (
            currentUser.blogId === post.authorId || // Author can edit their own posts
            currentUser.role === "CONTENT_ADMIN" // Admin can edit any post
        )
    }

    const canDeletePost = (post: BackendBlogPost) => {
        if (!currentUser) return false
        return (
            currentUser.blogId === post.authorId || // Author can delete their own posts
            currentUser.role === "CONTENT_ADMIN" // Admin can delete any post
        )
    }

    const canReportPost = (post: BackendBlogPost) => {
        if (!currentUser) return false
        return currentUser.blogId !== post.authorId // Users can't report their own posts
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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <BlogHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <main className="container mx-auto px-6 pb-20">
                <AnimatedSection animation="fadeUp" delay={300}>
                    <UserAuthSection currentUser={currentUser} handleCreateBlogClick={handleCreateBlogClick} />

                    {blogsLoading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
                            <p className="mt-4 text-slate-600 dark:text-slate-300">Đang tải bài viết...</p>
                        </div>
                    ) : selectedPost ? (
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
                </AnimatedSection>
            </main>

            {/* Dialogs */}
            <LoginPromptDialog
                isOpen={isLoginPromptOpen}
                onClose={() => setIsLoginPromptOpen(false)}
            />

            <BlogFormDialog
                isOpen={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
                onSubmit={handleCreateBlog}
                currentUserRole={UserRole?.role}
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
