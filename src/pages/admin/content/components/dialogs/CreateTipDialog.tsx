"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog-task"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Lightbulb } from "lucide-react"
import { TaskService } from "@/services/taskService"
import { toast } from "react-toastify"


interface CreateTipDialogProps {
    onTipCreated: () => void
}

export function CreateTipDialog({ onTipCreated }: CreateTipDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [content, setContent] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!content.trim()) {
            toast.error("Vui lòng nhập nội dung tip!")
            return
        }

        try {
            setIsSubmitting(true)
            await TaskService.createTipByAdmin({ content: content.trim() })

            // Reset form
            setContent("")
            setIsOpen(false)

            // Refresh the tips list
            onTipCreated()

            toast.success("Tạo tip thành công!")
        } catch (error: any) {
            toast.error(`Lỗi tạo tip: ${error.message}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo Tip Mới
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500" />
                        <span>Tạo Tip Mới</span>
                    </DialogTitle>
                    <DialogDescription>Tạo một tip hữu ích để giúp người dùng trong hành trình cai thuốc lá</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="content">Nội dung tip *</Label>
                        <Textarea
                            id="content"
                            placeholder="Nhập nội dung tip hữu ích..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={4}
                            className="resize-none"
                        />
                        <div className="text-sm text-slate-500">{content.length} ký tự</div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !content.trim()}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {isSubmitting ? "Đang tạo..." : "Tạo Tip"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateTipDialog
