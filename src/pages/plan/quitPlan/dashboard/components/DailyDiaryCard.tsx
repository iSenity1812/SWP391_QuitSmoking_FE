import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Clock, ChevronUp, ChevronDown, Edit } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { QuitPlanCalculator } from "@/utils/QuitPlanCalculator"
import { getVietnameseTranslation } from "@/utils/enumTranslations"
import type { ReductionQuitPlanType } from "@/services/quitPlanService"
import type { Mood, DailySummaryResponse } from "@/services/dailySummaryService"

interface EnhancedDailyRecord {
    dailySummaryId?: number
    date: string
    totalSmokedCount?: number | null
    totalCravingCount?: number | null
    mood?: string
    note?: string
}

interface DailyDiaryCardProps {
    actualRecords: EnhancedDailyRecord[]
    isRecentDataLoading: boolean
    recentDataError: string | null
    hasDataForToday: boolean
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
        reductionType: ReductionQuitPlanType
        initialSmokingAmount: number
    }
    onOpenDiaryModal: () => void
    openEditDialog: (record: DailySummaryResponse) => void
}

export function DailyDiaryCard({
    actualRecords,
    isRecentDataLoading,
    recentDataError,
    hasDataForToday,
    quitPlan,
    onOpenDiaryModal,
    openEditDialog
}: DailyDiaryCardProps) {
    const [showRecords, setShowRecords] = useState(false)

    // Convert EnhancedDailyRecord to DailySummaryResponse for editing
    const convertToEditableRecord = (record: EnhancedDailyRecord): DailySummaryResponse => {
        return {
            dailySummaryId: record.dailySummaryId || 0,
            totalSmokedCount: record.totalSmokedCount || 0,
            totalCravingCount: record.totalCravingCount || 0,
            trackDate: record.date,
            mood: record.mood as Mood | undefined,
            note: record.note,
            moneySaved: 0, // Default value, will be calculated by backend
            isGoalAchievedToday: false // Default value, will be calculated by backend
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
        >
            <Card className="overflow-hidden border border-slate-300">
                <CardHeader className="mb-10">
                    <div className="flex items-center justify-between py-8">
                        <div className="space-y-3">
                            <CardTitle className="flex items-center gap-2 text-3xl font-bold">
                                Nhật Ký Cai Thuốc Của Bạn
                            </CardTitle>
                            <p className="text-md text-gray-600">
                                Theo dõi hành trình mỗi ngày bạn đã trải qua!
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <Button
                                onClick={onOpenDiaryModal}
                                size="lg"
                                className="px-6 py-3 mr-3 text-base font-medium bg-foreground"
                            >
                                <Plus className="w-5 h-5" /> Ghi Nhận Nhật Ký
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="space-y-4">
                        <div className="border-t pt-4">
                            <Button
                                onClick={() => setShowRecords(!showRecords)}
                                variant="ghost"
                                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                            >
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-600" />
                                    <span className="font-medium text-gray-700">Xem các nhật ký đã ghi nhận</span>
                                    {actualRecords && actualRecords.length > 0 && (
                                        <Badge variant="secondary" className="ml-2">
                                            {actualRecords.length} ghi nhận
                                        </Badge>
                                    )}
                                </div>
                                {showRecords ? (
                                    <ChevronUp className="w-4 h-4 text-gray-400" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                )}
                            </Button>

                            <AnimatePresence>
                                {showRecords && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-3 space-y-4 max-h-[400px] overflow-y-auto">
                                            {isRecentDataLoading ? (
                                                <div className="text-center py-4 text-gray-500">
                                                    Đang tải dữ liệu...
                                                </div>
                                            ) : recentDataError ? (
                                                <div className="text-center py-4 text-red-500">
                                                    Lỗi khi tải dữ liệu ghi nhận
                                                </div>
                                            ) : actualRecords && actualRecords.length > 0 ? (
                                                <div className="max-h-64 overflow-y-auto space-y-3">
                                                    {actualRecords
                                                        .sort((a: EnhancedDailyRecord, b: EnhancedDailyRecord) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                                        // .slice(0, 3)
                                                        .map((dayData: EnhancedDailyRecord, index: number) => {
                                                            const daysSincePlanStart = QuitPlanCalculator.getDaysBetweenDates(quitPlan.startDate, dayData.date)
                                                            const totalDaysInPlan = QuitPlanCalculator.getTotalDays(quitPlan.startDate, quitPlan.goalDate)
                                                            const recommendedLimit = QuitPlanCalculator.calculateDailyLimit(
                                                                quitPlan.reductionType,
                                                                quitPlan.initialSmokingAmount,
                                                                daysSincePlanStart,
                                                                totalDaysInPlan
                                                            )
                                                            const goalMet = (dayData.totalSmokedCount || 0) <= recommendedLimit
                                                            const isToday = new Date(dayData.date).toDateString() === new Date().toDateString()

                                                            return (
                                                                <motion.div
                                                                    key={dayData.date}
                                                                    className="border rounded-lg p-4 bg-gray-50 mb-3"
                                                                    initial={{ opacity: 0, y: 10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    transition={{ delay: index * 0.1 }}
                                                                >
                                                                    <div className="flex items-center justify-between mb-3">
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="font-medium">{new Date(dayData.date).toLocaleDateString('vi-VN')}</div>
                                                                            {isToday && (
                                                                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-300">
                                                                                    Hôm nay
                                                                                </Badge>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <Badge
                                                                                variant={goalMet ? "default" : "destructive"}
                                                                                className={`text-xs ${goalMet ? "bg-green-100 text-green-700 border-green-300" : "bg-red-100 text-red-700 border-red-300"}`}
                                                                            >
                                                                                {goalMet ? "✓ Đạt mục tiêu" : "✗ Vượt mức"}
                                                                            </Badge>
                                                                            <Button variant="outline" size="sm" onClick={() => openEditDialog(convertToEditableRecord(dayData))}>
                                                                                <Edit className="w-4 h-4 mr-1" /> Sửa
                                                                            </Button>
                                                                        </div>
                                                                    </div>

                                                                    <div className="text-sm">
                                                                        <div className="grid grid-cols-12 gap-4">
                                                                            <div className="col-span-2">
                                                                                <span className="text-gray-600">Tổng số lần hút:</span>
                                                                                <span className="ml-1 font-medium text-slate-700">
                                                                                    {dayData.totalSmokedCount || 0}
                                                                                </span>
                                                                            </div>
                                                                            <div className="col-span-2">
                                                                                <span className="text-gray-600">Tổng số lần thèm:</span>
                                                                                <span className="ml-1 font-medium text-slate-700">
                                                                                    {dayData.totalCravingCount || 0}
                                                                                </span>
                                                                            </div>
                                                                            <div className="ml-10 col-span-8">
                                                                                <div className="grid grid-cols-3 gap-4">
                                                                                    <div className="col-span-1">
                                                                                        <span className="text-gray-600">Tâm trạng:</span>
                                                                                        <span className="ml-1 font-medium text-blue-600">
                                                                                            {dayData.mood ? getVietnameseTranslation(dayData.mood as Mood) : "Không xác định"}
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className=" ml-7 col-span-2">
                                                                                        <span className="text-gray-600">Ghi chú:</span>
                                                                                        {dayData.note && dayData.note.length > 0 ? (
                                                                                            dayData.note.length > 40 ? (
                                                                                                <Tooltip>
                                                                                                    <TooltipTrigger asChild>
                                                                                                        <span className="ml-1 font-medium text-gray-700 cursor-help underline decoration-dotted">
                                                                                                            {dayData.note.substring(0, 40) + "..."}
                                                                                                        </span>
                                                                                                    </TooltipTrigger>
                                                                                                    <TooltipContent className="max-w-xs">
                                                                                                        <p className="whitespace-pre-wrap">{dayData.note}</p>
                                                                                                    </TooltipContent>
                                                                                                </Tooltip>
                                                                                            ) : (
                                                                                                <span className="ml-1 font-medium text-gray-700">
                                                                                                    {dayData.note}
                                                                                                </span>
                                                                                            )
                                                                                        ) : (
                                                                                            <span className="ml-1 font-medium text-gray-400 italic">
                                                                                                Không có ghi chú
                                                                                            </span>
                                                                                        )}
                                                                                    </div>

                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </motion.div>
                                                            )
                                                        })}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 text-gray-500">
                                                    <div className="text-4xl mb-2">📝</div>
                                                    <p>Chưa có nhật ký nào trong 30 ngày gần đây</p>
                                                    <p className="text-sm">Hãy bắt đầu ghi nhận để theo dõi hành trình của bạn!</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
