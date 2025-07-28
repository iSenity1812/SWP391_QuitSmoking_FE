"use client"

import type React from "react"
import { useState } from "react"
import { Plus, Search, Edit, Trash2, Eye, Filter, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { usePrograms, useProgramMutations } from "@/hooks/use-programs"
import type { ProgramResponseDTO, ProgramType } from "@/types/program"
import { CreateProgramDialog } from "./dialogs/CreateProgramDialog"
import { EditProgramDialog } from "./dialogs/EditProgramDialog"
import { ProgramDetailDialog } from "./dialogs/ProgramDetailDialog"
import { ProgramType as ProgramTypeEnum, ProgramTypeLabels } from "@/types/program"

export function ProgramManagement() {
    const [selectedType, setSelectedType] = useState<ProgramType | "">("")
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [programToDelete, setProgramToDelete] = useState<ProgramResponseDTO | null>(null)
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [detailDialogOpen, setDetailDialogOpen] = useState(false)
    const [selectedProgram, setSelectedProgram] = useState<ProgramResponseDTO | null>(null)

    const {
        programs,
        loading,
        error,
        pagination,
        searchTerm,
        debouncedSearchTerm,
        updateSearchParams,
        changePage,
        changePageSize,
        search,
        clearSearch,
        refresh,
        searchParams,
    } = usePrograms({
        page: 0,
        size: 10,
        sort: "createdAt",
        direction: "DESC",
    })

    const { deleteProgram, loading: mutationLoading } = useProgramMutations()

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        search(e.target.value)
    }

    // Handle type filter change
    const handleTypeFilter = (type: string) => {
        console.log("Admin - Selected type:", type) // Debug log
        const programType = type as ProgramType | ""
        setSelectedType(programType)

        // Update search params immediately with proper logging
        console.log("Admin - Updating search params with programType:", programType || "undefined") // Debug log
        updateSearchParams({
            programType: programType || undefined,
            page: 0,
        })
    }

    // Handle clear filters
    const handleClearFilters = () => {
        clearSearch()
        setSelectedType("")
        updateSearchParams({
            keyword: undefined,
            programType: undefined,
            page: 0,
        })
    }

    // Handle delete
    const handleDeleteClick = (program: ProgramResponseDTO) => {
        setProgramToDelete(program)
        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (!programToDelete) return

        try {
            await deleteProgram(programToDelete.programId)
            setDeleteDialogOpen(false)
            setProgramToDelete(null)
            refresh()
        } catch (error) {
            console.error("Failed to delete program:", error)
        }
    }

    // Handle edit
    const handleEditClick = (program: ProgramResponseDTO) => {
        setSelectedProgram(program)
        setEditDialogOpen(true)
    }

    // Handle view details - show dialog instead of navigate
    const handleViewClick = (program: ProgramResponseDTO) => {
        setSelectedProgram(program)
        setDetailDialogOpen(true)
    }

    // Handle successful operations
    const handleOperationSuccess = () => {
        refresh()
        setCreateDialogOpen(false)
        setEditDialogOpen(false)
        setSelectedProgram(null)
    }

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    // Get program type color
    const getTypeColor = (type?: string) => {
        const colors: Record<string, string> = {
            BEGINNER: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
            INTERMEDIATE: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
            ADVANCED: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
            MEDITATION: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
            EXERCISE: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
            NUTRITION: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
            PSYCHOLOGY: "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300",
            SUPPORT_GROUP: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300",
            EDUCATIONAL: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-300",
            MOTIVATIONAL: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300",
        }
        return colors[type || ""] || "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
    }

    const getProgramTypeLabel = (type?: string) => {
        if (!type) return "Chưa phân loại"
        return ProgramTypeLabels[type as keyof typeof ProgramTypeLabels] || type
    }

    // Get proper image URL
    const getImageUrl = (imageUrl?: string) => {
        if (!imageUrl) return null

        // If it's already a full URL, return as is
        if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
            return imageUrl
        }

        // If it starts with /, it's a relative path from the server
        if (imageUrl.startsWith("/")) {
            return `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}${imageUrl}`
        }

        // Otherwise, assume it's a relative path and prepend the base URL
        return `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/${imageUrl}`
    }

    if (error) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="text-center text-red-600 dark:text-red-400">
                            <p>Có lỗi xảy ra: {error}</p>
                            <Button onClick={refresh} className="mt-4">
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Thử lại
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex flex-col gap-4 mb-6"
            >
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Chương trình</h1>
                        <p className="text-gray-600 dark:text-gray-400">Quản lý các chương trình học tập và hỗ trợ</p>
                    </div>
                    <Button onClick={() => setCreateDialogOpen(true)} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Tạo chương trình mới
                    </Button>
                </div>
            </motion.div>


            {/* Search and Filters */}
            <Card className="border border-gray-200 dark:border-gray-700">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Tìm kiếm theo tên chương trình..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                                />
                            </div>
                        </div>
                        <div className="w-full sm:w-48">
                            <select
                                value={selectedType}
                                onChange={(e) => handleTypeFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="" className="text-gray-900 dark:text-white">
                                    Tất cả loại
                                </option>
                                {Object.values(ProgramTypeEnum).map((type) => (
                                    <option key={type} value={type} className="text-gray-900 dark:text-white">
                                        {ProgramTypeLabels[type]}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleClearFilters} variant="outline">
                                <Filter className="h-4 w-4 mr-2" />
                                Xóa bộ lọc
                            </Button>
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    {(debouncedSearchTerm || selectedType) && (
                        <div className="flex flex-wrap gap-2 mt-4 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Bộ lọc đang áp dụng:</span>
                            {debouncedSearchTerm && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    Tìm kiếm: {debouncedSearchTerm}
                                    <button onClick={() => search("")} className="ml-1 hover:text-red-500 transition-colors">
                                        ×
                                    </button>
                                </Badge>
                            )}
                            {selectedType && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    Loại: {ProgramTypeLabels[selectedType]}
                                    <button onClick={() => handleTypeFilter("")} className="ml-1 hover:text-red-500 transition-colors">
                                        ×
                                    </button>
                                </Badge>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>



            {/* Programs List */}
            <Card className="border border-gray-200 dark:border-gray-700">
                <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">
                        Danh sách chương trình ({pagination.totalElements} chương trình)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : programs.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400">
                                {debouncedSearchTerm || selectedType
                                    ? "Không tìm thấy chương trình nào phù hợp với bộ lọc"
                                    : "Không có chương trình nào"}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {programs.map((program) => (
                                <div
                                    key={program.programId}
                                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-4 flex-1">
                                            {program.programImage ? (
                                                <img
                                                    src={getImageUrl(program.programImage) || "/placeholder.svg"}
                                                    alt={program.programTitle}
                                                    className="w-16 h-16 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement
                                                        if (!target.src.includes("placeholder.svg")) {
                                                            target.src = "/placeholder.svg?height=64&width=64"
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center border border-gray-200 dark:border-gray-600">
                                                    <span className="text-gray-400 dark:text-gray-500 text-xs">No Image</span>
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                                                        {program.programTitle}
                                                    </h3>
                                                    {program.programType && (
                                                        <Badge className={getTypeColor(program.programType)}>
                                                            {getProgramTypeLabel(program.programType)}
                                                        </Badge>
                                                    )}
                                                </div>
                                                {program.programName && (
                                                    <p className="text-gray-600 dark:text-gray-400 mb-1">{program.programName}</p>
                                                )}
                                                {program.description && (
                                                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-2 line-clamp-2">
                                                        {program.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarImage src={program.createdBy.avatar || "/placeholder.svg"} />
                                                            <AvatarFallback className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                                                                {program.createdBy.username.charAt(0).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span>{program.createdBy.username}</span>
                                                    </div>
                                                    <span>•</span>
                                                    <span>{formatDate(program.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <Button variant="outline" size="sm" onClick={() => handleViewClick(program)}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => handleEditClick(program)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDeleteClick(program)}
                                                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Hiển thị {pagination.currentPage * pagination.pageSize + 1} -{" "}
                                {Math.min((pagination.currentPage + 1) * pagination.pageSize, pagination.totalElements)} trong tổng số{" "}
                                {pagination.totalElements} chương trình
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => changePage(pagination.currentPage - 1)}
                                    disabled={!pagination.hasPrevious}
                                >
                                    Trước
                                </Button>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    Trang {pagination.currentPage + 1} / {pagination.totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => changePage(pagination.currentPage + 1)}
                                    disabled={!pagination.hasNext}
                                >
                                    Sau
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Create Program Dialog */}
            <CreateProgramDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onSuccess={handleOperationSuccess}
            />

            {/* Edit Program Dialog */}
            {selectedProgram && (
                <EditProgramDialog
                    open={editDialogOpen}
                    onOpenChange={setEditDialogOpen}
                    program={selectedProgram}
                    onSuccess={handleOperationSuccess}
                />
            )}

            {/* Program Detail Dialog */}
            {selectedProgram && (
                <ProgramDetailDialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen} program={selectedProgram} />
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-gray-900 dark:text-white">Xác nhận xóa</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                            Bạn có chắc chắn muốn xóa chương trình "{programToDelete?.programTitle}"? Hành động này không thể hoàn
                            tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
                            Hủy
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={mutationLoading}
                        >
                            {mutationLoading ? "Đang xóa..." : "Xóa"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
