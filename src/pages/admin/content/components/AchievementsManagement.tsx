"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, Users, Crown, Edit, Trash2, Plus, Target } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface Achievement {
    id: number
    name: string
    description: string
    icon: string
    category: "streak" | "milestone" | "social" | "premium"
    requirements: string
    rarity: "common" | "rare" | "epic" | "legendary"
    unlockedBy: number
    isActive: boolean
    createdAt: string
}

export function AchievementsManagement() {
    const [achievements, setAchievements] = useState<Achievement[]>([
        {
            id: 1,
            name: "Tuần Đầu Tiên",
            description: "Hoàn thành tuần đầu tiên không hút thuốc",
            icon: "🎯",
            category: "streak",
            requirements: "7 ngày liên tiếp không hút thuốc",
            rarity: "common",
            unlockedBy: 1250,
            isActive: true,
            createdAt: "2024-01-01T00:00:00Z",
        },
        {
            id: 2,
            name: "Chiến Binh Một Tháng",
            description: "Vượt qua mốc 30 ngày cai thuốc",
            icon: "🏆",
            category: "milestone",
            requirements: "30 ngày liên tiếp không hút thuốc",
            rarity: "rare",
            unlockedBy: 890,
            isActive: true,
            createdAt: "2024-01-01T00:00:00Z",
        },
        {
            id: 3,
            name: "Người Truyền Cảm Hứng",
            description: "Nhận được 100 lượt thích cho bài chia sẻ",
            icon: "⭐",
            category: "social",
            requirements: "100 lượt thích cho bài viết",
            rarity: "rare",
            unlockedBy: 234,
            isActive: true,
            createdAt: "2024-01-05T00:00:00Z",
        },
    ])

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        icon: "",
        category: "streak" as Achievement["category"],
        requirements: "",
        rarity: "common" as Achievement["rarity"],
    })

    const handleCreateAchievement = () => {
        const newAchievement: Achievement = {
            id: Math.max(...achievements.map((a) => a.id)) + 1,
            name: formData.name,
            description: formData.description,
            icon: formData.icon,
            category: formData.category,
            requirements: formData.requirements,
            rarity: formData.rarity,
            unlockedBy: 0,
            isActive: true,
            createdAt: new Date().toISOString(),
        }
        setAchievements((prev) => [newAchievement, ...prev])
        setIsCreateModalOpen(false)
        resetForm()
    }

    const handleEditAchievement = (achievement: Achievement) => {
        setSelectedAchievement(achievement)
        setFormData({
            name: achievement.name,
            description: achievement.description,
            icon: achievement.icon,
            category: achievement.category,
            requirements: achievement.requirements,
            rarity: achievement.rarity,
        })
        setIsEditModalOpen(true)
    }

    const handleUpdateAchievement = () => {
        if (!selectedAchievement) return
        setAchievements((prev) =>
            prev.map((achievement) =>
                achievement.id === selectedAchievement.id ? { ...achievement, ...formData } : achievement,
            ),
        )
        setIsEditModalOpen(false)
        resetForm()
    }

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            icon: "",
            category: "streak",
            requirements: "",
            rarity: "common",
        })
        setSelectedAchievement(null)
    }

    const handleDeleteAchievement = (achievementId: number) => {
        setAchievements((prev) => prev.filter((achievement) => achievement.id !== achievementId))
    }

    const toggleAchievementStatus = (achievementId: number) => {
        setAchievements((prev) =>
            prev.map((achievement) =>
                achievement.id === achievementId ? { ...achievement, isActive: !achievement.isActive } : achievement,
            ),
        )
    }

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "streak":
                return <Target className="w-4 h-4" />
            case "milestone":
                return <Trophy className="w-4 h-4" />
            case "social":
                return <Users className="w-4 h-4" />
            case "premium":
                return <Crown className="w-4 h-4" />
            default:
                return <Star className="w-4 h-4" />
        }
    }

    const getCategoryColor = (category: string) => {
        switch (category) {
            case "streak":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
            case "milestone":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
            case "social":
                return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
            case "premium":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
        }
    }

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case "common":
                return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
            case "rare":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
            case "epic":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
            case "legendary":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
        }
    }

    return (
        <div className="space-y-6">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-slate-900 dark:text-white">Quản Lý Thành Tựu</CardTitle>
                            <CardDescription className="text-slate-600 dark:text-slate-400">
                                Tạo, chỉnh sửa và quản lý hệ thống thành tựu cho người dùng
                            </CardDescription>
                        </div>
                        <Button onClick={() => setIsCreateModalOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Tạo Thành Tựu Mới
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {achievements.map((achievement) => (
                            <Card
                                key={achievement.id}
                                className={`bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 ${!achievement.isActive ? "opacity-60" : ""
                                    }`}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-2xl">{achievement.icon}</span>
                                            <div className="flex items-center space-x-1">
                                                {getCategoryIcon(achievement.category)}
                                                <Badge className={getCategoryColor(achievement.category)}>
                                                    {achievement.category === "streak"
                                                        ? "Chuỗi ngày"
                                                        : achievement.category === "milestone"
                                                            ? "Mốc quan trọng"
                                                            : achievement.category === "social"
                                                                ? "Xã hội"
                                                                : "Premium"}
                                                </Badge>
                                            </div>
                                        </div>
                                        <Badge className={getRarityColor(achievement.rarity)}>
                                            {achievement.rarity === "common"
                                                ? "Phổ thông"
                                                : achievement.rarity === "rare"
                                                    ? "Hiếm"
                                                    : achievement.rarity === "epic"
                                                        ? "Sử thi"
                                                        : "Huyền thoại"}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-lg text-slate-900 dark:text-white">{achievement.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{achievement.description}</p>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 dark:text-slate-400">Yêu cầu:</span>
                                            <span className="text-slate-700 dark:text-slate-300">{achievement.requirements}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 dark:text-slate-400">Đã mở khóa:</span>
                                            <span className="text-slate-700 dark:text-slate-300">{achievement.unlockedBy} người</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mb-4">
                                        <Badge variant={achievement.isActive ? "default" : "secondary"}>
                                            {achievement.isActive ? "Đang hoạt động" : "Tạm dừng"}
                                        </Badge>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                            {new Date(achievement.createdAt).toLocaleDateString("vi-VN")}
                                        </span>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="flex-1"
                                            onClick={() => handleEditAchievement(achievement)}
                                        >
                                            <Edit className="w-4 h-4 mr-1" />
                                            Sửa
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => toggleAchievementStatus(achievement.id)}
                                            className="flex-1"
                                        >
                                            {achievement.isActive ? "Tạm dừng" : "Kích hoạt"}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleDeleteAchievement(achievement.id)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
            {/* Create Achievement Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Tạo Thành Tựu Mới</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="achievement-name">Tên thành tựu</Label>
                            <Input
                                id="achievement-name"
                                value={formData.name}
                                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                placeholder="Ví dụ: Tuần Đầu Tiên"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="achievement-icon">Icon (Emoji)</Label>
                            <Input
                                id="achievement-icon"
                                value={formData.icon}
                                onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
                                placeholder="🎯"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="achievement-category">Danh mục</Label>
                            <select
                                id="achievement-category"
                                value={formData.category}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, category: e.target.value as Achievement["category"] }))
                                }
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="streak">Chuỗi ngày</option>
                                <option value="milestone">Mốc quan trọng</option>
                                <option value="social">Xã hội</option>
                                <option value="premium">Premium</option>
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="achievement-rarity">Độ hiếm</Label>
                            <select
                                id="achievement-rarity"
                                value={formData.rarity}
                                onChange={(e) => setFormData((prev) => ({ ...prev, rarity: e.target.value as Achievement["rarity"] }))}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="common">Phổ thông</option>
                                <option value="rare">Hiếm</option>
                                <option value="epic">Sử thi</option>
                                <option value="legendary">Huyền thoại</option>
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="achievement-requirements">Yêu cầu</Label>
                            <Input
                                id="achievement-requirements"
                                value={formData.requirements}
                                onChange={(e) => setFormData((prev) => ({ ...prev, requirements: e.target.value }))}
                                placeholder="Ví dụ: 7 ngày liên tiếp không hút thuốc"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="achievement-description">Mô tả</Label>
                            <Textarea
                                id="achievement-description"
                                value={formData.description}
                                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                                placeholder="Mô tả chi tiết về thành tựu..."
                                className="min-h-[100px]"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-4">
                        <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleCreateAchievement} disabled={!formData.name.trim() || !formData.description.trim()}>
                            Tạo Thành Tựu
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Achievement Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Chỉnh Sửa Thành Tựu</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-achievement-name">Tên thành tựu</Label>
                            <Input
                                id="edit-achievement-name"
                                value={formData.name}
                                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                placeholder="Ví dụ: Tuần Đầu Tiên"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-achievement-icon">Icon (Emoji)</Label>
                            <Input
                                id="edit-achievement-icon"
                                value={formData.icon}
                                onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
                                placeholder="🎯"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-achievement-category">Danh mục</Label>
                            <select
                                id="edit-achievement-category"
                                value={formData.category}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, category: e.target.value as Achievement["category"] }))
                                }
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="streak">Chuỗi ngày</option>
                                <option value="milestone">Mốc quan trọng</option>
                                <option value="social">Xã hội</option>
                                <option value="premium">Premium</option>
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-achievement-rarity">Độ hiếm</Label>
                            <select
                                id="edit-achievement-rarity"
                                value={formData.rarity}
                                onChange={(e) => setFormData((prev) => ({ ...prev, rarity: e.target.value as Achievement["rarity"] }))}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="common">Phổ thông</option>
                                <option value="rare">Hiếm</option>
                                <option value="epic">Sử thi</option>
                                <option value="legendary">Huyền thoại</option>
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-achievement-requirements">Yêu cầu</Label>
                            <Input
                                id="edit-achievement-requirements"
                                value={formData.requirements}
                                onChange={(e) => setFormData((prev) => ({ ...prev, requirements: e.target.value }))}
                                placeholder="Ví dụ: 7 ngày liên tiếp không hút thuốc"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-achievement-description">Mô tả</Label>
                            <Textarea
                                id="edit-achievement-description"
                                value={formData.description}
                                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                                placeholder="Mô tả chi tiết về thành tựu..."
                                className="min-h-[100px]"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-4">
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleUpdateAchievement} disabled={!formData.name.trim() || !formData.description.trim()}>
                            Cập Nhật
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
