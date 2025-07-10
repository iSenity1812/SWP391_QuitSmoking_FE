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
import { Loader2, X } from "lucide-react"

interface CreateProgramDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function CreateProgramDialog({ open, onOpenChange, onSuccess }: CreateProgramDialogProps) {
    const { createProgram, loading } = useProgramMutations()
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        programTitle: "",
        programName: "",
        programType: "" as ProgramType | "",
        contentUrl: "",
        description: "",
    })

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
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.programTitle.trim()) {
            toast.error("Vui lòng nhập tiêu đề chương trình")
            return
        }

        try {
            const programData: ProgramRequestDTO = {
                programTitle: formData.programTitle,
                programName: formData.programName || undefined,
                programType: formData.programType || undefined,
                programImage: imageFile || undefined,
                contentUrl: formData.contentUrl || undefined,
                description: formData.description || undefined,
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
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <DialogHeader>
                    <DialogTitle className="text-gray-900 dark:text-white">Tạo chương trình mới</DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-400">
                        Điền thông tin để tạo chương trình cai thuốc mới
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right text-gray-700 dark:text-gray-300">
                            Tiêu đề *
                        </Label>
                        <Input
                            id="title"
                            value={formData.programTitle}
                            onChange={(e) => setFormData({ ...formData, programTitle: e.target.value })}
                            className="col-span-3 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                            placeholder="Nhập tiêu đề chương trình"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right text-gray-700 dark:text-gray-300">
                            Tên chương trình
                        </Label>
                        <Input
                            id="name"
                            value={formData.programName}
                            onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
                            className="col-span-3 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                            placeholder="Nhập tên chương trình"
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right text-gray-700 dark:text-gray-300">
                            Loại chương trình
                        </Label>
                        <Select
                            value={formData.programType}
                            onValueChange={(value: ProgramType) => setFormData({ ...formData, programType: value })}
                        >
                            <SelectTrigger className="col-span-3 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
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

                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="description" className="text-right pt-2 text-gray-700 dark:text-gray-300">
                            Mô tả
                        </Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="col-span-3 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                            placeholder="Nhập mô tả chương trình"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="contentUrl" className="text-right text-gray-700 dark:text-gray-300">
                            URL nội dung
                        </Label>
                        <Input
                            id="contentUrl"
                            value={formData.contentUrl}
                            onChange={(e) => setFormData({ ...formData, contentUrl: e.target.value })}
                            className="col-span-3 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                            placeholder="https://example.com/content"
                        />
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
                                    className="flex-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
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
                            Tạo chương trình
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
