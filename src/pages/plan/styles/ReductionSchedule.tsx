"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, TrendingDown, Calendar, Target, Zap, Clock } from "lucide-react"
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
                {/* Main Info Section */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                    <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                        Bạn đã chọn phương pháp giảm dần hàng ngày!
                    </h4>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                        Mỗi ngày bạn sẽ giảm 1 điếu thuốc so với ngày hôm trước. Đây là cách tiếp cận từ từ nhưng kiên định, giúp cơ
                        thể thích nghi dần dần với việc giảm nicotine.
                    </p>
                </div>

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
                            <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                                <Calendar className="w-4 h-4" />
                                <span>Ngày {currentDay} trong kế hoạch</span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-blue-700 dark:text-blue-300 text-sm">
                            Kế hoạch đã hoàn thành! Chúc mừng bạn!
                        </p>
                    )}
                </div>

                {/* Schedule Preview */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h4 className="font-medium text-slate-800 dark:text-slate-300 mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Lịch trình giảm dần:
                    </h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                        {schedule.map((step, index) => {
                            const isCompleted = index < currentDay - 1
                            const isToday = index === currentDay - 1
                            const isFuture = index > currentDay - 1

                            return (
                                <div
                                    key={index}
                                    className={`flex items-center justify-between p-2 rounded-md text-sm ${
                                        isCompleted
                                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300"
                                            : isToday
                                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-2 border-blue-300 dark:border-blue-600"
                                                : "bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400"
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        {isCompleted ? (
                                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                                        ) : isToday ? (
                                            <Zap className="w-4 h-4 text-blue-600" />
                                        ) : (
                                            <Clock className="w-4 h-4 text-slate-500" />
                                        )}
                                        <span>Ngày {index + 1}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">
                                            {step.cigarettesPerDay} điếu
                                        </span>
                                        {isToday && (
                                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs">
                                                Hôm nay
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Tips */}
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-700">
                    <h4 className="font-medium text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Lời khuyên:
                    </h4>
                    <ul className="text-amber-700 dark:text-amber-300 text-sm space-y-1">
                        <li>• Hãy kiên định với mục tiêu hàng ngày</li>
                        <li>• Nếu vượt quá mục tiêu, đừng bỏ cuộc - hãy tiếp tục vào ngày mai</li>
                        <li>• Sử dụng các kỹ thuật thở và thư giãn khi thèm thuốc</li>
                        <li>• Theo dõi tiến độ và ăn mừng những thành công nhỏ</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    )
}
