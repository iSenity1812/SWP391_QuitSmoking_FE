"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { TaskService } from "@/services/taskService"
import type { TipCreationRequestDTO } from "@/types/task"

interface CreateTipDialogProps {
    onTipCreated: () => void
}

export function CreateTipDialog({ onTipCreated }: CreateTipDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState<TipCreationRequestDTO>({
        content: "",
    })

    const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({ content: e.target.value })
    }, [])

    const resetForm = useCallback(() => {
        setFormData({ content: "" })
    }, [])

    const handleSubmit = async () => {
        try {
            // Validation
            if (!formData.content.trim()) {
                alert("Vui lòng nhập nội dung tip")
                return
            }

            if (formData.content.length > 2000) {
                alert("Nội dung tip không được vượt quá 2000 ký tự")
                return
            }

            setIsSubmitting(true)
            await TaskService.createTipByAdmin(formData)

            // Success
            alert("Tạo tip thành công!")
            setIsOpen(false)
            resetForm()
            onTipCreated()
        } catch (err: any) {
            alert(`Lỗi tạo tip: ${err.message}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancel = useCallback(() => {
        setIsOpen(false)
        resetForm()
    }, [resetForm])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo Tip Mới
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Tạo Tip Mới</DialogTitle>
                    <DialogDescription>Tạo một tip hữu ích cho hệ thống cai thuốc lá</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="tip-content">Nội dung Tip *</Label>
                        <Textarea
                            id="tip-content"
                            value={formData.content}
                            onChange={handleContentChange}
                            placeholder="Nhập nội dung tip hữu ích cho việc cai thuốc lá..."
                            className="mt-1 min-h-[120px]"
                            rows={6}
                        />
                        <div className="text-right text-sm text-slate-500 mt-1">{formData.content.length}/2000 ký tự</div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                            Hủy
                        </Button>
                        <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? "Đang tạo..." : "Tạo Tip"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
