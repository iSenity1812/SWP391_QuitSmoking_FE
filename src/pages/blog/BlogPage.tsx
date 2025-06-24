"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { AnimatedSection } from "@/components/ui/AnimatedSection"
import { useBlogPosts, useBlogActions, useMyBlogs } from "@/hooks/use-blogs"
import { commentService } from "@/services/commentService"
import type { BlogRequestDTO, BlogPost as BackendBlogPost, BlogUser } from "@/types/blog"
import type { CommentRequestDTO, CommentResponseDTO, CommentApiResponse } from "@/types/comment"
import type { AccountResponse } from "@/types/auth"

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
}

interface ReportFormData {
    reason: string
    reportType: string
    reportedContentType: string
}
export type Role = 'NORMAL_MEMBER' | 'PREMIUM_MEMBER' | 'SUPER_ADMIN' | 'CONTENT_ADMIN' | 'COACH';

type ViewMode = "list" | "detail" | "myPosts"

const BlogPage: React.FC = () => {
    // State
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedPost, setSelectedPost] = useState<BackendBlogPost | null>(null)
    const [selectedPostComments, setSelectedPostComments] = useState<CommentResponseDTO[]>([])
    const [viewMode, setViewMode] = useState<ViewMode>("list")

    // User state (null for guest) - In real app, get from AuthContext
    const [currentUser, setCurrentUser] = useState<BlogUser | null>(null)

    // Set mock user on component mount
    useEffect(() => {
        const userInfoString = localStorage.getItem("user_info");
        if (userInfoString) {
            try {
                const accountData = JSON.parse(userInfoString);
                const user: BlogUser = {
                    id: accountData.userId, // Đảm bảo khớp với JSON trong localStorage
                    username: accountData.username,
                    role: accountData.role,

                };
                setCurrentUser(user);
                console.log("DEBUG: currentUser loaded from localStorage. ID:", user.id);
            } catch (e) {
                console.error("Error parsing user info from localStorage", e);
                setCurrentUser(null);
            }
        } else {
            console.log("DEBUG: No user info found in localStorage.");
            setCurrentUser(null);
        }
    }, []);

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
    console.log("Rendering component. currentUser.id passed to useMyBlogs:", currentUser?.id || "");
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
    const myPosts = myPostsData?.content || [];

    // Filter posts based on search term (additional client-side filtering if needed)
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

        if (currentUser.role === "CONTENT_ADMIN") {
            alert("Content Admin không quyền tạo bài viết.")
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
            refetchMyPosts() // Also refresh my posts

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
                    lastUpdated: new Date().toISOString(),
                })
            }

            setEditingPost(null)
            setIsEditDialogOpen(false)
            refetchBlogs()
            refetchMyPosts() // Also refresh my posts
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
            reportedBy: currentUser.id,
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

            console.log("Adding comment:", commentData)
            const response: CommentApiResponse<CommentResponseDTO> = await commentService.addComment(commentData)
            console.log("Comment API response:", response)

            if (response.success && response.data) {
                const newComment = response.data
                console.log("New comment:", newComment)

                // Refresh the blog data to get updated comments
                refetchBlogs()

                // For immediate UI update, add the new comment to current state
                if (selectedPost?.blogId === blogId) {
                    const updatedComments: CommentResponseDTO[] = [...selectedPostComments, newComment]
                    setSelectedPostComments(updatedComments)

                    // Also update the selected post's comment count
                    setSelectedPost({
                        ...selectedPost,
                        commentCount: (selectedPost.commentCount || 0) + 1,
                        comments: updatedComments,
                    })
                }

                alert("Bình luận đã được thêm thành công!")
            } else {
                throw new Error(response.message || "Failed to add comment")
            }
        } catch (error: any) {
            console.error("Error adding comment:", error)
            alert(`Lỗi khi thêm bình luận: ${error.message || "Có lỗi xảy ra"}`)
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
            <BlogHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <main className="container mx-auto px-6 pb-20">
                <AnimatedSection animation="fadeUp" delay={300}>
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
                </AnimatedSection>
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
