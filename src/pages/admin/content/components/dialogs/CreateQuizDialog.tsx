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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Brain, Trash2 } from "lucide-react"
import { TaskService } from "@/services/taskService"
import { toast } from "react-toastify"


interface CreateQuizDialogProps {
    onQuizCreated: () => void
}

interface QuizOption {
    content: string
    isCorrect: boolean
}

export function CreateQuizDialog({ onQuizCreated }: CreateQuizDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [scorePossible, setScorePossible] = useState(10)
    const [options, setOptions] = useState<QuizOption[]>([
        { content: "", isCorrect: false },
        { content: "", isCorrect: false },
    ])
    const [isSubmitting, setIsSubmitting] = useState(false)

    const addOption = () => {
        if (options.length < 6) {
            setOptions([...options, { content: "", isCorrect: false }])
        }
    }

    const removeOption = (index: number) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index))
        }
    }

    const updateOption = (index: number, field: keyof QuizOption, value: string | boolean) => {
        const newOptions = [...options]
        newOptions[index] = { ...newOptions[index], [field]: value }
        setOptions(newOptions)
    }

    const setCorrectAnswer = (index: number) => {
        const newOptions = options.map((option, i) => ({
            ...option,
            isCorrect: i === index,
        }))
        setOptions(newOptions)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!title.trim()) {
            toast.error("Vui lòng nhập tiêu đề quiz!")
            return
        }

        const validOptions = options.filter((opt) => opt.content.trim())
        if (validOptions.length !== 4) {
            toast.error("Quiz phải có đúng 4 lựa chọn")
            return
        }

        const hasCorrectAnswer = validOptions.some((opt) => opt.isCorrect)
        if (!hasCorrectAnswer) {
            toast.error("Vui lòng chọn đáp án đúng!")
            return
        }

        try {
            setIsSubmitting(true)

            const quizData = {
                title: title.trim(),
                description: description.trim() || undefined,
                scorePossible,
                options: validOptions.map((opt) => ({
                    content: opt.content.trim(),
                    isCorrect: opt.isCorrect,
                })),
            }

            await TaskService.createQuiz(quizData)

            // Reset form
            setTitle("")
            setDescription("")
            setScorePossible(10)
            setOptions([
                { content: "", isCorrect: false },
                { content: "", isCorrect: false },
            ])
            setIsOpen(false)

            // Refresh the quizzes list
            onQuizCreated()

            toast.success("Tạo quiz thành công!")
        } catch (error: any) {
            toast.error(`Lỗi tạo quiz: ${error.message}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo Quiz Mới
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                        <Brain className="w-5 h-5 text-purple-500" />
                        <span>Tạo Quiz Mới</span>
                    </DialogTitle>
                    <DialogDescription>Tạo một quiz để kiểm tra kiến thức của người dùng về cai thuốc lá</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Tiêu đề quiz *</Label>
                        <Input
                            id="title"
                            placeholder="Nhập tiêu đề quiz..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Mô tả (tùy chọn)</Label>
                        <Textarea
                            id="description"
                            placeholder="Nhập mô tả quiz..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={2}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="score">Điểm tối đa</Label>
                        <Input
                            id="score"
                            type="number"
                            min="1"
                            max="100"
                            value={scorePossible}
                            onChange={(e) => setScorePossible(Number.parseInt(e.target.value) || 10)}
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label>Các lựa chọn *</Label>
                            <Button type="button" variant="outline" size="sm" onClick={addOption} disabled={options.length >= 6}>
                                <Plus className="w-4 h-4 mr-1" />
                                Thêm lựa chọn
                            </Button>
                        </div>

                        {options.map((option, index) => (
                            <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg">
                                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium bg-slate-200 text-slate-700">
                                    {String.fromCharCode(65 + index)}
                                </span>
                                <Input
                                    placeholder={`Lựa chọn ${String.fromCharCode(65 + index)}`}
                                    value={option.content}
                                    onChange={(e) => updateOption(index, "content", e.target.value)}
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    variant={option.isCorrect ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCorrectAnswer(index)}
                                    className={option.isCorrect ? "bg-green-600 hover:bg-green-700" : ""}
                                >
                                    {option.isCorrect ? "Đúng" : "Chọn"}
                                </Button>
                                {options.length > 2 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeOption(index)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !title.trim()}
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            {isSubmitting ? "Đang tạo..." : "Tạo Quiz"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateQuizDialog
