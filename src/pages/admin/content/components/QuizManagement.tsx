"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Edit, Trash2, Brain, Search, Filter, XCircle } from "lucide-react"
import { TaskService } from "@/services/taskService"
import type { QuizResponseDTO } from "@/types/task"
import { CreateQuizDialog } from "./dialogs/CreateQuizDialog"
import { EditQuizDialog } from "./dialogs/EditQuizDialog"
import { toast } from "react-toastify"



export function QuizManagement() {
    const [quizzes, setQuizzes] = useState<QuizResponseDTO[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [editingQuiz, setEditingQuiz] = useState<QuizResponseDTO | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    useEffect(() => {
        loadQuizzes()
    }, [])

    const loadQuizzes = async () => {
        try {
            setLoading(true)
            const data = await TaskService.getAllQuizzes()
            setQuizzes(data)
            setError(null)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteQuiz = async (quizId: string) => {
        try {
            await TaskService.deleteQuiz(quizId)
            await loadQuizzes()
            alert("Xóa quiz thành công!")
        } catch (err: any) {
            alert(`Lỗi xóa quiz: ${err.message}`)
        }
    }

    const openEditDialog = (quiz: QuizResponseDTO) => {
        setEditingQuiz(quiz)
        setIsEditDialogOpen(true)
    }

    const closeEditDialog = () => {
        setEditingQuiz(null)
        setIsEditDialogOpen(false)
    }

    const filteredQuizzes = useMemo(
        () =>
            quizzes.filter(
                (quiz) =>
                    quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (quiz.description && quiz.description.toLowerCase().includes(searchTerm.toLowerCase())),
            ),
        [quizzes, searchTerm],
    )

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <Brain className="w-8 h-8 animate-pulse mx-auto mb-2 text-purple-500" />
                    <p className="text-slate-600 dark:text-slate-400">Đang tải danh sách quiz...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Quản Lý Quiz</h2>
                <p className="text-slate-600 dark:text-slate-400">Tạo, chỉnh sửa và quản lý các quiz trong hệ thống</p>
            </div>

            {/* Search, Create and Filter */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <Input
                                placeholder="Tìm kiếm quiz theo tiêu đề hoặc mô tả..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <CreateQuizDialog onQuizCreated={loadQuizzes} />

                        <Button variant="outline">
                            <Filter className="w-4 h-4 mr-2" />
                            Lọc
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Error State */}
            {error && (
                <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                            <XCircle className="w-5 h-5" />
                            <span>{error}</span>
                            <Button variant="outline" size="sm" onClick={loadQuizzes} className="ml-auto bg-transparent">
                                Thử lại
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Quiz List */}
            <div className="grid gap-4">
                {filteredQuizzes.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <Brain className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                                {searchTerm ? "Không tìm thấy quiz" : "Chưa có quiz nào"}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                                {searchTerm ? "Thử thay đổi từ khóa tìm kiếm" : "Tạo quiz đầu tiên để bắt đầu"}
                            </p>
                            {!searchTerm && <CreateQuizDialog onQuizCreated={loadQuizzes} />}
                        </CardContent>
                    </Card>
                ) : (
                    filteredQuizzes.map((quiz) => (
                        <Card key={quiz.quizId} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Brain className="w-5 h-5 text-purple-500" />
                                        <CardTitle className="text-lg">{quiz.title}</CardTitle>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Badge variant="secondary">{quiz.scorePossible} điểm</Badge>
                                        <Badge variant="outline">{quiz.options.length} lựa chọn</Badge>
                                    </div>
                                </div>
                                {quiz.description && <CardDescription className="mt-2">{quiz.description}</CardDescription>}
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Các lựa chọn:</div>
                                    {quiz.options.map((option, index) => (
                                        <div
                                            key={option.optionId}
                                            className="flex items-center space-x-3 p-2 rounded bg-slate-50 dark:bg-slate-800/50"
                                        >
                                            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300">
                                                {String.fromCharCode(65 + index)}
                                            </span>
                                            <span className="text-slate-700 dark:text-slate-300">{option.content}</span>
                                        </div>
                                    ))}

                                    <div className="flex items-center justify-between pt-3 border-t">
                                        <div className="text-sm text-slate-500">ID: {quiz.quizId}</div>
                                        <div className="flex items-center space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => openEditDialog(quiz)}>
                                                <Edit className="w-4 h-4 mr-1" />
                                                Sửa
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-red-600 hover:text-red-700 bg-transparent"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                        Xóa
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Xác nhận xóa quiz</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Bạn có chắc chắn muốn xóa quiz "{quiz.title}"? Hành động này không thể hoàn tác.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDeleteQuiz(quiz.quizId)}
                                                            className="bg-red-600 hover:bg-red-700"
                                                        >
                                                            Xóa
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Edit Dialog */}
            <EditQuizDialog
                quiz={editingQuiz}
                isOpen={isEditDialogOpen}
                onClose={closeEditDialog}
                onQuizUpdated={loadQuizzes}
            />
        </div>
    )
}
