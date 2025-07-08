"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Upload, ImageIcon, Trash2 } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })
import "react-quill/dist/quill.snow.css"

// Define the correct UserRole type to match the backend
type UserRole = "NORMAL_MEMBER" | "PREMIUM_MEMBER" | "COACH" | "CONTENT_ADMIN" | "SUPER_ADMIN"

interface BlogFormData {
    title: string
    content: string
    imageUrl?: File | string // Giữ nguyên tên imageUrl
    removeImage?: boolean // Add removeImage flag
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
            imageUrl: undefined,
            removeImage: false,
        },
    )
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null)

    // Update form data when initialData changes
    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                removeImage: false, // Always start with removeImage = false
            })
            // Set image preview if editing with existing image
            if (typeof initialData.imageUrl === "string" && initialData.imageUrl) {
                setImagePreview(initialData.imageUrl)
                setOriginalImageUrl(initialData.imageUrl)
                console.log("Setting image preview from existing imageUrl:", initialData.imageUrl)
            }
        } else {
            setFormData({
                title: "",
                content: "",
                imageUrl: undefined,
                removeImage: false,
            })
            setImagePreview(null)
            setOriginalImageUrl(null)
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                alert("Vui lòng chọn file hình ảnh")
                return
            }

            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                alert("Kích thước file không được vượt quá 5MB")
                return
            }

            setFormData((prev) => ({
                ...prev,
                imageUrl: file,
                removeImage: false, // Reset removeImage when new file is selected
            }))

            // Create preview
            const reader = new FileReader()
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleRemoveImage = () => {
        console.log("=== handleRemoveImage called ===")
        console.log("Original image URL:", originalImageUrl)
        console.log("Current imageUrl:", formData.imageUrl)

        if (isEdit && originalImageUrl) {
            // If editing and there was an original image, set removeImage flag
            setFormData((prev) => ({
                ...prev,
                imageUrl: undefined,
                removeImage: true,
            }))
            console.log("Set removeImage = true for existing image")
        } else {
            // If creating new blog or no original image, just clear imageUrl
            setFormData((prev) => ({
                ...prev,
                imageUrl: undefined,
                removeImage: false,
            }))
            console.log("Just cleared imageUrl for new blog")
        }

        setImagePreview(null)

        // Reset file input
        const fileInput = document.getElementById("image-upload") as HTMLInputElement
        if (fileInput) {
            fileInput.value = ""
        }

        console.log("=== handleRemoveImage completed ===")
    }

    const handleSubmit = () => {
        if (formData.title.trim() && formData.content.trim()) {
            console.log("=== Submitting form data ===")
            console.log("Form data:", formData)
            console.log("removeImage flag:", formData.removeImage)
            console.log("imageUrl:", formData.imageUrl)
            console.log("imageUrl type:", typeof formData.imageUrl)
            console.log("=== About to call onSubmit ===")
            onSubmit(formData)
            console.log("=== onSubmit called ===")
        }
    }

    const handleClose = () => {
        setFormData({
            title: "",
            content: "",
            imageUrl: undefined,
            removeImage: false,
        })
        setImagePreview(null)
        setOriginalImageUrl(null)
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

                    {/* Image Upload Section */}
                    <div className="grid gap-2">
                        <Label htmlFor="image-upload">Hình ảnh</Label>
                        {imagePreview ? (
                            <div className="relative">
                                <img
                                    src={imagePreview || "/placeholder.svg"}
                                    alt="Preview"
                                    className="w-full h-48 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                                    onError={(e) => {
                                        console.error("Preview image failed to load:", imagePreview)
                                        const target = e.target as HTMLImageElement
                                        target.src = "/placeholder.svg?height=192&width=400"
                                    }}
                                    onLoad={() => console.log("Preview image loaded successfully:", imagePreview)}
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-2 right-2"
                                    onClick={handleRemoveImage}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>

                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center">
                                <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Chọn hình ảnh để tải lên</p>
                                <p className="text-xs text-slate-500 dark:text-slate-500 mb-4">PNG, JPG, GIF tối đa 5MB</p>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => document.getElementById("image-upload")?.click()}
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Chọn file
                                </Button>
                            </div>
                        )}
                        <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
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
