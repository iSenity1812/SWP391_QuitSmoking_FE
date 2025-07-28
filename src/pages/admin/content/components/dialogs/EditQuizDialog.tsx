"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle, Plus } from "lucide-react"
import { TaskService } from "@/services/taskService"
import type { QuizResponseDTO, QuizCreationRequestDTO } from "@/types/task"
import { toast } from "react-toastify"

interface EditQuizDialogProps {
    quiz: QuizResponseDTO | null
    isOpen: boolean
    onClose: () => void
    onQuizUpdated: () => void
}

export function EditQuizDialog({ quiz, isOpen, onClose, onQuizUpdated }: EditQuizDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState<QuizCreationRequestDTO>({
        title: "",
        description: "",
        options: [
            { content: "", correct: false },
            { content: "", correct: false },
        ],
    })

    useEffect(() => {
        if (quiz && isOpen) {
            setFormData({
                title: quiz.title,
                description: quiz.description || "",
                options: quiz.options.map((option) => ({
                    content: option.content,
                    correct: option.correct, // Giữ nguyên trạng thái đúng/sai từ API
                })),
            })
        }
    }, [quiz, isOpen])

    const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, title: e.target.value }))
    }, [])

    const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, description: e.target.value }))
    }, [])

    const handleOptionChange = useCallback((index: number, value: string) => {
        setFormData((prev) => ({
            ...prev,
            options: prev.options.map((option, i) => (i === index ? { ...option, content: value } : option)),
        }))
    }, [])

    const handleCorrectAnswerChange = useCallback((index: number) => {
        setFormData((prev) => ({
            ...prev,
            options: prev.options.map((option, i) => ({
                ...option,
                correct: i === index ? !option.correct : option.correct
            })),
        }))
    }, [])

    const addOption = useCallback(() => {
        if (formData.options.length < 6) {
            setFormData((prev) => ({
                ...prev,
                options: [...prev.options, { content: "", correct: false }],
            }))
        }
    }, [formData.options.length])

    const removeOption = useCallback(
        (index: number) => {
            if (formData.options.length > 2) {
                setFormData((prev) => ({
                    ...prev,
                    options: prev.options.filter((_, i) => i !== index),
                }))
            }
        },
        [formData.options.length],
    )

    const handleSubmit = async () => {
        if (!quiz) return

        try {
            // Validation
            if (!formData.title.trim()) {
                toast.error("Vui lòng nhập tiêu đề quiz!")
                return
            }

            const validOptions = formData.options.filter((opt) => opt.content.trim())
            if (validOptions.length < 2) {
                toast.error("Quiz phải có ít nhất 2 lựa chọn")
                return
            }

            const hasCorrectAnswer = validOptions.some((option) => option.correct)
            if (!hasCorrectAnswer) {
                toast.error("Vui lòng chọn ít nhất một đáp án đúng!")
                return
            }

            setIsSubmitting(true)

            // Tạo payload với chỉ những options có nội dung
            const updatePayload: QuizCreationRequestDTO = {
                title: formData.title.trim(),
                description: formData.description?.trim() || undefined,
                options: validOptions.map((opt) => ({
                    content: opt.content.trim(),
                    correct: opt.correct,
                })),
            }

            await TaskService.updateQuiz(quiz.quizId, updatePayload)

            // Success
            toast.success("Cập nhật quiz thành công!")
            onClose()
            onQuizUpdated()
        } catch (err: unknown) {
            toast.error(`Lỗi cập nhật quiz: ${err instanceof Error ? err.message : 'Đã xảy ra lỗi'}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Chỉnh Sửa Quiz</DialogTitle>
                    <DialogDescription>Cập nhật thông tin quiz "{quiz?.title}"</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <div>
                        <Label htmlFor="edit-quiz-title">Tiêu đề Quiz *</Label>
                        <Input
                            id="edit-quiz-title"
                            value={formData.title}
                            onChange={handleTitleChange}
                            placeholder="Nhập tiêu đề cho quiz..."
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="edit-quiz-description">Mô tả</Label>
                        <Textarea
                            id="edit-quiz-description"
                            value={formData.description}
                            onChange={handleDescriptionChange}
                            placeholder="Nhập mô tả cho quiz (tùy chọn)..."
                            className="mt-1"
                            rows={3}
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <Label>Các lựa chọn *</Label>
                                <p className="text-sm text-muted-foreground">Có thể chọn nhiều đáp án đúng</p>
                            </div>
                            {formData.options.length < 6 && (
                                <Button type="button" variant="outline" size="sm" onClick={addOption}>
                                    <Plus className="w-4 h-4 mr-1" />
                                    Thêm lựa chọn
                                </Button>
                            )}
                        </div>

                        <div className="space-y-3">
                            {formData.options.map((option, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <Button
                                        type="button"
                                        variant={option.correct ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handleCorrectAnswerChange(index)}
                                        className={`min-w-[40px] ${option.correct ? "bg-green-600 hover:bg-green-700" : "hover:bg-green-50 hover:border-green-300"
                                            }`}
                                    >
                                        {option.correct ? <CheckCircle className="w-4 h-4" /> : String.fromCharCode(65 + index)}
                                    </Button>
                                    <Input
                                        value={option.content}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        placeholder={`Lựa chọn ${String.fromCharCode(65 + index)}`}
                                        className="flex-1"
                                    />
                                    {formData.options.length > 2 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeOption(index)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            ×
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-slate-500 mt-2">
                            Click vào chữ cái để chọn/bỏ chọn đáp án đúng. Có thể chọn nhiều đáp án đúng.
                        </p>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                            Hủy
                        </Button>
                        <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? "Đang cập nhật..." : "Cập nhật Quiz"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
