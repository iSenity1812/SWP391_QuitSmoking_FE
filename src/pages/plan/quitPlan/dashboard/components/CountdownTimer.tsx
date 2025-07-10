"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { QuitPlanCalculator } from "@/utils/QuitPlanCalculator" // Import QuitPlanCalculator

interface CountdownTimerProps {
  targetDate: string // Đây sẽ là goalDate cho đếm ngược, startDate cho đếm lên
  label: string
  isCountUp?: boolean // true cho "thời gian đã trôi qua", false cho "thời gian còn lại"
  planStartDate?: string; // Ngày bắt đầu của kế hoạch, cần cho việc tính "Ngày hiện tại của kế hoạch"
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CountdownTimer({ targetDate, label, isCountUp = false, planStartDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [currentDayOfPlan, setCurrentDayOfPlan] = useState(0); // Trạng thái mới cho ngày hiện tại của kế hoạch

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date(); // Lấy thời gian hiện tại một lần

      let daysDiff = 0;
      let hoursDiff = 0;
      let minutesDiff = 0;
      let secondsDiff = 0;

      if (isCountUp) {
        // Nếu là chế độ đếm lên (Time Since Quitting)
        // targetDate ở đây là startDate của kế hoạch
        const start = new Date(targetDate);
        
        // BẮT ĐẦU CHỈNH SỬA: Sử dụng getDaysSinceStart từ QuitPlanCalculator
        const daysPassed = QuitPlanCalculator.getDaysSinceStart(targetDate);
        // KẾT THÚC CHỈNH SỬA

        // Tính toán giờ, phút, giây đã trôi qua từ thời điểm bắt đầu của ngày hiện tại
        // (để đảm bảo đồng bộ với getDaysSinceStart chỉ tính ngày)
        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);

        const startOfTargetDate = new Date(targetDate);
        startOfTargetDate.setHours(0, 0, 0, 0);

        // Nếu ngày bắt đầu là hôm nay, tính từ thời gian thực
        // Nếu ngày bắt đầu là quá khứ, tính từ 00:00:00 của ngày hôm đó
        const actualStartTime = (startOfTargetDate.getTime() === startOfToday.getTime()) ? start.getTime() : startOfTargetDate.getTime();
        
        const totalMillisecondsPassedToday = now.getTime() - actualStartTime;

        // Đảm bảo chỉ lấy phần lẻ của ngày hiện tại
        const remainingMilliseconds = totalMillisecondsPassedToday % (1000 * 60 * 60 * 24);

        hoursDiff = Math.floor((remainingMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        minutesDiff = Math.floor((remainingMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
        secondsDiff = Math.floor((remainingMilliseconds % (1000 * 60)) / 1000);

        daysDiff = daysPassed; // Sử dụng daysPassed từ QuitPlanCalculator
        
        setTimeLeft({ days: daysDiff, hours: hoursDiff, minutes: minutesDiff, seconds: secondsDiff });

        // BẮT ĐẦU CHỈNH SỬA: Sử dụng getDaysSinceStart + 1 cho currentDayOfPlan
        setCurrentDayOfPlan(QuitPlanCalculator.getDaysSinceStart(targetDate) + 1);
        // KẾT THÚC CHỈNH SỬA

      } else {
        // Nếu là chế độ đếm ngược (Time Until Quitting)
        // targetDate ở đây là goalDate của kế hoạch
        
        // BẮT ĐẦU CHỈNH SỬA: Sử dụng getDaysUntilGoal từ QuitPlanCalculator
        daysDiff = QuitPlanCalculator.getDaysUntilGoal(targetDate);
        // KẾT THÚC CHỈNH SỬA

        const goal = new Date(targetDate).getTime();
        const difference = goal - now.getTime();

        if (difference > 0) {
          hoursDiff = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          minutesDiff = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          secondsDiff = Math.floor((difference % (1000 * 60)) / 1000);
        } else {
          daysDiff = 0;
          hoursDiff = 0;
          minutesDiff = 0;
          secondsDiff = 0;
        }
        
        setTimeLeft({ days: daysDiff, hours: hoursDiff, minutes: minutesDiff, seconds: secondsDiff });

        // BẮT ĐẦU CHỈNH SỬA: Sử dụng planStartDate để tính currentDayOfPlan
        if (planStartDate) {
          setCurrentDayOfPlan(QuitPlanCalculator.getDaysSinceStart(planStartDate) + 1);
        } else {
          // Fallback nếu planStartDate không được cung cấp cho countdown
          setCurrentDayOfPlan(0); 
        }
        // KẾT THÚC CHỈNH SỬA
      }
    }

    calculateTime();
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, [targetDate, isCountUp, planStartDate]); // Dependencies vẫn giữ nguyên

  const TimeUnit = ({ value, unit }: { value: number; unit: string }) => (
    <motion.div
      className="flex flex-col items-center"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div
        className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl px-4 py-3 min-w-[60px] text-center shadow-lg"
        key={value}
      >
        <span className="text-2xl font-bold tabular-nums">{value.toString().padStart(2, "0")}</span>
      </div>
      <span className="text-sm text-gray-600 mt-2 font-medium">{unit}</span>
    </motion.div>
  )

  return (
    <div className="text-center">
      {/* Day Badge */}
      <motion.div
        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl mb-4 shadow-lg
        bg-gradient-to-br from-emerald-300 via-emerald-500 to-emerald-500 text-white"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
      >
        <div className="text-lg">⏳</div>
        <span className="font-bold text-lg">DAY {currentDayOfPlan.toString().padStart(2, "0")}</span>
      </motion.div>

      <h3 className="text-lg font-semibold text-gray-800 mb-4">{label}</h3>
      
      {/* Hiển thị thời gian (đếm ngược hoặc đếm lên) */}
      <div className="flex justify-center gap-4">
        <TimeUnit value={timeLeft.days} unit="Days" />
        <TimeUnit value={timeLeft.hours} unit="Hours" />
        <TimeUnit value={timeLeft.minutes} unit="Minutes" />
        <TimeUnit value={timeLeft.seconds} unit="Seconds" />
      </div>
    </div>
  )
}
