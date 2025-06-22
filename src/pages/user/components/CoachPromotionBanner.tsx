"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    Award,
    Users,
    TrendingUp,
    Crown,
    CheckCircle,
    ArrowRight,
    Sparkles,
    Target,
    BookOpen,
    Heart,
} from "lucide-react"
import type { User } from "../types/user-types"

interface CoachPromotionBannerProps {
    user: User
    onApplyCoach: () => void
}

export function CoachPromotionBanner({ user, onApplyCoach }: CoachPromotionBannerProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    // Calculate eligibility score based on user progress
    const calculateEligibilityScore = () => {
        let score = 0

        // Days smoke-free (max 30 points) - using daysSmokeFreee from User type
        const daysSmokeFreee = user.daysSmokeFreee || 0
        score += Math.min((daysSmokeFreee / 30) * 30, 30)

        // Achievements (max 25 points)
        const achievementCount = user.achievements?.length || 0
        score += Math.min((achievementCount / 5) * 25, 25)

        // Community engagement (max 20 points) - using friends count as proxy
        const communityScore = user.friends?.length || 0
        score += Math.min((communityScore / 5) * 20, 20)

        // Streak consistency (max 15 points) - using streak from User type
        const currentStreak = user.streak || 0
        score += Math.min((currentStreak / 14) * 15, 15)

        // Profile completeness (max 10 points)
        const profileComplete = user.avatar && user.name ? 10 : 5
        score += profileComplete

        return Math.round(score)
    }

    const eligibilityScore = calculateEligibilityScore()
    const isEligible = eligibilityScore >= 70
    const daysSmokeFreee = user.daysSmokeFreee || 0

    const requirements = [
        {
            id: "smoke-free",
            label: "Ít nhất 30 ngày không hút thuốc",
            completed: daysSmokeFreee >= 30,
            current: daysSmokeFreee,
            target: 30,
            icon: Target,
        },
        {
            id: "achievements",
            label: "Đạt được ít nhất 5 thành tựu",
            completed: (user.achievements?.length || 0) >= 5,
            current: user.achievements?.length || 0,
            target: 5,
            icon: Award,
        },
        {
            id: "community",
            label: "Tích cực trong cộng đồng",
            completed: (user.friends?.length || 0) >= 5,
            current: user.friends?.length || 0,
            target: 5,
            icon: Users,
        },
        {
            id: "streak",
            label: "Duy trì chuỗi ngày ít nhất 2 tuần",
            completed: (user.streak || 0) >= 14,
            current: user.streak || 0,
            target: 14,
            icon: TrendingUp,
        },
    ]

    const completedRequirements = requirements.filter((req) => req.completed).length

    if (daysSmokeFreee < 7) {
        return null // Don't show banner for very new users
    }

    return (
        <Card className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Crown className="h-6 w-6 text-amber-600" />
                            <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100">Trở thành Chuyên gia Hỗ trợ</h3>
                            {isEligible && (
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Đủ điều kiện
                                </Badge>
                            )}
                        </div>

                        <p className="text-amber-800 dark:text-amber-200 mb-4">
                            {isEligible
                                ? "🎉 Chúc mừng! Bạn đã đủ điều kiện để trở thành chuyên gia hỗ trợ và giúp đỡ những người khác bỏ thuốc lá."
                                : "Tiếp tục hành trình của bạn để trở thành chuyên gia hỗ trợ và giúp đỡ cộng đồng bỏ thuốc lá."}
                        </p>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-amber-800 dark:text-amber-200">Điểm đủ điều kiện</span>
                                    <span className="text-sm font-bold text-amber-900 dark:text-amber-100">{eligibilityScore}/100</span>
                                </div>
                                <Progress value={eligibilityScore} className="h-2" />
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-amber-600">{completedRequirements}/4</div>
                                <div className="text-xs text-amber-700 dark:text-amber-300">Yêu cầu</div>
                            </div>
                        </div>

                        {!isExpanded && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsExpanded(true)}
                                className="text-amber-700 border-amber-300 hover:bg-amber-100 dark:text-amber-300 dark:border-amber-700 dark:hover:bg-amber-900/20"
                            >
                                Xem chi tiết yêu cầu
                                <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        )}

                        {isExpanded && (
                            <div className="mt-4 space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {requirements.map((req) => (
                                        <div
                                            key={req.id}
                                            className={`flex items-center gap-3 p-3 rounded-lg border ${req.completed
                                                ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
                                                : "bg-white border-amber-200 dark:bg-slate-800 dark:border-amber-700"
                                                }`}
                                        >
                                            <req.icon className={`h-5 w-5 ${req.completed ? "text-green-600" : "text-amber-600"}`} />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`text-sm font-medium ${req.completed
                                                            ? "text-green-800 dark:text-green-200"
                                                            : "text-amber-800 dark:text-amber-200"
                                                            }`}
                                                    >
                                                        {req.label}
                                                    </span>
                                                    {req.completed && <CheckCircle className="h-4 w-4 text-green-600" />}
                                                </div>
                                                <div className="text-xs text-slate-600 dark:text-slate-400">
                                                    {req.current}/{req.target}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <BookOpen className="h-5 w-5 text-blue-600" />
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                            Lợi ích khi trở thành Chuyên gia
                                        </div>
                                        <div className="text-xs text-blue-600 dark:text-blue-300">
                                            • Nhận hoa hồng từ việc tư vấn • Truy cập công cụ chuyên nghiệp • Huy hiệu đặc biệt
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsExpanded(false)}
                                        className="text-amber-700 border-amber-300 hover:bg-amber-100 dark:text-amber-300 dark:border-amber-700"
                                    >
                                        Thu gọn
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="ml-4">
                        {isEligible ? (
                            <Button
                                onClick={onApplyCoach}
                                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-6 py-2 shadow-lg"
                            >
                                <Sparkles className="h-4 w-4 mr-2" />
                                Đăng ký ngay
                            </Button>
                        ) : (
                            <div className="text-center">
                                <div className="text-2xl mb-1">🎯</div>
                                <div className="text-xs text-amber-700 dark:text-amber-300">Cần {70 - eligibilityScore} điểm nữa</div>
                            </div>
                        )}
                    </div>
                </div>

                {isEligible && (
                    <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2">
                            <Heart className="h-5 w-5 text-green-600" />
                            <span className="text-sm font-medium text-green-800 dark:text-green-200">
                                Bạn có thể giúp đỡ những người khác trên hành trình bỏ thuốc lá và kiếm thêm thu nhập!
                            </span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
