"use client"

import type { Achievement } from "@/types/achievement"
import { Calendar, Users, Heart, Target, Clock, Trophy, Award, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

interface AchievementCardProps {
  achievement: Achievement
  index: number
}

const getAchievementIcon = (type: string) => {
  switch (type) {
    case "DAYS_QUIT":
      return Calendar
    case "SOCIAL":
      return Users
    case "HEALTH":
      return Heart
    case "DAILY":
      return Target
    case "WEEKLY":
      return Clock
    case "MONTHLY":
      return Trophy
    default:
      return Award
  }
}

const getAchievementTypeLabel = (type: string) => {
  switch (type) {
    case "DAYS_QUIT":
      return "Ngày cai thuốc"
    case "SOCIAL":
      return "Xã hội"
    case "HEALTH":
      return "Sức khỏe"
    case "DAILY":
      return "Hàng ngày"
    case "WEEKLY":
      return "Hàng tuần"
    case "MONTHLY":
      return "Hàng tháng"
    default:
      return "Khác"
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "DAYS_QUIT":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
    case "SOCIAL":
      return "bg-sky-100 text-sky-800 dark:bg-sky-900/20 dark:text-sky-400"
    case "HEALTH":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    case "DAILY":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
    case "WEEKLY":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
    case "MONTHLY":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
    default:
      return "bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400"
  }
}

export default function AchievementCard({ achievement, index }: AchievementCardProps) {
  const IconComponent = getAchievementIcon(achievement.achievementType)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative p-6 rounded-xl border transition-all duration-300 hover:shadow-lg ${achievement.completed
        ? "bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700"
        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600"
        }`}
    >
      {achievement.completed && (
        <div className="absolute top-3 right-3">
          <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
      )}

      <div className="flex items-start space-x-4">
        <div
          className={`p-3 rounded-lg ${achievement.completed ? "bg-yellow-200 dark:bg-yellow-800/30" : "bg-emerald-100 dark:bg-emerald-900/20"
            }`}
        >
          <IconComponent
            className={`w-6 h-6 ${achievement.completed ? "text-yellow-700 dark:text-yellow-400" : "text-emerald-600 dark:text-emerald-400"
              }`}
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">{achievement.name}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(achievement.achievementType)}`}>
              {getAchievementTypeLabel(achievement.achievementType)}
            </span>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{achievement.description}</p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">Mục tiêu: {achievement.milestoneValue}</span>
            <span
              className={`text-xs font-medium ${achievement.completed ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"
                }`}
            >
              {achievement.completed ? "Hoàn thành" : "Chưa hoàn thành"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
