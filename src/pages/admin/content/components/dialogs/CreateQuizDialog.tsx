"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Plus, CheckCircle } from "lucide-react"
import { TaskService } from "@/services/taskService"
import type { QuizCreationRequestDTO } from "@/types/task"

interface CreateQuizDialogProps {
    onQuizCreated: () => void
}

export function CreateQuizDialog({ onQuizCreated }: CreateQuizDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState<QuizCreationRequestDTO>({
        title: "",
        description: "",
        scorePossible: 10,
        options: [
            { content: "", isCorrect: false },
            { content: "", isCorrect: false },
            { content: "", isCorrect: false },
            { content: "", isCorrect: false },
        ],
    })

    const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, title: e.target.value }))
    }, [])

    const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, description: e.target.value }))
    }, [])

    const handleScoreChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number.parseInt(e.target.value) || 10
        setFormData((prev) => ({ ...prev, scorePossible: Math.max(1, Math.min(100, value)) }))
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
            options: prev.options.map((option, i) => ({ ...option, isCorrect: i === index })),
        }))
    }, [])

    const addOption = useCallback(() => {
        if (formData.options.length < 6) {
            setFormData((prev) => ({
                ...prev,
                options: [...prev.options, { content: "", isCorrect: false }],
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

    const resetForm = useCallback(() => {
        setFormData({
            title: "",
            description: "",
            scorePossible: 10,
            options: [
                { content: "", isCorrect: false },
                { content: "", isCorrect: false },
                { content: "", isCorrect: false },
                { content: "", isCorrect: false },
            ],
        })
    }, [])

    const handleSubmit = async () => {
        try {
            // Validation
            if (!formData.title.trim()) {
                alert("Vui lòng nhập tiêu đề quiz")
                return
            }

            if (formData.options.some((option) => !option.content.trim())) {
                alert("Vui lòng điền đầy đủ tất cả các lựa chọn")
                return
            }

            const hasCorrectAnswer = formData.options.some((option) => option.isCorrect)
            if (!hasCorrectAnswer) {
                alert("Vui lòng chọn ít nhất một đáp án đúng")
                return
            }

            setIsSubmitting(true)
            await TaskService.createQuiz(formData)

            // Success
            alert("Tạo quiz thành công!")
            setIsOpen(false)
            resetForm()
            onQuizCreated()
        } catch (err: any) {
            alert(`Lỗi tạo quiz: ${err.message}`)
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
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo Quiz Mới
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Tạo Quiz Mới</DialogTitle>
                    <DialogDescription>Tạo một quiz mới cho hệ thống cai thuốc lá</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <div>
                        <Label htmlFor="quiz-title">Tiêu đề Quiz *</Label>
                        <Input
                            id="quiz-title"
                            value={formData.title}
                            onChange={handleTitleChange}
                            placeholder="Nhập tiêu đề cho quiz..."
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="quiz-description">Mô tả</Label>
                        <Textarea
                            id="quiz-description"
                            value={formData.description}
                            onChange={handleDescriptionChange}
                            placeholder="Nhập mô tả cho quiz (tùy chọn)..."
                            className="mt-1"
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label htmlFor="quiz-score">Điểm số (1-100)</Label>
                        <Input
                            id="quiz-score"
                            type="number"
                            min="1"
                            max="100"
                            value={formData.scorePossible}
                            onChange={handleScoreChange}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <Label>Các lựa chọn *</Label>
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
                                        variant={option.isCorrect ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handleCorrectAnswerChange(index)}
                                        className={`min-w-[40px] ${option.isCorrect ? "bg-green-600 hover:bg-green-700" : "hover:bg-green-50 hover:border-green-300"
                                            }`}
                                    >
                                        {option.isCorrect ? <CheckCircle className="w-4 h-4" /> : String.fromCharCode(65 + index)}
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
                        <p className="text-sm text-slate-500 mt-2">Click vào chữ cái để chọn đáp án đúng</p>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                            Hủy
                        </Button>
                        <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? "Đang tạo..." : "Tạo Quiz"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
