"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

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

    const handleChange = (field: keyof BlogFormData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleSubmit = () => {
        if (formData.title.trim() && formData.content.trim()) {
            onSubmit(formData)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="blog-title">Tiêu đề bài viết</Label>
                        <Input
                            id="blog-title"
                            value={formData.title}
                            onChange={(e) => handleChange("title", e.target.value)}
                            placeholder="Nhập tiêu đề bài viết..."
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="blog-content">Nội dung</Label>
                        <Textarea
                            id="blog-content"
                            value={formData.content}
                            onChange={(e) => handleChange("content", e.target.value)}
                            placeholder="Viết nội dung bài viết của bạn..."
                            className="min-h-[200px]"
                        />
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
                    <Button variant="outline" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button onClick={handleSubmit} disabled={!formData.title.trim() || !formData.content.trim() || loading}>
                        {loading ? "Đang xử lý..." : isEdit ? "Cập nhật bài viết" : "Tạo bài viết"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default BlogFormDialog
