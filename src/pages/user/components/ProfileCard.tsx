"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  Crown,
  Calendar,
  Target,
  TrendingUp,
  Award,
  DollarSign,
  Cigarette,
  Heart,
  Users,
  UserPlus,
  Loader2,
  Activity,
  Zap,
  Shield,
  Star,
  TrendingDown,
  BarChart3,
  Plus,
  Camera,
} from "lucide-react"
import { motion } from "framer-motion"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { userService, type UserProfileMeResponse, type Achievement } from "@/services/userService"
import { Progress } from "@/components/ui/progress"
import axiosConfig from "@/config/axiosConfig"
import { useAuth } from "@/hooks/useAuth"

// Base URL configuration - adjust this to match your backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export default function ProfileCard() {
  const [profileData, setProfileData] = useState<UserProfileMeResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [forceUpdate, setForceUpdate] = useState(0) // Add this line
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { updateProfilePicture, refreshUserInfo, user } = useAuth() // Add user to destructuring

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

  // Add this useEffect after the existing useEffect
  useEffect(() => {
    const handleProfilePictureUpdate = (event: CustomEvent) => {
      console.log("Profile picture updated event received in ProfileCard:", event.detail)
      // Update the profile data immediately
      if (profileData) {
        setProfileData((prev) => ({
          ...prev!,
          profilePicture: event.detail.profilePicture,
        }))
      }
      // Force re-render
      setForceUpdate((prev) => prev + 1)
    }

    window.addEventListener("profilePictureUpdated", handleProfilePictureUpdate as EventListener)
    return () => {
      window.removeEventListener("profilePictureUpdated", handleProfilePictureUpdate as EventListener)
    }
  }, [profileData])

  // Helper function to construct full image URL
  const getImageUrl = (imagePath: string | null | undefined): string | null => {
    if (!imagePath) return null

    // If it's already a full URL (starts with http/https), return as is
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath
    }

    // If it's a base64 image, return as is
    if (imagePath.startsWith("data:")) {
      return imagePath
    }

    // If it's a relative path, prepend the base URL
    if (imagePath.startsWith("/")) {
      return `${API_BASE_URL}${imagePath}`
    }

    // If it doesn't start with /, add both base URL and /
    return `${API_BASE_URL}/${imagePath}`
  }

  // Update the handleProfilePictureUpload function to ensure immediate update:
  const handleProfilePictureUpload = async (file: File) => {
    try {
      setIsUploadingImage(true)

      const formData = new FormData()
      formData.append("profilePicture", file)

      console.log("Uploading profile picture...")
      console.log("File:", file.name, file.size, file.type)

      // Use axiosConfig which already has CORS and auth configured
      const response = await axiosConfig.patch("/profile/picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("Upload response:", response.data)

      if (response.data.success) {
        // Update the profile data with new image IMMEDIATELY
        const updatedProfile = response.data.data
        const newProfilePicture = updatedProfile.profilePicture

        setProfileData((prev) => ({
          ...prev!,
          profilePicture: newProfilePicture,
        }))

        // Update the AuthContext immediately to sync across all components
        updateProfilePicture(newProfilePicture)

        // Force re-render
        setForceUpdate((prev) => prev + 1)

        console.log("Profile picture updated successfully!")
        console.log("New profile picture URL:", getImageUrl(newProfilePicture))
        alert("Cập nhật ảnh đại diện thành công!")
      }
    } catch (error: any) {
      console.error("Error uploading profile picture:", error)

      // More detailed error logging
      if (error.response) {
        console.error("Response error:", error.response.data)
        console.error("Response status:", error.response.status)
        alert(`Lỗi: ${error.response.data?.message || "Không thể cập nhật ảnh đại diện"}`)
      } else if (error.request) {
        console.error("Request error:", error.request)
        alert("Lỗi kết nối. Vui lòng thử lại!")
      } else {
        console.error("Error:", error.message)
        alert("Có lỗi xảy ra. Vui lòng thử lại!")
      }
    } finally {
      setIsUploadingImage(false)
    }
  }

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file hình ảnh!")
        return
      }

      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File quá lớn! Vui lòng chọn file nhỏ hơn 5MB.")
        return
      }

      handleProfilePictureUpload(file)
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

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
      currency: "VND",
    }).format(amount)
  }

  // Use the actual data from API instead of generating our own dates
  const generateLast7DaysData = (dailyData: { date: string; cigarettesSmoked: number; cravings?: number }[]) => {
    // If we have daily data from API, use it directly
    if (dailyData && dailyData.length > 0) {
      return dailyData.map((item) => ({
        ...item,
        date: item.date,
        cravings: item.cravings || 0, // Default to 0 for normal members
      }))
    }

    // Fallback: generate last 7 days if no data
    const last7Days = []
    const today = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]

      last7Days.push({
        date: dateStr,
        cigarettesSmoked: 0,
        cravings: 0,
      })
    }

    return last7Days
  }

  // Function to handle image error - similar to BlogPostCard
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement
    const originalSrc = target.src
    console.error("Profile image failed to load:", originalSrc)
    console.error("Original path from API:", profileData?.profilePicture)
    console.error("Constructed URL:", getImageUrl(profileData?.profilePicture))

    target.style.display = "none"
    // Show the fallback div
    const fallbackDiv = target.nextElementSibling as HTMLElement
    if (fallbackDiv) {
      fallbackDiv.style.display = "flex"
    }
  }

  // Function to handle achievement icon error
  const handleAchievementIconError = (e: React.SyntheticEvent<HTMLImageElement>, achievement: Achievement) => {
    const target = e.target as HTMLImageElement
    console.error("Achievement icon failed to load:", target.src)
    console.error("Original iconUrl from API:", achievement.iconUrl)
    console.error("Constructed URL:", getImageUrl(achievement.iconUrl))

    target.style.display = "none"
    const fallback = target.nextElementSibling as HTMLElement
    if (fallback) {
      fallback.style.display = "flex"
    }
  }

  const isPremiumMember = profileData?.role === "PREMIUM_MEMBER"
  const achievements = profileData?.last5Achievements || profileData?.last3Achievements || []

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  // Debug profile picture URL - enhanced debugging
  console.log("=== ProfileCard Debug ===")
  console.log("Raw profile picture from API:", profileData?.profilePicture)
  console.log("Constructed profile picture URL:", getImageUrl(profileData?.profilePicture))
  console.log("API Base URL:", API_BASE_URL)
  console.log("=== End Debug ===")

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

  // Use the latest profile picture from either profileData or user context
  const profileImageUrl = getImageUrl(profileData?.profilePicture || user?.profilePicture)

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
    >
      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

      {/* Header Section */}
      <motion.div
        variants={itemVariants}
        className="relative bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center space-x-4">
          <motion.div
            className="relative group cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={triggerFileInput}
          >
            {/* Profile Picture - with proper URL construction */}
            {profileImageUrl && (
              <img
                src={profileImageUrl || "/placeholder.svg"}
                alt={profileData.username}
                className="w-20 h-20 rounded-full object-cover border-4 border-white/20 shadow-lg transition-all duration-300 group-hover:brightness-75"
                onError={handleImageError}
                onLoad={() => {
                  console.log("Profile image loaded successfully!")
                  console.log("Loaded URL:", profileImageUrl)
                }}
              />
            )}

            {/* Fallback Avatar - always present but hidden when image loads */}
            <div
              className={`w-20 h-20 rounded-full bg-white/20 border-4 border-white/20 flex items-center justify-center shadow-lg transition-all duration-300 group-hover:bg-white/30 ${profileImageUrl ? "hidden" : "flex"
                }`}
              style={{ display: profileImageUrl ? "none" : "flex" }}
            >
              <span className="text-white text-2xl font-bold">{profileData.username.charAt(0).toUpperCase()}</span>
            </div>

            {/* Upload/Update Overlay */}
            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {isUploadingImage ? (
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              ) : profileImageUrl ? (
                <div className="flex flex-col items-center">
                  <Camera className="w-5 h-5 text-white mb-1" />
                  <span className="text-xs text-white font-medium">Đổi ảnh</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Plus className="w-6 h-6 text-white mb-1" />
                  <span className="text-xs text-white font-medium">Thêm ảnh</span>
                </div>
              )}
            </div>

            {/* Premium Badge */}
            {profileData.role === "PREMIUM_MEMBER" && (
              <motion.div
                className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2 shadow-lg"
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
              >
                <Crown className="w-5 h-5 text-yellow-800" />
              </motion.div>
            )}
          </motion.div>

          <div className="flex-1">
            <motion.h2 variants={itemVariants} className="text-2xl font-bold">
              {profileData.username}
            </motion.h2>
            <motion.p variants={itemVariants} className="text-white/80 text-sm">
              {profileData.email}
            </motion.p>
            <motion.div variants={itemVariants} className="flex items-center text-sm text-white/70 mt-2">
              <Calendar className="w-4 h-4 mr-1" />
              Tham gia {formatDate(profileData.accountCreationDate)}
            </motion.div>

            {/* Progress Badge - Only for Premium Members */}
            {isPremiumMember && profileData.progressSnapshot && (
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center mt-2 px-3 py-1 bg-white/20 rounded-full text-sm font-medium"
              >
                <Target className="w-4 h-4 mr-1" />
                {profileData.progressSnapshot}
              </motion.div>
            )}

            {/* For Normal Members - Show role badge */}
            {!isPremiumMember && (
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center mt-2 px-3 py-1 bg-white/20 rounded-full text-sm font-medium"
              >
                <Target className="w-4 h-4 mr-1" />
                Thành viên thường
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content - All sections combined */}
      <div className="p-6 space-y-8">
        {/* Overview Section - Stats Grid */}
        <motion.div variants={itemVariants} className="space-y-6">
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
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{profileData.cigarettesAvoided}</div>
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
              <div className="text-xs text-purple-500 dark:text-purple-400">{profileData.followingCount} following</div>
            </motion.div>
          </div>

          {/* Enhanced Quick Stats with Progress Bars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl" whileHover={{ scale: 1.02 }}>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-orange-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Streak hiện tại</span>
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                {profileData.currentStreakCount} ngày
              </div>
              <Progress value={Math.min((profileData.currentStreakCount / 30) * 100, 100)} className="h-2" />
              <div className="text-xs text-slate-500 mt-1">Mục tiêu: 30 ngày</div>
            </motion.div>

            {/* Cravings stats - only for premium members */}
            {isPremiumMember && profileData.averageDailyCravings !== undefined && (
              <motion.div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl" whileHover={{ scale: 1.02 }}>
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-red-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Cảm giác thèm thuốc/ngày</span>
                </div>
                <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {profileData.averageDailyCravings.toFixed(1)}
                </div>
                <Progress value={Math.max(0, 100 - (profileData.averageDailyCravings / 10) * 100)} className="h-2" />
                <div className="text-xs text-slate-500 mt-1">Càng thấp càng tốt</div>
              </motion.div>
            )}

            {/* For normal members, show a different stat instead */}
            {!isPremiumMember && (
              <motion.div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl" whileHover={{ scale: 1.02 }}>
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-red-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Điếu hút gần đây</span>
                </div>
                <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {profileData.dailyChartData?.slice(-1)[0]?.cigarettesSmoked || 0}
                </div>
                <div className="text-xs text-slate-500 mt-1">Hôm nay</div>
              </motion.div>
            )}

            <motion.div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl" whileHover={{ scale: 1.02 }}>
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
        <motion.div variants={itemVariants} className="space-y-6">
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
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("vi-VN", { weekday: "short", day: "numeric" })
                  }
                  className="text-xs"
                />
                <YAxis className="text-xs" allowDecimals={false} domain={[0, "dataMax + 1"]} />
                <Tooltip
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "short" })
                  }
                  formatter={(value, name) => [value, name === "cigarettesSmoked" ? "Điếu hút" : "Cảm giác thèm"]}
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

          {/* Progress Summary - Different for Premium vs Normal */}
          {isPremiumMember ? (
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
                    <span className="font-bold text-red-800 dark:text-red-300">
                      {profileData.totalCigarettesSmokedSinceStart || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-700 dark:text-red-400">Tổng cảm giác thèm:</span>
                    <span className="font-bold text-red-800 dark:text-red-300">{profileData.totalCravings || 0}</span>
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
                    <span className="font-bold text-green-800 dark:text-green-300">
                      {formatCurrency(profileData.moneySaved)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700 dark:text-green-400">Tổng tất cả kế hoạch:</span>
                    <span className="font-bold text-green-800 dark:text-green-300">
                      {formatCurrency(profileData.totalMoneySaved || 0)}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          ) : (
            // Normal member summary - simpler view
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-6 rounded-xl border border-blue-200 dark:border-blue-700"
                whileHover={{ scale: 1.02 }}
              >
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                  <Cigarette className="w-5 h-5" />
                  Thống kê cơ bản
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-400">Ngày không hút:</span>
                    <span className="font-bold text-blue-800 dark:text-blue-300">
                      {profileData.daysWithoutSmoking} ngày
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-400">Điếu tránh được:</span>
                    <span className="font-bold text-blue-800 dark:text-blue-300">{profileData.cigarettesAvoided}</span>
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
                    <span className="text-green-700 dark:text-green-400">Số tiền tiết kiệm:</span>
                    <span className="font-bold text-green-800 dark:text-green-300">
                      {formatCurrency(profileData.moneySaved)}
                    </span>
                  </div>
                  <div className="text-center mt-3">
                    <div className="text-sm text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                      💡 Nâng cấp Premium để xem thêm thống kê
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>

        {/* Achievements Section */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-600" />
              {isPremiumMember ? "Thành tựu gần đây (5 mới nhất)" : "Thành tựu gần đây (3 mới nhất)"}
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
            >
              Xem tất cả
            </motion.button>
          </div>

          {achievements && achievements.length > 0 ? (
            <div className="space-y-3">
              {achievements.map((achievement: Achievement, index: number) => {
                const achievementIconUrl = getImageUrl(achievement.iconUrl)

                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors"
                  >
                    {/* Achievement Icon */}
                    <div className="relative flex-shrink-0">
                      {achievementIconUrl && (
                        <img
                          src={achievementIconUrl || "/placeholder.svg"}
                          alt={achievement.name}
                          className="w-12 h-12 rounded-lg object-cover"
                          onError={(e) => handleAchievementIconError(e, achievement)}
                          onLoad={() => {
                            console.log("Achievement icon loaded successfully!")
                            console.log("Achievement:", achievement.name)
                            console.log("Loaded URL:", achievementIconUrl)
                          }}
                        />
                      )}
                      <div
                        className={`w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center ${achievementIconUrl ? "hidden" : "flex"
                          }`}
                        style={{ display: achievementIconUrl ? "none" : "flex" }}
                      >
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      {/* Level badge if available */}
                      {achievement.name.includes("Level") && (
                        <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                          {achievement.name.match(/\d+/)?.[0] || ""}
                        </div>
                      )}
                    </div>

                    {/* Achievement Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {achievement.name}
                      </h4>
                      {/* Show detailed description only for premium members */}
                      {isPremiumMember && achievement.detailedDescription && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {achievement.detailedDescription}
                        </p>
                      )}
                      {/* For normal members, show a simpler description */}
                      {!isPremiumMember && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Thành tựu đã đạt được</p>
                      )}
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                        {new Date(achievement.dateAchieved).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    {/* Progress Bar for achievement */}
                    <div className="w-20">
                      <div className="w-full bg-amber-100 dark:bg-amber-900/30 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full"
                          style={{ width: "100%" }}
                        />
                      </div>
                      <div className="text-xs text-center mt-1 text-amber-600 dark:text-amber-400 font-medium">
                        Hoàn thành
                      </div>
                    </div>
                  </motion.div>
                )
              })}

              {/* Show upgrade message for normal members */}
              {!isPremiumMember && (
                <motion.div
                  className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700"
                  whileHover={{ scale: 1.01 }}
                >
                  <Crown className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
                    Nâng cấp Premium để xem thêm thành tựu và mô tả chi tiết!
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg text-sm font-medium"
                  >
                    Nâng cấp ngay
                  </motion.button>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h4 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">Chưa có thành tựu nào</h4>
              <p className="text-slate-500 dark:text-slate-500">
                Tiếp tục hành trình bỏ thuốc để mở khóa các thành tựu đầu tiên!
              </p>
            </div>
          )}
        </motion.div>

        {/* Subscription Section - Only for Premium Members */}
        {isPremiumMember && (
          <motion.div variants={itemVariants} className="space-y-6">
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
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${profileData.subscriptionStatus === "Active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                      }`}
                  >
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
                <h4 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">Chưa có gói đăng ký</h4>
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
        )}

        {/* For Normal Members - Show upgrade promotion */}
        {!isPremiumMember && (
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="text-center py-12 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700">
              <Crown className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-yellow-700 dark:text-yellow-300 mb-2">Nâng cấp lên Premium</h4>
              <p className="text-yellow-600 dark:text-yellow-400 mb-6 max-w-md mx-auto">
                Mở khóa thêm nhiều tính năng: thống kê chi tiết, lịch sử đầy đủ và nhiều hơn nữa!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 max-w-md mx-auto">
                <div className="flex items-center text-sm text-yellow-700 dark:text-yellow-300">
                  <Star className="w-4 h-4 mr-2" />
                  Thống kê nâng cao
                </div>
                <div className="flex items-center text-sm text-yellow-700 dark:text-yellow-300">
                  <Star className="w-4 h-4 mr-2" />
                  Lịch sử đầy đủ
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-medium hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg"
              >
                Nâng cấp ngay - Chỉ từ 119.000đ/tháng
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
