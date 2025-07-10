"use client"

import type React from "react"
import { useState } from "react"
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
import type { ProgramRequestDTO } from "@/types/program"
import { ProgramType, ProgramTypeLabels } from "@/types/program"
import { toast } from "react-toastify"
import { Loader2, X, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CreateProgramDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
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

export function CreateProgramDialog({ open, onOpenChange, onSuccess }: CreateProgramDialogProps) {
    const { createProgram, loading } = useProgramMutations()
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [errors, setErrors] = useState<ValidationErrors>({})
    const [formData, setFormData] = useState({
        programTitle: "",
        programName: "",
        programType: "" as ProgramType | "",
        contentUrl: "",
        description: "",
    })

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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            updateFieldError("programImage", file)

            const error = validateField("programImage", file)
            if (error) {
                return
            }

            setImageFile(file)
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
        setErrors((prev) => ({ ...prev, programImage: undefined }))
    }

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        updateFieldError(field, value)
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



        try {
            const programData: ProgramRequestDTO = {
                programTitle: formData.programTitle.trim(),
                programName: formData.programName.trim() || undefined,
                programType: formData.programType || undefined,
                programImage: imageFile || undefined,
                contentUrl: formData.contentUrl.trim() || undefined,
                description: formData.description.trim() || undefined,
            }

            await createProgram(programData)
            toast.success("Chương trình đã được tạo thành công!")

            // Reset form
            setFormData({
                programTitle: "",
                programName: "",
                programType: "",
                contentUrl: "",
                description: "",
            })
            setImageFile(null)
            setImagePreview(null)
            setErrors({})

            onSuccess()
        } catch (error: any) {
            toast.error(`Lỗi khi tạo chương trình: ${error.message || "Có lỗi xảy ra"}`)
        }
    }

    const handleClose = () => {
        setFormData({
            programTitle: "",
            programName: "",
            programType: "",
            contentUrl: "",
            description: "",
        })
        setImageFile(null)
        setImagePreview(null)
        setErrors({})
        onOpenChange(false)
    }

    const hasErrors = Object.values(errors).some((error) => error !== undefined)

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <DialogHeader>
                    <DialogTitle className="text-gray-900 dark:text-white">Tạo chương trình mới</DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-400">
                        Điền thông tin để tạo chương trình cai thuốc mới. Các trường có dấu (*) là bắt buộc.
                    </DialogDescription>
                </DialogHeader>



                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right text-gray-700 dark:text-gray-300">
                            Tiêu đề *
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="title"
                                value={formData.programTitle}
                                onChange={(e) => handleInputChange("programTitle", e.target.value)}
                                className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white ${errors.programTitle ? "border-red-500 focus:border-red-500" : ""
                                    }`}
                                placeholder="Nhập tiêu đề chương trình"
                                required
                            />
                            {errors.programTitle && <p className="text-red-500 text-sm mt-1">{errors.programTitle}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right text-gray-700 dark:text-gray-300">
                            Tên chương trình
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="name"
                                value={formData.programName}
                                onChange={(e) => handleInputChange("programName", e.target.value)}
                                className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white ${errors.programName ? "border-red-500 focus:border-red-500" : ""
                                    }`}
                                placeholder="Nhập tên chương trình"
                            />
                            {errors.programName && <p className="text-red-500 text-sm mt-1">{errors.programName}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right text-gray-700 dark:text-gray-300">
                            Loại chương trình
                        </Label>
                        <div className="col-span-3">
                            <Select
                                value={formData.programType}
                                onValueChange={(value: ProgramType) => handleInputChange("programType", value)}
                            >
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
                            {errors.programType && <p className="text-red-500 text-sm mt-1">{errors.programType}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="description" className="text-right pt-2 text-gray-700 dark:text-gray-300">
                            Mô tả
                        </Label>
                        <div className="col-span-3">
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                                className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white ${errors.description ? "border-red-500 focus:border-red-500" : ""
                                    }`}
                                placeholder="Nhập mô tả chương trình"
                                rows={3}
                            />
                            <div className="flex justify-between items-center mt-1">
                                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                                <p className="text-gray-500 text-sm ml-auto">{formData.description.length}/1000 ký tự</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="contentUrl" className="text-right text-gray-700 dark:text-gray-300">
                            URL nội dung
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="contentUrl"
                                value={formData.contentUrl}
                                onChange={(e) => handleInputChange("contentUrl", e.target.value)}
                                className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white ${errors.contentUrl ? "border-red-500 focus:border-red-500" : ""
                                    }`}
                                placeholder="https://example.com/content"
                            />
                            {errors.contentUrl && <p className="text-red-500 text-sm mt-1">{errors.contentUrl}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="image" className="text-right pt-2 text-gray-700 dark:text-gray-300">
                            Hình ảnh
                        </Label>
                        <div className="col-span-3 space-y-3">
                            <div className="flex items-center gap-3">
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                    onChange={handleImageChange}
                                    className={`flex-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 ${errors.programImage ? "border-red-500 focus:border-red-500" : ""
                                        }`}
                                />
                                {imageFile && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleRemoveImage}
                                        className="text-red-600 hover:text-red-700 bg-transparent"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>

                            {imagePreview && (
                                <div className="relative">
                                    <img
                                        src={imagePreview || "/placeholder.svg"}
                                        alt="Preview"
                                        className="w-32 h-32 object-cover rounded border border-gray-200 dark:border-gray-600"
                                    />
                                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        {imageFile?.name} ({((imageFile?.size || 0) / 1024 / 1024).toFixed(2)} MB)
                                    </div>
                                </div>
                            )}

                            {errors.programImage && <p className="text-red-500 text-sm">{errors.programImage}</p>}

                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                Chấp nhận: JPEG, PNG, GIF, WebP. Tối đa 5MB.
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
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
                            Tạo chương trình
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
