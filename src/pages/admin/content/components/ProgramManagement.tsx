"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Edit, Trash2, BookOpen, CheckCircle, Loader2, RefreshCw, Eye, ImageIcon } from "lucide-react"
import { useTheme } from "@/context/ThemeContext"
import { usePrograms, useProgramMutations } from "@/hooks/use-programs"
import type { ProgramRequestDTO, ProgramUpdateRequestDTO, ProgramResponseDTO } from "@/types/program"
import { toast } from "react-toastify"

// Import ProgramDetail component
import { ProgramDetail } from "@/pages/learning/components/ProgramDetail"

export function ProgramManagement() {
    const { theme } = useTheme()
    const [searchTerm, setSearchTerm] = useState("")
    const [programTypeFilter, setProgramTypeFilter] = useState<string>("ALL")
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [selectedProgram, setSelectedProgram] = useState<ProgramResponseDTO | null>(null)
    const [viewingProgram, setViewingProgram] = useState<ProgramResponseDTO | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [removeImage, setRemoveImage] = useState(false)

    // Use the programs hook with search functionality
    const {
        programs,
        loading: programsLoading,
        error: programsError,
        pagination,
        searchParams,
        updateSearchParams,
        search,
        changePage,
        refresh,
    } = usePrograms({
        page: 0,
        size: 100, // Load more for admin view
        sort: "createdAt",
        direction: "DESC",
    })

    // Use mutations hook
    const {
        createProgram,
        updateProgram,
        deleteProgram,
        loading: mutationLoading,
    } = useProgramMutations()

    const [formData, setFormData] = useState<{
        programTitle: string
        programName: string
        programType: string
        contentUrl: string
        description: string
    }>({
        programTitle: "",
        programName: "",
        programType: "",
        contentUrl: "",
        description: "",
    })

    // Filter programs based on search and type
    const filteredPrograms = programs.filter((program) => {
        const matchesSearch =
            program.programTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (program.description && program.description.toLowerCase().includes(searchTerm.toLowerCase()))
        const matchesType = programTypeFilter === "ALL" || program.programType === programTypeFilter

        return matchesSearch && matchesType
    })

    // Get unique program types for filter
    const programTypes = Array.from(new Set(programs.map((p) => p.programType).filter(Boolean)))

    // Get type counts for tabs


    const handleCreateProgram = async () => {
        try {
            if (!formData.programTitle.trim()) {
                toast.error("Vui lòng nhập tiêu đề chương trình")
                return
            }

            const programData: ProgramRequestDTO = {
                programTitle: formData.programTitle,
                programName: formData.programName || undefined,
                programType: formData.programType || undefined,
                programImage: imageFile || undefined,
                contentUrl: formData.contentUrl || undefined,
                description: formData.description || undefined,
            }

            await createProgram(programData)
            setIsCreateDialogOpen(false)
            resetForm()
            refresh()
            toast.success("Chương trình đã được tạo thành công!")
        } catch (error: any) {
            toast.error(`Lỗi khi tạo chương trình: ${error.message || "Có lỗi xảy ra"}`)
        }
    }

    const handleEditProgram = async () => {
        if (!selectedProgram) return

        try {
            if (!formData.programTitle.trim()) {
                toast.error("Vui lòng nhập tiêu đề chương trình")
                return
            }

            const programData: ProgramUpdateRequestDTO = {
                programTitle: formData.programTitle,
                programName: formData.programName || undefined,
                programType: formData.programType || undefined,
                programImage: imageFile || undefined,
                removeImage: removeImage,
                contentUrl: formData.contentUrl || undefined,
                description: formData.description || undefined,
            }

            await updateProgram(selectedProgram.programId, programData)
            setIsEditDialogOpen(false)
            setSelectedProgram(null)
            resetForm()
            refresh()
            toast.success("Chương trình đã được cập nhật thành công!")
        } catch (error: any) {
            toast.error(`Lỗi khi cập nhật chương trình: ${error.message || "Có lỗi xảy ra"}`)
        }
    }

    const handleDeleteProgram = async (programId: number) => {
        try {
            await deleteProgram(programId)
            refresh()
            toast.success("Chương trình đã được xóa thành công!")
        } catch (error: any) {
            toast.error(`Lỗi khi xóa chương trình: ${error.message || "Có lỗi xảy ra"}`)
        }
    }

    const resetForm = () => {
        setFormData({
            programTitle: "",
            programName: "",
            programType: "",
            contentUrl: "",
            description: "",
        })
        setImageFile(null)
        setRemoveImage(false)
    }

    const openEditDialog = (program: ProgramResponseDTO) => {
        setSelectedProgram(program)
        setFormData({
            programTitle: program.programTitle,
            programName: program.programName || "",
            programType: program.programType || "",
            contentUrl: program.contentUrl || "",
            description: program.description || "",
        })
        setImageFile(null)
        setRemoveImage(false)
        setIsEditDialogOpen(true)
    }

    const handleViewProgram = (program: ProgramResponseDTO) => {
        setViewingProgram(program)
    }

    const handleBackToList = () => {
        setViewingProgram(null)
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
            const maxSize = 5 * 1024 * 1024 // 5MB

            if (!allowedTypes.includes(file.type)) {
                toast.error("Chỉ chấp nhận file ảnh định dạng JPEG, PNG, GIF, WebP")
                return
            }

            if (file.size > maxSize) {
                toast.error("Kích thước file không được vượt quá 5MB")
                return
            }

            setImageFile(file)
            setRemoveImage(false)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    // Helper function to strip HTML tags and get plain text
    const stripHtmlTags = (html: string) => {
        const div = document.createElement("div")
        div.innerHTML = html
        return div.textContent || div.innerText || ""
    }

    // Helper function to render content preview with proper HTML
    const renderContentPreview = (content: string, maxLength = 200) => {
        const plainText = stripHtmlTags(content)
        const truncated = plainText.length > maxLength ? plainText.substring(0, maxLength) + "..." : plainText
        return truncated
    }

    // Helper function to get proper image URL
    const getImageUrl = (imageUrl: string | undefined) => {
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

    // Program Card Component with proper image handling
    const ProgramCard = ({ program }: { program: ProgramResponseDTO }) => {
        const [imageError, setImageError] = useState(false)
        const imageUrl = getImageUrl(program.programImage)

        const handleImageError = () => {
            setImageError(true)
        }

        return (
            <Card className="mb-4">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <CardTitle className="text-lg mb-2">{program.programTitle}</CardTitle>
                            <CardDescription className="flex items-center gap-4 text-sm">
                                <span>Tác giả: {program.createdBy.fullName || program.createdBy.username}</span>
                                <span>Ngày tạo: {formatDate(program.createdAt)}</span>
                                {program.programType && <span>Loại: {program.programType}</span>}
                            </CardDescription>
                        </div>
                        {program.programType && (
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                {program.programType}
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Image preview with proper error handling */}
                    <div className="mb-4">
                        <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-lg overflow-hidden">
                            {imageUrl && !imageError ? (
                                <img
                                    src={imageUrl || "/placeholder.svg"}
                                    alt={program.programTitle}
                                    className="w-full h-full object-cover"
                                    onError={handleImageError}
                                    loading="lazy"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="text-center">
                                        <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">
                                            {program.programImage ? "Không thể tải ảnh" : "Chưa có hình ảnh"}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Program name */}
                    {program.programName && (
                        <p className="text-slate-600 dark:text-slate-300 mb-2 font-medium">{program.programName}</p>
                    )}

                    {/* Content preview */}
                    {program.description && (
                        <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
                            {renderContentPreview(program.description)}
                        </p>
                    )}

                    {/* Content URL indicator */}
                    {program.contentUrl && (
                        <div className="mb-4">
                            <Badge variant="outline" className="text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Có nội dung
                            </Badge>
                        </div>
                    )}

                    <div className="flex gap-2 flex-wrap">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(program)}
                            className="flex items-center gap-1"
                        >
                            <Edit className="w-4 h-4" />
                            Chỉnh sửa
                        </Button>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1 text-red-600 hover:text-red-700 bg-transparent"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Xóa
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Bạn có chắc chắn muốn xóa chương trình "{program.programTitle}"? Hành động này không thể hoàn tác.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => handleDeleteProgram(program.programId)}
                                        className="bg-red-600 hover:bg-red-700"
                                        disabled={mutationLoading}
                                    >
                                        {mutationLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                        Xóa
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewProgram(program)}
                            className="flex items-center gap-1"
                        >
                            <Eye className="w-4 h-4" />
                            Xem nội dung
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Handle search with debounce effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm !== searchParams.keyword) {
                search(searchTerm)
            }
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [searchTerm, search, searchParams.keyword])

    // If viewing a program, show ProgramDetail
    if (viewingProgram) {
        return <ProgramDetail program={viewingProgram} onBack={handleBackToList} />
    }

    // Error handling
    if (programsError) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Lỗi tải dữ liệu</h2>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">{programsError}</p>
                    <Button
                        onClick={() => refresh()}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Thử lại
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{programs.length}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">Tổng chương trình</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                        {programs.filter((p) => p.contentUrl).length}
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-300">Có nội dung</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                        {programs.filter((p) => p.programImage).length}
                    </div>
                    <div className="text-sm text-purple-600 dark:text-purple-300">Có hình ảnh</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">{programTypes.length}</div>
                    <div className="text-sm text-blue-600 dark:text-blue-300">Loại chương trình</div>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <Input
                            type="text"
                            placeholder="Tìm kiếm chương trình..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Button onClick={refresh} variant="outline" disabled={programsLoading}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${programsLoading ? "animate-spin" : ""}`} />
                        Làm mới
                    </Button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                {/* Header with Create Button */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Quản lý Chương trình</h2>
                            <p className="text-slate-600 dark:text-slate-300">Quản lý tất cả chương trình cai thuốc trong hệ thống</p>
                        </div>

                        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Tạo chương trình
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Tạo chương trình mới</DialogTitle>
                                    <DialogDescription>Điền thông tin để tạo chương trình cai thuốc mới</DialogDescription>
                                </DialogHeader>

                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="title" className="text-right">
                                            Tiêu đề *
                                        </Label>
                                        <Input
                                            id="title"
                                            value={formData.programTitle}
                                            onChange={(e) => setFormData({ ...formData, programTitle: e.target.value })}
                                            className="col-span-3"
                                            placeholder="Nhập tiêu đề chương trình"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Tên chương trình
                                        </Label>
                                        <Input
                                            id="name"
                                            value={formData.programName}
                                            onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
                                            className="col-span-3"
                                            placeholder="Nhập tên chương trình"
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="type" className="text-right">
                                            Loại chương trình
                                        </Label>
                                        <Input
                                            id="type"
                                            value={formData.programType}
                                            onChange={(e) => setFormData({ ...formData, programType: e.target.value })}
                                            className="col-span-3"
                                            placeholder="Ví dụ: Video, Audio, Document, Course"
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 items-start gap-4">
                                        <Label htmlFor="description" className="text-right pt-2">
                                            Mô tả
                                        </Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="col-span-3"
                                            placeholder="Nhập mô tả chương trình"
                                            rows={3}
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="contentUrl" className="text-right">
                                            URL nội dung
                                        </Label>
                                        <Input
                                            id="contentUrl"
                                            value={formData.contentUrl}
                                            onChange={(e) => setFormData({ ...formData, contentUrl: e.target.value })}
                                            className="col-span-3"
                                            placeholder="https://example.com/content"
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="image" className="text-right">
                                            Hình ảnh
                                        </Label>
                                        <Input
                                            id="image"
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                            onChange={handleImageChange}
                                            className="col-span-3"
                                        />
                                    </div>

                                    {imageFile && (
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <div className="text-right text-sm text-gray-500">File đã chọn:</div>
                                            <div className="col-span-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="text-sm">
                                                        {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setImageFile(null)}
                                                        className="text-red-600"
                                                    >
                                                        Xóa
                                                    </Button>
                                                </div>
                                                {/* Image preview */}
                                                <div className="mt-2">
                                                    <img
                                                        src={URL.createObjectURL(imageFile) || "/placeholder.svg"}
                                                        alt="Preview"
                                                        className="w-32 h-32 object-cover rounded border"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setIsCreateDialogOpen(false)
                                            resetForm()
                                        }}
                                    >
                                        Hủy
                                    </Button>
                                    <Button onClick={handleCreateProgram} disabled={mutationLoading || !formData.programTitle.trim()}>
                                        {mutationLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                        Tạo chương trình
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {programsLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
                        <p className="mt-4 text-slate-600 dark:text-slate-300">Đang tải chương trình...</p>
                    </div>
                ) : (
                    <div className="p-6">


                        {/* Programs List */}
                        {filteredPrograms.length === 0 ? (
                            <div className="text-center py-12">
                                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    Không tìm thấy chương trình
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {programTypeFilter === "ALL"
                                        ? "Không có chương trình nào."
                                        : `Không có chương trình nào với loại ${programTypeFilter}.`}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredPrograms.map((program) => (
                                    <ProgramCard key={program.programId} program={program} />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa chương trình</DialogTitle>
                        <DialogDescription>Cập nhật thông tin chương trình</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-title" className="text-right">
                                Tiêu đề *
                            </Label>
                            <Input
                                id="edit-title"
                                value={formData.programTitle}
                                onChange={(e) => setFormData({ ...formData, programTitle: e.target.value })}
                                className="col-span-3"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">
                                Tên chương trình
                            </Label>
                            <Input
                                id="edit-name"
                                value={formData.programName}
                                onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
                                className="col-span-3"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-type" className="text-right">
                                Loại chương trình
                            </Label>
                            <Input
                                id="edit-type"
                                value={formData.programType}
                                onChange={(e) => setFormData({ ...formData, programType: e.target.value })}
                                className="col-span-3"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="edit-description" className="text-right pt-2">
                                Mô tả
                            </Label>
                            <Textarea
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="col-span-3"
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-contentUrl" className="text-right">
                                URL nội dung
                            </Label>
                            <Input
                                id="edit-contentUrl"
                                value={formData.contentUrl}
                                onChange={(e) => setFormData({ ...formData, contentUrl: e.target.value })}
                                className="col-span-3"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-image" className="text-right">
                                Hình ảnh mới
                            </Label>
                            <Input
                                id="edit-image"
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                onChange={handleImageChange}
                                className="col-span-3"
                            />
                        </div>

                        {selectedProgram?.programImage && !removeImage && !imageFile && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Hình ảnh hiện tại</Label>
                                <div className="col-span-3 flex items-center gap-2">
                                    <img
                                        src={getImageUrl(selectedProgram.programImage) || "/placeholder.svg"}
                                        alt="Current"
                                        className="w-16 h-16 object-cover rounded"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement
                                            target.src = "/placeholder.svg?height=64&width=64"
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setRemoveImage(true)}
                                        className="text-red-600"
                                    >
                                        Xóa hình ảnh
                                    </Button>
                                </div>
                            </div>
                        )}

                        {removeImage && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <div className="text-right text-sm text-red-600">Hình ảnh sẽ bị xóa</div>
                                <div className="col-span-3">
                                    <Button type="button" variant="outline" size="sm" onClick={() => setRemoveImage(false)}>
                                        Hủy xóa
                                    </Button>
                                </div>
                            </div>
                        )}

                        {imageFile && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <div className="text-right text-sm text-gray-500">File mới:</div>
                                <div className="col-span-3">
                                    <div className="flex items-center gap-3">
                                        <div className="text-sm">
                                            {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setImageFile(null)}
                                            className="text-red-600"
                                        >
                                            Xóa
                                        </Button>
                                    </div>
                                    {/* Image preview */}
                                    <div className="mt-2">
                                        <img
                                            src={URL.createObjectURL(imageFile) || "/placeholder.svg"}
                                            alt="Preview"
                                            className="w-32 h-32 object-cover rounded border"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsEditDialogOpen(false)
                                resetForm()
                                setSelectedProgram(null)
                            }}
                        >
                            Hủy
                        </Button>
                        <Button onClick={handleEditProgram} disabled={mutationLoading || !formData.programTitle.trim()}>
                            {mutationLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Cập nhật
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
