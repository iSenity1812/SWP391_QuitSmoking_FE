"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TaskService } from "@/services/taskService"
import type { TipResponseDTO, TipCreationRequestDTO } from "@/types/task"
import { toast } from "react-toastify"


interface EditTipDialogProps {
    tip: TipResponseDTO | null
    isOpen: boolean
    onClose: () => void
    onTipUpdated: () => void
}

export function EditTipDialog({ tip, isOpen, onClose, onTipUpdated }: EditTipDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState<TipCreationRequestDTO>({
        content: "",
    })

    useEffect(() => {
        if (tip && isOpen) {
            setFormData({
                content: tip.content,
            })
        }
    }, [tip, isOpen])

    const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({ content: e.target.value })
    }, [])

    const handleSubmit = async () => {
        if (!tip) return

        try {
            // Validation
            if (!formData.content.trim()) {
                toast.error("Vui lòng nhập nội dung tip")
                return
            }

            if (formData.content.length > 2000) {
                toast.error("Nội dung tip không được vượt quá 2000 ký tự")
                return
            }

            setIsSubmitting(true)
            await TaskService.updateTip(tip.tipId, formData)

            // Success
            toast.success("Cập nhật tip thành công!")
            onClose()
            onTipUpdated()
        } catch (err: any) {
            toast.error(`Lỗi cập nhật tip: ${err.message}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Chỉnh Sửa Tip</DialogTitle>
                    <DialogDescription>Cập nhật nội dung tip</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="edit-tip-content">Nội dung Tip *</Label>
                        <Textarea
                            id="edit-tip-content"
                            value={formData.content}
                            onChange={handleContentChange}
                            placeholder="Nhập nội dung tip hữu ích cho việc cai thuốc lá..."
                            className="mt-1 min-h-[120px]"
                            rows={6}
                        />
                        <div className="text-right text-sm text-slate-500 mt-1">{formData.content.length}/2000 ký tự</div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                            Hủy
                        </Button>
                        <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? "Đang cập nhật..." : "Cập nhật Tip"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
