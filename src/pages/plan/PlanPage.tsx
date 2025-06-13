"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimatedSection } from "@/components/ui/AnimatedSection"
import { PaymentFlow } from "@/pages/plan/styles/Payment"
import { PlanStats } from "@/pages/plan/styles/PlanStats"
import { PlanMilestones } from "@/pages/plan/styles/PlanMilestone"
import { PlanDetails } from "@/pages/plan/styles/PlanDetail"
import { PlanProgress } from "@/pages/plan/styles/PlanProgress"
import { PlanFormDialog } from "@/pages/plan/styles/PlanFormDialog"
import { ProgressDetails } from "@/pages/plan/styles/ProgressDetail"
import { usePlanCalculations } from "@/hooks/usePlanCalculations"
import { usePlanStorage } from "@/hooks/usePlanStorage"
import { usePlanForm } from "@/hooks/usePlanForm"
import { CIGARETTE_PRICES } from "@/pages/plan/styles/ui/types/cigarette"
import { Target, AlertTriangle, CreditCard, CalendarIcon, Plus, Sparkles, TrendingUp } from "lucide-react"

export default function PlanPage() {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
    const [activeTab, setActiveTab] = useState("plan")

    // Custom hooks
    const { currentPlan, setCurrentPlan, userSubscription, setUserSubscription } = usePlanStorage()
    const { days: smokeFreeDays, saved: moneySaved, progress } = usePlanCalculations(currentPlan)
    const {
        isCreatingPlan,
        setIsCreatingPlan,
        newPlan,
        resetForm,
        handleCreatePlan,
        handleEditPlan,
        handleInputChange,
        handleSelectChange,
        handleDateChange,
        handleNumberChange,
    } = usePlanForm(setCurrentPlan)

    // Force re-render when localStorage changes
    useEffect(() => {
        const handleStorageChange = () => {
            window.location.reload()
        }

        window.addEventListener("storage", handleStorageChange)
        return () => window.removeEventListener("storage", handleStorageChange)
    }, [])

    // Calculate cigarettes not smoked
    const cigarettesNotSmoked = currentPlan ? smokeFreeDays * currentPlan.dailyCigarettes : 0

    // Subscription logic
    const isPremiumUser = userSubscription.type === "premium"
    const isSubscriptionActive =
        isPremiumUser && (!userSubscription.expiryDate || userSubscription.expiryDate > new Date())

    const handleSelectPlan = (planType: "free" | "premium", duration?: string) => {
        if (planType === "free") {
            setUserSubscription({ type: "free" })
            alert("Bạn đã chuyển về gói miễn phí!")
        } else {
            const expiryDate = new Date()
            if (duration === "14 ngày") expiryDate.setDate(expiryDate.getDate() + 14)
            else if (duration === "30 ngày") expiryDate.setDate(expiryDate.getDate() + 30)
            else if (duration === "90 ngày") expiryDate.setDate(expiryDate.getDate() + 90)

            setUserSubscription({ type: "premium", duration, expiryDate })
            alert(`Chúc mừng! Bạn đã nâng cấp thành công lên gói Premium ${duration}!`)
            setActiveTab("plan")
        }
    }

    const handleDeletePlan = () => {
        setCurrentPlan(null)
        setIsConfirmingDelete(false)
        resetForm()
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pt-20">
            <div className="container mx-auto py-8 px-6 relative">
                {/* Premium Banner */}
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
                            <span className="bg-white/20 text-white px-2 py-1 rounded text-xs">PREMIUM</span>
                        </div>
                    </div>
                )}

                {/* Dialogs */}
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
                        cigarettePrices={CIGARETTE_PRICES}
                        isEditing={!!currentPlan}
                        isPremium={isSubscriptionActive}
                    />
                </Dialog>

                {/* Delete Dialog */}
                <Dialog open={isConfirmingDelete} onOpenChange={setIsConfirmingDelete}>
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-slate-900 rounded-lg p-6 max-w-md w-full">
                            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-4">
                                <AlertTriangle className="w-5 h-5" />
                                <h3 className="text-lg font-semibold">Xóa Kế Hoạch</h3>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 mb-6">
                                Bạn có chắc chắn muốn xóa kế hoạch cai thuốc lá của mình không?
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
                    </div>
                </Dialog>

                {/* Main Content */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                    <TabsList className="grid grid-cols-3 w-full max-w-lg mx-auto h-12 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-sm">
                        <TabsTrigger
                            value="plan"
                            className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                        >
                            <Target className="w-4 h-4" />
                            Kế Hoạch
                        </TabsTrigger>
                        <TabsTrigger
                            value="details"
                            className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                        >
                            <TrendingUp className="w-4 h-4" />
                            Chi Tiết
                        </TabsTrigger>
                        <TabsTrigger
                            value="payment"
                            className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                        >
                            <CreditCard className="w-4 h-4" />
                            {isSubscriptionActive ? "Quản Lý" : "Nâng Cấp"}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="plan">
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

                                    {/* Stats */}
                                    <AnimatedSection animation="fadeUp" delay={300}>
                                        <PlanStats days={smokeFreeDays} saved={moneySaved} progress={progress} />
                                    </AnimatedSection>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        {/* Left Column */}
                                        <div className="lg:col-span-2 space-y-6">
                                            <AnimatedSection animation="fadeUp" delay={400}>
                                                <PlanProgress
                                                    plan={currentPlan}
                                                    smokeFreeDays={smokeFreeDays}
                                                    moneySaved={moneySaved}
                                                    progress={progress}
                                                    isSubscriptionActive={isSubscriptionActive}
                                                />
                                            </AnimatedSection>

                                            <AnimatedSection animation="fadeUp" delay={500}>
                                                <PlanMilestones smokeFreeDays={smokeFreeDays} />
                                            </AnimatedSection>
                                        </div>

                                        {/* Right Column */}
                                        <div className="space-y-6">
                                            <AnimatedSection animation="fadeUp" delay={600}>
                                                <PlanDetails
                                                    plan={currentPlan}
                                                    onEdit={() => handleEditPlan(currentPlan)}
                                                    onDelete={() => setIsConfirmingDelete(true)}
                                                />
                                            </AnimatedSection>

                                            <AnimatedSection animation="fadeUp" delay={700}>
                                                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-emerald-100 dark:border-slate-700 shadow-xl rounded-lg p-6">
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <CalendarIcon className="w-5 h-5 text-emerald-500" />
                                                        <h3 className="text-lg font-semibold">Lịch</h3>
                                                    </div>
                                                    <Calendar selected={date} onSelect={setDate} className="rounded-md border-0" />
                                                </div>
                                            </AnimatedSection>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </TabsContent>

                    <TabsContent value="details">
                        {currentPlan ? (
                            <ProgressDetails
                                smokeFreeDays={smokeFreeDays}
                                moneySaved={moneySaved}
                                cigarettesNotSmoked={cigarettesNotSmoked}
                            />
                        ) : (
                            <div className="text-center py-12">
                                <h3 className="text-xl font-medium mb-2">Chưa có kế hoạch cai thuốc</h3>
                                <p className="text-slate-600 dark:text-slate-300 mb-6">
                                    Bạn cần tạo kế hoạch cai thuốc trước khi xem chi tiết tiến trình
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
