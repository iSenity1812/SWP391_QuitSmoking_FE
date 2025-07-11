"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProgramMutations } from "@/hooks/use-programs"
import type { ProgramResponseDTO } from "@/types/program"
import { ProgramType, ProgramTypeLabels } from "@/types/program"
import { toast } from "react-toastify"
import { Loader2, X, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EditProgramDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    program: ProgramResponseDTO
    onSuccess: () => void
}

interface ValidationErrors {
    programTitle?: string
    programName?: string
    programType?: string
    contentUrl?: string
    description?: string
    programImage?: string
}

export function EditProgramDialog({ open, onOpenChange, program, onSuccess }: EditProgramDialogProps) {
    const [formData, setFormData] = useState({
        programTitle: "",
        programName: "",
        programType: "" as ProgramType | "",
        description: "",
        contentUrl: "",
    })
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [removeImage, setRemoveImage] = useState(false)
    const [errors, setErrors] = useState<ValidationErrors>({})

    const { updateProgram, loading } = useProgramMutations()

    // Initialize form data when program changes
    useEffect(() => {
        if (program) {
            setFormData({
                programTitle: program.programTitle || "",
                programName: program.programName || "",
                programType: program.programType || "",
                description: program.description || "",
                contentUrl: program.contentUrl || "",
            })

            // Set current image preview
            if (program.programImage) {
                const imageUrl = program.programImage.startsWith("http")
                    ? program.programImage
                    : `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}${program.programImage.startsWith("/") ? "" : "/"}${program.programImage}`
                setImagePreview(imageUrl)
            } else {
                setImagePreview(null)
            }

            setImageFile(null)
            setRemoveImage(false)
            setErrors({})
        }
    }, [program])

    // Real-time validation
    const validateField = (field: keyof ValidationErrors, value: string | File | null): string | undefined => {
        switch (field) {
            case "programTitle":
                if (!value || typeof value !== "string") return "Tiêu đề chương trình là bắt buộc"
                if (value.trim().length < 3) return "Tiêu đề phải có ít nhất 3 ký tự"
                if (value.trim().length > 200) return "Tiêu đề không được vượt quá 200 ký tự"
                return undefined

            case "programName":
                if (value && typeof value === "string" && value.trim().length > 100) {
                    return "Tên chương trình không được vượt quá 100 ký tự"
                }
                return undefined

            case "description":
                if (value && typeof value === "string" && value.trim().length > 1000) {
                    return "Mô tả không được vượt quá 1000 ký tự"
                }
                return undefined

            case "contentUrl":
                if (value && typeof value === "string" && value.trim()) {
                    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
                    if (!urlPattern.test(value.trim())) {
                        return "URL không hợp lệ"
                    }
                }
                return undefined

            case "programImage":
                if (value && value instanceof File) {
                    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
                    const maxSize = 5 * 1024 * 1024 // 5MB

                    if (!allowedTypes.includes(value.type)) {
                        return "Chỉ chấp nhận file ảnh định dạng JPEG, PNG, GIF, WebP"
                    }
                    if (value.size > maxSize) {
                        return "Kích thước file không được vượt quá 5MB"
                    }
                }
                return undefined

            default:
                return undefined
        }
    }

    // Update error for specific field
    const updateFieldError = (field: keyof ValidationErrors, value: string | File | null) => {
        const error = validateField(field, value)
        setErrors((prev) => ({
            ...prev,
            [field]: error,
        }))
    }

    // Check if form is valid
    const isFormValid = () => {
        const titleError = validateField("programTitle", formData.programTitle)
        const nameError = validateField("programName", formData.programName)
        const descError = validateField("description", formData.description)
        const urlError = validateField("contentUrl", formData.contentUrl)
        const imageError = validateField("programImage", imageFile)

        return !titleError && !nameError && !descError && !urlError && !imageError && formData.programTitle.trim()
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))

        updateFieldError(field as keyof ValidationErrors, value)
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            updateFieldError("programImage", file)

            const error = validateField("programImage", file)
            if (error) {
                return
            }

            setImageFile(file)
            setRemoveImage(false)
            const reader = new FileReader()
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleRemoveImage = () => {
        setImageFile(null)
        setImagePreview(null)
        setRemoveImage(true)
        setErrors((prev) => ({ ...prev, programImage: undefined }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Final validation
        const titleError = validateField("programTitle", formData.programTitle)
        const nameError = validateField("programName", formData.programName)
        const descError = validateField("description", formData.description)
        const urlError = validateField("contentUrl", formData.contentUrl)
        const imageError = validateField("programImage", imageFile)

        const finalErrors: ValidationErrors = {}
        if (titleError) finalErrors.programTitle = titleError
        if (nameError) finalErrors.programName = nameError
        if (descError) finalErrors.description = descError
        if (urlError) finalErrors.contentUrl = urlError
        if (imageError) finalErrors.programImage = imageError

        setErrors(finalErrors)

        if (Object.keys(finalErrors).length > 0) {
            toast.error("Vui lòng kiểm tra lại thông tin đã nhập")
            return
        }

        try {
            const requestData = {
                programTitle: formData.programTitle.trim(),
                programName: formData.programName.trim() || undefined,
                programType: formData.programType || undefined,
                description: formData.description.trim() || undefined,
                contentUrl: formData.contentUrl.trim() || undefined,
                programImage: imageFile || undefined,
                removeImage: removeImage,
            }

            await updateProgram(program.programId, requestData)
            toast.success("Chương trình đã được cập nhật thành công!")
            onSuccess()
        } catch (error) {
            console.error("Failed to update program:", error)
            toast.error("Có lỗi xảy ra khi cập nhật chương trình")
        }
    }

    const handleCancel = () => {
        // Reset to original values
        if (program) {
            setFormData({
                programTitle: program.programTitle || "",
                programName: program.programName || "",
                programType: program.programType || "",
                description: program.description || "",
                contentUrl: program.contentUrl || "",
            })

            if (program.programImage) {
                const imageUrl = program.programImage.startsWith("http")
                    ? program.programImage
                    : `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}${program.programImage.startsWith("/") ? "" : "/"}${program.programImage}`
                setImagePreview(imageUrl)
            } else {
                setImagePreview(null)
            }
        }

        setImageFile(null)
        setRemoveImage(false)
        setErrors({})
        onOpenChange(false)
    }

    const hasErrors = Object.values(errors).some((error) => error !== undefined)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <DialogHeader>
                    <DialogTitle className="text-gray-900 dark:text-white">Chỉnh sửa chương trình</DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-400">
                        Cập nhật thông tin chương trình học tập. Các trường có dấu (*) là bắt buộc.
                    </DialogDescription>
                </DialogHeader>



                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="programTitle" className="text-gray-900 dark:text-white">
                                Tiêu đề chương trình *
                            </Label>
                            <Input
                                id="programTitle"
                                value={formData.programTitle}
                                onChange={(e) => handleInputChange("programTitle", e.target.value)}
                                placeholder="Nhập tiêu đề chương trình"
                                className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white ${errors.programTitle ? "border-red-500 focus:border-red-500" : ""
                                    }`}
                                required
                            />
                            {errors.programTitle && <p className="text-red-500 text-sm">{errors.programTitle}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="programName" className="text-gray-900 dark:text-white">
                                Tên chương trình
                            </Label>
                            <Input
                                id="programName"
                                value={formData.programName}
                                onChange={(e) => handleInputChange("programName", e.target.value)}
                                placeholder="Nhập tên chương trình"
                                className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white ${errors.programName ? "border-red-500 focus:border-red-500" : ""
                                    }`}
                            />
                            {errors.programName && <p className="text-red-500 text-sm">{errors.programName}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="programType" className="text-gray-900 dark:text-white">
                            Loại chương trình
                        </Label>
                        <Select value={formData.programType} onValueChange={(value) => handleInputChange("programType", value)}>
                            <SelectTrigger
                                className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white ${errors.programType ? "border-red-500 focus:border-red-500" : ""
                                    }`}
                            >
                                <SelectValue placeholder="Chọn loại chương trình" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                {Object.values(ProgramType).map((type) => (
                                    <SelectItem
                                        key={type}
                                        value={type}
                                        className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        {ProgramTypeLabels[type]}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.programType && <p className="text-red-500 text-sm">{errors.programType}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contentUrl" className="text-gray-900 dark:text-white">
                            URL nội dung
                        </Label>
                        <Input
                            id="contentUrl"
                            value={formData.contentUrl}
                            onChange={(e) => handleInputChange("contentUrl", e.target.value)}
                            placeholder="Nhập URL nội dung chương trình"
                            className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white ${errors.contentUrl ? "border-red-500 focus:border-red-500" : ""
                                }`}
                        />
                        {errors.contentUrl && <p className="text-red-500 text-sm">{errors.contentUrl}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-gray-900 dark:text-white">
                            Mô tả
                        </Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            placeholder="Nhập mô tả chương trình"
                            rows={4}
                            className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white ${errors.description ? "border-red-500 focus:border-red-500" : ""
                                }`}
                        />
                        <div className="flex justify-between items-center">
                            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                            <p className="text-gray-500 text-sm ml-auto">{formData.description.length}/1000 ký tự</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="programImage" className="text-gray-900 dark:text-white">
                            Hình ảnh chương trình
                        </Label>
                        <Input
                            id="programImage"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white ${errors.programImage ? "border-red-500 focus:border-red-500" : ""
                                }`}
                        />
                        {errors.programImage && <p className="text-red-500 text-sm">{errors.programImage}</p>}

                        {imagePreview && !removeImage && (
                            <div className="mt-2 flex items-start gap-4">
                                <img
                                    src={imagePreview || "/placeholder.svg"}
                                    alt="Preview"
                                    className="w-32 h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRemoveImage}
                                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-transparent"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Xóa ảnh
                                </Button>
                            </div>
                        )}
                        {removeImage && <p className="text-sm text-red-600 dark:text-red-400">Ảnh sẽ được xóa khi lưu thay đổi</p>}

                        <div className="text-xs text-gray-500 dark:text-gray-400">Chấp nhận: JPEG, PNG, GIF, WebP. Tối đa 5MB.</div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || !isFormValid()}
                            className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                        >
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {loading ? "Đang cập nhật..." : "Cập nhật"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
