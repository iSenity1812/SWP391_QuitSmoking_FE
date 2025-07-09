"use client"
import { ArrowLeft, Calendar, ExternalLink, Play, Share2, BookOpen, Tag, User, Clock, Star, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import type { ProgramResponseDTO } from "@/types/program"

interface ProgramDetailProps {
    program: ProgramResponseDTO
    onBack: () => void
}

export function ProgramDetail({ program, onBack }: ProgramDetailProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
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

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: program.programTitle,
                    text: program.description || "Xem chương trình cai thuốc lá này",
                    url: window.location.href,
                })
            } catch (err) {
                console.log("Lỗi chia sẻ:", err)
            }
        } else {
            navigator.clipboard.writeText(window.location.href)
        }
    }

    const handleContentAccess = () => {
        if (program.contentUrl) {
            window.open(program.contentUrl, "_blank")
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="container mx-auto px-4 py-8 pt-24">
                {/* Enhanced Back Button */}
                <Button
                    variant="outline"
                    onClick={onBack}
                    className="mb-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Quay lại danh sách chương trình
                </Button>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="xl:col-span-2 space-y-8">
                        {/* Enhanced Program Header */}
                        <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-2xl overflow-hidden">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-blue-400/20" />
                                <CardHeader className="relative p-8">
                                    <div className="flex items-start justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="p-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full">
                                                    <BookOpen className="h-6 w-6 text-white" />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Star className="h-5 w-5 text-yellow-500" />
                                                    <Badge className="bg-yellow-500/90 text-yellow-900 border-0">Premium</Badge>
                                                </div>
                                            </div>
                                            <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4 leading-tight">
                                                {program.programTitle}
                                            </h1>
                                            {program.programName && (
                                                <p className="text-xl text-slate-600 dark:text-slate-400 mb-6 font-medium">
                                                    {program.programName}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    <span>{formatDate(program.createdAt)}</span>
                                                </div>
                                                {program.programType && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700"
                                                    >
                                                        <Tag className="h-3 w-3" />
                                                        {program.programType}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleShare}
                                                className="bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm"
                                            >
                                                <Share2 className="h-4 w-4 mr-2" />
                                                Chia sẻ
                                            </Button>
                                            <Button variant="outline" size="sm" className="bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm">
                                                <Heart className="h-4 w-4 mr-2" />
                                                Lưu
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                            </div>
                        </Card>

                        {/* Enhanced Program Image */}
                        {program.programImage && (
                            <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-2xl overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="aspect-video relative overflow-hidden">
                                        <img
                                            src={
                                                program.programImage.startsWith("http")
                                                    ? program.programImage
                                                    : `http://localhost:8080${program.programImage}`
                                            }
                                            alt={program.programTitle}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement
                                                target.style.display = "none"
                                                target.nextElementSibling?.classList.remove("hidden")
                                            }}
                                        />
                                        <div
                                            className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900 dark:to-blue-900 ${program.programImage ? "hidden" : ""}`}
                                        >
                                            <div className="p-8 bg-white/20 dark:bg-slate-800/20 rounded-full backdrop-blur-sm">
                                                <Play className="h-20 w-20 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Enhanced Program Description */}
                        {program.description && (
                            <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-2xl">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3 text-2xl">
                                        <div className="p-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg">
                                            <BookOpen className="h-5 w-5 text-white" />
                                        </div>
                                        Về chương trình này
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose prose-lg dark:prose-invert max-w-none">
                                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap text-lg">
                                            {program.description}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                    </div>

                    {/* Enhanced Sidebar */}
                    <div className="space-y-8">
                        {/* Enhanced Creator Info */}
                        <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-2xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg">
                                        <User className="h-5 w-5 text-white" />
                                    </div>
                                    Tác giả chương trình
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4 mb-6">
                                    <Avatar className="h-16 w-16 ring-4 ring-emerald-200 dark:ring-emerald-700">
                                        <AvatarImage src={program.createdBy.avatar || "/placeholder.svg"} />
                                        <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-lg">
                                            {getInitials(program.createdBy.fullName || program.createdBy.username)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                                            {program.createdBy.fullName || program.createdBy.username}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">@{program.createdBy.username}</p>
                                        <Badge variant="outline" className="mt-1 text-xs">
                                            Chuyên gia tạo nội dung
                                        </Badge>
                                    </div>
                                </div>
                                <Separator className="my-4" />
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                        <User className="h-4 w-4" />
                                        <span>Chuyên gia tạo nội dung chuyên nghiệp</span>
                                    </div>
                                    {program.createdBy.email && (
                                        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                            <span>📧 {program.createdBy.email}</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>



                        {/* Enhanced Program Stats */}
                        <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-2xl">
                            <CardHeader>
                                <CardTitle>Thông tin chương trình</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Tạo lúc:
                                    </span>
                                    <span className="font-medium">{formatDate(program.createdAt)}</span>
                                </div>
                                {program.programType && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                            <Tag className="h-4 w-4" />
                                            Loại:
                                        </span>
                                        <Badge
                                            variant="secondary"
                                            className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                                        >
                                            {program.programType}
                                        </Badge>
                                    </div>
                                )}
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600 dark:text-slate-400">ID chương trình:</span>
                                    <span className="font-mono text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                                        #{program.programId}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>


                    </div>
                </div>
            </div>
        </div>
    )
}
