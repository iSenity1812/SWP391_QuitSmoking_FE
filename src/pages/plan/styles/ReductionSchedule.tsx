"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingDown, Calendar, Target, Zap, Clock } from "lucide-react"
import type { ReductionStep } from "@/pages/plan/styles/ui/types/plan"

interface ReductionScheduleProps {
    schedule: ReductionStep[]
    currentDay: number
}

export const ReductionSchedule: React.FC<ReductionScheduleProps> = ({ schedule, currentDay }) => {
    if (!schedule || schedule.length === 0) {
        return (
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-blue-100 dark:border-slate-700 shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                        <TrendingDown className="w-5 h-5 text-blue-500" />
                        Phương Pháp Giảm Dần Hàng Ngày
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <p className="text-slate-600 dark:text-slate-300">Chưa có lịch trình giảm dần</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const totalDays = schedule.length
    const completedDays = Math.max(0, currentDay - 1)
    const overallProgress = Math.min(100, (completedDays / totalDays) * 100)
    const todaySchedule = schedule[currentDay - 1]

    return (
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-blue-100 dark:border-slate-700 shadow-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                    <TrendingDown className="w-5 h-5 text-blue-500" />
                    Phương Pháp Giảm Dần Hàng Ngày
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
            
                {/* Progress Overview */}
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-700">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-emerald-800 dark:text-emerald-300">Tiến độ tổng thể:</h4>
                        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                            Ngày {currentDay} / {totalDays}
                        </Badge>
                    </div>
                    <Progress value={overallProgress} className="h-3 mb-2" />
                    <p className="text-emerald-700 dark:text-emerald-300 text-sm">
                        {Math.round(overallProgress)}% hoàn thành -{" "}
                        {currentDay <= totalDays ? "Đang tiến triển tốt!" : "Đã hoàn thành kế hoạch!"}
                    </p>
                </div>

                {/* Today's Target */}
                <div className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="font-medium text-blue-800 dark:text-blue-300">Mục tiêu hôm nay:</span>
                    </div>
                    {todaySchedule ? (
                        <div>
                            <p className="text-blue-700 dark:text-blue-300 text-sm mb-2">
                                {todaySchedule.cigarettesPerDay === 0 ? (
                                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                        🎉 Không hút thuốc lá nào! Bạn đã đạt được mục tiêu cuối cùng!
                                    </span>
                                ) : (
                                    <span>
                                        Hôm nay bạn chỉ hút <strong>{todaySchedule.cigarettesPerDay} điếu</strong>
                                        {currentDay > 1 && (
                                            <span className="text-emerald-600 dark:text-emerald-400 ml-2">(giảm 1 điếu so với hôm qua!)</span>
                                        )}
                                    </span>
                                )}
                            </p>
                            <p className="text-blue-600 dark:text-blue-400 text-xs italic">"{todaySchedule.description}"</p>
                        </div>
                    ) : currentDay > totalDays ? (
                        <p className="text-emerald-700 dark:text-emerald-300 text-sm">
                            🎉 Chúc mừng! Bạn đã hoàn thành toàn bộ kế hoạch giảm dần!
                        </p>
                    ) : (
                        <p className="text-slate-600 dark:text-slate-300 text-sm">Kế hoạch chưa bắt đầu</p>
                    )}
                </div>

                {/* Daily Schedule - Show next 7 days */}
                <div className="space-y-3">
                    <h4 className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        Lịch trình 7 ngày tới:
                    </h4>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                        {/* Progress Line Visualization */}
                        <div className="space-y-4">
                            {/* Days Labels */}
                            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                                {schedule.slice(Math.max(0, currentDay - 1), Math.max(7, currentDay + 6)).map((_, index) => {
                                    const dayNumber = Math.max(1, currentDay) + index - (currentDay > 1 ? 1 : 0)
                                    const actualStep = schedule[dayNumber - 1]
                                    if (!actualStep) return null

                                    return (
                                        <div key={`day-label-${dayNumber}`} className="text-center">
                                            <div className="font-medium">Ngày {dayNumber}</div>
                                            <div className={dayNumber === currentDay ? "text-blue-600 dark:text-blue-400" : ""}>
                                                {actualStep.cigarettesPerDay === 0 ? "0" : actualStep.cigarettesPerDay}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Progress Line */}
                            <div className="relative">
                                <div className="flex items-end justify-between h-20">
                                    {schedule.slice(Math.max(0, currentDay - 1), Math.max(7, currentDay + 6)).map((_, index) => {
                                        const dayNumber = Math.max(1, currentDay) + index - (currentDay > 1 ? 1 : 0)
                                        const actualStep = schedule[dayNumber - 1]
                                        if (!actualStep) return null

                                        const isCompleted = currentDay > dayNumber
                                        const isCurrent = currentDay === dayNumber
                                        const maxCigarettes = Math.max(...schedule.map((s) => s.cigarettesPerDay))
                                        const height = maxCigarettes > 0 ? (actualStep.cigarettesPerDay / maxCigarettes) * 100 : 0

                                        return (
                                            <div key={`bar-${dayNumber}`} className="flex flex-col items-center flex-1">
                                                <div
                                                    className={`w-8 rounded-t transition-all duration-300 ${isCompleted ? "bg-green-500" : isCurrent ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-600"
                                                        }`}
                                                    style={{ height: `${Math.max(height, 10)}%` }}
                                                />
                                                <div
                                                    className={`w-3 h-3 rounded-full mt-1 ${isCompleted ? "bg-green-500" : isCurrent ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-600"
                                                        }`}
                                                />
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Connecting Line */}
                                <div className="absolute bottom-1.5 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-600" />
                            </div>

                            {/* Current Status */}
                            <div className="text-center">
                                {todaySchedule && (
                                    <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                        <span className="text-sm text-blue-700 dark:text-blue-300">
                                            {todaySchedule.cigarettesPerDay === 0
                                                ? "Hôm nay: Không hút thuốc!"
                                                : `Hôm nay: ${todaySchedule.cigarettesPerDay} điếu`}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-700">
                        <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            <span className="text-purple-800 dark:text-purple-300 text-sm font-medium">Thời gian còn lại</span>
                        </div>
                        <p className="text-purple-700 dark:text-purple-300 text-lg font-bold">
                            {Math.max(0, totalDays - currentDay + 1)} ngày
                        </p>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-700">
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingDown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                            <span className="text-amber-800 dark:text-amber-300 text-sm font-medium">Đã giảm</span>
                        </div>
                        <p className="text-amber-700 dark:text-amber-300 text-lg font-bold">
                            {Math.max(0, currentDay - 1)} điếu/ngày
                        </p>
                    </div>
                </div>

    
            </CardContent>
        </Card>
    )
}
