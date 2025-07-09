"use client"
import { Calendar, ExternalLink, Play, Clock, Star } from "lucide-react"
import type React from "react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { ProgramResponseDTO } from "@/types/program"

interface ProgramCardProps {
    program: ProgramResponseDTO
    viewMode: "grid" | "list"
    onClick: () => void
}

export function ProgramCard({ program, viewMode, onClick }: ProgramCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word.charAt(0))
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    const handleContentClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (program.contentUrl) {
            window.open(program.contentUrl, "_blank")
        }
    }

    if (viewMode === "list") {
        return (
            <Card
                className="hover:shadow-2xl transition-all duration-500 cursor-pointer group border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 overflow-hidden"
                onClick={onClick}
            >
                <CardContent className="p-8">
                    <div className="flex gap-8">
                        {/* Enhanced Program Image */}
                        <div className="flex-shrink-0">
                            <div className="w-40 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-100 via-blue-100 to-purple-100 dark:from-emerald-900 dark:via-blue-900 dark:to-purple-900 shadow-lg group-hover:shadow-xl transition-all duration-500 relative">
                                {program.programImage ? (
                                    <img
                                        src={
                                            program.programImage.startsWith("http")
                                                ? program.programImage
                                                : `http://localhost:8080${program.programImage}`
                                        }
                                        alt={program.programTitle}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement
                                            target.style.display = "none"
                                            target.nextElementSibling?.classList.remove("hidden")
                                        }}
                                    />
                                ) : null}
                                <div
                                    className={`w-full h-full flex items-center justify-center ${program.programImage ? "hidden" : ""}`}
                                >
                                    <div className="p-4 bg-white/20 dark:bg-slate-800/20 rounded-full backdrop-blur-sm">
                                        <Play className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                </div>
                                {program.programType && (
                                    <Badge className="absolute top-3 right-3 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white border-0 shadow-lg">
                                        {program.programType}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Enhanced Program Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                                        {program.programTitle}
                                    </h3>
                                    {program.programName && (
                                        <p className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-3">{program.programName}</p>
                                    )}
                                </div>
                            </div>

                            {program.description && (
                                <p className="text-slate-600 dark:text-slate-300 text-base mb-6 line-clamp-3 leading-relaxed">
                                    {program.description}
                                </p>
                            )}

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8 ring-2 ring-emerald-200 dark:ring-emerald-700">
                                            <AvatarImage src={program.createdBy.avatar || "/placeholder.svg"} />
                                            <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white text-sm">
                                                {getInitials(program.createdBy.fullName || program.createdBy.username)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-slate-700 dark:text-slate-300">
                                                {program.createdBy.fullName || program.createdBy.username}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Tác giả chương trình</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>{formatDate(program.createdAt)}</span>
                                    </div>
                                </div>

                                {program.contentUrl && (
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        onClick={handleContentClick}
                                        className="bg-gradient-to-br from-emerald-400 to-emerald-600 hover:from-emerald-600 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        Xem nội dung
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card
            className="hover:shadow-2xl transition-all duration-500 cursor-pointer group overflow-hidden border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 hover:-translate-y-2"
            onClick={onClick}
        >
            {/* Enhanced Program Image */}
            <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-emerald-100 via-blue-100 to-purple-100 dark:from-emerald-900 dark:via-blue-900 dark:to-purple-900">
                {program.programImage ? (
                    <img
                        src={
                            program.programImage.startsWith("http")
                                ? program.programImage
                                : `http://localhost:8080${program.programImage}`
                        }
                        alt={program.programTitle}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = "none"
                            target.nextElementSibling?.classList.remove("hidden")
                        }}
                    />
                ) : null}
                <div className={`absolute inset-0 flex items-center justify-center ${program.programImage ? "hidden" : ""}`}>
                    <div className="p-6 bg-white/20 dark:bg-slate-800/20 rounded-full backdrop-blur-sm">
                        <Play className="h-16 w-16 text-emerald-600 dark:text-emerald-400" />
                    </div>
                </div>

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {program.programType && (
                    <Badge className="absolute top-4 right-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white border-0 shadow-lg backdrop-blur-sm">
                        {program.programType}
                    </Badge>
                )}

                {/* Premium indicator */}
                <div className="absolute top-4 left-4 flex items-center gap-1 bg-yellow-500/90 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                    <Star className="h-3 w-3" />
                    Premium
                </div>
            </div>

            <CardHeader className="pb-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-tight">
                    {program.programTitle}
                </h3>
                {program.programName && (
                    <p className="text-base font-medium text-slate-600 dark:text-slate-400 line-clamp-1">{program.programName}</p>
                )}
            </CardHeader>

            <CardContent className="pt-0">
                {program.description && (
                    <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 line-clamp-3 leading-relaxed">
                        {program.description}
                    </p>
                )}

                <div className="flex items-center justify-between mb-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 ring-2 ring-emerald-200 dark:ring-emerald-700">
                            <AvatarImage src={program.createdBy.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-sm">
                                {getInitials(program.createdBy.fullName || program.createdBy.username)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                                {program.createdBy.fullName || program.createdBy.username}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                <Clock className="h-3 w-3" />
                                <span>{formatDate(program.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {program.contentUrl && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={handleContentClick}
                    >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Truy cập chương trình
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}
