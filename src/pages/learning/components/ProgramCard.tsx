"use client"
import { Calendar, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { ProgramResponseDTO } from "@/types/program"
import { ProgramTypeLabels } from "@/types/program"

interface ProgramCardProps {
    program: ProgramResponseDTO
    onClick: (program: ProgramResponseDTO) => void
}

export function ProgramCard({ program, onClick }: ProgramCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        })
    }

    const getImageUrl = (imageUrl?: string) => {
        if (!imageUrl) return null // Return null for no image

        if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
            return imageUrl
        }

        if (imageUrl.startsWith("/")) {
            return `${import.meta.env.VITE_API_BASE_URL}${imageUrl}`
        }

        return `${import.meta.env.VITE_API_BASE_URL}/${imageUrl}`
    }

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

    return (
        <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:scale-[1.02]">
            <div className="relative overflow-hidden">
                {getImageUrl(program.programImage) ? (
                    <img
                        src={getImageUrl(program.programImage)! || "/placeholder.svg"}
                        alt={program.programTitle}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement
                            // Show no image background when image fails to load
                            target.style.display = "none"
                            const parent = target.parentElement
                            if (parent) {
                                parent.innerHTML = `
                        <div class="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600">
                            <div class="text-center">
                                <div class="text-4xl mb-2 text-slate-400 dark:text-slate-500">📷</div>
                                <span class="text-sm font-medium text-slate-500 dark:text-slate-400">No Image</span>
                            </div>
                        </div>
                        ${program.programType ? `<div class="absolute top-3 left-3"><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border-0 shadow-lg ${getTypeColor(program.programType)}">${getProgramTypeLabel(program.programType)}</span></div>` : ""}
                    `
                            }
                        }}
                    />
                ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600">
                        <div className="text-center">
                            <div className="text-4xl mb-2 text-slate-400 dark:text-slate-500">📷</div>
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">No Image</span>
                        </div>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {program.programType && (
                    <Badge className={`absolute top-3 left-3 ${getTypeColor(program.programType)} border-0 shadow-lg`}>
                        {getProgramTypeLabel(program.programType)}
                    </Badge>
                )}
            </div>

            <CardHeader className="pb-3">
                <div className="space-y-2">
                    <h3 className="font-bold text-xl text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                        {program.programTitle}
                    </h3>
                    {program.programName && (
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300 line-clamp-1">{program.programName}</p>
                    )}
                </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-4">
                {program.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {program.description}
                    </p>
                )}

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={program.createdBy.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs">
                                {program.createdBy.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{program.createdBy.username}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(program.createdAt)}</span>
                    </div>
                </div>

                <div className="flex gap-2 pt-2">
                    <Button
                        onClick={() => onClick(program)}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
                    >
                        <span className="mr-2">Truy cập chương trình</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
