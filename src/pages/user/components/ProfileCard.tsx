"use client"

import type { UserProfile } from "../types/UserProfile"
import { Crown, Calendar } from "lucide-react"
import { motion } from "framer-motion"

interface ProfileCardProps {
  user: UserProfile
}

export default function ProfileCard({ user }: ProfileCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
    >
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative">
          {user.profilePicture ? (
            <img
              src={user.profilePicture || "/placeholder.svg"}
              alt={user.username}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
              <span className="text-emerald-600 dark:text-emerald-400 text-xl font-semibold">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          {user.role === "PREMIUM_MEMBER" && (
            <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
              <Crown className="w-4 h-4 text-yellow-800" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{user.displayName || user.username}</h2>
          <p className="text-slate-600 dark:text-slate-400">@{user.username}</p>
          <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-1">
            <Calendar className="w-4 h-4 mr-1" />
            Tham gia {formatDate(user.createdAt)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{user.streakCount}</div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Streak</div>
        </div>

        <div className="text-center p-3 bg-sky-50 dark:bg-sky-900/20 rounded-lg">
          <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">{user.totalAchievements || 0}</div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Thành tựu</div>
        </div>

        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{user.followerCount || 0}</div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Followers</div>
        </div>

        <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{user.followingCount || 0}</div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Following</div>
        </div>
      </div>
    </motion.div>
  )
}
