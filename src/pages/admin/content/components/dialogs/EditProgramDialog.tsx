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
import { useProgramMutations } from "@/hooks/use-programs"
import type { ProgramResponseDTO, ProgramUpdateRequestDTO } from "@/types/program"
import { toast } from "react-toastify"
import { Loader2, X } from "lucide-react"

interface EditProgramDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    program: ProgramResponseDTO
    onSuccess: () => void
}

export function EditProgramDialog({ open, onOpenChange, program, onSuccess }: EditProgramDialogProps) {
    const { updateProgram, loading } = useProgramMutations()
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [removeImage, setRemoveImage] = useState(false)
    const [formData, setFormData] = useState({
        programTitle: "",
        programName: "",
        programType: "",
        contentUrl: "",
        description: "",
    })

    // Initialize form data when program changes
    useEffect(() => {
        if (program) {
            setFormData({
                programTitle: program.programTitle,
                programName: program.programName || "",
                programType: program.programType || "",
                contentUrl: program.contentUrl || "",
                description: program.description || "",
            })
            setImageFile(null)
            setImagePreview(null)
            setRemoveImage(false)
        }
    }, [program])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
            const maxSize = 5 * 1024 * 1024 // 5MB

            if (!allowedTypes.includes(file.type)) {
                toast.error("Chỉ chấp nhận file ảnh định dạng JPEG, PNG, GIF, WebP")
                return
            }

            if (file.size > maxSize) {
                toast.error("Kích thước file không được vượt quá 5MB")
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

    const handleRemoveNewImage = () => {
        setImageFile(null)
        setImagePreview(null)
    }

    const handleRemoveCurrentImage = () => {
        setRemoveImage(true)
    }

    const handleKeepCurrentImage = () => {
        setRemoveImage(false)
    }

    const getImageUrl = (imageUrl?: string) => {
        if (!imageUrl) return null

        if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
            return imageUrl
        }

        if (imageUrl.startsWith("/")) {
            return `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}${imageUrl}`
        }

        return `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/${imageUrl}`
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.programTitle.trim()) {
            toast.error("Vui lòng nhập tiêu đề chương trình")
            return
        }

        try {
            const programData: ProgramUpdateRequestDTO = {
                programTitle: formData.programTitle,
                programName: formData.programName || undefined,
                programType: formData.programType || undefined,
                programImage: imageFile || undefined,
                removeImage: removeImage,
                contentUrl: formData.contentUrl || undefined,
                description: formData.description || undefined,
            }

            await updateProgram(program.programId, programData)
            toast.success("Chương trình đã được cập nhật thành công!")
            onSuccess()
        } catch (error: any) {
            toast.error(`Lỗi khi cập nhật chương trình: ${error.message || "Có lỗi xảy ra"}`)
        }
    }

    const handleClose = () => {
        setImageFile(null)
        setImagePreview(null)
        setRemoveImage(false)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <DialogHeader>
                    <DialogTitle className="text-gray-900 dark:text-white">Chỉnh sửa chương trình</DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-400">
                        Cập nhật thông tin chương trình
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-title" className="text-right text-gray-700 dark:text-gray-300">
                            Tiêu đề *
                        </Label>
                        <Input
                            id="edit-title"
                            value={formData.programTitle}
                            onChange={(e) => setFormData({ ...formData, programTitle: e.target.value })}
                            className="col-span-3 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-name" className="text-right text-gray-700 dark:text-gray-300">
                            Tên chương trình
                        </Label>
                        <Input
                            id="edit-name"
                            value={formData.programName}
                            onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
                            className="col-span-3 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-type" className="text-right text-gray-700 dark:text-gray-300">
                            Loại chương trình
                        </Label>
                        <Input
                            id="edit-type"
                            value={formData.programType}
                            onChange={(e) => setFormData({ ...formData, programType: e.target.value })}
                            className="col-span-3 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                        />
                    </div>

                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="edit-description" className="text-right pt-2 text-gray-700 dark:text-gray-300">
                            Mô tả
                        </Label>
                        <Textarea
                            id="edit-description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="col-span-3 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-contentUrl" className="text-right text-gray-700 dark:text-gray-300">
                            URL nội dung
                        </Label>
                        <Input
                            id="edit-contentUrl"
                            value={formData.contentUrl}
                            onChange={(e) => setFormData({ ...formData, contentUrl: e.target.value })}
                            className="col-span-3 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                        />
                    </div>

                    {/* Current Image */}
                    {program.programImage && !removeImage && !imageFile && (
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label className="text-right pt-2 text-gray-700 dark:text-gray-300">Hình ảnh hiện tại</Label>
                            <div className="col-span-3 space-y-3">
                                <img
                                    src={getImageUrl(program.programImage) || "/placeholder.svg"}
                                    alt="Current"
                                    className="w-32 h-32 object-cover rounded border border-gray-200 dark:border-gray-600"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement
                                        target.src = "/placeholder.svg?height=128&width=128"
                                    }}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRemoveCurrentImage}
                                    className="text-red-600 hover:text-red-700 bg-transparent"
                                >
                                    Xóa hình ảnh hiện tại
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Remove Image Confirmation */}
                    {removeImage && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <div className="text-right text-sm text-red-600 dark:text-red-400">Hình ảnh sẽ bị xóa</div>
                            <div className="col-span-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleKeepCurrentImage}
                                    className="text-gray-600 dark:text-gray-400 bg-transparent"
                                >
                                    Hủy xóa
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* New Image Upload */}
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="edit-image" className="text-right pt-2 text-gray-700 dark:text-gray-300">
                            {program.programImage && !removeImage ? "Thay đổi hình ảnh" : "Hình ảnh mới"}
                        </Label>
                        <div className="col-span-3 space-y-3">
                            <div className="flex items-center gap-3">
                                <Input
                                    id="edit-image"
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                    onChange={handleImageChange}
                                    className="flex-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                />
                                {imageFile && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleRemoveNewImage}
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
                            disabled={loading || !formData.programTitle.trim()}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Cập nhật
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
