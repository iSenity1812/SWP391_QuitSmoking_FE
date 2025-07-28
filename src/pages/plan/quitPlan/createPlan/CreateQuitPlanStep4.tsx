"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, CheckCircle2, Calendar, Target, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuitPlan } from "@/context/QuitPlanContext"
import type { QuitPlanCreateRequestDTO, ReductionQuitPlanType } from "@/services/quitPlanService"
import { quitPlanService } from "@/services/quitPlanService"

const formatVietnameseDate = (date: Date): string => {
  const days = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"]
  const dayName = days[date.getDay()]
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return `${dayName}, ngày ${day} tháng ${month}, ${year}`
}

const CreateQuitPlanStep4 = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const { formData, resetFormData } = useQuitPlan()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const validateField = (name: keyof typeof formData, value: string): string | undefined => {
    if (name === "initialSmokingAmount" || name === "cigarettesPerPack" || name === "costPerPack") {
      if (!value.trim()) return "This field is required";

      const numValue = Number.parseFloat(value);
      if (isNaN(numValue) || numValue < 0) return "Please enter a valid positive number";

      switch (name) {
        case "initialSmokingAmount":
          if (numValue === 0) return "Please enter a number greater than 0";
          if (numValue > 100) return "Please enter a realistic number (max 100)";
          break;
        case "cigarettesPerPack":
          if (numValue === 0) return "Please enter a number greater than 0";
          if (numValue > 50) return "Please enter a realistic pack size (max 50)";
          break;
        case "costPerPack":
          if (numValue === 0) return "Please enter a cost greater than 0VNĐ";
          if (numValue > 999999) return "Please enter a realistic cost (max 999.999VNĐ)";
          break;
      }
    }

    const isImmediatePlan = formData.reductionType === "IMMEDIATE" || formData.initialSmokingAmount === 1;

    if (!isImmediatePlan) {
      if (name === "reductionType" && !value) return "Plan type is required";
      if (name === "startDate" && !value) return "Start date is required";
      if (name === "goalDate" && !value) return "Goal date is required";
    }

    return undefined;
  }

  const handleSubmit = async () => {
    const errors: Record<string, string> = {}

    const isImmediatePlan = formData.initialSmokingAmount === 1 || formData.reductionType === "IMMEDIATE";

    const fieldsToValidate: (keyof typeof formData)[] = [
      "initialSmokingAmount",
      "cigarettesPerPack",
      "costPerPack"
    ]

    if (!isImmediatePlan) {
      fieldsToValidate.push("reductionType", "startDate", "goalDate");
    }

    fieldsToValidate.forEach((field) => {
      const value = formData[field];
      let error: string | undefined;

      if (value instanceof Date) {
        error = validateField(field, value.toISOString());
      } else if (value !== undefined && value !== null) {
        error = validateField(field, String(value));
      } else {
        error = validateField(field, "");
      }

      if (error) {
        errors[field] = error;
      }
    });

    if (Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.querySelector(`[data-field="${firstErrorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const reductionTypeForBE: ReductionQuitPlanType = formData.reductionType === undefined ? "IMMEDIATE" : formData.reductionType;

      const now = new Date();
      const currentDateTimeISO = now.toISOString().slice(0, 19);
      const currentDateISO = now.toISOString().split('T')[0];

      const requestData: QuitPlanCreateRequestDTO = {
        reductionType: reductionTypeForBE,
        initialSmokingAmount: formData.initialSmokingAmount,
        cigarettesPerPack: formData.cigarettesPerPack,
        pricePerPack: formData.costPerPack,
        startDate: isImmediatePlan ? currentDateTimeISO : (formData.startDate ? formData.startDate.toISOString().slice(0, 19) : currentDateTimeISO),
        goalDate: isImmediatePlan ? currentDateISO : (formData.goalDate ? formData.goalDate.toISOString().split('T')[0] : currentDateISO),
      };

      const response = await quitPlanService.createQuitPlan(requestData);

      setIsSuccess(true);
      console.log('Kế hoạch bỏ thuốc lá đã được tạo thành công:', response);

      resetFormData();

      setTimeout(() => {
        onNext();
      }, 1500);

    } catch (error: unknown) {
      setIsSuccess(false);
      console.error('Lỗi khi tạo kế hoạch bỏ thuốc lá:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-emerald-50 to-white dark:from-slate-900/99 dark:to-slate-800">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Kế Hoạch Được Tạo Thành Công!</h2>
          <p className="text-muted-foreground">Đang chuyển hướng đến trang cá nhân hóa của bạn...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 relative overflow-hidden bg-gradient-to-bl from-emerald-50 to-white dark:from-slate-900/99 dark:to-slate-800">
      <div className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-emerald-100 opacity-30 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-20 h-[300px] w-[300px] rounded-full bg-teal-100 opacity-30 blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10 mt-5"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Xác Nhận{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                Kế Hoạch Cai Thuốc
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Xem lại thông tin kế hoạch của bạn và xác nhận để bắt đầu hành trình bỏ thuốc lá!
            </p>
          </motion.div>

          {/* Summary Cards */}
          <div className="space-y-6 mb-12">
            {/* Smoking Habits Summary */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-600" />
                    Thói Quen Hút Thuốc Của Bạn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <motion.div
                      key={`cigarettes-${formData.initialSmokingAmount}`}
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 0.3 }}
                      className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                      data-field="initialSmokingAmount"
                    >
                      <span className="text-2xl font-bold text-emerald-600">
                        {formData.initialSmokingAmount}
                      </span>
                      <p className="text-sm text-muted-foreground">Số điếu mỗi ngày</p>
                    </motion.div>

                    <motion.div
                      key={`per-pack-${formData.cigarettesPerPack}`}
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 0.3 }}
                      className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                      data-field="cigarettesPerPack"
                    >
                      <span className="text-2xl font-bold text-emerald-600">
                        {formData.cigarettesPerPack}
                      </span>
                      <p className="text-sm text-muted-foreground">Số điếu mỗi gói</p>
                    </motion.div>

                    <motion.div
                      key={`cost-${formData.costPerPack}`}
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 0.3 }}
                      className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                      data-field="costPerPack"
                    >
                      <span className="text-2xl font-bold text-emerald-600">
                        {formData.costPerPack}
                      </span>
                      <p className="text-sm text-muted-foreground">Giá mỗi gói  </p>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Plan Details */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                    Kế Hoạch Cai Thuốc Của Bạn
                  </CardTitle>
                </CardHeader>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5 }}
                >
                  <CardContent className="transition-all duration-500 ease-in-out">
                    <div className="space-y-6">
                      {/* Auto-adjustment notification */}
                      {(formData.initialSmokingAmount === 1) && (
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg"
                        >
                          <p className="text-sm text-amber-700">
                            ⚠️ Kiểu dừng hoàn toàn đã được chọn tự động để phù hợp với thói quen hút 1 điếu mỗi ngày của bạn
                          </p>
                        </motion.div>
                      )}

                      {/* Plan Type */}
                      <motion.div
                        key={`plan-type-${formData.reductionType}`}
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 0.3 }}
                        className="flex justify-between items-center py-3 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <span className="font-medium">Loại Kế Hoạch:</span>
                        <span className="text-emerald-600 font-semibold">
                          {formData.reductionType === "IMMEDIATE" ? "Ngừng Hoàn Toàn" :
                            formData.reductionType === "LINEAR" ? "Giảm Dần - Giảm Đều" :
                              formData.reductionType === "EXPONENTIAL" ? "Giảm Dần - Khởi Đầu Mạnh" : "Giảm Dần - Khởi Đầu Nhẹ"}
                        </span>
                      </motion.div>

                      {/* Timeline */}
                      <AnimatePresence mode="wait">
                        {!(formData.initialSmokingAmount == 1 || formData.reductionType === "IMMEDIATE") && (
                          <motion.div
                            key="timeline-fields"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30, transition: { duration: 0.4 } }}
                            transition={{ duration: 0.5 }}
                            className="space-y-6"
                          >

                            {/* Start Date */}
                            <motion.div
                              key={`start-date-${formData.startDate?.toISOString()}`}
                              initial={{ scale: 1 }}
                              animate={{ scale: [1, 1.02, 1] }}
                              transition={{ duration: 0.3 }}
                              className="flex justify-between items-center py-3 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                            >
                              <span className="font-medium">Ngày Bắt Đầu:</span>
                              <div className="flex flex-col items-end">
                                <span className="text-emerald-600 font-semibold">
                                  {formData.startDate ? formatVietnameseDate(formData.startDate) : ""}
                                </span>
                              </div>
                            </motion.div>

                            {/* Target Quit Date */}
                            <motion.div
                              key={`goal-date-${formData.goalDate?.toISOString()}`}
                              initial={{ scale: 1 }}
                              animate={{ scale: [1, 1.02, 1] }}
                              transition={{ duration: 0.3 }}
                              className="flex justify-between items-center py-3 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                            >
                              <span className="font-medium">Ngày Kết Thúc:</span>
                              <div className="flex flex-col items-end">
                                <span className="text-emerald-600 font-semibold">
                                  {formData.goalDate ? formatVietnameseDate(formData.goalDate) : ""}
                                </span>
                              </div>
                            </motion.div>

                            {/* Duration Display */}
                            <div
                              className="flex justify-between items-center py-3 px-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700">
                              <span className="font-medium">Thời Gian:</span>
                              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                                <Clock className="w-4 h-4" />
                                {formData.duration} ngày
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </CardContent>
                </motion.div>
              </Card>
            </motion.div>

            {/* Savings Projection */}
            {/* <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                    Tiết Kiệm Dự Kiến
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Tổng tiết kiệm đến ngày kết thúc:</p>
                    <p className="text-3xl font-bold text-emerald-600">
                      {calculateTotalSavings().toLocaleString("vi-VN")} VNĐ
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">Plus countless health benefits!</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div> */}
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={onBack}
              variant="outline"
              size="lg"
              className="px-8 py-3 text-base font-medium border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-transparent"
              disabled={isSubmitting}
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Quay Lại Chỉnh Sửa
            </Button>

            <Button
              onClick={handleSubmit}
              size="lg"
              className="px-8 py-3 text-base font-medium bg-emerald-500 hover:bg-emerald-600 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  Đang Tạo Kế Hoạch...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Xác Nhận Kế Hoạch
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CreateQuitPlanStep4
