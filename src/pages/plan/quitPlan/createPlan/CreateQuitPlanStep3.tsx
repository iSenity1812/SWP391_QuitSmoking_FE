"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronRight, ChevronLeft, Calendar, Target, CheckCircle2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useQuitPlan } from "@/context/QuitPlanContext"
import { quitPlanService } from "@/services/quitPlanService"
import { QuitPlanCalculator } from "@/utils/QuitPlanCalculator"

type PlanType = "IMMEDIATE" | "LINEAR" | "EXPONENTIAL" | "LOGARITHMIC"

interface PlanOption {
  type: "immediate" | "gradual"
  variant?: string
  planType: PlanType
  title: string
  subtitle: string
  description: string
  icon: string
  recommended?: boolean
}

const CreateQuitPlanStep3 = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const { formData, updateFormData } = useQuitPlan()
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(formData.reductionType || null);
  const [startDate, setStartDate] = useState(formData.startDate ? formData.startDate.toISOString().split("T")[0] : "");
  const [endDate, setEndDate] = useState(formData.goalDate ? formData.goalDate.toISOString().split("T")[0] : "");
  const [attempts, setAttempts] = useState(0);
  const [showAdjustmentNotification, setShowAdjustmentNotification] = useState(false);

  useEffect(() => {
    quitPlanService.getAllQuitPlans().then((plans) => {
      setAttempts(plans.length);
    });
  }, []);

  const getPlanRecommendations = (): PlanOption[] => {
    const initial = formData.initialSmokingAmount
    let recommendedTypes: PlanType[] = []

    // Personalization Logic
    if (initial === 1) {
      recommendedTypes = ["IMMEDIATE"]
    } else if (initial <= 5) {
      recommendedTypes = ["LINEAR", "EXPONENTIAL"]
    } else if (initial <= 10) {
      recommendedTypes = ["LINEAR", "LOGARITHMIC"]
    } else {
      recommendedTypes = ["LINEAR", "EXPONENTIAL", "LOGARITHMIC"]
    }

    const plans: PlanOption[] = [
      {
        type: "immediate",
        planType: "IMMEDIATE",
        title: "Immediate",
        subtitle: "Full stop",
        description:
          "Perfect for those ready to quit completely right away. Requires strong commitment but delivers immediate results.",
        icon: "🚀",
        recommended: recommendedTypes.includes("IMMEDIATE"),
      },
      {
        type: "gradual",
        variant: "Linear",
        planType: "LINEAR",
        title: "Gradual",
        subtitle: "Reduce the same amount each day",
        description:
          "Steady, predictable progress that's easier to maintain. Stick to a clear and linear path to freedom. Ideal if you prefer consistency.",
        icon: "📉",
        recommended: recommendedTypes.includes("LINEAR"),
      },
      {
        type: "gradual",
        variant: "Strong Start",
        planType: "EXPONENTIAL",
        title: "Gradual",
        subtitle: "Start slow, then accelerate reduction",
        description: "Take your time at first, then finish strong with rapid progress later. Great for those who need time to adapt early on.",
        icon: "📈",
        recommended: recommendedTypes.includes("EXPONENTIAL"),
      },
      {
        type: "gradual",
        variant: "Light Start",
        planType: "LOGARITHMIC",
        title: "Gradual",
        subtitle: "Quick initial reduction, then slower pace",
        description: "Get ahead early and maintain balance. Designed for those motivated by early impact.",
        icon: "📊",
        recommended: recommendedTypes.includes("LOGARITHMIC"),
      },
    ]

    return plans
  }

  const getRecommendedDuration = () => {
    const initial = formData.initialSmokingAmount
    if (initial === 1) return { min: 6, max: 13 }
    if (initial <= 5) return { min: 13, max: 29 }
    if (initial <= 10) return { min: 29, max: 59 }
    return { min: 59, max: 89 }
  }

  const planOptions = getPlanRecommendations()
  const recommendedDuration = getRecommendedDuration()

  const calculateRecommendedEndDate = (start: Date, minDays: number) => {
    const end = new Date(start)
    end.setDate(start.getDate() + minDays)
    return end.toISOString().split("T")[0]
  }

  useEffect(() => {
    // Chỉ đặt startDate và endDate mặc định nếu chúng chưa được thiết lập từ formData
    if (!formData.startDate) {
      const today = new Date();
      setStartDate(today.toISOString().split("T")[0]);
    }
    if (!formData.goalDate) {
      const defaultEndDate = calculateRecommendedEndDate(
        formData.startDate || new Date(), // Sử dụng startDate từ form nếu có
        recommendedDuration.min
      );
      setEndDate(defaultEndDate);
    }

    // Buộc chọn "IMMEDIATE" nếu số điếu là 1 và chưa có planType được chọn
    if (formData.initialSmokingAmount === 1 && !formData.reductionType) {
      setSelectedPlan("IMMEDIATE");
    } else if (formData.reductionType) {
      // Đảm bảo selectedPlan đồng bộ với formData nếu nó đã có giá trị
      setSelectedPlan(formData.reductionType);
    }

  }, [formData.initialSmokingAmount, formData.startDate, formData.goalDate, formData.reductionType]);

  const handleEndDateChange = (newEndDate: string) => {
    const start = formData.startDate || new Date(startDate); // Dùng startDate từ formData hoặc local
    const end = new Date(newEndDate);

    let diffTime = QuitPlanCalculator.getTotalDays(start.toISOString(), end.toISOString())

    if (diffTime > 90) {
      const maxEndDate = new Date(start);
      maxEndDate.setDate(start.getDate() + 89);
      const adjustedEndDateISO = maxEndDate.toISOString().split("T")[0];
      setEndDate(adjustedEndDateISO);
      diffTime = QuitPlanCalculator.getTotalDays(startDate, endDate);

      setShowAdjustmentNotification(true);
      setTimeout(() => setShowAdjustmentNotification(false), 4000);
      // Cập nhật cả formData của context
      updateFormData({ goalDate: maxEndDate, duration: diffTime });
    } else {
      setEndDate(newEndDate);
      // Cập nhật cả formData của context
      updateFormData({ goalDate: end, duration: diffTime });
    }
  };

  const handleStartDateChange = (newStartDate: string) => {
    const start = new Date(newStartDate);
    const currentEnd = formData.goalDate || new Date(endDate); // Dùng goalDate từ formData hoặc local

    let diffTime = QuitPlanCalculator.getTotalDays(start.toISOString(), currentEnd.toISOString());

    if (currentEnd <= start || diffTime > 90) {
      const updatedEnd = calculateRecommendedEndDate(start, recommendedDuration.min);
      setStartDate(newStartDate);
      setEndDate(updatedEnd);
      diffTime = QuitPlanCalculator.getTotalDays(startDate, endDate);
      // Cập nhật cả formData của context
      updateFormData({
        startDate: start,
        goalDate: new Date(updatedEnd),
        duration: diffTime,
      });
    } else {
      setStartDate(newStartDate);
      // Cập nhật cả formData của context
      updateFormData({ startDate: start, duration: diffTime });
    }
  };

  const handleContinue = () => {
    if (selectedPlan && startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const duration = QuitPlanCalculator.getTotalDays(start.toISOString(), end.toISOString());

      updateFormData({
        reductionType: selectedPlan,
        startDate: start,
        goalDate: end,
        duration: duration,
      })
      onNext()
    }
  }

  const isFormValid = selectedPlan && startDate && endDate

  return (
    <div className="min-h-screen pt-25 pb-10 relative overflow-hidden bg-gradient-to-bl from-emerald-50 to-white dark:from-slate-900/99 dark:to-slate-800">
      <div className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-emerald-100 opacity-30 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-20 h-[300px] w-[300px] rounded-full bg-teal-100 opacity-30 blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-45 py-8">
        <div className="mx-auto">
          <AnimatePresence>
            {/* Header */}
            <div className="max-w-4xl mx-auto mb-15">
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-12"
              >
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  Choose Your{" "}
                  <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                    Quit Strategy
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  Everyones journey is different. Choose what suits you best
                </p>
              </motion.div>

              {/* User Profile Summary */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-8"
              >
                <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200">
                  <CardContent>
                    <div className="grid grid-cols-3 md:grid-cols-7 gap-4">
                      <CardTitle className="text-lg flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
                        {/* <Target className="w-5 h-5 text-emerald-600" /> */}
                        Your Habbit
                      </CardTitle>
                      <div className="col-span-2 flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                          <span className="text-red-600 text-lg">🚬</span>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Daily Cigarettes</p>
                          <p className="font-semibold text-foreground">{formData.initialSmokingAmount}</p>
                        </div>
                      </div>

                      <div className="col-span-2 flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-lg">💸</span>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Cost Per Week</p>
                          <p className="font-semibold text-foreground">
                            {(formData.initialSmokingAmount * 7 * (formData.costPerPack / formData.cigarettesPerPack)).toLocaleString("vi-VN")} VNĐ
                          </p>
                        </div>
                      </div>

                      <div className="col-span-2 flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 text-lg">🌱</span>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Previous Quit Attempts</p>
                          <p className="font-semibold text-foreground">{attempts > 0 ? attempts : "First Attempt"}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Plan Selection */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-12"
            >

              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Target className="w-6 h-6 text-emerald-600" />
                Select Your Plan Type
              </h2>

              {/* Auto-adjustment notification */}
              {(formData.initialSmokingAmount === 1) && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg"
                >
                  <p className="text-sm text-amber-700">
                    ⚠️ Quit Type is automatically selected to suit with your smoking habits (1 cigarette per day)
                  </p>
                </motion.div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                {planOptions.map((plan, index) => {
                  const isRecommended = plan.recommended
                  return (
                    <motion.div
                      key={plan.type}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all duration-300 hover:shadow-lg relative overflow-hidden
                            ${selectedPlan === plan.planType
                            ? "ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-lg"
                            : isRecommended
                              ? "border-emerald-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                              : "hover:bg-gray-50 dark:hover:bg-gray-800"
                          }
                          ${formData.initialSmokingAmount === 1 && plan.planType !== "IMMEDIATE" ? "cursor-not-allowed opacity-50" : ""}`
                        }
                        onClick={() => {
                          if (formData.initialSmokingAmount !== 1) {
                            setSelectedPlan(plan.planType);
                            updateFormData({ reductionType: plan.planType }); // <-- Thêm dòng này
                          }
                        }}
                      >
                        {isRecommended && (
                          <div className="absolute top-3 right-3 z-10">
                            <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-medium">
                              ⭐ Recommended
                            </span>
                          </div>
                        )}

                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${selectedPlan === plan.planType
                                  ? "bg-emerald-100 dark:bg-emerald-800"
                                  : isRecommended
                                    ? "bg-emerald-50 dark:bg-emerald-900/50"
                                    : "bg-gray-100 dark:bg-gray-800"
                                  }`}
                              >
                                {plan.icon}
                              </div>
                              <div className="flex-1">
                                <div className="mb-2">
                                  <CardTitle
                                    className={`text-lg leading-tight ${selectedPlan === plan.planType ? "text-emerald-700 dark:text-emerald-300" : ""
                                      }`}
                                  >
                                    {plan.title == "Immediate" ? (<>{plan.title}</>) : (<>{plan.variant}</>)}

                                    <div className="text-sm font-medium text-muted-foreground mt-1">{plan.subtitle}</div>
                                  </CardTitle>
                                </div>
                              </div>
                            </div>
                            {selectedPlan === plan.planType && (
                              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription
                            className={`text-sm leading-relaxed ${selectedPlan === plan.planType ? "text-emerald-600 dark:text-emerald-400" : ""
                              }`}
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              height: "3.0em", // 1.2em * 2 dòng
                              lineHeight: "1.5em",
                            }}
                          >
                            {plan.description}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* Date Selection */}
            <AnimatePresence mode="wait">
              {selectedPlan !== "IMMEDIATE" && (
                <motion.div
                  key="timeline-section"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40, height: 0, marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="mb-12 overflow-hidden"
                >
                  <div className="flex items-center gap-4 mb-7">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-6 h-6 text-emerald-600" />
                      <h2 className="text-2xl font-bold mb-0">Set Your Timeline</h2>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Maximum duration: 90 days</p>
                  </div>

                  {/* Auto-adjustment notification */}
                  {showAdjustmentNotification && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg"
                    >
                      <p className="text-sm text-amber-700">
                        ⚠️ Goal date automatically adjusted to stay within 90-day maximum duration
                      </p>
                    </motion.div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="startDate" className="text-sm font-medium">
                        Start Date
                      </Label>
                      <input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => handleStartDateChange(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-3 py-3 mt-1
                    bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                      <p className="text-xs text-muted-foreground">You can start today or choose a future date</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="endDate" className="text-sm font-medium">
                          Target Quit Date
                        </Label>
                        <p className="text-xs text-right text-emerald-600 font-medium">
                          Recommended: {recommendedDuration.min + 1}–{recommendedDuration.max + 1} days
                        </p>

                      </div>

                      <input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => handleEndDateChange(e.target.value)}
                        min={startDate}
                        className="w-full px-3 py-3 border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                      {/* Duration display */}
                      {startDate && endDate && (
                        <div className="mt-2 p-2 bg-emerald-50 rounded-lg">
                          <p className="text-sm text-emerald-700">
                            Duration:{" "}
                            {QuitPlanCalculator.getTotalDays(startDate, endDate)
                            }{" "}
                            days
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <motion.div
              // initial={{ opacity: 0, y: 50 }}
              // animate={{ opacity: 1, y: 0 }}
              // transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                onClick={onBack}
                variant="outline"
                size="lg"
                className="px-8 py-3 text-base font-medium border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-transparent"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back to Previous Step
              </Button>

              <Button
                onClick={handleContinue}
                disabled={!isFormValid}
                size="lg"
                className="px-8 py-3 text-base font-medium bg-emerald-500 hover:bg-emerald-600 text-white group disabled:opacity-50"
              >
                <Star className="w-5 h-5 mr-2" />
                <span className="mr-2">Continue to Confirmation</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default CreateQuitPlanStep3
