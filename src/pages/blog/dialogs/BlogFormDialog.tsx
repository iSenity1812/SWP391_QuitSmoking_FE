"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import dynamic from "next/dynamic"

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })
import "react-quill/dist/quill.snow.css"

// Define the correct UserRole type to match the backend
type UserRole = "NORMAL_MEMBER" | "PREMIUM_MEMBER" | "COACH" | "CONTENT_ADMIN" | "SUPER_ADMIN"

interface BlogFormData {
    title: string
    content: string
}

interface BlogFormDialogProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (formData: BlogFormData) => void
    initialData?: BlogFormData
    isEdit?: boolean
    currentUserRole?: UserRole
    loading?: boolean
}

const getPublishingMessage = (role: UserRole): string => {
    switch (role) {
        case "COACH":
            return "Bài viết của Coach sẽ được gửi để phê duyệt trước khi xuất bản."
        case "CONTENT_ADMIN":
            return "Bài viết sẽ được xuất bản ngay lập tức."
        default:
            return "Bài viết sẽ được xuất bản ngay lập tức."
    }
}

// Quill editor configuration
const quillModules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        ["link", "image"],
        [{ color: [] }, { background: [] }],
        ["blockquote", "code-block"],
        ["clean"],
    ],
}

const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
    "image",
    "color",
    "background",
    "blockquote",
    "code-block",
]

const BlogFormDialog: React.FC<BlogFormDialogProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    isEdit = false,
    currentUserRole,
    loading = false,
}) => {
    const [formData, setFormData] = useState<BlogFormData>(
        initialData || {
            title: "",
            content: "",
        },
    )

    // Update form data when initialData changes
    useEffect(() => {
        if (initialData) {
            setFormData(initialData)
        } else {
            setFormData({
                title: "",
                content: "",
            })
        }
    }, [initialData, isOpen])

    const handleChange = (field: keyof BlogFormData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleContentChange = (content: string) => {
        setFormData((prev) => ({
            ...prev,
            content: content,
        }))
    }

    const handleSubmit = () => {
        if (formData.title.trim() && formData.content.trim()) {
            onSubmit(formData)
        }
    }

    const handleClose = () => {
        setFormData({
            title: "",
            content: "",
        })
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="blog-title">Tiêu đề bài viết</Label>
                        <Input
                            id="blog-title"
                            value={formData.title}
                            onChange={(e) => handleChange("title", e.target.value)}
                            placeholder="Nhập tiêu đề bài viết..."
                            className="text-lg"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="blog-content">Nội dung</Label>
                        <div className="border rounded-md">
                            <ReactQuill
                                theme="snow"
                                value={formData.content}
                                onChange={handleContentChange}
                                modules={quillModules}
                                formats={quillFormats}
                                placeholder="Viết nội dung bài viết của bạn..."
                                style={{
                                    height: "300px",
                                    marginBottom: "42px", // Space for toolbar
                                }}
                            />
                        </div>
                    </div>
                    {currentUserRole === "COACH" && !isEdit && (
                        <div className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                            <strong>Lưu ý:</strong> {getPublishingMessage("COACH")}
                        </div>
                    )}
                    {isEdit && (
                        <div className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                            <strong>Lưu ý:</strong> Chỉ tác giả mới có thể chỉnh sửa bài viết của mình.
                        </div>
                    )}
                </div>
                <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!formData.title.trim() || !formData.content.trim() || loading}
                        className="min-w-[120px]"
                    >
                        {loading ? "Đang xử lý..." : isEdit ? "Cập nhật bài viết" : "Tạo bài viết"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default BlogFormDialog
