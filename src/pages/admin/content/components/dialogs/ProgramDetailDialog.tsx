"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, User, Link, FileText } from "lucide-react"
import type { ProgramResponseDTO } from "@/types/program"

interface ProgramDetailDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    program: ProgramResponseDTO
}

export function ProgramDetailDialog({ open, onOpenChange, program }: ProgramDetailDialogProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const getImageUrl = (imageUrl?: string) => {
        if (!imageUrl) return null

        if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
            return imageUrl
        }

        if (imageUrl.startsWith("/")) {
            return `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}${imageUrl}`
        }

        return `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/${imageUrl}`
    }

    const getTypeColor = (type?: string) => {
        const colors: Record<string, string> = {
            Meditation: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
            Exercise: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
            Nutrition: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
            Therapy: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
            "Support Group": "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300",
            Educational: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
            Mindfulness: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300",
            Behavioral: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
        }
        return colors[type || ""] || "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <FileText className="h-6 w-6" />
                        Chi tiết chương trình
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-8">
                    {/* Program Image */}
                    {program.programImage && (
                        <div className="w-full">
                            <img
                                src={getImageUrl(program.programImage) || "/placeholder.svg"}
                                alt={program.programTitle}
                                className="w-full h-64 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    if (!target.src.includes("placeholder.svg")) {
                                        target.src = "/placeholder.svg?height=256&width=512"
                                    }
                                }}
                            />
                        </div>
                    )}

                    {/* Program Title and Type */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{program.programTitle}</h1>
                            {program.programType && (
                                <Badge className={`${getTypeColor(program.programType)} text-sm px-3 py-1`}>
                                    {program.programType}
                                </Badge>
                            )}
                        </div>

                        {program.programName && (
                            <h2 className="text-xl text-gray-700 dark:text-gray-300 font-medium">{program.programName}</h2>
                        )}
                    </div>

                    {/* Program Description */}
                    {program.description && (
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Mô tả
                            </h3>
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {program.description}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Content URL */}
                    {program.contentUrl && (
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Link className="h-5 w-5" />
                                Liên kết nội dung
                            </h3>
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <a
                                    href={program.contentUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline break-all"
                                >
                                    {program.contentUrl}
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Program Metadata */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Created By */}
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Người tạo
                            </h3>
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={program.createdBy.avatar || "/placeholder.svg"} />
                                        <AvatarFallback className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                                            {program.createdBy.username.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{program.createdBy.username}</p>
                                        {program.createdBy.fullName && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{program.createdBy.fullName}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Created Date */}
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Ngày tạo
                            </h3>
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <p className="text-gray-700 dark:text-gray-300">{formatDate(program.createdAt)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Updated Date */}
                    {program.updatedAt && program.updatedAt !== program.createdAt && (
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Cập nhật lần cuối
                            </h3>
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <p className="text-gray-700 dark:text-gray-300">{formatDate(program.updatedAt)}</p>
                            </div>
                        </div>
                    )}

                    {/* Program ID */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">ID Chương trình</h3>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <p className="text-gray-700 dark:text-gray-300 font-mono">{program.programId}</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                        onClick={() => onOpenChange(false)}
                        className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                        Đóng
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
