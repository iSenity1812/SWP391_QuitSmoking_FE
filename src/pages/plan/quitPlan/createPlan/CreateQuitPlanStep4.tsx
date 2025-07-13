"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, CheckCircle2, Calendar, Target, DollarSign, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuitPlan } from "@/context/QuitPlanContext"
import axios from "axios"
import type { QuitPlanCreateRequestDTO, ReductionQuitPlanType, ApiResponse } from "@/services/quitPlanService"
import { quitPlanService } from "@/services/quitPlanService"
import { QuitPlanCalculator } from "@/utils/QuitPlanCalculator" // Import QuitPlanCalculator

const formatVietnameseDate = (date: Date): string => {
  const days = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"]
  const dayName = days[date.getDay()]
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return `${dayName}, ngày ${day} tháng ${month}, ${year}`
}

const CreateQuitPlanStep4 = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const { formData, updateFormData, resetFormData } = useQuitPlan()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [showTimeAdjustmentNotification, setShowAdjustmentNotification] = useState(false)
  const [showTypeAdjustmentNotification, setTypeAdjustmentNotification] = useState(false)

  // BẮT ĐẦU CHỈNH SỬA: Logic tính toán duration và recommendedDuration
  // const getRecommendedDuration = () => {
  //   const initial = formData.initialSmokingAmount
  //   if (initial === 1) return { min: 7, max: 14 }
  //   if (initial <= 5) return { min: 14, max: 30 }
  //   if (initial <= 10) return { min: 30, max: 60 }
  //   return { min: 60, max: 90 }
  // }

  // const recommendedDuration = getRecommendedDuration()

  // const calculateRecommendedEndDate = (start: Date, minDays: number) => {
  //   const end = new Date(start)
  //   end.setDate(start.getDate() + minDays)
  //   return end.toISOString().split("T")[0]
  // }
  // KẾT THÚC CHỈNH SỬA

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

  // BẮT ĐẦU CHỈNH SỬA: Cập nhật handleFieldChange và thêm handleDateChange
  const handleFieldChange = (fieldName: keyof typeof formData, value: string) => {
    const error = validateField(fieldName, value)

    setValidationErrors((prev) => ({
      ...prev,
      [fieldName]: error || "",
    }))

    const updates: Partial<typeof formData> = {}

    if (fieldName === "initialSmokingAmount" || fieldName === "cigarettesPerPack" || fieldName === "costPerPack") {
        const numValue = Number.parseFloat(value) || 0;
        updates[fieldName] = numValue;

        if (fieldName === "initialSmokingAmount") {
            if (numValue === 1) {
                updates.reductionType = "IMMEDIATE";
                setTypeAdjustmentNotification(true);
            } else {
                // Chỉ reset nếu trước đó là IMMEDIATE do 1 điếu và giờ không còn là 1 điếu
                if (formData.reductionType === "IMMEDIATE" && formData.initialSmokingAmount !== 1) {
                    updates.reductionType = undefined; // Hoặc một giá trị mặc định khác nếu có
                }
                setTypeAdjustmentNotification(false);
            }
        }
    } else if (fieldName === "reductionType") {
        updates.reductionType = value as ReductionQuitPlanType;
    }
    
    updateFormData(updates);
  }

  const handleStartDateChange = (newStartDateString: string) => {
    const newStartDate = new Date(newStartDateString);
    const currentGoalDate = formData.goalDate || new Date(); // Sử dụng goalDate từ formData hoặc ngày hiện tại
    
    // Chuẩn hóa ngày để tính toán chính xác
    const startISO = newStartDate.toISOString().split("T")[0];
    const goalISO = currentGoalDate.toISOString().split("T")[0];

    const diffDays = QuitPlanCalculator.getTotalDays(startISO, goalISO);

    // Nếu ngày bắt đầu mới sau ngày mục tiêu hiện tại hoặc thời lượng vượt quá 90 ngày
    if (newStartDate.getTime() > currentGoalDate.getTime() || diffDays > 90) {
      const adjustedGoalDate = new Date(newStartDate);
      adjustedGoalDate.setDate(newStartDate.getDate() + 90); // Đặt lại goalDate là 90 ngày sau startDate mới

      updateFormData({
        startDate: newStartDate,
        goalDate: adjustedGoalDate,
        duration: 90,
      });
      setShowAdjustmentNotification(true);
      setTimeout(() => setShowAdjustmentNotification(false), 4000);
    } else {
      updateFormData({
        startDate: newStartDate,
        duration: diffDays,
      });
    }
  };

  const handleGoalDateChange = (newGoalDateString: string) => {
    const newGoalDate = new Date(newGoalDateString);
    const startDate = formData.startDate || new Date(); // Sử dụng startDate từ formData hoặc ngày hiện tại

    // Chuẩn hóa ngày để tính toán chính xác
    const diffTime = QuitPlanCalculator.getTotalDays(startDate.toISOString(), newGoalDate.toISOString());

    // Nếu ngày mục tiêu mới trước ngày bắt đầu hoặc thời lượng vượt quá 90 ngày
    if (newGoalDate.getTime() < startDate.getTime() || diffTime > 90) {
      const adjustedGoalDate = new Date(startDate);
      adjustedGoalDate.setDate(startDate.getDate() + 90); // Đặt lại goalDate là 90 ngày sau startDate

      updateFormData({
        goalDate: adjustedGoalDate,
        duration: 90,
      });
      setShowAdjustmentNotification(true);
      setTimeout(() => setShowAdjustmentNotification(false), 4000);
    } else {
      updateFormData({
        goalDate: newGoalDate,
        duration: diffTime,
      });
    }
  };
  // KẾT THÚC CHỈNH SỬA

  const calculateTotalSavings = () => {
    const dailyCost = (formData.costPerPack / formData.cigarettesPerPack) * formData.initialSmokingAmount
    const duration = formData.duration || 30 // Sử dụng duration từ formData
    return dailyCost * duration
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
      setValidationErrors(errors);
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.querySelector(`[data-field="${firstErrorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);
    setValidationErrors({});

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
      
      if (axios.isAxiosError(error) && error.response) {
          const apiResponse = error.response.data as ApiResponse<unknown>;
          if (apiResponse.errors) {
              setValidationErrors((prevErrors) => ({
                  ...prevErrors,
                  ...apiResponse.errors,
                  apiError: apiResponse.message || 'Lỗi validation từ máy chủ.',
              }));
          } else {
              setValidationErrors({ apiError: apiResponse.message || 'Đã xảy ra lỗi khi tạo kế hoạch.' });
          }
      } else if (error instanceof Error) {
          setValidationErrors({ apiError: error.message });
      } else {
          setValidationErrors({ apiError: 'Đã xảy ra lỗi không xác định.' });
      }
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
          <h2 className="text-3xl font-bold text-foreground mb-4">Plan Created Successfully!</h2>
          <p className="text-muted-foreground">Redirecting to your personalized quit plan...</p>
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
            className="text-center mb-4"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Confirm Your{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                Quit Plan
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Review your personalized quit smoking plan before we create it
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
                    Your Smoking Habits
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
                      <input
                        type="number"
                        value={formData.initialSmokingAmount}
                        onChange={(e) => handleFieldChange("initialSmokingAmount", e.target.value)}
                        className={`text-2xl font-bold text-emerald-600 bg-transparent border-none text-center w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-2 py-1 ${validationErrors.initialSmokingAmount ? "ring-2 ring-red-500" : ""
                          }`}
                        min="0"
                      />
                      <p className="text-sm text-muted-foreground">Cigarettes per day</p>
                      {validationErrors.initialSmokingAmount && (
                        <p className="text-xs text-red-500 mt-1">{validationErrors.initialSmokingAmount}</p>
                      )}
                    </motion.div>

                    <motion.div
                      key={`per-pack-${formData.cigarettesPerPack}`}
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 0.3 }}
                      className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                      data-field="cigarettesPerPack"
                    >
                      <input
                        type="number"
                        value={formData.cigarettesPerPack}
                        onChange={(e) => handleFieldChange("cigarettesPerPack", e.target.value)}
                        className={`text-2xl font-bold text-emerald-600 bg-transparent border-none text-center w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-2 py-1 ${validationErrors.cigarettesPerPack ? "ring-2 ring-red-500" : ""
                          }`}
                        min="0"
                      />
                      <p className="text-sm text-muted-foreground">Per pack</p>
                      {validationErrors.cigarettesPerPack && (
                        <p className="text-xs text-red-500 mt-1">{validationErrors.cigarettesPerPack}</p>
                      )}
                    </motion.div>

                    <motion.div
                      key={`cost-${formData.costPerPack}`}
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 0.3 }}
                      className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                      data-field="costPerPack"
                    >
                      <input
                        type="number"
                        value={formData.costPerPack}
                        onChange={(e) => handleFieldChange("costPerPack", e.target.value)}
                        className={`text-2xl font-bold text-emerald-600 bg-transparent border-none text-center w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-2 py-1 ${validationErrors.costPerPack ? "ring-2 ring-red-500" : ""
                          }`}
                        min="0"
                      />
                      <p className="text-sm text-muted-foreground">VNĐ per pack</p>
                      {validationErrors.costPerPack && (
                        <p className="text-xs text-red-500 mt-1">{validationErrors.costPerPack}</p>
                      )}
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
                    Your Quit Plan
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
                      {(showTypeAdjustmentNotification || formData.initialSmokingAmount === 1) && (
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg"
                        >
                          <p className="text-sm text-amber-700">
                            ⚠️ Full Stop type is automatically selected to suit with your smoking habits (1 cigarette per day)
                          </p>
                        </motion.div>
                      )}

                      {/* Editable Plan Type */}
                      <motion.div
                        key={`plan-type-${formData.reductionType}`}
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 0.3 }}
                        className="flex justify-between items-center py-3 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <span className="font-medium">Plan Type:</span>
                        <div className="flex flex-col items-end py-3">
                          <select
                            value={formData.reductionType || ""}
                            onChange={(e) => {
                              const newType = e.target.value as "IMMEDIATE" | "LINEAR" | "EXPONENTIAL" | "LOGARITHMIC"
                              updateFormData({ reductionType: newType })
                            }}
                            disabled={formData.initialSmokingAmount === 1}
                            className={`bg-transparent border-none text-end
                            text-emerald-600 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-2 py-1 ${formData.initialSmokingAmount === 1 ? "opacity-75 cursor-not-allowed" : ""
                              }`}
                          >
                            <option value="IMMEDIATE">Full Stop</option>
                            <option value="LINEAR">Gradual - Linear</option>
                            <option value="EXPONENTIAL">Gradual - Strong Start</option>
                            <option value="LOGARITHMIC">Gradual - Light Start</option>
                          </select>
                        </div>
                      </motion.div>

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

                            {/* Editable Start Date */}
                            <motion.div
                              key={`start-date-${formData.startDate?.toISOString()}`}
                              initial={{ scale: 1 }}
                              animate={{ scale: [1, 1.02, 1] }}
                              transition={{ duration: 0.3 }}
                              className="flex justify-between items-center py-3 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                            >
                              <span className="font-medium">Start Date:</span>
                              <div className="flex flex-col items-end">
                                <input
                                  type="date"
                                  value={formData.startDate ? formData.startDate.toISOString().split("T")[0] : ""}
                                  min={new Date().toISOString().split("T")[0]}
                                  onChange={(e) => handleStartDateChange(e.target.value)} // Sử dụng handleStartDateChange
                                  className="bg-transparent border-none text-emerald-600 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-2 py-1"
                                />
                                <span className="text-xs text-muted-foreground mt-1">
                                  {formData.startDate ? formatVietnameseDate(formData.startDate) : ""}
                                </span>
                              </div>
                            </motion.div>

                            {/* Auto-adjustment notification */}
                            {showTimeAdjustmentNotification && (
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

                            {/* Editable Target Quit Date */}
                            <motion.div
                              key={`goal-date-${formData.goalDate?.toISOString()}`}
                              initial={{ scale: 1 }}
                              animate={{ scale: [1, 1.02, 1] }}
                              transition={{ duration: 0.3 }}
                              className="flex justify-between items-center py-3 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                            >
                              <span className="font-medium">Target Quit Date:</span>
                              <div className="flex flex-col items-end">
                                <input
                                  type="date"
                                  value={formData.goalDate ? formData.goalDate.toISOString().split("T")[0] : ""}
                                  onChange={(e) => handleGoalDateChange(e.target.value)} // Sử dụng handleGoalDateChange
                                  min={formData.startDate ? formData.startDate.toISOString().split("T")[0] : ""}
                                  className="bg-transparent border-none text-emerald-600 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-2 py-1"
                                />
                                <span className="text-xs text-muted-foreground mt-1">
                                  {formData.goalDate ? formatVietnameseDate(formData.goalDate) : ""}
                                </span>
                              </div>
                            </motion.div>

                            {/* Duration Display */}
                            <div
                              className="flex justify-between items-center py-3 px-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700">
                              <span className="font-medium">Duration:</span>
                              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                                <Clock className="w-4 h-4" />
                                {formData.duration} days
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
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                    Projected Savings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Total savings by quit date:</p>
                    <p className="text-3xl font-bold text-emerald-600">
                      {calculateTotalSavings().toLocaleString("vi-VN")} VNĐ
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">Plus countless health benefits!</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
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
              Back to Plan Selection
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
                  Creating Your Plan...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Confirm & Finish
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
