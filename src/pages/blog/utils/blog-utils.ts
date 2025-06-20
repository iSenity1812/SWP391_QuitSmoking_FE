import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
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
            return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
        case "PENDING":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
        case "REJECTED":
            return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
}

export const getStatusText = (status: string) => {
    switch (status) {
        case "PUBLISHED":
            return "Đã xuất bản"
        case "PENDING":
            return "Chờ duyệt"
        case "REJECTED":
            return "Bị từ chối"
        default:
            return status
    }
}

export const getRoleColor = (role: string) => {
    switch (role) {
        case "SUPER_ADMIN":
            return "bg-red-600 text-white"
        case "CONTENT_ADMIN":
            return "bg-orange-600 text-white"
        case "COACH":
            return "bg-blue-600 text-white"
        case "PREMIUM_MEMBER":
            return "bg-purple-600 text-white"
        case "NORMAL_MEMBER":
            return "bg-gray-600 text-white"
        default:
            return "bg-gray-400 text-white"
    }
}

export const getRoleText = (role: string) => {
    switch (role) {
        case "SUPER_ADMIN":
            return "Super Admin"
        case "CONTENT_ADMIN":
            return "Admin"
        case "COACH":
            return "Coach"
        case "PREMIUM_MEMBER":
            return "Premium"
        case "NORMAL_MEMBER":
            return "Thành viên"
        default:
            return role
    }
}

export const canEditBlog = (blog: any, currentUser: any) => {
    if (!currentUser) return false

    // Author can edit their own blog
    if (blog.author.userId === currentUser.userId) return true

    // Content admin can edit any blog
    if (currentUser.role === "CONTENT_ADMIN") return true

    return false
}

export const canDeleteBlog = (blog: any, currentUser: any) => {
    return canEditBlog(blog, currentUser)
}

export const canApproveBlog = (currentUser: any) => {
    return currentUser?.role === "CONTENT_ADMIN"
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
