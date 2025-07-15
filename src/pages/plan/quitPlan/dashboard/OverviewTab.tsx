"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Target, Plus, Cigarette, Flame, CalendarDays, CalendarIcon, ChevronUp, ChevronDown, Notebook } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { QuitPlanCalculator } from "@/utils/QuitPlanCalculator"
import type { QuitPlanResponseDTO } from "@/services/quitPlanService"
import { DailyInputModal } from "./components/DailyInputModal"
import { LungHealthIndicator } from "./components/LungHealthIndicator"
import { CountdownTimer } from "./components/CountdownTimer"
import { SmokeOverlay } from "./components/SmokeOverlay"
import { Badge } from "@/components/ui/badge"
import { AnimatedSection } from "@/components/ui/AnimatedSection"
import { DynamicReductionSchedule } from "./components/PlanSchedule"
import { StreakCalendar } from "./components/StreakCalendar"
import { CravingSupportModal } from "./components/CravingSupportModal"
import type { DailySummaryResponse } from "@/services/dailySummaryService"
import type { DailyChartDataResponse } from "@/services/dataVisualizationService"
import { useCravingTrackingsByDailySummary, type CravingTrackingResponse } from "@/services/cravingTrackingService"


interface OverviewTabProps {
    quitPlan: QuitPlanResponseDTO | null; // Kế hoạch bỏ thuốc từ cha
    refetchQuitPlan: () => Promise<void>; // Hàm để làm mới dữ liệu quitPlan từ cha
    onViewProgress: () => void; // Hàm để chuyển sang tab Progress
    dailySummary: DailySummaryResponse | null; // DailySummary của ngày hôm nay từ cha
    refetchDailySummary: () => Promise<void>; // Hàm để làm mới dailySummary của ngày hôm nay từ cha
    dailyData: DailyChartDataResponse[]; // Dữ liệu daily summary lịch sử từ cha (dùng cho biểu đồ), đã đổi kiểu
}

//cho progress chart (sử dụng daily summary data)
interface DailyChartData {
    day: number;
    recommended: number;
    actual: number | null;
    date: string;
}

