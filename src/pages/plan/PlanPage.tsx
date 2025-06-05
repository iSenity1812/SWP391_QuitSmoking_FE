"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimatedSection } from "@/components/shared/AnimatedSection"
import { PaymentFlow } from "@/components/Plan/Payment"
import {
    CalendarIcon,
    Target,
    TrendingUp,
    DollarSign,
    Heart,
    Award,
    Edit3,
    Plus,
    Cigarette,
    Clock,
    CheckCircle2,
    Sparkles,
    Trash2,
    AlertTriangle,
    CreditCard,
    BarChart3,
} from "lucide-react"

interface Plan {
    id: number
    title: string
    description: string
    startDate: Date
    targetDate: Date
    dailyCigarettes: number
    motivation: string
    cigaretteType: string
}

interface PlanFormData {
    title: string
    description: string
    startDate: Date
    targetDate: Date
    dailyCigarettes: number
    motivation: string
    cigaretteType: string
}

// Danh sách các loại thuốc lá phổ biến ở Việt Nam và giá tham khảo (VNĐ)
const cigarettePrices: { [key: string]: number } = {
    "Vinataba (mềm)": 25000,
    "Vinataba (đóng gói cứng)": 30000,
    "Thăng Long": 23000,
    "Marlboro (đỏ/trắng)": 35000,
    "555": 40000,
    Esse: 30000,
    "Black Stone": 50000,
    "Captain Black": 60000,
    Khác: 30000,
}

const milestones = [
    { days: 1, title: "Ngày Đầu Tiên", description: "Cơ thể bắt đầu hồi phục", icon: CheckCircle2 },
    { days: 7, title: "Một Tuần", description: "Vị giác và khứu giác cải thiện", icon: Heart },
    { days: 30, title: "Một Tháng", description: "Tuần hoàn máu được cải thiện", icon: TrendingUp },
    { days: 90, title: "Ba Tháng", description: "Chức năng phổi tăng cường", icon: Award },
]

// Local storage key for persisting the plan
const PLAN_STORAGE_KEY = "quit_smoking_plan"
const USER_SUBSCRIPTION_KEY = "user_subscription"

