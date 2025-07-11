"use client"
import { RefreshCw, AlertCircle, BookOpen, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ProgramCard } from "./ProgramCard"
import type { ProgramResponseDTO } from "@/types/program"

interface ProgramListProps {
    programs: ProgramResponseDTO[]
    loading: boolean
    error: string | null
    pagination: {
        currentPage: number
        totalPages: number
        totalElements: number
        pageSize: number
        hasNext: boolean
        hasPrevious: boolean
    }
    viewMode: "grid" | "list"
    onProgramSelect: (program: ProgramResponseDTO) => void
    onPageChange: (page: number) => void
    onPageSizeChange: (size: number) => void
    onRefresh: () => void
}

export function ProgramList({
    programs,
    loading,
    error,
    pagination,
    viewMode,
    onProgramSelect,
    onPageChange,
    onPageSizeChange,
    onRefresh,
}: ProgramListProps) {
    if (error) {
        return (
            <Alert variant="destructive" className="border-0 bg-red-50 dark:bg-red-900/20 backdrop-blur-sm">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription className="flex items-center justify-between text-base">
                    <span>{error}</span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRefresh}
                        className="bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/30"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Thử lại
                    </Button>
                </AlertDescription>
            </Alert>
        )
    }

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="flex items-center justify-center py-16">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-emerald-200 dark:border-emerald-700 rounded-full animate-spin border-t-emerald-500 dark:border-t-emerald-400"></div>
                            <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-emerald-500 animate-pulse" />
                        </div>
                        <p className="text-lg font-medium text-slate-600 dark:text-slate-400">Đang tải chương trình premium...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (programs.length === 0) {
        return (
            <Card className="text-center py-16 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl">
                <CardContent>
                    <div className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                        <div className="mb-8">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900 dark:to-blue-900 rounded-full flex items-center justify-center">
                                <BookOpen className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-slate-700 dark:text-slate-300">Không tìm thấy chương trình</h3>
                        <p className="text-base mb-8 leading-relaxed">
                            Chúng tôi không thể tìm thấy chương trình nào phù hợp với tiêu chí tìm kiếm của bạn. Hãy thử điều chỉnh bộ
                            lọc hoặc từ khóa tìm kiếm để khám phá thêm nội dung.
                        </p>
                        <Button
                            onClick={onRefresh}
                            variant="outline"
                            className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Làm mới chương trình
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-8">
            {/* Enhanced Results Info - Simplified */}

            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></span>
                Chương trình ({pagination.totalElements} bài)
            </h2>
            {/* Enhanced Programs Grid/List */}
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8" : "space-y-6"}>
                {programs.map((program) => (
                    <ProgramCard
                        key={program.programId}
                        program={program}
                        onClick={() => onProgramSelect(program)}
                    />
                ))}
            </div>
        </div>
    )
}
