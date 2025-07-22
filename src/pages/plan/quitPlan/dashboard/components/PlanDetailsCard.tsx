import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Edit3, Save, RotateCcw } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { QuitPlanCalculator } from "@/utils/QuitPlanCalculator"
import { quitPlanService } from "@/services/quitPlanService"

// Temporary interface and function - should be imported from types and utils
interface QuitPlanUpdateRequestDTO {
    targetCigarettesPerDay?: number
    notes?: string
    cigarettesPerPack?: number
    pricePerPack?: number
}

const toast = {
    success: (message: string) => console.log('Success:', message),
    error: (message: string) => console.error('Error:', message)
}

interface PlanDetailsCardProps {
    quitPlan: {
        id: string
        targetCigarettesPerDay: number
        currentCigarettesPerDay: number
        quitDate: string
        currentPhase: string
        status: string
        notes?: string
        createdAt: string
        daysWithoutSmoking: number
        startDate: string
        goalDate: string
        reductionType: string
        initialSmokingAmount: number
        cigarettesPerPack: number
        pricePerPack: number
    }
    refetchQuitPlan: () => void
    onRestartPlan: () => void
    isRestarting: boolean
}

export function PlanDetailsCard({ quitPlan, refetchQuitPlan, onRestartPlan, isRestarting }: PlanDetailsCardProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [editData, setEditData] = useState({
        cigarettesPerPack: quitPlan.cigarettesPerPack,
        pricePerPack: quitPlan.pricePerPack,
    })

    const daysSinceStart = QuitPlanCalculator.getDaysSinceStart(quitPlan.startDate)
    const totalDays = QuitPlanCalculator.getTotalDays(quitPlan.startDate, quitPlan.goalDate)

    const getStatusColor = (status: string) => {
        switch (status) {
            case "IN_PROGRESS":
                return "bg-blue-100 text-blue-800"
            case "COMPLETED":
                return "bg-green-100 text-green-800"
            case "FAILED":
                return "bg-red-100 text-red-800"
            case "NOT_STARTED":
                return "bg-gray-100 text-gray-800"
            case "RESTARTED":
                return "bg-yellow-100 text-yellow-800"
            case "ABANDONED":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "IN_PROGRESS":
                return "Đang tiến hành"
            case "COMPLETED":
                return "Hoàn thành"
            case "FAILED":
                return "Thất bại"
            case "NOT_STARTED":
                return "Chưa bắt đầu"
            case "RESTARTED":
                return "Đã khởi động lại"
            case "ABANDONED":
                return "Đã từ bỏ"
            default:
                return status
        }
    }

    const getReductionTypeLabel = (type: string) => {
        switch (type) {
            case "IMMEDIATE":
                return "Dừung Hoàn Toàn"
            case "LINEAR":
                return "Giảm Dần - Giảm Đều"
            case "EXPONENTIAL":
                return "Giảm Dần - Khởi Đầu Mạnh"
            case "LOGARITHMIC":
                return "Giảm Dần - Khởi Đầu Nhẹ"
            default:
                return type
        }
    }

    const isValidCigarettesPerPack = (value: number) => value >= 0 && value <= 50
    const isValidPricePerPack = (value: number) => value >= 1 && value <= 999999

    const handleSaveEdit = async () => {
        if (!isValidCigarettesPerPack(editData.cigarettesPerPack)) {
            toast.error("Số điếu trong gói phải từ 0 đến 50")
            return
        }

        if (!isValidPricePerPack(editData.pricePerPack)) {
            toast.error("Giá tiền mỗi gói phải từ 1 đến 999,999 VND")
            return
        }

        setIsSaving(true)
        try {
            const updateData: QuitPlanUpdateRequestDTO = {
                cigarettesPerPack: editData.cigarettesPerPack,
                pricePerPack: editData.pricePerPack,
            }

            await quitPlanService.updateCurrentQuitPlan(updateData)
            await refetchQuitPlan()
            setIsEditing(false)
            toast.success("Đã cập nhật thông tin kế hoạch thành công!")
        } catch (error) {
            console.error("Error updating quit plan:", error)
            toast.error("Không thể cập nhật kế hoạch. Vui lòng thử lại sau")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="border border-emerald-400">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                            <Calendar className="w-5 h-5" />
                            Chi tiết kế hoạch
                        </CardTitle>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    if (isEditing) {
                                        setEditData({
                                            cigarettesPerPack: quitPlan.cigarettesPerPack,
                                            pricePerPack: quitPlan.pricePerPack,
                                        })
                                    }
                                    setIsEditing(!isEditing)
                                }}
                                disabled={isSaving}
                            >
                                <Edit3 className="w-4 h-4 mr-2" />
                                {isEditing ? "Hủy" : "Sửa"}
                            </Button>
                            {isEditing && (
                                <div className="flex justify-end">
                                    <Button
                                        onClick={handleSaveEdit}
                                        size="sm"
                                        variant={"outline"}
                                        disabled={
                                            isSaving ||
                                            !isValidCigarettesPerPack(editData.cigarettesPerPack) ||
                                            !isValidPricePerPack(editData.pricePerPack)
                                        }
                                        className="text-emerald-500 border border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        {isSaving ? "Đang lưu..." : "Lưu chỉnh sửa"}
                                    </Button>
                                </div>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onRestartPlan}
                                className="text-orange-600 border-orange-300 hover:bg-orange-50 bg-transparent"
                                disabled={isSaving || isRestarting}
                            >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Khởi động lại
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <Label className="text-sm text-gray-600">Loại kế hoạch</Label>
                            <div className="font-medium">{getReductionTypeLabel(quitPlan.reductionType)}</div>
                        </div>
                        <div>
                            <Label className="text-sm text-gray-600 mr-3">Trạng thái</Label>
                            <Badge className={getStatusColor(quitPlan.status)}>{getStatusLabel(quitPlan.status)}</Badge>
                        </div>
                        <div>
                            <Label className="text-sm text-gray-600">Ngày bắt đầu</Label>
                            <div className="font-medium">{new Date(quitPlan.startDate).toLocaleDateString('vi-VN')}</div>
                        </div>
                        <div>
                            <Label className="text-sm text-gray-600">Ngày mục tiêu</Label>
                            <div className="font-medium">{new Date(quitPlan.goalDate).toLocaleDateString('vi-VN')}</div>
                        </div>
                        <div>
                            <Label className="text-sm text-gray-600">Lượng hút ban đầu</Label>
                            <div className="font-medium">{quitPlan.initialSmokingAmount} điếu/ngày</div>
                        </div>
                        <div>
                            <Label className="text-sm text-gray-600">Tiến độ</Label>
                            <div className="font-medium">
                                {daysSinceStart + 1}/{totalDays} ngày ({(((daysSinceStart + 1) / totalDays) * 100).toFixed(1)}%)
                            </div>
                        </div>
                        <div>
                            <Label className="text-sm text-gray-600">Số điếu trong gói</Label>
                            {isEditing ? (
                                <div className="space-y-1">
                                    <Input
                                        type="number"
                                        min="1"
                                        max="50"
                                        value={editData.cigarettesPerPack}
                                        onChange={(e) => {
                                            const value = Number.parseInt(e.target.value) || 0
                                            const constrainedValue = Math.max(1, Math.min(50, value))
                                            setEditData({
                                                ...editData,
                                                cigarettesPerPack: constrainedValue,
                                            })
                                        }}
                                        className={`h-8 ${!isValidCigarettesPerPack(editData.cigarettesPerPack)
                                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                            : "border-green-300 focus:border-green-500 focus:ring-green-500"
                                            }`}
                                        disabled={isSaving}
                                        placeholder="1-50"
                                    />
                                    <p className="text-xs text-gray-500">Từ 1 đến 50 điếu</p>
                                </div>
                            ) : (
                                <div className="font-medium">{quitPlan.cigarettesPerPack} điếu</div>
                            )}
                        </div>
                        <div>
                            <Label className="text-sm text-gray-600">Giá tiền mỗi gói</Label>
                            {isEditing ? (
                                <div className="space-y-1">
                                    <Input
                                        type="number"
                                        min="1"
                                        max="999999"
                                        step="1000"
                                        value={editData.pricePerPack}
                                        onChange={(e) => {
                                            const value = Number.parseFloat(e.target.value) || 1
                                            const constrainedValue = Math.max(1, Math.min(999999, value))
                                            setEditData({
                                                ...editData,
                                                pricePerPack: constrainedValue,
                                            })
                                        }}
                                        className={`h-8 ${!isValidPricePerPack(editData.pricePerPack)
                                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                            : "border-green-300 focus:border-green-500 focus:ring-green-500"
                                            }`}
                                        disabled={isSaving}
                                        placeholder="1-999,999"
                                    />
                                    <p className="text-xs text-gray-500">Từ 1 đến 999,999 VND</p>
                                </div>
                            ) : (
                                <div className="font-medium">{quitPlan.pricePerPack.toLocaleString('vi-VN')} VND</div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
