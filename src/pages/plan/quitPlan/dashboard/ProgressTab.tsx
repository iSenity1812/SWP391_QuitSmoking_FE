"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, RotateCcw, Edit3, Save, AlertTriangle, Cigarette, Flame, ChevronDown, ChevronUp, Plus, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import type { QuitPlanResponseDTO, QuitPlanUpdateRequestDTO } from "@/services/quitPlanService"
import { quitPlanService } from "@/services/quitPlanService"
import { QuitPlanCalculator } from "@/utils/QuitPlanCalculator"
import type { DailySummaryResponse } from "@/services/dailySummaryService"
import { useDailyDataForDayRange } from "@/services/dataVisualizationService"
import { format, subDays } from "date-fns"
import { DiaryInputModal } from "./components/DiaryInputModal"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { getVietnameseTranslation, getMoodTranslation } from "@/utils/enumTranslations"
import { AnimatedSection } from "@/components/ui/AnimatedSection"

interface ProgressTabProps {
  quitPlan: QuitPlanResponseDTO;
  refetchQuitPlan: () => Promise<void>; // Hàm để refetch quitPlan khi có thay đổi
  dailySummary: DailySummaryResponse | null; // Daily summary của ngày hôm nay
  refetchDailySummary: () => Promise<void>; // Hàm để refetch daily summary
}

export function ProgressTab({ quitPlan, refetchQuitPlan, dailySummary: todayDailySummary, refetchDailySummary }: ProgressTabProps) {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showRestartConfirm, setShowRestartConfirm] = useState(false)
  const [isRestarting, setIsRestarting] = useState(false)
  const [restartSuccess, setRestartSuccess] = useState(false)
  const [showRecords, setShowRecords] = useState(false) // State for toggling records view
  const [isDiaryModalOpen, setIsDiaryModalOpen] = useState(false) // State for diary modal // State for editing record
  const [editData, setEditData] = useState({
    cigarettesPerPack: quitPlan.cigarettesPerPack,
    pricePerPack: quitPlan.pricePerPack,
  })

  // Get today's date formatted (for future use)
  // const todayFormatted = format(new Date(), "yyyy-MM-dd")

  // Calculate today's statistics
  const todaySmoked = todayDailySummary?.totalSmokedCount ?? 0
  const todayCravings = todayDailySummary?.totalCravingCount ?? 0
  const hasDataForToday = todayDailySummary !== null && todayDailySummary.totalSmokedCount !== null

  // Calculate date range for last 30 days
  const endDate = format(new Date(), 'yyyy-MM-dd')
  const startDate = format(subDays(new Date(), 30), 'yyyy-MM-dd')

  // Fetch recent daily data for records view using dataVisualizationService
  const {
    data: recentDailyData,
    isLoading: isRecentDataLoading,
    error: recentDataError,
    refetch: refetchRecentData,
  } = useDailyDataForDayRange(startDate, endDate)

  // Filter only records that have actual data (not null/empty)
  const actualRecords = recentDailyData?.filter(record =>
    record.totalSmokedCount !== null ||
    record.totalCravingCount !== null ||
    record.mood !== null
  ) || []

  // Handlers for daily input (currently handled by button click)
  // const handleDailyInput = () => {
  //   console.log("Daily input submitted, refreshing data.")
  //   refetchDailySummary()
  //   refetchQuitPlan()
  //   refetchCravingTrackings()
  // }

  const closeDiaryModal = () => {
    setIsDiaryModalOpen(false)
  }

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

  // Add validation helper functions
  const isValidCigarettesPerPack = (value: number) => value >= 0 && value <= 50
  const isValidPricePerPack = (value: number) => value >= 1 && value <= 999999

  const handleSaveEdit = async () => {
    // Validation for cigarettes per pack (0-50)
    if (!isValidCigarettesPerPack(editData.cigarettesPerPack)) {
      toast.error("Số điếu trong gói phải từ 0 đến 50")
      return
    }

    // Validation for price per pack (1-999999)
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
      await refetchQuitPlan() // Refetch để cập nhật UI
      setIsEditing(false)
      toast.success("Đã cập nhật thông tin kế hoạch thành công!")
    } catch (error) {
      console.error("Error updating quit plan:", error)
      toast.error("Không thể cập nhật kế hoạch. Vui lòng thử lại sau")
    } finally {
      setIsSaving(false)
    }
  }

  const handleRestartPlan = () => {
    setShowRestartConfirm(true)
  }

  const handleCloseRestartModal = () => {
    if (!isRestarting && !restartSuccess) {
      setShowRestartConfirm(false)
      setRestartSuccess(false)
    }
  }

  const handleConfirmRestart = async () => {
    setIsRestarting(true)
    try {
      await quitPlanService.giveUpQuitPlan(quitPlan.quitPlanId)

      // Show success state
      setRestartSuccess(true)

      // Wait 3 seconds to show success message, then redirect
      setTimeout(() => {
        navigate("/plan/create")
      }, 3000)
    } catch (error) {
      console.error("Error giving up quit plan:", error)
      toast.error("Không thể từ bỏ kế hoạch. Vui lòng thử lại sau")
      setIsRestarting(false)
      setShowRestartConfirm(false)
    }
    // Note: Don't reset isRestarting here for success case, let the redirect handle it
  }

  // Chart data for statistics
  const weeklyData = [
    { week: "Week 1", smoking: 85, cravings: 45, mood: 3.2 },
    { week: "Week 2", smoking: 70, cravings: 38, mood: 3.8 },
    { week: "Week 3", smoking: 55, cravings: 28, mood: 4.1 },
    { week: "Week 4", smoking: 40, cravings: 22, mood: 4.3 },
  ]

  const moodData = [
    { day: 1, mood: 4 },
    { day: 2, mood: 3 },
    { day: 3, mood: 2 },
    { day: 4, mood: 5 },
    { day: 5, mood: 4 },
    { day: 6, mood: 3 },
    { day: 7, mood: 4 },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Plan Details Header */}
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
                      // Reset về giá trị ban đầu khi cancel
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
                  onClick={handleRestartPlan}
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
                        // Constrain value between 1 and 50
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
                        // Constrain value between 1 and 999999
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

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-1 sm:gap-3 lg:gap-4">
        {/* Left Column */}
        {/* Daily Summary Card */}
        <div className="xl:col-span-4 flex flex-col space-y-3 sm:space-y-5 h-full">
          <AnimatedSection animation="fadeUp" delay={400} className="flex-1">
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

                    {/* Main Action Button */}
                    <div className="flex justify-center">
                      <Button
                        onClick={() => setIsDiaryModalOpen(true)}
                        size="lg"
                        className="px-6 py-3 mr-3 text-base font-medium bg-foreground"
                      >
                        <Plus className="w-5 h-5" />
                        {hasDataForToday ? "Chỉnh sửa nhật ký hôm nay" : "Ghi nhận nhật ký hôm nay"}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Collapsible Records Section */}
                    <div className="border-t pt-4">
                      <Button
                        onClick={() => setShowRecords(!showRecords)}
                        variant="ghost"
                        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-600" />
                          <span className="font-medium text-gray-700">Xem các ghi nhận trước</span>
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
                                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort newest first
                                    .slice(0, 3) // Limit to 3 records
                                    .map((dayData, index) => {
                                      // Calculate if goal was met using same logic as OverviewTab
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
                                          className="border rounded-lg p-4 bg-gray-50"
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
                                            <Badge
                                              variant={goalMet ? "default" : "destructive"}
                                              className={`text-xs ${goalMet ? "bg-green-100 text-green-700 border-green-300" : "bg-red-100 text-red-700 border-red-300"}`}
                                            >
                                              {goalMet ? "✓ Đạt mục tiêu" : "✗ Vượt mức"}
                                            </Badge>
                                          </div>
                                          <div className="flex items-center gap-30 text-sm">
                                            <div>
                                              <span className="text-gray-600">Số điếu đã hút:</span>
                                              <span className="ml-1 font-medium text-red-600">
                                                {dayData.totalSmokedCount || 0}
                                              </span>
                                            </div>
                                            <div>
                                              <span className="text-gray-600">Số lần thèm:</span>
                                              <span className="ml-1 font-medium text-orange-600">
                                                {dayData.totalCravingCount || 0}
                                              </span>
                                            </div>
                                            <div>
                                              <span className="text-gray-600">Tâm trạng:</span>
                                              <span className="ml-1 font-medium text-blue-600">
                                                {dayData.mood ? getMoodTranslation(dayData.mood) : "Không xác định"}
                                              </span>
                                            </div>
                                            <div>
                                              <span className="text-gray-600">Note:</span>
                                              <span className="ml-1 font-medium text-blue-600">
                                                {dayData.mood ? getMoodTranslation(dayData.mood) : "Không xác định"}
                                              </span>
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
          </AnimatedSection>
        </div>

        {/* Right Column */}
        {/* Mini Cards for Today's Summary */}
        <div className="space-y-4">
          <AnimatedSection animation="fadeUp" delay={450}>
            <div className=" bg-red-50 px-3 py-5 rounded-lg border border-red-200">
              <div className="flex items-center gap-4">
                <Cigarette className="w-5 h-5 text-red-600" />
                <div className="text-md text-red-600 font-medium">Tổng Số Thuốc Đã Hút</div>
              </div>
              <div className="text-xl font-bold text-center text-red-700">{todaySmoked}</div>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={500}>
            <div className="bg-orange-50 px-3 py-5 rounded-lg border border-orange-200">
              <div className="flex items-center gap-4">
                <Flame className="w-5 h-5 text-orange-600" />
                <div className="text-md text-orange-600 font-medium">Tổng Lần Thèm Thuốc</div>
              </div>
              <div className="text-xl  text-center font-bold text-orange-700">{todayCravings}</div>
            </div>
          </AnimatedSection>

          {/* Mood Card - Only show if mood exists */}
          <AnimatedSection animation="fadeUp" delay={550}>
            <div className="bg-blue-50 px-3 py-5 rounded-lg border border-blue-200">
              <div className="flex items-center gap-4">
                <span className="text-xl">😊</span>
                <div className="text-md text-blue-600 font-medium">Tâm Trạng Hôm Nay</div>
              </div>
              <div className="text-sm text-center font-medium text-blue-700">
                {todayDailySummary?.mood
                  ? getVietnameseTranslation(todayDailySummary.mood)
                  : "Chưa được ghi nhận"}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Statistics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Weekly Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="smoking" fill="#ef4444" name="Cigarettes" />
                    <Bar dataKey="cravings" fill="#f59e0b" name="Cravings" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Mood Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={moodData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[1, 5]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="mood"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>

          </Card>
        </motion.div>
      </div>


      {/* Restart Confirmation Modal */}
      <AnimatePresence>
        {showRestartConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseRestartModal}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                {restartSuccess ? (
                  // Success state
                  <>
                    <div className="text-green-500 text-4xl mb-4">✅</div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      Đã từ bỏ kế hoạch thành công!
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Đang chuyển hướng về trang tạo kế hoạch mới...
                    </p>
                    <div className="flex justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full"
                      />
                    </div>
                  </>
                ) : (
                  // Confirmation state
                  <>
                    <div className="text-orange-500 text-4xl mb-4">⚠️</div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      Xác nhận khởi động lại kế hoạch
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Bạn có chắc chắn muốn thực hiện lại với kế hoạch mới không?
                      <br />
                      <span className="text-red-500 font-medium">
                        Lưu ý: Khi xác nhận sẽ không thể quay lại kế hoạch hiện tại
                      </span>
                    </p>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCloseRestartModal}
                        className="flex-1"
                        disabled={isRestarting || restartSuccess}
                      >
                        Hủy
                      </Button>
                      <Button
                        type="button"
                        onClick={handleConfirmRestart}
                        className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                        disabled={isRestarting || restartSuccess}
                      >
                        {isRestarting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                            />
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Xác nhận
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Diary Input Modal */}
      <DiaryInputModal
        isOpen={isDiaryModalOpen}
        onClose={closeDiaryModal}
        editingRecord={todayDailySummary}
        onRecordSuccess={() => {
          refetchDailySummary()
          refetchRecentData()
          closeDiaryModal()
        }}
      />
    </div>
  )
}