export default function PlanPage() {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [isCreatingPlan, setIsCreatingPlan] = useState(false)
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
    const [currentPlan, setCurrentPlan] = useState<Plan | null>(null)
    const [activeTab, setActiveTab] = useState("plan")
    const [userSubscription, setUserSubscription] = useState<{
        type: "free" | "premium"
        duration?: string
        expiryDate?: Date
    }>({ type: "free" })

    const [newPlan, setNewPlan] = useState<PlanFormData>({
        title: "",
        description: "",
        startDate: new Date(),
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        dailyCigarettes: 0,
        motivation: "",
        cigaretteType: Object.keys(cigarettePrices)[0],
    })

    // Load plan from localStorage on component mount
    useEffect(() => {
        const savedPlan = localStorage.getItem(PLAN_STORAGE_KEY)
        if (savedPlan) {
            try {
                const parsedPlan = JSON.parse(savedPlan)
                // Convert date strings back to Date objects
                parsedPlan.startDate = new Date(parsedPlan.startDate)
                parsedPlan.targetDate = new Date(parsedPlan.targetDate)
                setCurrentPlan(parsedPlan)
            } catch (error) {
                console.error("Error loading plan from localStorage:", error)
                // Clear corrupted data
                localStorage.removeItem(PLAN_STORAGE_KEY)
            }
        }

        // Load subscription data
        const savedSubscription = localStorage.getItem(USER_SUBSCRIPTION_KEY)
        if (savedSubscription) {
            try {
                const parsedSubscription = JSON.parse(savedSubscription)
                if (parsedSubscription.expiryDate) {
                    parsedSubscription.expiryDate = new Date(parsedSubscription.expiryDate)
                }
                setUserSubscription(parsedSubscription)
            } catch (error) {
                console.error("Error loading subscription from localStorage:", error)
                localStorage.removeItem(USER_SUBSCRIPTION_KEY)
            }
        }
    }, [])

    // Save plan to localStorage whenever currentPlan changes
    useEffect(() => {
        if (currentPlan) {
            localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(currentPlan))
        } else {
            localStorage.removeItem(PLAN_STORAGE_KEY)
        }
    }, [currentPlan])

    // Save subscription to localStorage whenever userSubscription changes
    useEffect(() => {
        localStorage.setItem(USER_SUBSCRIPTION_KEY, JSON.stringify(userSubscription))
    }, [userSubscription])

    const handleCreatePlan = () => {
        // Validate required fields
        if (!newPlan.title.trim() || !newPlan.description.trim() || !newPlan.motivation.trim()) {
            alert("Vui lòng điền đầy đủ tất cả các trường bắt buộc")
            return
        }

        const plan: Plan = {
            id: Date.now(),
            ...newPlan,
        }
        setCurrentPlan(plan)
        setIsCreatingPlan(false)
        // Reset form
        resetForm()
    }

    const handleEditPlan = () => {
        if (currentPlan) {
            setNewPlan({
                title: currentPlan.title,
                description: currentPlan.description,
                startDate: currentPlan.startDate,
                targetDate: currentPlan.targetDate,
                dailyCigarettes: currentPlan.dailyCigarettes,
                motivation: currentPlan.motivation,
                cigaretteType: currentPlan.cigaretteType,
            })
            setIsCreatingPlan(true)
        }
    }

    const handleDeletePlan = () => {
        setCurrentPlan(null)
        setIsConfirmingDelete(false)
        resetForm()
    }

    const resetForm = () => {
        setNewPlan({
            title: "",
            description: "",
            startDate: new Date(),
            targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            dailyCigarettes: 0,
            motivation: "",
            cigaretteType: Object.keys(cigarettePrices)[0],
        })
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setNewPlan((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        setNewPlan((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewPlan((prev) => ({
            ...prev,
            [name]: new Date(value),
        }))
    }

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewPlan((prev) => ({
            ...prev,
            [name]: Number.parseInt(value) || 0,
        }))
    }

    const handleSelectPlan = (planType: "free" | "premium", duration?: string) => {
        if (planType === "free") {
            setUserSubscription({ type: "free" })
            alert("Bạn đã chuyển về gói miễn phí!")
        } else {
            // Calculate expiry date based on duration
            const expiryDate = new Date()
            if (duration === "14 ngày") {
                expiryDate.setDate(expiryDate.getDate() + 14)
            } else if (duration === "30 ngày") {
                expiryDate.setDate(expiryDate.getDate() + 30)
            } else if (duration === "90 ngày") {
                expiryDate.setDate(expiryDate.getDate() + 90)
            }

            setUserSubscription({
                type: "premium",
                duration: duration,
                expiryDate: expiryDate,
            })

            alert(`Chúc mừng! Bạn đã nâng cấp thành công lên gói Premium ${duration}!`)
            // Switch back to plan tab to see premium features
            setActiveTab("plan")
        }
    }

    const calculateSavings = (plan: Plan | null) => {
        if (!plan) return { days: 0, saved: 0, progress: 0 }

        const today = new Date()
        const startDate = new Date(plan.startDate)
        const targetDate = new Date(plan.targetDate)
        const timeDiff = today.getTime() - startDate.getTime()
        const totalDuration = targetDate.getTime() - startDate.getTime()
        const daysSmokeFree = Math.max(0, Math.floor(timeDiff / (1000 * 3600 * 24)))
        const totalDays = Math.floor(totalDuration / (1000 * 3600 * 24))
        const progress = Math.min(100, (daysSmokeFree / totalDays) * 100)

        const cigarettePricePerPack = cigarettePrices[plan.cigaretteType] || cigarettePrices["Khác"]
        const costPerCigarette = cigarettePricePerPack / 20
        const dailyCost = costPerCigarette * plan.dailyCigarettes
        const totalSaved = dailyCost * daysSmokeFree

        return { days: daysSmokeFree, saved: totalSaved, progress }
    }

    const { days: smokeFreeDays, saved: moneySaved, progress } = calculateSavings(currentPlan)

    const getNextMilestone = () => {
        return milestones.find((milestone) => milestone.days > smokeFreeDays) || milestones[milestones.length - 1]
    }

    const isPremiumUser = userSubscription.type === "premium"
    const isSubscriptionActive =
        isPremiumUser && (!userSubscription.expiryDate || userSubscription.expiryDate > new Date())

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pt-20">
            <div className="container mx-auto py-8 px-6 relative">
                {/* Premium Status Banner */}
                {isSubscriptionActive && (
                    <div className="mb-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4 rounded-lg shadow-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                <span className="font-medium">
                                    Gói Premium {userSubscription.duration} - Hết hạn:{" "}
                                    {userSubscription.expiryDate?.toLocaleDateString("vi-VN")}
                                </span>
                            </div>
                            <Badge className="bg-white/20 text-white">PREMIUM</Badge>
                        </div>
                    </div>
                )}

                {/* Dialog for creating/editing plans */}
                <Dialog open={isCreatingPlan} onOpenChange={setIsCreatingPlan}>
                    <PlanFormDialog
                        newPlan={newPlan}
                        onInputChange={handleInputChange}
                        onSelectChange={handleSelectChange}
                        onDateChange={handleDateChange}
                        onNumberChange={handleNumberChange}
                        onSubmit={handleCreatePlan}
                        onCancel={() => {
                            setIsCreatingPlan(false)
                            resetForm()
                        }}
                        cigarettePrices={cigarettePrices}
                        isEditing={!!currentPlan}
                        isPremium={isSubscriptionActive}
                    />
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={isConfirmingDelete} onOpenChange={setIsConfirmingDelete}>
                    <DialogContent className="sm:max-w-[400px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-2 border-red-100 dark:border-red-900">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                <AlertTriangle className="w-5 h-5" />
                                Xóa Kế Hoạch
                            </DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            <p className="text-slate-700 dark:text-slate-300 mb-4">
                                Bạn có chắc chắn muốn xóa kế hoạch cai thuốc lá của mình không? Hành động này không thể hoàn tác và bạn
                                sẽ mất tất cả dữ liệu tiến trình.
                            </p>
                            <div className="flex justify-end gap-4">
                                <Button variant="outline" onClick={() => setIsConfirmingDelete(false)}>
                                    Hủy
                                </Button>
                                <Button onClick={handleDeletePlan} className="bg-red-500 hover:bg-red-600 text-white">
                                    Xóa Kế Hoạch
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Tabs for different plan sections */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                    <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
                        <TabsTrigger value="plan" className="flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Kế Hoạch
                        </TabsTrigger>
                        <TabsTrigger value="progress" className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4" />
                            Tiến Trình
                        </TabsTrigger>
                        <TabsTrigger value="payment" className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            {isSubscriptionActive ? "Quản Lý Gói" : "Nâng Cấp"}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="plan">
                        {/* Existing Plan Content */}
                        <AnimatePresence mode="wait">
                            {!currentPlan ? (
                                <motion.div
                                    key="no-plan"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="flex flex-col items-center justify-center min-h-[60vh] space-y-8"
                                >
                                    <div className="text-center space-y-6">
                                        <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
                                            <Target className="w-12 h-12 text-white" />
                                        </div>
                                        <h1 className="text-4xl lg:text-5xl font-black text-slate-800 dark:text-white">
                                            Bắt Đầu Hành Trình
                                        </h1>
                                        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                                            Tạo kế hoạch cai thuốc lá cá nhân hóa và thực hiện bước đầu tiên hướng tới cuộc sống khỏe mạnh,
                                            không khói thuốc
                                        </p>
                                        {isSubscriptionActive && (
                                            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-700">
                                                <p className="text-emerald-700 dark:text-emerald-300 font-medium">
                                                    🎉 Bạn đang sử dụng gói Premium! Tận hưởng các tính năng cao cấp khi tạo kế hoạch.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Enhanced center button */}
                                    <button
                                        onClick={() => {
                                            resetForm()
                                            setIsCreatingPlan(true)
                                        }}
                                        className="px-10 py-5 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 hover:scale-105 transition-all duration-300 hover:-translate-y-1 shadow-xl shadow-emerald-200/50 dark:shadow-emerald-500/25 flex items-center gap-2"
                                    >
                                        <Plus className="w-6 h-6" />
                                        Tạo Kế Hoạch Của Bạn
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="with-plan"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-8"
                                >
                                    {/* Header */}
                                    <AnimatedSection animation="fadeUp" delay={200}>
                                        <div className="text-center space-y-4">
                                            <h1 className="text-4xl lg:text-5xl font-black text-slate-800 dark:text-white">
                                                Hành Trình Cai Thuốc
                                            </h1>
                                            <p className="text-xl text-slate-600 dark:text-slate-300">
                                                Theo dõi tiến trình và ăn mừng mỗi cột mốc quan trọng
                                            </p>
                                        </div>
                                    </AnimatedSection>

                                    {/* Stats Cards */}
                                    <AnimatedSection animation="fadeUp" delay={300}>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                            <StatsCard
                                                icon={CalendarIcon}
                                                title="Ngày Không Hút Thuốc"
                                                value={smokeFreeDays.toString()}
                                                subtitle="ngày"
                                                gradient="from-emerald-400 to-emerald-600"
                                            />
                                            <StatsCard
                                                icon={DollarSign}
                                                title="Tiền Tiết Kiệm"
                                                value={moneySaved.toLocaleString("vi-VN")}
                                                subtitle="VNĐ"
                                                gradient="from-green-400 to-green-600"
                                            />
                                            <StatsCard
                                                icon={TrendingUp}
                                                title="Tiến Trình"
                                                value={Math.round(progress).toString()}
                                                subtitle="%"
                                                gradient="from-blue-400 to-blue-600"
                                            />
                                            <StatsCard
                                                icon={Heart}
                                                title="Điểm Sức Khỏe"
                                                value="Đang Cải Thiện"
                                                subtitle=""
                                                gradient="from-rose-400 to-rose-600"
                                            />
                                        </div>
                                    </AnimatedSection>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        {/* Left Column */}
                                        <div className="lg:col-span-2 space-y-6">
                                            {/* Progress Card */}
                                            <AnimatedSection animation="fadeUp" delay={400}>
                                                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-emerald-100 dark:border-slate-700 shadow-xl">
                                                    <CardHeader>
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <CardTitle className="flex items-center gap-2">
                                                                    <Target className="w-5 h-5 text-emerald-500" />
                                                                    Tổng Quan Tiến Trình
                                                                    {isSubscriptionActive && (
                                                                        <Badge className="bg-emerald-500 text-white text-xs">PREMIUM</Badge>
                                                                    )}
                                                                </CardTitle>
                                                                <CardDescription>Hành trình hướng tới tự do</CardDescription>
                                                            </div>
                                                            <Badge
                                                                variant="secondary"
                                                                className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                                                            >
                                                                {Math.round(progress)}% Hoàn Thành
                                                            </Badge>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent className="space-y-6">
                                                        <div>
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className="text-sm font-medium">Tiến Trình Tổng Thể</span>
                                                                <span className="text-sm text-muted-foreground">
                                                                    {smokeFreeDays} /{" "}
                                                                    {Math.floor(
                                                                        (new Date(currentPlan.targetDate).getTime() -
                                                                            new Date(currentPlan.startDate).getTime()) /
                                                                        (1000 * 3600 * 24),
                                                                    )}{" "}
                                                                    ngày
                                                                </span>
                                                            </div>
                                                            <Progress value={progress} className="h-3" />
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                                                                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                                                    {smokeFreeDays}
                                                                </div>
                                                                <div className="text-sm text-muted-foreground">Ngày Không Hút Thuốc</div>
                                                            </div>
                                                            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                                                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                                    {moneySaved.toLocaleString("vi-VN")}
                                                                </div>
                                                                <div className="text-sm text-muted-foreground">VNĐ Tiết Kiệm</div>
                                                            </div>
                                                        </div>

                                                        {/* Premium Features */}
                                                        {isSubscriptionActive && (
                                                            <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/10 dark:to-blue-900/10 rounded-lg border border-emerald-200 dark:border-emerald-700">
                                                                <h4 className="font-medium text-emerald-700 dark:text-emerald-300 mb-2 flex items-center gap-2">
                                                                    <Sparkles className="w-4 h-4" />
                                                                    Tính Năng Premium
                                                                </h4>
                                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                                    <div className="flex items-center gap-2">
                                                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                                        <span>Tư vấn chuyên gia</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                                        <span>Báo cáo chi tiết</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                                        <span>Hỗ trợ 24/7</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                                        <span>Kế hoạch cá nhân</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            </AnimatedSection>

                                            {/* Milestones */}
                                            <AnimatedSection animation="fadeUp" delay={500}>
                                                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-emerald-100 dark:border-slate-700 shadow-xl">
                                                    <CardHeader>
                                                        <CardTitle className="flex items-center gap-2">
                                                            <Award className="w-5 h-5 text-emerald-500" />
                                                            Cột Mốc Quan Trọng
                                                        </CardTitle>
                                                        <CardDescription>Ăn mừng những thành tựu của bạn</CardDescription>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="space-y-4">
                                                            {milestones.map((milestone, index) => {
                                                                const isAchieved = smokeFreeDays >= milestone.days
                                                                const isNext = milestone === getNextMilestone() && !isAchieved

                                                                return (
                                                                    <motion.div
                                                                        key={milestone.days}
                                                                        initial={{ opacity: 0, x: -20 }}
                                                                        animate={{ opacity: 1, x: 0 }}
                                                                        transition={{ delay: index * 0.1 }}
                                                                        className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${isAchieved
                                                                                ? "bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-700"
                                                                                : isNext
                                                                                    ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700"
                                                                                    : "bg-gray-50 dark:bg-slate-700/50 border-2 border-gray-200 dark:border-slate-600"
                                                                            }`}
                                                                    >
                                                                        <div
                                                                            className={`w-12 h-12 rounded-full flex items-center justify-center ${isAchieved
                                                                                    ? "bg-emerald-500 text-white"
                                                                                    : isNext
                                                                                        ? "bg-blue-500 text-white"
                                                                                        : "bg-gray-300 dark:bg-slate-600 text-gray-600 dark:text-slate-400"
                                                                                }`}
                                                                        >
                                                                            <milestone.icon className="w-6 h-6" />
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <div className="flex items-center gap-2">
                                                                                <h4 className="font-semibold">{milestone.title}</h4>
                                                                                {isAchieved && <Sparkles className="w-4 h-4 text-emerald-500" />}
                                                                                {isNext && <Clock className="w-4 h-4 text-blue-500" />}
                                                                            </div>
                                                                            <p className="text-sm text-muted-foreground">{milestone.description}</p>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <div className="text-sm font-medium">{milestone.days} ngày</div>
                                                                            {isNext && (
                                                                                <div className="text-xs text-blue-600 dark:text-blue-400">
                                                                                    Còn {milestone.days - smokeFreeDays} ngày
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </motion.div>
                                                                )
                                                            })}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </AnimatedSection>
                                        </div>

                                        {/* Right Column */}
                                        <div className="space-y-6">
                                            {/* Plan Details */}
                                            <AnimatedSection animation="fadeUp" delay={600}>
                                                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-emerald-100 dark:border-slate-700 shadow-xl">
                                                    <CardHeader>
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <CardTitle>{currentPlan.title}</CardTitle>
                                                                <CardDescription>Kế hoạch cai thuốc của bạn</CardDescription>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Button variant="outline" size="sm" onClick={handleEditPlan}>
                                                                    <Edit3 className="w-4 h-4 mr-2" />
                                                                    Sửa
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => setIsConfirmingDelete(true)}
                                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                                                                >
                                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                                    Xóa
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent className="space-y-4">
                                                        <div>
                                                            <h4 className="font-medium text-sm text-muted-foreground mb-1">Mô Tả</h4>
                                                            <p className="text-sm">{currentPlan.description}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-sm text-muted-foreground mb-1">Động Lực</h4>
                                                            <p className="text-sm italic">{currentPlan.motivation}</p>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <h4 className="font-medium text-sm text-muted-foreground mb-1">Ngày Bắt Đầu</h4>
                                                                <p className="text-sm">{currentPlan.startDate.toLocaleDateString("vi-VN")}</p>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium text-sm text-muted-foreground mb-1">Ngày Mục Tiêu</h4>
                                                                <p className="text-sm">{currentPlan.targetDate.toLocaleDateString("vi-VN")}</p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-sm text-muted-foreground mb-1">Thói Quen Trước Đây</h4>
                                                            <div className="flex items-center gap-2">
                                                                <Cigarette className="w-4 h-4 text-muted-foreground" />
                                                                <span className="text-sm">{currentPlan.dailyCigarettes} điếu/ngày</span>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground mt-1">{currentPlan.cigaretteType}</p>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </AnimatedSection>

                                            {/* Calendar */}
                                            <AnimatedSection animation="fadeUp" delay={700}>
                                                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-emerald-100 dark:border-slate-700 shadow-xl">
                                                    <CardHeader>
                                                        <CardTitle className="flex items-center gap-2">
                                                            <CalendarIcon className="w-5 h-5 text-emerald-500" />
                                                            Lịch
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <Calendar selected={date} onSelect={setDate} className="rounded-md border-0" />
                                                    </CardContent>
                                                </Card>
                                            </AnimatedSection>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </TabsContent>

                    <TabsContent value="progress">
                        {currentPlan ? (
                            <div className="space-y-6">
                                <div className="text-center space-y-4">
                                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Chi Tiết Tiến Trình</h2>
                                    <p className="text-slate-600 dark:text-slate-300">Xem chi tiết về hành trình cai thuốc lá của bạn</p>
                                </div>

                                {/* Detailed Progress Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-emerald-100 dark:border-slate-700">
                                        <CardContent className="p-6 text-center">
                                            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Heart className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <h3 className="font-semibold mb-2">Sức Khỏe Tim Mạch</h3>
                                            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                                +{Math.min(smokeFreeDays * 2, 100)}%
                                            </p>
                                            <p className="text-sm text-muted-foreground">Cải thiện</p>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-blue-100 dark:border-slate-700">
                                        <CardContent className="p-6 text-center">
                                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <h3 className="font-semibold mb-2">Chức Năng Phổi</h3>
                                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                +{Math.min(smokeFreeDays * 1.5, 100)}%
                                            </p>
                                            <p className="text-sm text-muted-foreground">Phục hồi</p>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-purple-100 dark:border-slate-700">
                                        <CardContent className="p-6 text-center">
                                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <h3 className="font-semibold mb-2">Năng Lượng</h3>
                                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                                +{Math.min(smokeFreeDays * 3, 100)}%
                                            </p>
                                            <p className="text-sm text-muted-foreground">Tăng cường</p>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-orange-100 dark:border-slate-700">
                                        <CardContent className="p-6 text-center">
                                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Award className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                            </div>
                                            <h3 className="font-semibold mb-2">Thành Tựu</h3>
                                            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                                {milestones.filter((m) => m.days <= smokeFreeDays).length}
                                            </p>
                                            <p className="text-sm text-muted-foreground">Cột mốc đạt được</p>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Progress Chart Placeholder */}
                                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-emerald-100 dark:border-slate-700">
                                    <CardHeader>
                                        <CardTitle>Biểu Đồ Tiến Trình</CardTitle>
                                        <CardDescription>Theo dõi hành trình cai thuốc theo thời gian</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-64 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/10 dark:to-blue-900/10 rounded-lg flex items-center justify-center">
                                            <div className="text-center">
                                                <BarChart3 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                                                <p className="text-slate-600 dark:text-slate-300">Biểu đồ tiến trình sẽ được hiển thị ở đây</p>
                                                {isSubscriptionActive && (
                                                    <p className="text-emerald-600 dark:text-emerald-400 text-sm mt-2">
                                                        ✨ Tính năng Premium: Biểu đồ chi tiết và phân tích xu hướng
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <h3 className="text-xl font-medium mb-2">Chưa có kế hoạch cai thuốc</h3>
                                <p className="text-slate-600 dark:text-slate-300 mb-6">
                                    Bạn cần tạo kế hoạch cai thuốc trước khi xem tiến trình
                                </p>
                                <Button onClick={() => setActiveTab("plan")}>Tạo Kế Hoạch</Button>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="payment">
                        <PaymentFlow onSelectPlan={handleSelectPlan} onBack={() => setActiveTab("plan")} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

// Stats Card Component
function StatsCard({
    icon: Icon,
    title,
    value,
    subtitle,
    gradient,
}: {
    icon: any
    title: string
    value: string
    subtitle: string
    gradient: string
}) {
    return (
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-emerald-100 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <div className="flex items-baseline gap-1">
                            <p className="text-2xl font-bold">{value}</p>
                            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
                        </div>
                    </div>
                    <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
                    >
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// Plan Form Dialog Component
function PlanFormDialog({
    newPlan,
    onInputChange,
    onSelectChange,
    onDateChange,
    onNumberChange,
    onSubmit,
    onCancel,
    cigarettePrices,
    isEditing = false,
    isPremium = false,
}: {
    newPlan: PlanFormData
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onSubmit: () => void
    onCancel: () => void
    cigarettePrices: { [key: string]: number }
    isEditing?: boolean
    isPremium?: boolean
}) {
    return (
        <DialogContent className="sm:max-w-[600px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-2 border-emerald-100 dark:border-slate-700">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                    <Target className="w-5 h-5 text-emerald-500" />
                    {isEditing ? "Chỉnh Sửa Kế Hoạch" : "Tạo Kế Hoạch Cai Thuốc"}
                    {isPremium && <Badge className="bg-emerald-500 text-white text-xs">PREMIUM</Badge>}
                </DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
                {isPremium && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-700">
                        <p className="text-emerald-700 dark:text-emerald-300 text-sm flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Bạn đang sử dụng gói Premium! Tận hưởng các tính năng cao cấp và tư vấn cá nhân hóa.
                        </p>
                    </div>
                )}

                <div className="grid gap-2">
                    <Label htmlFor="title" className="text-sm font-medium text-slate-900 dark:text-white">
                        Tên Kế Hoạch <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="title"
                        name="title"
                        value={newPlan.title}
                        onChange={onInputChange}
                        placeholder="VD: Hành trình cai thuốc 30 ngày"
                        className="border-2 border-emerald-100 dark:border-slate-600 focus:border-emerald-300 dark:focus:border-emerald-500 text-slate-900 dark:text-white bg-white dark:bg-slate-800 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="description" className="text-sm font-medium text-slate-900 dark:text-white">
                        Mô Tả <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                        id="description"
                        name="description"
                        value={newPlan.description}
                        onChange={onInputChange}
                        placeholder="Mô tả chi tiết kế hoạch cai thuốc lá của bạn"
                        className="border-2 border-emerald-100 dark:border-slate-600 focus:border-emerald-300 dark:focus:border-emerald-500 text-slate-900 dark:text-white bg-white dark:bg-slate-800 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                        rows={3}
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="cigaretteType" className="text-sm font-medium text-slate-900 dark:text-white">
                        Loại Thuốc Lá
                    </Label>
                    <select
                        id="cigaretteType"
                        name="cigaretteType"
                        value={newPlan.cigaretteType}
                        onChange={onSelectChange}
                        className="flex h-10 w-full rounded-md border-2 border-emerald-100 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm ring-offset-background focus:border-emerald-300 dark:focus:border-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 text-slate-900 dark:text-white"
                    >
                        {Object.keys(cigarettePrices).map((type) => (
                            <option key={type} value={type} className="text-slate-900 dark:text-white bg-white dark:bg-slate-800">
                                {type} - {cigarettePrices[type].toLocaleString("vi-VN")} VNĐ/gói
                            </option>
                        ))}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label className="text-sm font-medium text-slate-900 dark:text-white">Ngày Bắt Đầu</Label>
                        <Input
                            type="date"
                            name="startDate"
                            value={newPlan.startDate?.toISOString().split("T")[0]}
                            onChange={onDateChange}
                            className="border-2 border-emerald-100 dark:border-slate-600 focus:border-emerald-300 dark:focus:border-emerald-500 text-slate-900 dark:text-white bg-white dark:bg-slate-800"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label className="text-sm font-medium text-slate-900 dark:text-white">Ngày Mục Tiêu</Label>
                        <Input
                            type="date"
                            name="targetDate"
                            value={newPlan.targetDate?.toISOString().split("T")[0]}
                            onChange={onDateChange}
                            className="border-2 border-emerald-100 dark:border-slate-600 focus:border-emerald-300 dark:focus:border-emerald-500 text-slate-900 dark:text-white bg-white dark:bg-slate-800"
                        />
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="dailyCigarettes" className="text-sm font-medium text-slate-900 dark:text-white">
                        Số Điếu Thuốc Hàng Ngày (trước khi cai)
                    </Label>
                    <Input
                        id="dailyCigarettes"
                        name="dailyCigarettes"
                        type="number"
                        value={newPlan.dailyCigarettes}
                        onChange={onNumberChange}
                        placeholder="VD: 20"
                        min="0"
                        className="border-2 border-emerald-100 dark:border-slate-600 focus:border-emerald-300 dark:focus:border-emerald-500 text-slate-900 dark:text-white bg-white dark:bg-slate-800 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="motivation" className="text-sm font-medium text-slate-900 dark:text-white">
                        Động Lực Của Bạn <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                        id="motivation"
                        name="motivation"
                        value={newPlan.motivation}
                        onChange={onInputChange}
                        placeholder="Viết lý do tại sao bạn muốn cai thuốc lá..."
                        className="border-2 border-emerald-100 dark:border-slate-600 focus:border-emerald-300 dark:focus:border-emerald-500 text-slate-900 dark:text-white bg-white dark:bg-slate-800 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                        rows={3}
                        required
                    />
                </div>
            </div>
            <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={onCancel}>
                    Hủy
                </Button>
                <Button
                    onClick={onSubmit}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                >
                    {isEditing ? "Cập Nhật Kế Hoạch" : "Tạo Kế Hoạch"}
                </Button>
            </div>
        </DialogContent>
    )
}
