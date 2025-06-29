"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Edit, Trash2, Lightbulb, Search, Filter, XCircle } from "lucide-react"
import { TaskService } from "@/services/taskService"
import type { TipResponseDTO } from "@/types/task"
import { CreateTipDialog } from "./dialogs/CreateTipDialog"
import { EditTipDialog } from "./dialogs/EditTipDialog"

export function TipManagement() {
    const [tips, setTips] = useState<TipResponseDTO[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [editingTip, setEditingTip] = useState<TipResponseDTO | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    useEffect(() => {
        loadTips()
    }, [])

    const loadTips = async () => {
        try {
            setLoading(true)
            const data = await TaskService.getAllTips()
            setTips(data)
            setError(null)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteTip = async (tipId: string) => {
        try {
            await TaskService.deleteTip(tipId)
            await loadTips()
            alert("Xóa tip thành công!")
        } catch (err: any) {
            alert(`Lỗi xóa tip: ${err.message}`)
        }
    }

    const openEditDialog = (tip: TipResponseDTO) => {
        setEditingTip(tip)
        setIsEditDialogOpen(true)
    }

    const closeEditDialog = () => {
        setEditingTip(null)
        setIsEditDialogOpen(false)
    }

    const filteredTips = useMemo(
        () => tips.filter((tip) => tip.content.toLowerCase().includes(searchTerm.toLowerCase())),
        [tips, searchTerm],
    )

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <Lightbulb className="w-8 h-8 animate-pulse mx-auto mb-2 text-yellow-500" />
                    <p className="text-slate-600 dark:text-slate-400">Đang tải danh sách tips...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Quản Lý Tips</h2>
                <p className="text-slate-600 dark:text-slate-400">Tạo, chỉnh sửa và quản lý các tips hữu ích trong hệ thống</p>
            </div>

            {/* Search, Create and Filter */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <Input
                                placeholder="Tìm kiếm tip theo nội dung..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <CreateTipDialog onTipCreated={loadTips} />

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
                            <Button variant="outline" size="sm" onClick={loadTips} className="ml-auto bg-transparent">
                                Thử lại
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Tips List */}
            <div className="grid gap-4">
                {filteredTips.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <Lightbulb className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                                {searchTerm ? "Không tìm thấy tip" : "Chưa có tip nào"}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                                {searchTerm ? "Thử thay đổi từ khóa tìm kiếm" : "Tạo tip đầu tiên để bắt đầu"}
                            </p>
                            {!searchTerm && <CreateTipDialog onTipCreated={loadTips} />}
                        </CardContent>
                    </Card>
                ) : (
                    filteredTips.map((tip) => (
                        <Card key={tip.tipId} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Lightbulb className="w-5 h-5 text-yellow-500" />
                                        <CardTitle className="text-lg">Tip Hữu Ích</CardTitle>
                                    </div>
                                    <Badge variant="secondary">{tip.content.length} ký tự</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-400">
                                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{tip.content}</p>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t">
                                        <div className="text-sm text-slate-500">ID: {tip.tipId}</div>
                                        <div className="flex items-center space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => openEditDialog(tip)}>
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
                                                        <AlertDialogTitle>Xác nhận xóa tip</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Bạn có chắc chắn muốn xóa tip này? Hành động này không thể hoàn tác.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDeleteTip(tip.tipId)}
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
            <EditTipDialog tip={editingTip} isOpen={isEditDialogOpen} onClose={closeEditDialog} onTipUpdated={loadTips} />
        </div>
    )
}
