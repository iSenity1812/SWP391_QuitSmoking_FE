"use client"

import type React from "react"
import { useState } from "react"
import { Search, Filter, Grid, List, Sparkles, BookOpen } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProgramList } from "./components/ProgramList"
import { ProgramDetail } from "./components/ProgramDetail"
import { usePrograms } from "@/hooks/use-programs"
import type { ProgramResponseDTO, ProgramType } from "@/types/program"
import { ProgramType as ProgramTypeEnum, ProgramTypeLabels } from "@/types/program"

export default function ProgramPage() {
    const [selectedProgram, setSelectedProgram] = useState<ProgramResponseDTO | null>(null)
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [selectedType, setSelectedType] = useState<ProgramType | "">("")

    const {
        programs,
        loading,
        error,
        pagination,
        searchTerm,
        debouncedSearchTerm,
        search,
        clearSearch,
        updateSearchParams,
        changePage,
        changePageSize,
        refresh,
        searchParams,
    } = usePrograms()

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        search(e.target.value)
    }

    // Handle type filter change - Enhanced with better debugging
    const handleTypeFilter = (type: string) => {
        console.log("Selected type:", type) // Debug log
        const programType = type as ProgramType | ""
        setSelectedType(programType)

        // Update search params immediately with proper logging
        console.log("Updating search params with programType:", programType || "undefined") // Debug log
        updateSearchParams({
            programType: programType || undefined,
            page: 0,
        })
    }

    const handleProgramSelect = (program: ProgramResponseDTO) => {
        setSelectedProgram(program)
    }

    const handleBackToList = () => {
        setSelectedProgram(null)
    }

    const handleClearFilters = () => {
        clearSearch()
        setSelectedType("")
        updateSearchParams({
            keyword: undefined,
            programType: undefined,
            page: 0,
        })
    }

    if (selectedProgram) {
        return <ProgramDetail program={selectedProgram} onBack={handleBackToList} />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="container mx-auto px-4 py-8 pt-24">
                {/* Hero Header */}
                <div className="text-center mb-16 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-3xl blur-3xl -z-10" />
                    <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-emerald-200/50 dark:border-emerald-700/50">
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <div className="p-3 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full">
                                <Sparkles className="h-8 w-8 text-white" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-slate-800 dark:text-white">
                                Chương Trình Premium
                            </h1>
                        </div>
                        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                            Khám phá các chương trình cai thuốc lá toàn diện được thiết kế bởi các chuyên gia để giúp bạn thành công
                            trong hành trình hướng tới cuộc sống không khói thuốc. Thay đổi thói quen của bạn với các chiến lược đã
                            được chứng minh và hỗ trợ cá nhân hóa.
                        </p>
                        <div className="flex items-center justify-center gap-6 mt-8 text-sm text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                <span>Thiết kế chuyên nghiệp</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4" />
                                <span>Nội dung Premium</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <span>Cập nhật hàng ngày</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Search and Filters */}
                <Card className="mb-8 border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-3 text-xl">
                            <div className="p-2 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg">
                                <Filter className="h-5 w-5 text-white" />
                            </div>
                            Tìm kiếm & Lọc chương trình
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Enhanced Search */}
                            <div className="flex-1">
                                <div className="relative group">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 h-5 w-5 transition-colors" />
                                    <Input
                                        type="text"
                                        placeholder="Tìm kiếm chương trình theo tiêu đề, tên hoặc mô tả..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        className="pl-12 h-12 text-lg border-2 border-slate-200 dark:border-slate-600 focus:border-emerald-500 dark:focus:border-emerald-400 rounded-xl bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all"
                                    />
                                </div>
                            </div>

                            {/* Enhanced Type Filter */}
                            <div className="w-full lg:w-64">
                                <select
                                    value={selectedType}
                                    onChange={(e) => handleTypeFilter(e.target.value)}
                                    className="w-full h-12 px-4 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm text-slate-900 dark:text-white focus:border-emerald-500 dark:focus:border-emerald-400 transition-all"
                                >
                                    <option value="">🎯 Tất cả loại chương trình</option>
                                    {Object.values(ProgramTypeEnum).map((type) => (
                                        <option key={type} value={type}>
                                            📚 {ProgramTypeLabels[type]}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Enhanced View Mode Toggle */}
                            <div className="flex gap-2 bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
                                <Button
                                    variant={viewMode === "grid" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setViewMode("grid")}
                                    className={`rounded-lg transition-all ${viewMode === "grid"
                                        ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg"
                                        : "hover:bg-white/50 dark:hover:bg-slate-600"
                                        }`}
                                >
                                    <Grid className="h-4 w-4 mr-2" />
                                    Lưới
                                </Button>
                                <Button
                                    variant={viewMode === "list" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setViewMode("list")}
                                    className={`rounded-lg transition-all ${viewMode === "list"
                                        ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg"
                                        : "hover:bg-white/50 dark:hover:bg-slate-600"
                                        }`}
                                >
                                    <List className="h-4 w-4 mr-2" />
                                    Danh sách
                                </Button>
                            </div>
                        </div>

                        {/* Enhanced Active Filters */}
                        {(debouncedSearchTerm || selectedType) && (
                            <div className="flex flex-wrap gap-3 mt-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-xl border border-emerald-200/50 dark:border-emerald-700/50">
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Bộ lọc đang áp dụng:</span>
                                {debouncedSearchTerm && (
                                    <Badge
                                        variant="secondary"
                                        className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700 px-3 py-1 rounded-full"
                                    >
                                        🔍 Tìm kiếm: {debouncedSearchTerm}
                                        <button onClick={() => search("")} className="ml-1 hover:text-red-500 transition-colors font-bold">
                                            ×
                                        </button>
                                    </Badge>
                                )}
                                {selectedType && (
                                    <Badge
                                        variant="secondary"
                                        className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700 px-3 py-1 rounded-full"
                                    >
                                        📚 Loại: {ProgramTypeLabels[selectedType]}
                                        <button
                                            onClick={() => handleTypeFilter("")}
                                            className="ml-1 hover:text-red-500 transition-colors font-bold"
                                        >
                                            ×
                                        </button>
                                    </Badge>
                                )}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClearFilters}
                                    className="text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400"
                                >
                                    Xóa tất cả bộ lọc
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>



                {/* Programs List */}
                <ProgramList
                    programs={programs}
                    loading={loading}
                    error={error}
                    pagination={pagination}
                    viewMode={viewMode}
                    onProgramSelect={handleProgramSelect}
                    onPageChange={changePage}
                    onPageSizeChange={changePageSize}
                    onRefresh={refresh}
                />
            </div>
        </div>
    )
}
