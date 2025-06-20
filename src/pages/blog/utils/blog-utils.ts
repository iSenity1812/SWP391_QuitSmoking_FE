import { formatDistanceToNow } from "date-fns/formatDistanceToNow"
import { vi } from "date-fns/locale"

export const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
}

export const formatRelativeTime = (date: string | Date) => {
    const dateObj = typeof date === "string" ? new Date(date) : date
    return formatDistanceToNow(dateObj, { addSuffix: true, locale: vi })
}

export const truncateText = (text: string, maxLength = 150) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + "..."
}

export const getStatusColor = (status: string) => {
    switch (status) {
        case "PUBLISHED":
        case "Published":
            return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
        case "PENDING":
        case "Pending":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
        case "REJECTED":
        case "Rejected":
            return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
}

export const getStatusText = (status: string) => {
    switch (status) {
        case "PUBLISHED":
        case "Published":
            return "Đã xuất bản"
        case "PENDING":
        case "Pending":
            return "Chờ duyệt"
        case "REJECTED":
        case "Rejected":
            return "Bị từ chối"
        default:
            return status
    }
}

export const getRoleColor = (role: string) => {
    switch (role) {
        case "SUPER_ADMIN":
        case "Super Admin":
            return "bg-red-600 text-white"
        case "CONTENT_ADMIN":
        case "Content Admin":
            return "bg-orange-600 text-white"
        case "COACH":
        case "Coach":
            return "bg-blue-600 text-white"
        case "PREMIUM_MEMBER":
        case "Premium member":
            return "bg-purple-600 text-white"
        case "NORMAL_MEMBER":
        case "Normal member":
            return "bg-gray-600 text-white"
        default:
            return "bg-gray-400 text-white"
    }
}

export const getRoleText = (role: string) => {
    switch (role) {
        case "SUPER_ADMIN":
        case "Super Admin":
            return "Super Admin"
        case "CONTENT_ADMIN":
        case "Content Admin":
            return "Admin"
        case "COACH":
        case "Coach":
            return "Coach"
        case "PREMIUM_MEMBER":
        case "Premium member":
            return "Premium"
        case "NORMAL_MEMBER":
        case "Normal member":
            return "Thành viên"
        default:
            return role
    }
}

export const getPublishingStatus = (userRole: string) => {
    switch (userRole) {
        case "Coach":
            return "Pending" // Coach posts need approval
        case "Content Admin":
        case "Super Admin":
            return "Published" // Admin posts are auto-published
        default:
            return "Published" // Regular members auto-publish
    }
}

export const getPublishingMessage = (userRole: string) => {
    switch (userRole) {
        case "Coach":
            return "Bài viết của bạn đã được gửi và đang chờ phê duyệt từ Content Admin."
        case "Content Admin":
        case "Super Admin":
            return "Bài viết đã được xuất bản thành công!"
        default:
            return "Bài viết đã được xuất bản thành công!"
    }
}

export const canEditBlog = (blog: any, currentUser: any) => {
    if (!currentUser) return false

    // Author can edit their own blog
    if (blog.author?.userId === currentUser.userId || blog.authorId === currentUser.id) return true

    // Content admin can edit any blog
    if (currentUser.role === "CONTENT_ADMIN" || currentUser.role === "Content Admin") return true

    return false
}

export const canDeleteBlog = (blog: any, currentUser: any) => {
    return canEditBlog(blog, currentUser)
}

export const canApproveBlog = (currentUser: any) => {
    return currentUser?.role === "CONTENT_ADMIN" || currentUser?.role === "Content Admin"
}

export const extractTextFromHtml = (html: string) => {
    const div = document.createElement("div")
    div.innerHTML = html
    return div.textContent || div.innerText || ""
}

export const generateSlug = (title: string) => {
    return title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
        .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with single
        .trim()
}

// Helper function to get root comments from a list of comments
export const getRootComments = (comments: any[], blogId: number) => {
    return comments.filter(
        (comment) => comment.BlogID === blogId && (!comment.ParentCommentID || comment.ParentCommentID === null),
    )
}

// Helper function to get replies for a specific comment
export const getCommentReplies = (comments: any[], parentCommentId: number) => {
    return comments.filter((comment) => comment.ParentCommentID === parentCommentId)
}

// Helper function to build comment tree structure
export const buildCommentTree = (comments: any[]) => {
    const commentMap = new Map()
    const rootComments: any[] = []

    // First pass: create a map of all comments
    comments.forEach((comment) => {
        commentMap.set(comment.CommentID || comment.commentId, {
            ...comment,
            replies: [],
        })
    })

    // Second pass: build the tree structure
    comments.forEach((comment) => {
        const commentId = comment.CommentID || comment.commentId
        const parentId = comment.ParentCommentID || comment.parentCommentId

        if (parentId && commentMap.has(parentId)) {
            // This is a reply, add it to parent's replies
            commentMap.get(parentId).replies.push(commentMap.get(commentId))
        } else {
            // This is a root comment
            rootComments.push(commentMap.get(commentId))
        }
    })

    return rootComments
}
