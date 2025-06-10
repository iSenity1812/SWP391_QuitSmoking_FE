"use client"

import type React from "react"
import { useState } from "react"
import {
    Search,
    Calendar,
    MessageCircle,
    Send,
    Reply,
    Clock,
    ArrowRight,
    Plus,
    User,
    Crown,
    GraduationCap,
    LogIn,
    Edit,
    Trash2,
    Flag,
    MoreVertical,
    Shield,
    AlertTriangle,
    CheckCircle,
    X,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AnimatedSection } from "@/components/ui/AnimatedSection"
import { motion } from "framer-motion"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Interface chỉ sử dụng các trường từ bảng Blog
interface BlogPost {
    BlogID: number
    AuthorID: string
    AuthorRole: UserRole
    Title: string
    Content: string
    CreatedAt: string
    LastUpdated?: string
    Status: "Pending Approval" | "Published" | "Rejected"
    ApprovedBy?: string
    ApprovedAt?: string
}

// Interface chỉ sử dụng các trường từ bảng Comment
interface Comment {
    CommentID: number
    BlogID: number
    UserID: string
    ParentCommentID?: number
    Content: string
    CommentDate: string
}

// Interface cho bảng Report
interface Report {
    ReportID: number
    ReporterID: string
    ReportType: "User Report" | "Content Report" | "Bug Report"
    ReportedID?: string // có thể null nếu báo cáo về content/lỗi
    ReportedContentType?: "Blog" | "Program" | "Bug" | "Other"
    ReportedContentID?: number // ID của đối tượng bị báo cáo (BlogID...), có thể null
    Reason: string
    Status: "Pending" | "Reviewed" | "Resolved" | "Rejected"
    GeneratedDate: string
    reviewedByID?: string
    AdminNotes?: string
}

type UserRole = "Normal member" | "Premium member" | "Coach" | "Content Admin"

interface BlogUser {
    id: string
    name: string
    role: UserRole
}

interface BlogFormData {
    title: string
    content: string
}

interface ReportFormData {
    reason: string
    reportType: "Content Report"
    reportedContentType: "Blog"
}

const BlogPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
    const [commentText, setCommentText] = useState("")
    const [replyingTo, setReplyingTo] = useState<number | null>(null)
    const [replyText, setReplyText] = useState("")

    // Set to null to simulate guest user - change this to a user object to simulate logged in user
    const [currentUser, setCurrentUser] = useState<BlogUser | null>(null)
    // Uncomment one of the lines below to simulate different user types
    // const [currentUser, setCurrentUser] = useState<BlogUser | null>({
    //   id: "user-current",
    //   name: "Nguyễn Văn A",
    //   role: "Premium member",
    // })
    // const [currentUser, setCurrentUser] = useState<BlogUser | null>({
    //   id: "user-coach",
    //   name: "Coach Minh",
    //   role: "Coach",
    // })
    // const [currentUser, setCurrentUser] = useState<BlogUser | null>({
    //   id: "admin-content",
    //   name: "Admin Content",
    //   role: "Content Admin",
    // })

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
    const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false)
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
    const [reportingPost, setReportingPost] = useState<BlogPost | null>(null)
    const [deletingPost, setDeletingPost] = useState<BlogPost | null>(null)

    const [blogForm, setBlogForm] = useState<BlogFormData>({
        title: "",
        content: "",
    })

    const [reportForm, setReportForm] = useState<ReportFormData>({
        reason: "",
        reportType: "Content Report",
        reportedContentType: "Blog",
    })

    // Dữ liệu mẫu chỉ sử dụng các trường từ database schema
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
        {
            BlogID: 1,
            AuthorID: "user-123",
            AuthorRole: "Coach",
            Title: "10 Chiến lược đã được chứng minh để vượt qua cơn thèm thuốc lá",
            Content:
                "Khám phá những kỹ thuật hiệu quả đã giúp hàng nghìn người thành công trong việc quản lý và vượt qua cơn thèm thuốc lá trong hành trình cai thuốc. Cai thuốc lá là một hành trình đầy thách thức nhưng cũng vô cùng xứng đáng...",
            CreatedAt: "2024-01-15T10:30:00",
            LastUpdated: "2024-01-16T14:20:00",
            Status: "Published",
            ApprovedBy: "admin-456",
            ApprovedAt: "2024-01-15T12:45:00",
        },
        {
            BlogID: 2,
            AuthorID: "user-456",
            AuthorRole: "Premium member",
            Title: "Hành trình của tôi: Từ 2 gói thuốc mỗi ngày đến không hút thuốc",
            Content:
                "Câu chuyện cá nhân về việc vượt qua thói quen hút thuốc 15 năm và những thách thức gặp phải trên đường đi. Tôi đã hút thuốc trong 15 năm, từ khi còn là sinh viên đại học...",
            CreatedAt: "2024-01-12T08:15:00",
            Status: "Published",
            ApprovedBy: "admin-789",
            ApprovedAt: "2024-01-12T10:30:00",
        },
        {
            BlogID: 3,
            AuthorID: "user-789",
            AuthorRole: "Coach",
            Title: "Khoa học đằng sau nghiện nicotine",
            Content:
                "Hiểu cách nicotine ảnh hưởng đến não bộ và tại sao việc cai thuốc có thể khó khăn từ góc độ khoa học. Nicotine là một chất gây nghiện mạnh...",
            CreatedAt: "2024-01-10T15:45:00",
            LastUpdated: "2024-01-11T09:20:00",
            Status: "Pending Approval",
        },
        {
            BlogID: 4,
            AuthorID: "user-current", // This will be the current user's post for testing
            AuthorRole: "Premium member",
            Title: "Xây dựng thói quen lành mạnh để thay thế việc hút thuốc",
            Content:
                "Học cách tạo ra những thói quen tích cực sẽ giúp bạn duy trì cuộc sống không thuốc lá và cải thiện sức khỏe tổng thể...",
            CreatedAt: "2024-01-08T11:20:00",
            Status: "Published",
            ApprovedBy: "admin-456",
            ApprovedAt: "2024-01-08T14:15:00",
        },
        {
            BlogID: 5,
            AuthorID: "user-654",
            AuthorRole: "Premium member",
            Title: "Động lực hàng ngày: Tại sao bản thân tương lai sẽ cảm ơn bạn",
            Content: "Những suy nghĩ truyền cảm hứng và lời nhắc nhở để giữ động lực trên hành trình không thuốc lá...",
            CreatedAt: "2024-01-05T09:30:00",
            Status: "Published",
            ApprovedBy: "admin-789",
            ApprovedAt: "2024-01-05T11:45:00",
        },
    ])

    // Dữ liệu mẫu chỉ sử dụng các trường từ bảng Comment
    const comments: Comment[] = [
        {
            CommentID: 1,
            BlogID: 1,
            UserID: "user-111",
            Content: "Bài viết rất hữu ích! Tôi đã áp dụng chiến lược số 3 và thấy hiệu quả ngay.",
            CommentDate: "2024-01-16T08:45:00",
        },
        {
            CommentID: 2,
            BlogID: 1,
            UserID: "user-222",
            ParentCommentID: 1,
            Content: "Tôi cũng thấy chiến lược đó hiệu quả. Bạn đã thử chiến lược số 5 chưa?",
            CommentDate: "2024-01-16T09:30:00",
        },
        {
            CommentID: 3,
            BlogID: 1,
            UserID: "user-333",
            Content: "Cảm ơn tác giả đã chia sẻ những kinh nghiệm quý báu!",
            CommentDate: "2024-01-17T10:15:00",
        },
        {
            CommentID: 4,
            BlogID: 2,
            UserID: "user-444",
            Content: "Câu chuyện rất cảm động và truyền cảm hứng!",
            CommentDate: "2024-01-13T14:20:00",
        },
    ]

    const filteredPosts = blogPosts.filter((post) => {
        const isPublished = post.Status === "Published"
        const matchesSearch =
            post.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.Content.toLowerCase().includes(searchTerm.toLowerCase())
        return isPublished && matchesSearch
    })

    const handleViewPost = (post: BlogPost) => {
        setSelectedPost(post)
        // Don't scroll to top when viewing a post
    }

    const handleSubmitComment = () => {
        if (!currentUser) {
            setIsLoginPromptOpen(true)
            return
        }

        if (commentText.trim() && selectedPost) {
            // Xử lý gửi bình luận (trong thực tế sẽ gửi đến API)
            console.log(`Đã gửi bình luận cho bài viết ${selectedPost.BlogID}: ${commentText}`)
            setCommentText("")
        }
    }

    const handleReply = (commentId: number) => {
        if (!currentUser) {
            setIsLoginPromptOpen(true)
            return
        }
        setReplyingTo(commentId)
    }

    const handleSubmitReply = (commentId: number) => {
        if (!currentUser) {
            setIsLoginPromptOpen(true)
            return
        }

        if (replyText.trim() && selectedPost) {
            // Xử lý gửi phản hồi (trong thực tế sẽ gửi đến API)
            console.log(`Đã gửi phản hồi cho bình luận ${commentId}: ${replyText}`)
            setReplyText("")
            setReplyingTo(null)
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Published":
                return <Badge className="bg-green-100 text-green-700">Đã xuất bản</Badge>
            case "Pending Approval":
                return <Badge className="bg-yellow-100 text-yellow-700">Chờ phê duyệt</Badge>
            case "Rejected":
                return <Badge className="bg-red-100 text-red-700">Bị từ chối</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    // Lấy bình luận gốc (không có ParentCommentID)
    const getRootComments = (blogId: number) => {
        return comments.filter((comment) => comment.BlogID === blogId && !comment.ParentCommentID)
    }

    // Lấy phản hồi cho một bình luận
    const getReplies = (commentId: number) => {
        return comments.filter((comment) => comment.ParentCommentID === commentId)
    }

    const getRoleIcon = (role: UserRole) => {
        switch (role) {
            case "Coach":
                return <GraduationCap className="w-4 h-4 text-purple-600" />
            case "Premium member":
                return <Crown className="w-4 h-4 text-yellow-600" />
            case "Normal member":
                return <User className="w-4 h-4 text-blue-600" />
            case "Content Admin":
                return <Shield className="w-4 h-4 text-red-600" />
            default:
                return <User className="w-4 h-4 text-gray-600" />
        }
    }

    const getRoleBadge = (role: UserRole) => {
        switch (role) {
            case "Coach":
                return <Badge className="bg-purple-100 text-purple-700">Coach</Badge>
            case "Premium member":
                return <Badge className="bg-yellow-100 text-yellow-700">Premium</Badge>
            case "Normal member":
                return <Badge className="bg-blue-100 text-blue-700">Member</Badge>
            case "Content Admin":
                return <Badge className="bg-red-100 text-red-700">Admin</Badge>
            default:
                return <Badge variant="secondary">{role}</Badge>
        }
    }

    const getPublishingStatus = (role: UserRole) => {
        // Coach blogs need approval, member blogs are published immediately
        return role === "Coach" ? "Pending Approval" : "Published"
    }

    const getPublishingMessage = (role: UserRole) => {
        if (role === "Coach") {
            return "Bài viết của Coach sẽ được gửi để chờ phê duyệt trước khi xuất bản."
        } else {
            return "Bài viết sẽ được xuất bản ngay lập tức."
        }
    }

    // Check permissions
    const canEditPost = (post: BlogPost) => {
        if (!currentUser) return false
        // Only author can edit their own posts
        return currentUser.id === post.AuthorID
    }

    const canDeletePost = (post: BlogPost) => {
        if (!currentUser) return false
        // Author can delete their own posts, Content Admin can delete any post
        return currentUser.id === post.AuthorID || currentUser.role === "Content Admin"
    }

    const canReportPost = (post: BlogPost) => {
        if (!currentUser) return false
        // Members and Coaches can report posts (but not their own posts)
        return currentUser.id !== post.AuthorID && ["Normal member", "Premium member", "Coach"].includes(currentUser.role)
    }

    const handleCreateBlogClick = () => {
        if (!currentUser) {
            setIsLoginPromptOpen(true)
            return
        }

        // Content Admin cannot create blogs
        if (currentUser.role === "Content Admin") {
            alert("Content Admin không có quyền tạo bài viết.")
            return
        }

        setIsCreateDialogOpen(true)
    }

    const handleCreateBlog = () => {
        if (!currentUser) {
            setIsLoginPromptOpen(true)
            return
        }

        // Content Admin cannot create blogs
        if (currentUser.role === "Content Admin") {
            alert("Content Admin không có quyền tạo bài viết.")
            return
        }

        if (blogForm.title.trim() && blogForm.content.trim()) {
            const newBlog: BlogPost = {
                BlogID: Date.now(),
                AuthorID: currentUser.id,
                AuthorRole: currentUser.role,
                Title: blogForm.title,
                Content: blogForm.content,
                CreatedAt: new Date().toISOString(),
                Status: getPublishingStatus(currentUser.role),
            }

            setBlogPosts((prev) => [newBlog, ...prev])

            // Reset form and close dialog
            setBlogForm({ title: "", content: "" })
            setIsCreateDialogOpen(false)

            // Show success message
            const successMessage =
                currentUser.role === "Coach"
                    ? "Bài viết đã được tạo thành công! Bài viết đang chờ phê duyệt."
                    : "Bài viết đã được tạo và xuất bản thành công!"

            alert(successMessage)
        }
    }

    const handleEditPost = (post: BlogPost) => {
        if (!canEditPost(post)) return

        setEditingPost(post)
        setBlogForm({
            title: post.Title,
            content: post.Content,
        })
        setIsEditDialogOpen(true)
    }

    const handleUpdateBlog = () => {
        if (!editingPost || !currentUser) return

        if (blogForm.title.trim() && blogForm.content.trim()) {
            setBlogPosts((prev) =>
                prev.map((post) =>
                    post.BlogID === editingPost.BlogID
                        ? {
                            ...post,
                            Title: blogForm.title,
                            Content: blogForm.content,
                            LastUpdated: new Date().toISOString(),
                        }
                        : post,
                ),
            )

            // Update selected post if it's the one being edited
            if (selectedPost?.BlogID === editingPost.BlogID) {
                setSelectedPost({
                    ...editingPost,
                    Title: blogForm.title,
                    Content: blogForm.content,
                    LastUpdated: new Date().toISOString(),
                })
            }

            // Reset form and close dialog
            setBlogForm({ title: "", content: "" })
            setEditingPost(null)
            setIsEditDialogOpen(false)

            alert("Bài viết đã được cập nhật thành công!")
        }
    }

    const handleDeletePost = (post: BlogPost) => {
        if (!canDeletePost(post)) return

        setDeletingPost(post)
        setIsDeleteConfirmOpen(true)
    }

    const confirmDeletePost = () => {
        if (!deletingPost) return

        setBlogPosts((prev) => prev.filter((post) => post.BlogID !== deletingPost.BlogID))

        // If we're viewing the deleted post, go back to list
        if (selectedPost?.BlogID === deletingPost.BlogID) {
            setSelectedPost(null)
        }

        setDeletingPost(null)
        setIsDeleteConfirmOpen(false)

        alert("Bài viết đã được xóa thành công!")
    }

    const handleReportPost = (post: BlogPost) => {
        if (!canReportPost(post)) return

        setReportingPost(post)
        setReportForm({
            reason: "",
            reportType: "Content Report",
            reportedContentType: "Blog",
        })
        setIsReportDialogOpen(true)
    }

    const handleSubmitReport = () => {
        if (!reportingPost || !currentUser || !reportForm.reason.trim()) return

        const newReport: Report = {
            ReportID: Date.now(),
            ReporterID: currentUser.id,
            ReportType: reportForm.reportType,
            ReportedContentType: reportForm.reportedContentType,
            ReportedContentID: reportingPost.BlogID,
            Reason: reportForm.reason,
            Status: "Pending",
            GeneratedDate: new Date().toISOString(),
        }

        // In a real app, this would be sent to the backend
        console.log("Created new report:", newReport)

        // Reset form and close dialog
        setReportForm({
            reason: "",
            reportType: "Content Report",
            reportedContentType: "Blog",
        })
        setReportingPost(null)
        setIsReportDialogOpen(false)

        alert("Báo cáo đã được gửi thành công! Chúng tôi sẽ xem xét trong thời gian sớm nhất.")
    }

    const handleFormChange = (field: keyof BlogFormData, value: string) => {
        setBlogForm((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleReportFormChange = (field: keyof ReportFormData, value: string) => {
        setReportForm((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    // Simulate login for demo purposes
    const handleDemoLogin = (role: UserRole = "Premium member") => {
        const userNames = {
            "Premium member": "Nguyễn Văn A",
            "Normal member": "Trần Thị B",
            Coach: "Coach Minh",
            "Content Admin": "Admin Content",
        }

        setCurrentUser({
            id: role === "Content Admin" ? "admin-content" : "user-current",
            name: userNames[role],
            role: role,
        })
        setIsLoginPromptOpen(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            {/* Hero Section */}
            <section className="py-20 mt-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-emerald-300/20 dark:from-emerald-500/10 dark:to-emerald-600/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-100/40 to-emerald-200/30 dark:from-emerald-600/10 dark:to-emerald-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

                <AnimatedSection animation="fadeUp" delay={200}>
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="text-center mb-12">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="inline-block px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-200/50 dark:shadow-emerald-500/25 mb-6"
                            >
                                ✨ Blog cộng đồng cai thuốc lá
                            </motion.div>
                            <h1 className="text-4xl lg:text-6xl font-black mb-6 text-slate-800 dark:text-white">
                                Quit Smoking
                                <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                                    {" "}
                                    Blog
                                </span>
                            </h1>
                            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
                                Chia sẻ kinh nghiệm, câu chuyện và hỗ trợ lẫn nhau trong hành trình cai thuốc lá
                            </p>
                        </div>

                        {/* Search Section */}
                        <div className="max-w-2xl mx-auto mb-12">
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
                </AnimatedSection>
            </section>

            <div className="container mx-auto px-6 pb-20">
                {/* Create Blog Section - Always visible for everyone */}
                <div className="mb-8 flex justify-between items-center p-4 bg-white/90 dark:bg-slate-800/90 rounded-xl border-2 border-emerald-200 dark:border-emerald-500/30 shadow-md">
                    <div className="flex items-center gap-3">
                        {currentUser ? (
                            <>
                                <Avatar className="w-10 h-10">
                                    <AvatarFallback>
                                        {currentUser.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-white">{currentUser.name}</p>
                                    <div className="flex items-center gap-1">
                                        {getRoleIcon(currentUser.role)}
                                        <span className="text-sm text-slate-500 dark:text-slate-400">{currentUser.role}</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Avatar className="w-10 h-10">
                                    <AvatarFallback>
                                        <User className="w-5 h-5" />
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-white">Khách</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Chưa đăng nhập</p>
                                </div>
                            </>
                        )}
                    </div>

                    <Button
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600"
                        onClick={handleCreateBlogClick}
                    >
                        <Plus className="w-4 h-4" />
                        Tạo bài viết mới
                    </Button>
                </div>

                {/* Login Prompt Dialog */}
                <Dialog open={isLoginPromptOpen} onOpenChange={setIsLoginPromptOpen}>
                    <DialogContent className="sm:max-w-[400px]">
                        <DialogHeader>
                            <div className="flex justify-between items-start">
                                <DialogTitle className="flex items-center gap-2">
                                    <LogIn className="w-5 h-5" />
                                    Đăng nhập để tiếp tục
                                </DialogTitle>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full h-6 w-6 p-0"
                                    onClick={() => setIsLoginPromptOpen(false)}
                                >
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Đóng</span>
                                </Button>
                            </div>
                        </DialogHeader>
                        <div className="py-4">
                            <p className="text-slate-600 dark:text-slate-300 mb-6">
                                Bạn cần đăng nhập để có thể tạo bài viết và tương tác với cộng đồng.
                            </p>
                            <div className="flex flex-col gap-3">
                                <Link to="/login">
                                    <Button className="w-full bg-emerald-500 hover:bg-emerald-600">Đăng nhập</Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="outline" className="w-full">
                                        Đăng ký tài khoản mới
                                    </Button>
                                </Link>
                                <div className="text-center">
                                    <span className="text-sm text-slate-500 dark:text-slate-400">hoặc đăng nhập demo:</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant="ghost"
                                        className="text-blue-600 hover:text-blue-700"
                                        onClick={() => handleDemoLogin("Premium member")}
                                    >
                                        Premium Member
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="text-purple-600 hover:text-purple-700"
                                        onClick={() => handleDemoLogin("Coach")}
                                    >
                                        Coach
                                    </Button>
                                </div>
                                <Button
                                    variant="ghost"
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => handleDemoLogin("Content Admin")}
                                >
                                    Content Admin (để test)
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Create Blog Dialog */}
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Tạo bài viết mới</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="blog-title">Tiêu đề bài viết</Label>
                                <Input
                                    id="blog-title"
                                    value={blogForm.title}
                                    onChange={(e) => handleFormChange("title", e.target.value)}
                                    placeholder="Nhập tiêu đề bài viết..."
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="blog-content">Nội dung</Label>
                                <Textarea
                                    id="blog-content"
                                    value={blogForm.content}
                                    onChange={(e) => handleFormChange("content", e.target.value)}
                                    placeholder="Viết nội dung bài viết của bạn..."
                                    className="min-h-[200px]"
                                />
                            </div>
                            {currentUser && currentUser.role === "Coach" && (
                                <div className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                                    <strong>Lưu ý:</strong> {getPublishingMessage(currentUser.role)}
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end gap-4">
                            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                Hủy
                            </Button>
                            <Button onClick={handleCreateBlog} disabled={!blogForm.title.trim() || !blogForm.content.trim()}>
                                Tạo bài viết
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Edit Blog Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-blog-title">Tiêu đề bài viết</Label>
                                <Input
                                    id="edit-blog-title"
                                    value={blogForm.title}
                                    onChange={(e) => handleFormChange("title", e.target.value)}
                                    placeholder="Nhập tiêu đề bài viết..."
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-blog-content">Nội dung</Label>
                                <Textarea
                                    id="edit-blog-content"
                                    value={blogForm.content}
                                    onChange={(e) => handleFormChange("content", e.target.value)}
                                    placeholder="Viết nội dung bài viết của bạn..."
                                    className="min-h-[200px]"
                                />
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                                <strong>Lưu ý:</strong> Chỉ tác giả mới có thể chỉnh sửa bài viết của mình.
                            </div>
                        </div>
                        <div className="flex justify-end gap-4">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsEditDialogOpen(false)
                                    setEditingPost(null)
                                    setBlogForm({ title: "", content: "" })
                                }}
                            >
                                Hủy
                            </Button>
                            <Button onClick={handleUpdateBlog} disabled={!blogForm.title.trim() || !blogForm.content.trim()}>
                                Cập nhật bài viết
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Report Dialog */}
                <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Flag className="w-5 h-5 text-red-500" />
                                Báo cáo bài viết
                            </DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            <div className="mb-4">
                                <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                                    Bài viết: <strong>{reportingPost?.Title}</strong>
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Tác giả: {reportingPost?.AuthorID}</p>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="report-reason">Lý do báo cáo</Label>
                                <Textarea
                                    id="report-reason"
                                    value={reportForm.reason}
                                    onChange={(e) => handleReportFormChange("reason", e.target.value)}
                                    placeholder="Vui lòng mô tả lý do báo cáo bài viết này..."
                                    className="min-h-[100px]"
                                />
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                Báo cáo sẽ được gửi đến đội ngũ quản trị để xem xét.
                            </div>
                        </div>
                        <div className="flex justify-end gap-4">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsReportDialogOpen(false)
                                    setReportingPost(null)
                                    setReportForm({
                                        reason: "",
                                        reportType: "Content Report",
                                        reportedContentType: "Blog",
                                    })
                                }}
                            >
                                Hủy
                            </Button>
                            <Button
                                onClick={handleSubmitReport}
                                disabled={!reportForm.reason.trim()}
                                className="bg-red-500 hover:bg-red-600"
                            >
                                Gửi báo cáo
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                    <DialogContent className="sm:max-w-[400px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                Xác nhận xóa bài viết
                            </DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            <p className="text-slate-600 dark:text-slate-300 mb-4">Bạn có chắc chắn muốn xóa bài viết này không?</p>
                            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                                <p className="font-semibold text-slate-800 dark:text-white">{deletingPost?.Title}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Hành động này không thể hoàn tác.</p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-4">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsDeleteConfirmOpen(false)
                                    setDeletingPost(null)
                                }}
                            >
                                Hủy
                            </Button>
                            <Button onClick={confirmDeletePost} className="bg-red-500 hover:bg-red-600">
                                Xóa bài viết
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {selectedPost ? (
                    // Chi tiết bài viết
                    <AnimatedSection animation="fadeUp" delay={200}>
                        <Button
                            variant="outline"
                            className="mb-6"
                            onClick={() => {
                                setSelectedPost(null)
                                // Scroll to top when going back to blog list
                                window.scrollTo(0, 0)
                            }}
                        >
                            ← Quay lại danh sách bài viết
                        </Button>
                        <Card className="border-2 border-emerald-100 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                            <CardHeader>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        {getStatusBadge(selectedPost.Status)}
                                        {getRoleBadge(selectedPost.AuthorRole)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {getRoleIcon(selectedPost.AuthorRole)}
                                        <span className="text-sm text-slate-500 dark:text-slate-400">Tác giả: {selectedPost.AuthorID}</span>

                                        {/* Action Menu */}
                                        {currentUser &&
                                            (canEditPost(selectedPost) || canDeletePost(selectedPost) || canReportPost(selectedPost)) && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        {canEditPost(selectedPost) && (
                                                            <DropdownMenuItem onClick={() => handleEditPost(selectedPost)}>
                                                                <Edit className="w-4 h-4 mr-2" />
                                                                Chỉnh sửa
                                                            </DropdownMenuItem>
                                                        )}
                                                        {canDeletePost(selectedPost) && (
                                                            <DropdownMenuItem
                                                                onClick={() => handleDeletePost(selectedPost)}
                                                                className="text-red-600 focus:text-red-600"
                                                            >
                                                                <Trash2 className="w-4 h-4 mr-2" />
                                                                Xóa
                                                            </DropdownMenuItem>
                                                        )}
                                                        {canReportPost(selectedPost) && (
                                                            <>
                                                                {(canEditPost(selectedPost) || canDeletePost(selectedPost)) && (
                                                                    <DropdownMenuSeparator />
                                                                )}
                                                                <DropdownMenuItem
                                                                    onClick={() => handleReportPost(selectedPost)}
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
                                <CardTitle className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
                                    {selectedPost.Title}
                                </CardTitle>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mt-4">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        Đăng: {formatDate(selectedPost.CreatedAt)}
                                    </span>
                                    {selectedPost.LastUpdated && (
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            Cập nhật: {formatDate(selectedPost.LastUpdated)}
                                        </span>
                                    )}
                                    {selectedPost.ApprovedBy && selectedPost.ApprovedAt && (
                                        <span className="flex items-center gap-1">
                                            <CheckCircle className="w-4 h-4" />
                                            Phê duyệt: {formatDate(selectedPost.ApprovedAt)} bởi {selectedPost.ApprovedBy}
                                        </span>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="prose dark:prose-invert max-w-none">
                                    <div className="text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                                        {selectedPost.Content}
                                    </div>
                                </div>
                            </CardContent>

                            {/* Phần bình luận */}
                            <CardFooter className="flex flex-col items-start border-t pt-6">
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                    <MessageCircle className="w-5 h-5" />
                                    Bình luận ({getRootComments(selectedPost.BlogID).length})
                                </h3>

                                {/* Form bình luận */}
                                <div className="w-full mb-6">
                                    <Textarea
                                        placeholder={currentUser ? "Viết bình luận của bạn..." : "Đăng nhập để viết bình luận..."}
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        className="mb-2"
                                        disabled={!currentUser}
                                    />
                                    <Button
                                        onClick={handleSubmitComment}
                                        disabled={!commentText.trim()}
                                        className="flex items-center gap-2"
                                    >
                                        <Send className="w-4 h-4" />
                                        {currentUser ? "Gửi bình luận" : "Đăng nhập để bình luận"}
                                    </Button>
                                </div>

                                {/* Danh sách bình luận */}
                                <div className="w-full space-y-4">
                                    {getRootComments(selectedPost.BlogID).map((comment) => (
                                        <div key={comment.CommentID} className="border rounded-lg p-4 bg-white/50 dark:bg-slate-800/50">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="w-8 h-8">
                                                        <AvatarFallback>{comment.UserID.slice(-2).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-800 dark:text-white">{comment.UserID}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            {formatDate(comment.CommentDate)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-slate-400">#{comment.CommentID}</span>
                                            </div>
                                            <p className="text-slate-700 dark:text-slate-200 mb-2">{comment.Content}</p>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-slate-500 dark:text-slate-400"
                                                onClick={() => handleReply(comment.CommentID)}
                                            >
                                                <Reply className="w-4 h-4 mr-1" />
                                                {currentUser ? "Phản hồi" : "Đăng nhập để phản hồi"}
                                            </Button>

                                            {/* Form phản hồi */}
                                            {replyingTo === comment.CommentID && currentUser && (
                                                <div className="mt-2 pl-8 border-l-2 border-slate-200 dark:border-slate-700">
                                                    <Textarea
                                                        placeholder="Viết phản hồi của bạn..."
                                                        value={replyText}
                                                        onChange={(e) => setReplyText(e.target.value)}
                                                        className="mb-2 text-sm"
                                                    />
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleSubmitReply(comment.CommentID)}
                                                            disabled={!replyText.trim()}
                                                        >
                                                            Gửi
                                                        </Button>
                                                        <Button variant="outline" size="sm" onClick={() => setReplyingTo(null)}>
                                                            Hủy
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Phản hồi cho bình luận */}
                                            {getReplies(comment.CommentID).length > 0 && (
                                                <div className="mt-3 pl-8 space-y-3 border-l-2 border-slate-200 dark:border-slate-700">
                                                    {getReplies(comment.CommentID).map((reply) => (
                                                        <div key={reply.CommentID} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <div className="flex items-center gap-2">
                                                                    <Avatar className="w-6 h-6">
                                                                        <AvatarFallback>{reply.UserID.slice(-2).toUpperCase()}</AvatarFallback>
                                                                    </Avatar>
                                                                    <div>
                                                                        <p className="text-xs font-semibold text-slate-800 dark:text-white">
                                                                            {reply.UserID}
                                                                        </p>
                                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                            {formatDate(reply.CommentDate)}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <span className="text-xs text-slate-400">#{reply.CommentID}</span>
                                                            </div>
                                                            <p className="text-sm text-slate-700 dark:text-slate-200">{reply.Content}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardFooter>
                        </Card>
                    </AnimatedSection>
                ) : (
                    // Danh sách bài viết
                    <AnimatedSection animation="fadeUp" delay={300}>
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                                <span className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></span>
                                Bài viết ({filteredPosts.length})
                            </h2>

                            {filteredPosts.length === 0 ? (
                                <Card className="text-center py-12">
                                    <CardContent>
                                        <p className="text-slate-500 dark:text-slate-400">Không tìm thấy bài viết nào.</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid gap-6">
                                    {filteredPosts.map((post, index) => (
                                        <motion.div
                                            key={post.BlogID}
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <Card className="group overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-500 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                                                <CardHeader>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            {getStatusBadge(post.Status)}
                                                            {getRoleBadge(post.AuthorRole)}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {getRoleIcon(post.AuthorRole)}
                                                            <span className="text-sm text-slate-500 dark:text-slate-400">{post.AuthorID}</span>

                                                            {/* Action Menu for List View */}
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
                                                    <CardTitle className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                        {post.Title}
                                                    </CardTitle>
                                                    <CardDescription className="text-slate-600 dark:text-slate-300 line-clamp-2">
                                                        {post.Content.substring(0, 150)}...
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-4">
                                                        <div className="flex items-center gap-4">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="w-4 h-4" />
                                                                {formatDate(post.CreatedAt)}
                                                            </span>
                                                            {post.LastUpdated && (
                                                                <span className="flex items-center gap-1">
                                                                    <Clock className="w-4 h-4" />
                                                                    Cập nhật: {formatDate(post.LastUpdated)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                                            <span className="flex items-center gap-1">
                                                                <MessageCircle className="w-4 h-4" />
                                                                {getRootComments(post.BlogID).length} bình luận
                                                            </span>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold"
                                                            onClick={() => handleViewPost(post)}
                                                        >
                                                            Đọc thêm
                                                            <ArrowRight className="w-4 h-4 ml-1" />
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </AnimatedSection>
                )}
            </div>
        </div>
    )
}

export default BlogPage
