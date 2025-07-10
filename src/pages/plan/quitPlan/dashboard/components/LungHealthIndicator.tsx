"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface LungHealthIndicatorProps {
  healthLevel: "healthy" | "recovering" | "stressed" | "critical"
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

export function LungHealthIndicator({ healthLevel, size = "md", showLabel = true }: LungHealthIndicatorProps) {
  const getHealthColor = () => {
    switch (healthLevel) {
      case "healthy":
        return "#10b981" // emerald-500
      case "recovering":
        return "#f59e0b" // amber-500
      case "stressed":
        return "#f97316" // orange-500
      case "critical":
        return "#ef4444" // red-500
      default:
        return "#10b981"
    }
  }

  const getHealthText = () => {
    switch (healthLevel) {
      case "healthy":
        return "Phổi của bạn đang khỏe mạnh, hãy tiếp tục duy trì"
      case "recovering":
        return "Phổi của bạn đang phục hồi, hãy tiếp tục cố gắng"
      case "stressed":
        return "Phổi của bạn đang mệt mỏi, hãy ngừng hút thuốc"
      case "critical":
        return "Phổi của bạn đang hấp hối, cần ngừng hút thuốc ngay"
      default:
        return "Phổi của bạn đang khỏe mạnh, hãy tiếp tục duy trì"
    }
  }

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  return (
    <div className="flex items-center gap-3">
      {showLabel && (
        <motion.span
          className={cn(
            "text-sm font-medium",
            healthLevel === "healthy" && "text-emerald-600",
            healthLevel === "recovering" && "text-amber-600",
            healthLevel === "stressed" && "text-orange-600",
            healthLevel === "critical" && "text-red-600",
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {getHealthText()}
        </motion.span>
      )}
      <motion.div
        className={cn("relative", sizeClasses[size])}
        animate={{
          scale: healthLevel === "critical" ? [1, 1.1, 1] : 1,
        }}
        transition={{
          duration: 2,
          repeat: healthLevel === "critical" ? Number.POSITIVE_INFINITY : 0,
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Lung shape */}
          <motion.path
            d="M30 20 C20 20, 15 30, 15 40 L15 70 C15 80, 25 85, 35 80 L45 75 L45 25 C45 20, 40 15, 35 15 Z"
            fill={getHealthColor()}
            initial={{ opacity: 0.7 }}
            animate={{
              opacity: healthLevel === "critical" ? [0.7, 0.4, 0.7] : 0.9,
              fill: getHealthColor(),
            }}
            transition={{ duration: 2, repeat: healthLevel === "critical" ? Number.POSITIVE_INFINITY : 0 }}
          />
          <motion.path
            d="M70 20 C80 20, 85 30, 85 40 L85 70 C85 80, 75 85, 65 80 L55 75 L55 25 C55 20, 60 15, 65 15 Z"
            fill={getHealthColor()}
            initial={{ opacity: 0.7 }}
            animate={{
              opacity: healthLevel === "critical" ? [0.7, 0.4, 0.7] : 0.9,
              fill: getHealthColor(),
            }}
            transition={{ duration: 2, repeat: healthLevel === "critical" ? Number.POSITIVE_INFINITY : 0 }}
          />

          {/* Bronchi */}
          <motion.path
            d="M45 35 L40 45 M45 45 L40 55 M55 35 L60 45 M55 45 L60 55"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            animate={{ opacity: healthLevel === "healthy" ? 1 : 0.6 }}
          />
        </svg>
      </motion.div>

    
    </div>
  )
}
