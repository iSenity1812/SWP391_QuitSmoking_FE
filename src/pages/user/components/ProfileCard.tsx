"use client"

import { useState, useEffect } from "react"
import { Crown, Calendar, Target, TrendingUp, Award, DollarSign, Cigarette, Heart, Users, UserPlus, Loader2, Activity, Zap, Shield, Star, TrendingDown, BarChart3 } from "lucide-react"
import { motion } from "framer-motion"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { userService, type UserProfileMeResponse } from "@/services/userService"
import { Progress } from "@/components/ui/progress"

export default function ProfileCard() {
  const [profileData, setProfileData] = useState<UserProfileMeResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true)
        const data = await userService.getProfileMe()
        setProfileData(data)
      } catch (error) {
        console.error("Error fetching profile data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfileData()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(amount)
  }

  // Use the actual data from API instead of generating our own dates
  const generateLast7DaysData = (dailyData: { date: string; cigarettesSmoked: number; cravings: number }[]) => {
    // If we have daily data from API, use it directly
    if (dailyData && dailyData.length > 0) {
      return dailyData.map(item => ({
        ...item,
        date: item.date
      }))
    }

    // Fallback: generate last 7 days if no data
    const last7Days = []
    const today = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]

      last7Days.push({
        date: dateStr,
        cigarettesSmoked: 0,
        cravings: 0
      })
    }

    return last7Days
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  if (isLoading || !profileData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
      >
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
    >
      {/* Header Section */}
      <motion.div
        variants={itemVariants}
        className="relative bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center space-x-4">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {profileData.profilePicture ? (
              <img
                src={profileData.profilePicture}
                alt={profileData.username}
                className="w-20 h-20 rounded-full object-cover border-4 border-white/20 shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/20 flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">
                  {profileData.username.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            {profileData.role === "PREMIUM_MEMBER" && (
              <motion.div
                className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2 shadow-lg"
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Crown className="w-5 h-5 text-yellow-800" />
              </motion.div>
            )}
          </motion.div>

          <div className="flex-1">
            <motion.h2
              variants={itemVariants}
              className="text-2xl font-bold"
            >
              {profileData.username}
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-white/80 text-sm"
            >
              {profileData.email}
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex items-center text-sm text-white/70 mt-2"
            >
              <Calendar className="w-4 h-4 mr-1" />
              Tham gia {formatDate(profileData.accountCreationDate)}
            </motion.div>

            {/* Progress Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center mt-2 px-3 py-1 bg-white/20 rounded-full text-sm font-medium"
            >
              <Target className="w-4 h-4 mr-1" />
              {profileData.progressSnapshot}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content - All sections combined */}
      <div className="p-6 space-y-8">
        {/* Overview Section - Stats Grid */}
        <motion.div
          variants={itemVariants}
          className="space-y-6"
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
            Tổng quan
          </h3>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 p-4 rounded-xl border border-emerald-200 dark:border-emerald-700"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Heart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Ngày không hút</span>
              </div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {profileData.daysWithoutSmoking}
              </div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-xl border border-blue-200 dark:border-blue-700"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Cigarette className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Điếu tránh được</span>
              </div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {profileData.cigarettesAvoided}
              </div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 p-4 rounded-xl border border-yellow-200 dark:border-yellow-700"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">Kế hoạch hiện tại</span>
              </div>
              <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                {formatCurrency(profileData.moneySaved)}
              </div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-4 rounded-xl border border-purple-200 dark:border-purple-700"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Followers</span>
              </div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {profileData.followersCount}
              </div>
              <div className="text-xs text-purple-500 dark:text-purple-400">
                {profileData.followingCount} following
              </div>
            </motion.div>
          </div>

          {/* Enhanced Quick Stats with Progress Bars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-orange-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Streak hiện tại</span>
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                {profileData.currentStreakCount} ngày
              </div>
              <Progress
                value={Math.min((profileData.currentStreakCount / 30) * 100, 100)}
                className="h-2"
              />
              <div className="text-xs text-slate-500 mt-1">Mục tiêu: 30 ngày</div>
            </motion.div>

            <motion.div
              className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-red-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Cảm giác thèm thuốc/ngày</span>
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                {profileData.averageDailyCravings.toFixed(1)}
              </div>
              <Progress
                value={Math.max(0, 100 - (profileData.averageDailyCravings / 10) * 100)}
                className="h-2"
              />
              <div className="text-xs text-slate-500 mt-1">Càng thấp càng tốt</div>
            </motion.div>

            <motion.div
              className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-emerald-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Trạng thái kế hoạch</span>
              </div>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {profileData.quitPlanStatus === "IN_PROGRESS" ? "Đang thực hiện" : profileData.quitPlanStatus}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Progress Section */}
        <motion.div
          variants={itemVariants}
          className="space-y-6"
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Award className="w-6 h-6 text-blue-600" />
            Tiến độ
          </h3>

          {/* Progress Chart */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl">
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Biểu đồ tiến độ gần đây
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={generateLast7DaysData(profileData.dailyChartData)}>
                <defs>
                  <linearGradient id="cigarettesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="cravingsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString("vi-VN", { weekday: "short", day: "numeric" })}
                  className="text-xs"
                />
                <YAxis
                  className="text-xs"
                  allowDecimals={false}
                  domain={[0, 'dataMax + 1']}
                />
                <Tooltip
                  labelFormatter={(value) => new Date(value).toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "short" })}
                  formatter={(value, name) => [
                    value,
                    name === "cigarettesSmoked" ? "Điếu hút" : "Cảm giác thèm"
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="cigarettesSmoked"
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#cigarettesGradient)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="cravings"
                  stroke="#f59e0b"
                  fillOpacity={1}
                  fill="url(#cravingsGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Progress Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 p-6 rounded-xl border border-red-200 dark:border-red-700"
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="font-semibold text-red-800 dark:text-red-300 mb-3 flex items-center gap-2">
                <TrendingDown className="w-5 h-5" />
                Thống kê thuốc lá
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-red-700 dark:text-red-400">Tổng điếu đã hút:</span>
                  <span className="font-bold text-red-800 dark:text-red-300">{profileData.totalCigarettesSmokedSinceStart}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-700 dark:text-red-400">Tổng cảm giác thèm:</span>
                  <span className="font-bold text-red-800 dark:text-red-300">{profileData.totalCravings}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-6 rounded-xl border border-green-200 dark:border-green-700"
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Tiết kiệm tài chính
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-green-700 dark:text-green-400">Kế hoạch hiện tại:</span>
                  <span className="font-bold text-green-800 dark:text-green-300">{formatCurrency(profileData.moneySaved)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700 dark:text-green-400">Tổng tất cả kế hoạch:</span>
                  <span className="font-bold text-green-800 dark:text-green-300">{formatCurrency(profileData.totalMoneySaved)}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Subscription Section */}
        <motion.div
          variants={itemVariants}
          className="space-y-6"
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Crown className="w-6 h-6 text-yellow-600" />
            Gói đăng ký
          </h3>

          {profileData.subscriptionId ? (
            <motion.div
              className="bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900/30 dark:to-orange-800/30 p-6 rounded-xl border border-yellow-200 dark:border-yellow-700"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Crown className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                <h4 className="text-xl font-bold text-yellow-800 dark:text-yellow-300">
                  Gói {profileData.packageName}
                </h4>
                <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${profileData.subscriptionStatus === "Active"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                  }`}>
                  <Star className="w-3 h-3" />
                  {profileData.subscriptionStatus}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-yellow-700 dark:text-yellow-400 mb-1">Giá gói</div>
                  <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-300">
                    {formatCurrency(profileData.price || 0)}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-yellow-700 dark:text-yellow-400 mb-1">Còn lại</div>
                  <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-300">
                    {profileData.daysRemaining} ngày
                  </div>
                </div>

                <div>
                  <div className="text-sm text-yellow-700 dark:text-yellow-400 mb-1">Ngày bắt đầu</div>
                  <div className="font-medium text-yellow-800 dark:text-yellow-300">
                    {profileData.subscriptionStartDate && formatDate(profileData.subscriptionStartDate)}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-yellow-700 dark:text-yellow-400 mb-1">Ngày kết thúc</div>
                  <div className="font-medium text-yellow-800 dark:text-yellow-300">
                    {profileData.subscriptionEndDate && formatDate(profileData.subscriptionEndDate)}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <UserPlus className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
                Chưa có gói đăng ký
              </h4>
              <p className="text-slate-500 dark:text-slate-500 mb-4">
                Nâng cấp lên Premium để trải nghiệm đầy đủ tính năng
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-teal-700 transition-all duration-300"
              >
                Nâng cấp ngay
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
