"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, Users, Crown, Edit, Trash2, Plus, Target } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { achievementService } from '@/services/achievementService'
import { toast } from 'react-toastify';
import type { Achievement } from '@/types/achievement';

export function AchievementsManagement() {
    const [achievements, setAchievements] = useState<Achievement[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        icon: "",
        achievementType: "DAYS_QUIT" as Achievement["achievementType"],
        requirements: "",
        milestoneValue: 1,
    })

    // Fetch achievements from backend
    const fetchAchievements = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await achievementService.getAllAchievements()
            setAchievements(data)
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'Lỗi khi tải danh sách thành tựu')
            } else {
                setError('Lỗi khi tải danh sách thành tựu')
            }
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchAchievements()
    }, [fetchAchievements])

    const handleCreateAchievement = async () => {
        if (!formData.name.trim()) {
            toast.error('Tên thành tựu không được để trống')
            return
        }
        if (!formData.milestoneValue || isNaN(Number(formData.milestoneValue))) {
            toast.error('Milestone (giá trị mốc) phải là số và không được để trống')
            return
        }
        setLoading(true)
        try {
            const payload = {
                achievementType: formData.achievementType,
                name: formData.name,
                icon: formData.icon,
                description: formData.description,
                milestoneValue: formData.milestoneValue,
                requirements: formData.requirements,
            };
            await achievementService.createAchievement(payload)
            toast.success('Tạo thành tựu thành công!')
            setIsCreateModalOpen(false)
            resetForm()
            fetchAchievements()
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message || 'Tạo thành tựu thất bại')
            } else {
                toast.error('Tạo thành tựu thất bại')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleEditAchievement = (achievement: Achievement) => {
        setSelectedAchievement(achievement)
        setFormData({
            name: achievement.name || "",
            description: achievement.description || "",
            icon: achievement.icon || "",
            achievementType: achievement.achievementType || "DAYS_QUIT",
            requirements: achievement.requirements || "",
            milestoneValue: achievement.milestoneValue || 1,
        })
        setIsEditModalOpen(true)
    }

    const handleUpdateAchievement = async () => {
        if (!selectedAchievement) return
        if (!formData.name.trim()) {
            toast.error('Tên thành tựu không được để trống')
            return
        }
        setLoading(true)
        try {
            await achievementService.updateAchievement(selectedAchievement.achievementId || selectedAchievement.id || 0, formData)
            toast.success('Cập nhật thành tựu thành công!')
            setIsEditModalOpen(false)
            resetForm()
            fetchAchievements()
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message || 'Cập nhật thành tựu thất bại')
            } else {
                toast.error('Cập nhật thành tựu thất bại')
            }
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            icon: "",
            achievementType: "DAYS_QUIT",
            requirements: "",
            milestoneValue: 1,
        })
        setSelectedAchievement(null)
    }

    const handleDeleteAchievement = async (achievementId: number) => {
        if (!confirm("Bạn có chắc chắn muốn xóa thành tựu này?")) return
        setLoading(true)
        try {
            await achievementService.deleteAchievement(achievementId)
            toast.success('Xóa thành tựu thành công!')
            fetchAchievements()
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message || 'Xóa thành tựu thất bại')
            } else {
                toast.error('Xóa thành tựu thất bại')
            }
        } finally {
            setLoading(false)
        }
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

    const getTypeLabel = (type: Achievement["achievementType"]) => {
        switch (type) {
            case "DAYS_QUIT":
                return "Ngày cai thuốc"
            case "MONEY_SAVED":
                return "Tiền tiết kiệm"
            case "CIGARETTES_NOT_SMOKED":
                return "Điếu không hút"
            case "CRAVING_RESISTED":
                return "Chống chọi cơn thèm"
            case "DAILY":
                return "Hàng ngày"
            case "WEEKLY_GOAL":
                return "Mục tiêu tuần"
            case "GOAL_STREAK":
                return "Chuỗi mục tiêu"
            case "RESILIENCE":
                return "Kiên trì"
            case "HEALTH":
                return "Sức khỏe"
            case "SOCIAL":
                return "Cộng đồng"
            case "SPECIAL":
                return "Đặc biệt"
            default:
                return "Khác"
        }
    }

    if (loading && achievements.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-400">Đang tải danh sách thành tựu...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600 dark:text-red-400">{error}</p>
                <Button onClick={fetchAchievements} className="mt-4">
                    Thử lại
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Trophy className="w-6 h-6 text-yellow-600" />
                                Quản Lý Thành Tựu
                            </CardTitle>
                            <CardDescription>
                                Quản lý các thành tựu trong hệ thống
                            </CardDescription>
                        </div>
                        <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Tạo Thành Tựu
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {achievements.map((achievement) => (
                            <Card
                                key={achievement.achievementId || achievement.id}
                                className="bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600"
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-2xl">{achievement.icon || "🏆"}</span>
                                            <div className="flex items-center space-x-1">
                                                {getCategoryIcon(achievement.achievementType || "")}
                                                <Badge className={getCategoryColor(achievement.achievementType || "")}>
                                                    {getTypeLabel(achievement.achievementType)}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <CardTitle className="text-lg text-slate-900 dark:text-white">{achievement.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{achievement.description || "Không có mô tả"}</p>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 dark:text-slate-400">Yêu cầu:</span>
                                            <span className="text-slate-700 dark:text-slate-300">{achievement.requirements || "Không có"}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 dark:text-slate-400">Giá trị mốc:</span>
                                            <span className="text-slate-700 dark:text-slate-300">{achievement.milestoneValue || 0}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                            {achievement.createdAt ? new Date(achievement.createdAt).toLocaleDateString("vi-VN") : "Không có ngày tạo"}
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
                                            onClick={() => handleDeleteAchievement(achievement.achievementId || achievement.id || 0)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            Xóa
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {achievements.length === 0 && (
                        <div className="text-center py-12">
                            <Trophy className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
                                Chưa có thành tựu nào
                            </h3>
                            <p className="text-slate-500 dark:text-slate-500 mb-4">
                                Tạo thành tựu đầu tiên để bắt đầu
                            </p>
                            <Button onClick={() => setIsCreateModalOpen(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Tạo Thành Tựu
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Create Achievement Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Tạo Thành Tựu Mới</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Tên thành tựu</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Nhập tên thành tựu"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Mô tả</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Nhập mô tả thành tựu"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="icon">Biểu tượng</Label>
                            <Input
                                id="icon"
                                value={formData.icon}
                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                placeholder="Nhập emoji hoặc icon"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="achievementType">Loại thành tựu</Label>
                            <select
                                id="achievementType"
                                value={formData.achievementType}
                                onChange={(e) => setFormData({ ...formData, achievementType: e.target.value as Achievement["achievementType"] })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-md dark:border-slate-600 dark:bg-slate-700"
                            >
                                <option value="DAYS_QUIT">Ngày cai thuốc</option>
                                <option value="MONEY_SAVED">Tiền tiết kiệm</option>
                                <option value="CIGARETTES_NOT_SMOKED">Điếu không hút</option>
                                <option value="CRAVING_RESISTED">Chống chọi cơn thèm</option>
                                <option value="DAILY">Hàng ngày</option>
                                <option value="WEEKLY_GOAL">Mục tiêu tuần</option>
                                <option value="GOAL_STREAK">Chuỗi mục tiêu</option>
                                <option value="RESILIENCE">Kiên trì</option>
                                <option value="HEALTH">Sức khỏe</option>
                                <option value="SOCIAL">Cộng đồng</option>
                                <option value="SPECIAL">Đặc biệt</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="requirements">Yêu cầu</Label>
                            <Input
                                id="requirements"
                                value={formData.requirements}
                                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                placeholder="Nhập yêu cầu để đạt thành tựu"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="milestoneValue">Giá trị mốc</Label>
                            <Input
                                id="milestoneValue"
                                type="number"
                                value={formData.milestoneValue}
                                onChange={(e) => setFormData({ ...formData, milestoneValue: parseInt(e.target.value) || 1 })}
                                placeholder="Nhập giá trị mốc"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleCreateAchievement} disabled={loading}>
                            {loading ? "Đang tạo..." : "Tạo"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Achievement Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Chỉnh Sửa Thành Tựu</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Tên thành tựu</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Nhập tên thành tựu"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Mô tả</Label>
                            <Textarea
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Nhập mô tả thành tựu"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-icon">Biểu tượng</Label>
                            <Input
                                id="edit-icon"
                                value={formData.icon}
                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                placeholder="Nhập emoji hoặc icon"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-achievementType">Loại thành tựu</Label>
                            <select
                                id="edit-achievementType"
                                value={formData.achievementType}
                                onChange={(e) => setFormData({ ...formData, achievementType: e.target.value as Achievement["achievementType"] })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-md dark:border-slate-600 dark:bg-slate-700"
                            >
                                <option value="DAYS_QUIT">Ngày cai thuốc</option>
                                <option value="MONEY_SAVED">Tiền tiết kiệm</option>
                                <option value="CIGARETTES_NOT_SMOKED">Điếu không hút</option>
                                <option value="CRAVING_RESISTED">Chống chọi cơn thèm</option>
                                <option value="DAILY">Hàng ngày</option>
                                <option value="WEEKLY_GOAL">Mục tiêu tuần</option>
                                <option value="GOAL_STREAK">Chuỗi mục tiêu</option>
                                <option value="RESILIENCE">Kiên trì</option>
                                <option value="HEALTH">Sức khỏe</option>
                                <option value="SOCIAL">Cộng đồng</option>
                                <option value="SPECIAL">Đặc biệt</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-requirements">Yêu cầu</Label>
                            <Input
                                id="edit-requirements"
                                value={formData.requirements}
                                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                placeholder="Nhập yêu cầu để đạt thành tựu"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-milestoneValue">Giá trị mốc</Label>
                            <Input
                                id="edit-milestoneValue"
                                type="number"
                                value={formData.milestoneValue}
                                onChange={(e) => setFormData({ ...formData, milestoneValue: parseInt(e.target.value) || 1 })}
                                placeholder="Nhập giá trị mốc"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleUpdateAchievement} disabled={loading}>
                            {loading ? "Đang cập nhật..." : "Cập nhật"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}