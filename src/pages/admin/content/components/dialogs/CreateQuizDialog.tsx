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
import type { QuizCreationRequestDTO } from "@/types/task"


interface CreateQuizDialogProps {
    onQuizCreated: () => void
}

interface QuizOption {
    content: string
    correct: boolean
}

export function CreateQuizDialog({ onQuizCreated }: CreateQuizDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [options, setOptions] = useState<QuizOption[]>([
        { content: "", correct: false },
        { content: "", correct: false },
    ])
    const [isSubmitting, setIsSubmitting] = useState(false)

    const addOption = () => {
        if (options.length < 6) {
            setOptions([...options, { content: "", correct: false }])
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

    const toggleCorrectAnswer = (index: number) => {
        const newOptions = options.map((option, i) => ({
            ...option,
            correct: i === index ? !option.correct : option.correct,
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
        if (validOptions.length < 2) {
            toast.error("Quiz phải có ít nhất 2 lựa chọn")
            return
        }

        const hasCorrectAnswer = validOptions.some((opt) => opt.correct)
        if (!hasCorrectAnswer) {
            toast.error("Vui lòng chọn ít nhất một đáp án đúng!")
            return
        }

        try {
            setIsSubmitting(true)

            const quizData: QuizCreationRequestDTO = {
                title: title.trim(),
                description: description.trim() || undefined,
                options: validOptions.map((opt) => ({
                    content: opt.content.trim(),
                    correct: opt.correct,
                })),
            }

            await TaskService.createQuiz(quizData)

            // Reset form
            setTitle("")
            setDescription("")
            setOptions([
                { content: "", correct: false },
                { content: "", correct: false },
            ])
            setIsOpen(false)

            // Refresh the quizzes list
            onQuizCreated()

            toast.success("Tạo quiz thành công!")
        } catch (error: unknown) {
            toast.error(`Lỗi tạo quiz: ${error instanceof Error ? error.message : 'Unknown error'}`)
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

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label>Các lựa chọn *</Label>
                                <p className="text-sm text-muted-foreground">Có thể chọn nhiều đáp án đúng</p>
                            </div>
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
                                    variant={option.correct ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => toggleCorrectAnswer(index)}
                                    className={option.correct ? "bg-green-600 hover:bg-green-700" : ""}
                                >
                                    {option.correct ? "✓ Đúng" : "Chọn làm đúng"}
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