export function OverviewTab({
    quitPlan,
    refetchQuitPlan,
    onViewProgress,
    dailySummary: todayDailySummary, // Destructure và đổi tên để dễ đọc (dailySummary của ngày hôm nay)
    refetchDailySummary,
    dailyData: historicalDailySummaries, // Destructure và đổi tên để dễ đọc (dữ liệu lịch sử)
}: OverviewTabProps) {
    const [isInputModalOpen, setIsInputModalOpen] = useState(false)
    const [isCravingSupportOpen, setIsCravingSupportOpen] = useState(false)
    const [showRecords, setShowRecords] = useState(false)

    const [chartDailyData, setChartDailyData] = useState<DailyChartData[]>([])

    // Fetch craving tracking data for today's daily summary
    const {
        data: cravingTrackings,
        isLoading: isCravingTrackingsLoading,
        error: cravingTrackingsError,
        refetch: refetchCravingTrackings,
    } = useCravingTrackingsByDailySummary(todayDailySummary?.dailySummaryId ?? null); // Pass dailySummaryId if available

    // Tính toán các chỉ số từ chartDailyData
    const goalsMet = chartDailyData.filter(day => day.actual !== null && day.actual <= day.recommended).length
    const overLimit = chartDailyData.filter(day => day.actual !== null && day.actual > day.recommended).length
    const avgSmokings =
        chartDailyData.length > 0
            ? Math.round(chartDailyData.reduce((sum, day) => sum + (day.actual ?? 0), 0) / chartDailyData.length)
            : 0; // Xử lý trường hợp chia cho 0 và null

    // Tính toán các thông số liên quan đến ngày hiện tại
    const daysSinceStart = quitPlan ? QuitPlanCalculator.getDaysSinceStart(quitPlan.startDate) : 0
    const today = daysSinceStart + 1
    const totalDays = quitPlan ? QuitPlanCalculator.getTotalDays(quitPlan.startDate, quitPlan.goalDate) : 0
    const todayLimit = quitPlan ? QuitPlanCalculator.calculateDailyLimit(
        quitPlan.reductionType,
        quitPlan.initialSmokingAmount,
        daysSinceStart, // Sử dụng daysSinceStart (0-indexed) cho tính toán ngày hiện tại
        totalDays,
    ) : 0
    const yesterdayLimit = quitPlan ? QuitPlanCalculator.calculateDailyLimit( // Không sử dụng trong OverviewTab
        quitPlan.reductionType,
        quitPlan.initialSmokingAmount,
        daysSinceStart - 1, // Sử dụng daysSinceStart (0-indexed) cho tính toán ngày hôm qua
        totalDays,
    ) : 0

    // Sử dụng số điếu thuốc đã hút thực tế của ngày hôm nay từ dailySummary
    const todaySmoked = todayDailySummary?.totalSmokedCount ?? 0
    const todayCravings = todayDailySummary?.totalCravingCount ?? 0
    const isOverLimit = todaySmoked > todayLimit

    // để tính toán chartDailyData mỗi khi historicalDailySummaries hoặc quitPlan thay đổi
    useEffect(() => {
        if (quitPlan && historicalDailySummaries && historicalDailySummaries.length > 0 && quitPlan.startDate && quitPlan.goalDate) {
            // Tính tổng số ngày trong kế hoạch
            const totalDaysInPlan = QuitPlanCalculator.getTotalDays(quitPlan.startDate, quitPlan.goalDate);

            // Tạo dữ liệu mới cho biểu đồ từ historicalDailySummaries
            const newChartDailyData: DailyChartData[] = historicalDailySummaries.map((summary) => {
                // Tính số ngày kể từ khi bắt đầu kế hoạch cho từng bản tóm tắt
                // Sử dụng phương thức mới getDaysBetweenDates
                const daysSincePlanStartForSummary = QuitPlanCalculator.getDaysBetweenDates(quitPlan.startDate, summary.date);

                // Tính giới hạn hút thuốc đề xuất cho ngày đó
                const recommendedLimit = QuitPlanCalculator.calculateDailyLimit(
                    quitPlan.reductionType,
                    quitPlan.initialSmokingAmount,
                    daysSincePlanStartForSummary, // Truyền ngày 0-indexed cho tính toán
                    totalDaysInPlan
                );

                return {
                    day: daysSincePlanStartForSummary + 1, // Ngày 1-indexed để hiển thị
                    recommended: recommendedLimit,
                    actual: summary.totalSmokedCount, // Sử dụng dữ liệu thực tế từ BE
                    date: summary.date, // Sử dụng ngày thực tế từ BE
                };
            });
            setChartDailyData(newChartDailyData);
        } else {
            setChartDailyData([]); // Đặt lại dữ liệu biểu đồ nếu không có quitPlan hoặc dữ liệu lịch sử
        }
    }, [quitPlan, historicalDailySummaries])

    // Tính toán cường độ khói cho hiệu ứng SmokeOverlay
    const smokeIntensity =
        quitPlan?.reductionType === "IMMEDIATE"
            ? todaySmoked > 0
                ? 1
                : 0
            : todayLimit > 0
                ? Math.min(isOverLimit ? (todaySmoked - todayLimit) / todayLimit : 0, 1)
                : 0 // Xử lý trường hợp chia cho 0 nếu todayLimit là 0

    // Hàm xác định tình trạng phổi
    const getLungHealth = (): "critical" | "healthy" | "recovering" | "stressed" | "unknown" => {
        if (!quitPlan) return "unknown";
        // Nếu dailySummary của ngày hôm nay là null hoặc totalSmokedCount là null, coi như chưa ghi nhận
        if (!todayDailySummary || todayDailySummary.totalSmokedCount === null) return "unknown";

        if (quitPlan.reductionType === "IMMEDIATE") {
            return todaySmoked > 0 ? "critical" : "healthy"
        }

        if (todaySmoked === 0) return "healthy"
        if (todaySmoked <= todayLimit) return "recovering"
        if (todaySmoked <= todayLimit * 1.5) return "stressed"
        return "critical"
    }

    // Xử lý khi gửi dữ liệu nhập hàng ngày
    const handleDailyInput = () => { // Đã bỏ tham số 'data'
        console.log("Daily input submitted, refreshing data.");
        // Sau khi gửi dữ liệu, làm mới dailySummary và quitPlan để cập nhật UI
        refetchDailySummary();
        refetchQuitPlan();
        refetchCravingTrackings();
    }

    // Xử lý khi ghi nhận cơn thèm thuốc. This function will now be passed to CravingSupportModal's onRecordSuccess
    // Its signature needs to match the new onRecordSuccess in CravingSupportModalProps
    const handleCravingSupportSuccess = () => { // Changed name and removed data argument
        console.log("Craving support flow completed, refreshing data.");
        refetchDailySummary();
        refetchQuitPlan();
        refetchCravingTrackings(); // Also refetch craving trackings
    }

    // Hiển thị null hoặc trạng thái tải/lỗi nếu quitPlan chưa có
    if (!quitPlan) {
        return null;
    }

    return (
        <div className="space-y-6 relative">
            {/* <SmokeOverlay intensity={smokeIntensity} /> */}

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <AnimatedSection animation="fadeUp" delay={200}>
                    <div className="text-center space-y-4 mb-13">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <h1 className="text-4xl lg:text-5xl font-black text-slate-800 dark:text-white">
                                Quá Trình Cai Thuốc
                            </h1>
                            <Badge className="text-white text-sm px-3 py-1 mt-2 bg-emerald-500">
                                {quitPlan.reductionType === "IMMEDIATE"
                                    ? "Immediate Plan"
                                    : `${quitPlan.reductionType} Plan`}
                            </Badge>
                        </div>
                        <p className="text-xl text-slate-600 dark:text-slate-300">
                            Nơi giúp bạn theo dõi quá trình cai thuốc hiện tại của mình
                        </p>
                    </div>
                </AnimatedSection>

                {/* Timer - Streak Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                        {/* Countdown Timer */}
                        <div className="
                        bg-gradient-to-br from-green-100 to-emerald-50 
                        rounded-2xl p-6 border border-emerald-300">
                            <CountdownTimer
                                targetDate={quitPlan.reductionType === "IMMEDIATE" ? quitPlan.startDate : quitPlan.goalDate}
                                label={quitPlan.reductionType === "IMMEDIATE" ? "Time Since Quitting" : "Time Remaining"}
                                isCountUp={quitPlan.reductionType === "IMMEDIATE"}
                                planStartDate={quitPlan.startDate}
                            />
                        </div>

                        {/* Streak Widget */}
                        <div className="
                        bg-gradient-to-br from-amber-50 to-orange-50 
                        rounded-2xl p-7 border border-amber-200">
                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold text-amber-900 mb-2">STREAK</h3>
                                <p className="text-amber-700 text-sm">
                                    Chuỗi ngày liên tục mà bạn đã không hút thuốc
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                {/* Current Streak */}
                                <div className="text-center">
                                    <motion.div
                                        className="flex items-end justify-center gap-2 mb-2"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                    >
                                        <span className="text-4xl font-bold text-orange-600">7</span>
                                        <div className="text-1xl font-bold text-amber-800">Ngày</div>
                                    </motion.div>
                                    <div className="text-2xl">🔥</div>
                                    <div className="text-lg font-bold text-amber-900">HIỆN TẠI</div>
                                </div>

                                {/* Vertical Divider */}
                                <div className="relative">
                                    <div className="absolute left-0 top-0 bottom-0 w-px bg-amber-300"></div>

                                    {/* Best Streak */}
                                    <div className="text-center pl-4">
                                        <motion.div
                                            className="flex items-end justify-center gap-2 mb-2"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                                        >
                                            <span className="text-4xl font-bold text-orange-600">12</span>
                                            <div className="text-1xl font-bold text-amber-800">Ngày</div>
                                        </motion.div>
                                        <div className="text-2xl">🏆</div>
                                        <div className="text-lg font-bold text-amber-900">TỐT NHẤT</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative rounded-2xl overflow-hidden"
                >
                    <Card
                        className={cn(
                            "relative overflow-hidden transition-all duration-500",
                            todaySmoked === 0 && "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-300",
                            todaySmoked > 0 &&
                            todaySmoked <= todayLimit &&
                            "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300",
                            isOverLimit && "bg-gradient-to-br from-red-50 to-pink-50 border-red-300",
                        )}
                    >
                        <SmokeOverlay intensity={smokeIntensity} />
                        <CardContent className="relative p-7 pb-0 z-10">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <CardTitle className="text-3xl font-bold">Tình Trạng Hôm Nay Của Bạn</CardTitle>
                                    <p className="text-lg">Hãy kiên cường vì chính sức khỏe bạn!</p>
                                    {/* Nút ghi nhận thèm thuốc */}
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => setIsCravingSupportOpen(true)}
                                            className="
                                        text-1xl py-5 mt-3 shadow-lg bg-accent-foreground cursor-pointer"
                                        >
                                            <Plus className="w-4 h-4 mr-2" /> Bạn đang thèm thuốc?
                                        </Button>
                                        <Button
                                            onClick={() => setIsInputModalOpen(true)}
                                            className="
                                        text-1xl py-5 mt-3 shadow-lg bg-accent-foreground cursor-pointer"
                                        >
                                            <Plus className="w-4 h-4 mr-2" /> Bạn muốn ghi nhận?
                                        </Button>
                                    </div>

                                </div>
                                <LungHealthIndicator healthLevel={getLungHealth()} size="lg" />
                            </div>
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-center gap-2">
                                    <Cigarette className="w-5 h-5" />
                                    <span>Số Thuốc Đã Hút: {todaySmoked}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Flame className="w-5 h-5" />
                                    <span>Số Lần Thèm Thuốc: {todayCravings}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CalendarDays className="w-5 h-5" />
                                    <span>
                                        Ngày {today} trong {totalDays} ngày
                                    </span>
                                </div>
                            </div>
                        </CardContent>


                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.5 }}
                            className="relative px-7 z-10"
                        >
                            <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
                                <CardHeader className="cursor-pointer" onClick={() => setShowRecords(!showRecords)}>
                                    <CardTitle className="text-xl font-bold text-gray-800 flex items-center justify-between">
                                        <div>
                                            <Notebook className="h-5 w-5 inline-block mr-2" />
                                            Ghi Nhận Hôm Nay
                                        </div>
                                        {showRecords ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                    </CardTitle>
                                </CardHeader>
                                <AnimatePresence>
                                    {showRecords && (
                                        <CardContent>
                                            <div className="space-y-4 max-h-[400px] overflow-y-auto">
                                                {isCravingTrackingsLoading ? (
                                                    <div className="text-center text-gray-500">Đang tải nhật ký...</div>
                                                ) : cravingTrackingsError ? (
                                                    <div className="text-center text-red-500">Lỗi: {cravingTrackingsError}</div>
                                                ) : cravingTrackings && cravingTrackings.length > 0 ? (
                                                    cravingTrackings.map((record: CravingTrackingResponse, index: number) => (
                                                        <motion.div
                                                            key={record.cravingTrackingId}
                                                            className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700 shadow-sm"
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: index * 0.05 }}
                                                        >
                                                            <div className="flex items-center justify-between mb-2">
                                                                <div className="font-medium text-gray-800 dark:text-gray-200">
                                                                    {new Date(record.trackTime).toLocaleDateString('vi-VN')} - {new Date(record.trackTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                                </div>
                                                                <span className={cn(
                                                                    "text-xs font-semibold px-2 py-1 rounded-full",
                                                                    record.smokedCount !== null && record.smokedCount > 0
                                                                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                                                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                                                                )}>
                                                                    {record.smokedCount !== null && record.smokedCount > 0 ? "Đã hút" : "Không hút"}
                                                                </span>
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                                <div>
                                                                    <span className="font-semibold">Số điếu đã hút:</span> {record.smokedCount ?? "N/A"}
                                                                </div>
                                                                <div>
                                                                    <span className="font-semibold">Số lần thèm:</span> {record.cravingsCount ?? "N/A"}
                                                                </div>
                                                                <div>
                                                                    <span className="font-semibold">Tình huống:</span> {record.situations.join(', ') || "Không có"}
                                                                </div>
                                                                <div>
                                                                    <span className="font-semibold">Với ai:</span> {record.withWhoms.join(', ') || "Không có"}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ))
                                                ) : (
                                                    <div className="text-center text-gray-500">Chưa có bản ghi nào cho ngày hôm nay</div>
                                                )}
                                            </div>
                                        </CardContent>
                                    )}
                                </AnimatePresence>
                            </Card>
                        </motion.div>

                    </Card>
                </motion.div>
            </div>

            {/* Lịch trình giảm dần (chỉ hiển thị nếu không phải kế hoạch IMMEDIATE) */}
            {quitPlan.reductionType !== "IMMEDIATE" && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-1 sm:gap-3 lg:gap-4">
                    {/* Left Column */}

                    <div className="xl:col-span-2 flex flex-col space-y-3 sm:space-y-5 h-full">
                        <AnimatedSection animation="fadeUp" delay={400} className="flex-1">
                            <DynamicReductionSchedule
                                initialCigarettes={quitPlan.initialSmokingAmount}
                                totalDays={totalDays}
                                reductionType={quitPlan.reductionType}
                                currentDay={today}
                                userRecords={chartDailyData}
                                startDate={new Date(quitPlan.startDate)}
                            />
                        </AnimatedSection>
                    </div>

                    {/* Right Column */}
                    {/* Plan Info Summary */}
                    <div className="space-y-4">
                        <AnimatedSection animation="fadeUp" delay={450}>
                            <div className="grid grid-cols-2 gap-4">
                                {/* Today Goal Section */}
                                <div className="
                                    bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 p-6 
                                    rounded-lg border border-blue-200 dark:border-blue-700">
                                    <div className="flex items-center gap-2 mb-2 text-lg">
                                        <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <span className="font-medium text-blue-800 dark:text-blue-300">Mục Tiêu Hôm Nay</span>
                                    </div>
                                    {(today) ? (
                                        <div>
                                            <p className="text-blue-700 dark:text-blue-300 text-sm mb-2">
                                                {todayLimit === 0 ? (
                                                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                                        🎉 Không hút thuốc lá nào! Bạn đã đạt được mục tiêu cuối cùng!
                                                    </span>
                                                ) : (
                                                    <span>
                                                        Bạn chỉ nên hút <strong className="font-bold text-xl ">{todayLimit ?? "--"} điếu</strong>
                                                        <br />
                                                        {((today) > 1 && ((yesterdayLimit ?? 0) - todayLimit) != 0) && (
                                                            <span className="
                                                text-blue-600 dark:text-blue-400 text-xs italic
                                                ">
                                                                Giảm {(yesterdayLimit ?? 0) - todayLimit} điếu so với hôm qua!
                                                            </span>
                                                        )}
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    ) : today > totalDays ? (
                                        <p className="text-emerald-700 dark:text-emerald-300 text-sm">
                                            🎉 Chúc mừng! Bạn đã hoàn thành toàn bộ kế hoạch giảm dần!
                                        </p>
                                    ) : (
                                        <p className="text-slate-600 dark:text-slate-300 text-sm">Kế hoạch chưa bắt đầu</p>
                                    )}
                                </div>
                                {/* Current Status Section */}
                                <div className="
                                    bg-gradient-to-r from-purple-50 to-red-50 dark:from-purple-900/20 dark:to-red-900/20 p-6 
                                    rounded-lg border border-purple-200 dark:border-purple-700">
                                    <div className="flex items-center gap-2 mb-2 text-lg">
                                        <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        <span className="font-medium text-purple-800 dark:text-purple-300">Ghi Nhận Hiện Tại</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-purple-800">
                                                {todaySmoked}/{todayLimit}
                                            </div>
                                            <div className="text-sm text-purple-600">
                                                Số Thuốc Đã Hút
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>

                        <AnimatedSection animation="fadeUp" delay={600}>
                            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-emerald-100 dark:border-slate-700 shadow-xl rounded-lg p-5">
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="w-5 h-5 text-emerald-500" />
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Ghi Nhận</h3>
                                </div>
                                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                                    {/*Mini Summary*/}
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-emerald-600">{goalsMet}</div>
                                        <div className="text-xs text-gray-600">Đạt Mục Tiêu</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-orange-500">{overLimit}</div>
                                        <div className="text-xs text-gray-600">Vượt Mục Tiêu</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-blue-500">{avgSmokings}</div>
                                        <div className="text-xs text-gray-600">Trung Bình Số Điếu Hút Mỗi Ngày</div>
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>
                        {/* Calendar */}
                        <AnimatedSection animation="fadeUp" delay={600}>
                            <StreakCalendar
                                data={chartDailyData.map((day) => ({
                                    date: day.date,
                                    actual: day.actual,
                                    recommended: day.recommended,
                                }))}
                            />
                        </AnimatedSection>
                    </div>
                </div>
            )}

            {/* Daily Input Modal */}
            <DailyInputModal
                isOpen={isInputModalOpen}
                onClose={() => setIsInputModalOpen(false)}
                onRecordSuccess={handleDailyInput}
                planType={quitPlan.reductionType}
            />

            {/* Craving Support Modal */}
            <CravingSupportModal
                isOpen={isCravingSupportOpen}
                onClose={() => setIsCravingSupportOpen(false)}
                onRecordSuccess={handleCravingSupportSuccess}
                planType={quitPlan.reductionType}
            />
        </div>
    )
}
