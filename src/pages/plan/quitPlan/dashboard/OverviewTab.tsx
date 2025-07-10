"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, TrendingUp, DollarSign, Target, Plus, Cigarette, Flame, CalendarDays, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { QuitPlanCalculator } from "@/utils/QuitPlanCalculator"
import type { QuitPlanResponseDTO } from "@/services/quitPlanService"
import { DailyInputModal } from "./components/DailyInputModal"
import { ProgressChart } from "./components/ProgressChart"
import { LungHealthIndicator } from "./components/LungHealthIndicator"
import { CountdownTimer } from "./components/CountdownTimer"
import { SmokeOverlay } from "./components/SmokeOverlay"
import { Badge } from "@/components/ui/badge"
import { AnimatedSection } from "@/components/ui/AnimatedSection"
import { DynamicReductionSchedule } from "./components/PlanSchedule"

interface OverviewTabProps {
    quitPlan: QuitPlanResponseDTO
    onViewProgress: () => void
}

export function OverviewTab({ quitPlan, onViewProgress }: OverviewTabProps) {
    const [isInputModalOpen, setIsInputModalOpen] = useState(false)
    const [dailyData, setDailyData] = useState([
        { day: 1, recommended: 18, actual: 15, date: "2025-01-01" },
        { day: 2, recommended: 16, actual: 14, date: "2025-01-02" },
        { day: 3, recommended: 14, actual: 16, date: "2025-01-03" },
        { day: 4, recommended: 12, actual: 10, date: "2025-01-04" },
        { day: 5, recommended: 10, actual: 8, date: "2025-01-05" },
        { day: 6, recommended: 8, actual: 12, date: "2025-01-06" },
        { day: 7, recommended: 6, actual: 4, date: "2025-01-07" },
    ])

    const daysSinceStart = QuitPlanCalculator.getDaysSinceStart(quitPlan.startDate)
    const today = daysSinceStart + 1
    const totalDays = QuitPlanCalculator.getTotalDays(quitPlan.startDate, quitPlan.goalDate)
    const todayLimit = QuitPlanCalculator.calculateDailyLimit(
        quitPlan.reductionType,
        quitPlan.initialSmokingAmount,
        today,
        totalDays,
    )
    const yesterdayLimit =
        today > 0
            ? QuitPlanCalculator.calculateDailyLimit(
                quitPlan.reductionType,
                quitPlan.initialSmokingAmount,
                today - 1,
                totalDays
            )
            : null

    // Mock today's data
    const todaySmoked = 4
    const isOverLimit = todaySmoked > todayLimit
    const smokeIntensity =
        quitPlan.reductionType === "IMMEDIATE"
            ? todaySmoked > 0
                ? 1
                : 0
            : Math.min(isOverLimit ? (todaySmoked - todayLimit) / todayLimit : 0, 1)

    const getLungHealth = () => {
        if (quitPlan.reductionType === "IMMEDIATE") {
            return todaySmoked > 0 ? "critical" : "healthy"
        }

        if (todaySmoked === 0) return "healthy"
        if (todaySmoked <= todayLimit) return "recovering"
        if (todaySmoked <= todayLimit * 1.5) return "stressed"
        return "critical"
    }

    const handleDailyInput = (data: unknown) => {
        console.log("Daily input submitted:", data)
        // Here you would typically send this data to your backend
    }


    return (
        <div className="space-y-6 relative">
            <SmokeOverlay intensity={smokeIntensity} />

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
                        <CardContent className="relative p-7 z-10">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <CardTitle className="text-3xl font-bold">Tình Trạng Hôm Nay Của Bạn</CardTitle>
                                    <p className="text-lg">Hãy kiên cường vì chính sức khỏe bạn!</p>
                                    {/* Nút ghi nhận thèm thuốc */}
                                    <Button
                                        onClick={() => setIsInputModalOpen(true)}
                                        className="
                                        text-1xl py-5 mt-3 shadow-lg bg-accent-foreground"
                                    >
                                        <Plus className="w-4 h-4 mr-2" /> Bạn đã hút thuốc?
                                    </Button>
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
                                    <span>Số Lần Thèm Thuốc: {todaySmoked}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CalendarDays className="w-5 h-5" />
                                    <span>
                                        Ngày {today} trong {totalDays} ngày
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-1 sm:gap-3 lg:gap-4">
                {/* Left Column */}
                <div className="xl:col-span-2 space-y-3 sm:space-y-5">
                    <AnimatedSection animation="fadeUp" delay={400}>
                        <DynamicReductionSchedule
                            initialCigarettes={10}
                            totalDays={totalDays}
                            reductionType={'LINEAR'}
                            currentDay={today}
                            userRecords={[]}
                            startDate={new Date(quitPlan.startDate)}
                        />
                    </AnimatedSection>
                </div>

                {/* Right Column */}
                {/* Plan Info Summary */}
                <div className="space-y-6">
                    <AnimatedSection animation="fadeUp" delay={450}>
                        <div className="grid grid-cols-2 gap-2">
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
                                                {todaySmoked}/{quitPlan.reductionType === "IMMEDIATE" ? 0 : todayLimit}
                                            </div>
                                            <div className="text-sm text-purple-600">
                                                {quitPlan.reductionType === "IMMEDIATE" ? "Số Thuốc (Mục Tiêu: 0)" : "Số Thuốc Đã Hút"}
                                            </div>
                                        </div>
                                    </div>
                            </div>
                        </div>
                    </AnimatedSection>

                    <AnimatedSection animation="fadeUp" delay={700}>
                        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-emerald-100 dark:border-slate-700 shadow-xl rounded-lg p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <CalendarIcon className="w-5 h-5 text-emerald-500" />
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Lịch</h3>
                            </div>
                            hehe
                        </div>
                    </AnimatedSection>
                </div>
            </div>

            {/* Progress Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Progress Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ProgressChart data={dailyData} />

                        {/* Mini Summary */}
                        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t">
                            <div className="text-center">
                                <div className="text-lg font-semibold text-emerald-600">5</div>
                                <div className="text-xs text-gray-600">Goals Met</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-semibold text-red-500">2</div>
                                <div className="text-xs text-gray-600">Over Limit</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-semibold text-blue-500">12</div>
                                <div className="text-xs text-gray-600">Avg Cravings</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Daily Input Modal */}
            <DailyInputModal
                isOpen={isInputModalOpen}
                onClose={() => setIsInputModalOpen(false)}
                onSubmit={handleDailyInput}
                isImmediatePlan={quitPlan.reductionType === "IMMEDIATE"}
                recommendedLimit={todayLimit}
            />
        </div>
    )
}
