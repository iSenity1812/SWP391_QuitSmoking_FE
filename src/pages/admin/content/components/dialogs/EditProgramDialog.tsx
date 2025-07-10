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

interface EditProgramDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    program: ProgramResponseDTO
    onSuccess: () => void
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
        }
    }, [program])

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
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
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.programTitle.trim()) {
            alert("Vui lòng nhập tiêu đề chương trình")
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
            onSuccess()
        } catch (error) {
            console.error("Failed to update program:", error)
            alert("Có lỗi xảy ra khi cập nhật chương trình")
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
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <DialogHeader>
                    <DialogTitle className="text-gray-900 dark:text-white">Chỉnh sửa chương trình</DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-400">
                        Cập nhật thông tin chương trình học tập
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
                                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                                required
                            />
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
                                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="programType" className="text-gray-900 dark:text-white">
                            Loại chương trình
                        </Label>
                        <Select value={formData.programType} onValueChange={(value) => handleInputChange("programType", value)}>
                            <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
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
                            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                        />
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
                            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                        />
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
                            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                        />
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
                                    Xóa ảnh
                                </Button>
                            </div>
                        )}
                        {removeImage && <p className="text-sm text-red-600 dark:text-red-400">Ảnh sẽ được xóa khi lưu thay đổi</p>}
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
                        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                            {loading ? "Đang cập nhật..." : "Cập nhật"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
