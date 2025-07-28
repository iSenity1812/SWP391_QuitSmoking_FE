"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import {
  Crown, Calendar, Target, TrendingUp, Award, DollarSign, Cigarette, Heart,
  Users, UserPlus, Loader2, Activity, Zap, Shield, Star, TrendingDown,
  BarChart3, Camera, AlertCircle, PlayCircle, CheckCircle,
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { userService, type UserProfileMeResponse, type Achievement } from "@/services/userService"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import axios from "axios"

// Base URL configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export default function ProfileCard() {
  const [profileData, setProfileData] = useState<UserProfileMeResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [uploadMessage, setUploadMessage] = useState<string | null>(null)
  const [avatarKey, setAvatarKey] = useState(Date.now()) // Key để force re-render avatar
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user, refreshUserInfo } = useAuth()

  // Derived state
  const hasQuitPlan = profileData?.currentQuitPlanId !== null
  const isPremiumMember = profileData?.role === "PREMIUM_MEMBER"

  // Fetch profile data on initial load or when user changes
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      try {
        const data = await userService.getProfileMe()
        setProfileData(data)
        // Reset avatar key khi load data mới
        setAvatarKey(Date.now())
      } catch (error) {
        console.error("Error fetching profile data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfileData()
  }, [user]) // Dependency on user object

  // Helper to construct full image URL với cache busting
  const getImageUrl = (imagePath: string | null | undefined): string | null => {
    if (!imagePath) return null
    if (imagePath.startsWith("http") || imagePath.startsWith("data:")) {
      // Nếu URL đã có timestamp, giữ nguyên, nếu không thì thêm avatarKey
      if (imagePath.includes('?t=') || imagePath.includes('&t=')) {
        return imagePath
      }
      return `${imagePath}${imagePath.includes('?') ? '&' : '?'}t=${avatarKey}`
    }
    const baseUrl = `${API_BASE_URL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`
    return `${baseUrl}?t=${avatarKey}`
  }

  // Trigger file input click
  const triggerFileInput = () => {
    if (isUploadingImage) return // Prevent opening file dialog while uploading
    fileInputRef.current?.click()
  }

  // Main handler for file selection and upload
  const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    if (!file.type.startsWith("image/")) {
      setUploadMessage("File không hợp lệ. Vui lòng chọn một file ảnh.")
      return
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setUploadMessage("Ảnh quá lớn. Kích thước tối đa là 5MB.")
      return
    }

    setIsUploadingImage(true)
    setUploadMessage("Đang tải lên...")

    try {
      const response = await userService.uploadAvatar(file)

      if (response.success && response.data.profilePicture) {
        // Tạo timestamp mới để force browser load lại ảnh
        const newTimestamp = Date.now()

        // Cập nhật avatarKey để force re-render tất cả avatar instances
        setAvatarKey(newTimestamp)

        // Cập nhật profileData với URL mới (không cần thêm timestamp ở đây vì getImageUrl sẽ handle)
        setProfileData(prevProfile => {
          if (!prevProfile) return null
          return {
            ...prevProfile,
            profilePicture: response.data.profilePicture
          }
        })

        // Cập nhật localStorage để giữ đồng bộ với ảnh mới
        const currentUserInfo = localStorage.getItem('user_info')
        if (currentUserInfo) {
          try {
            const userInfo = JSON.parse(currentUserInfo)
            const updatedUserInfo = {
              ...userInfo,
              profilePicture: response.data.profilePicture
            }
            localStorage.setItem('user_info', JSON.stringify(updatedUserInfo))

            // Dispatch custom event để thông báo cho AuthContext
            window.dispatchEvent(new CustomEvent('profilePictureUpdated', {
              detail: { profilePicture: response.data.profilePicture }
            }))
          } catch (error) {
            console.error('Error updating localStorage:', error)
          }
        }
        // Cập nhật context chung của user
        await refreshUserInfo().catch(error => console.error('Error refreshing user info:', error))


        // Clear cache của browser cho ảnh cũ
        if ('caches' in window) {
          try {
            const cacheNames = await caches.keys()
            for (const cacheName of cacheNames) {
              const cache = await caches.open(cacheName)
              const requests = await cache.keys()
              for (const request of requests) {
                if (request.url.includes('avatar') || request.url.includes('profile')) {
                  await cache.delete(request)
                }
              }
            }
          } catch (error) {
            console.log('Cache clearing failed:', error)
          }
        }

        setUploadMessage("Cập nhật ảnh đại diện thành công! 🎉")
        setTimeout(() => setUploadMessage(null), 3000)
      } else {
        throw new Error(response.message || "Không thể cập nhật ảnh đại diện.")
      }
    } catch (err) {
      console.error("Lỗi khi tải ảnh đại diện:", err)
      let errorMessage = "Có lỗi xảy ra khi tải ảnh lên."
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err instanceof Error) {
        errorMessage = err.message
      }
      setUploadMessage(`Lỗi: ${errorMessage}`)
    } finally {
      setIsUploadingImage(false)
    }
  }

  // --- Helper Functions for Rendering ---
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric" })
  const formatCurrency = (amount: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const fallback = e.currentTarget.nextElementSibling as HTMLElement
    if (fallback) fallback.style.display = "flex"
    e.currentTarget.style.display = "none"
  }

  const handleAchievementIconError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
    if (fallback) fallback.style.display = 'flex';
    e.currentTarget.style.display = 'none';
  };

  const generateLast7DaysData = (dailyData?: DailyChartData[]) => {
    if (!hasQuitPlan || !dailyData) return []
    return dailyData.map(item => ({
      ...item,
      date: item.date,
      cravings: item.cravings || 0,
    }))
  }

  // --- Render Logic ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 rounded-xl bg-white dark:bg-slate-800">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="p-6 text-center rounded-xl bg-white dark:bg-slate-800">
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">Không thể tải dữ liệu hồ sơ.</h3>
        <p className="text-slate-500">Vui lòng thử lại sau.</p>
      </div>
    )
  }

  const profileImageUrl = getImageUrl(profileData.profilePicture)
  const achievements = profileData.last5Achievements || profileData.last3Achievements || []
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

  return (
    <AnimatePresence>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
      >
        {/* Hidden file input */}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleProfilePictureChange} className="hidden" />

        {/* Upload message notification */}
        {uploadMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg text-sm font-medium ${uploadMessage.includes('thành công')
              ? 'bg-green-100 text-green-800 border border-green-200'
              : uploadMessage.includes('Lỗi')
                ? 'bg-red-100 text-red-800 border border-red-200'
                : 'bg-blue-100 text-blue-800 border border-blue-200'
              }`}
          >
            {uploadMessage}
          </motion.div>
        )}

        {/* Header Section */}
        <motion.div
          variants={itemVariants}
          className={`relative p-6 text-white ${hasQuitPlan ? "bg-gradient-to-r from-emerald-500 to-teal-600" : "bg-gradient-to-r from-slate-500 to-slate-600"
            }`}
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex items-center space-x-4">
            <motion.div
              className="relative group cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={triggerFileInput}
            >
              {/* Profile Picture - sử dụng key để force re-render */}
              {profileImageUrl && (
                <img
                  key={`avatar-${avatarKey}`} // Key để force re-render
                  src={profileImageUrl || "/placeholder.svg"}
                  alt={profileData.username}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white/20 shadow-lg transition-all duration-300 group-hover:brightness-75"
                  onError={handleImageError}
                  loading="eager" // Load ảnh ngay lập tức
                  style={{
                    // CSS để tránh cache
                    minHeight: '80px',
                    minWidth: '80px'
                  }}
                />
              )}

              {/* Fallback Avatar */}
              <div
                key={`fallback-${avatarKey}`} // Key để đồng bộ với avatar
                className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/20 flex items-center justify-center shadow-lg transition-all duration-300 group-hover:bg-white/30"
                style={{ display: profileImageUrl ? 'none' : 'flex' }}
              >
                <span className="text-white text-2xl font-bold">{profileData.username.charAt(0).toUpperCase()}</span>
              </div>

              {/* Upload/Update Overlay */}
              <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {isUploadingImage ? (
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                ) : (
                  <div className="flex flex-col items-center">
                    <Camera className="w-5 h-5 text-white mb-1" />
                    <span className="text-xs text-white font-medium">{profileImageUrl ? 'Đổi ảnh' : 'Thêm ảnh'}</span>
                  </div>
                )}
              </div>

              {/* Premium Badge */}
              {isPremiumMember && (
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
              <motion.h2 variants={itemVariants} className="text-2xl font-bold">{profileData.username}</motion.h2>
              <motion.p variants={itemVariants} className="text-white/80 text-sm">{profileData.email}</motion.p>
              <motion.div variants={itemVariants} className="flex items-center text-sm text-white/70 mt-2">
                <Calendar className="w-4 h-4 mr-1" />
                Tham gia {formatDate(profileData.accountCreationDate)}
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center mt-2 px-3 py-1 bg-white/20 rounded-full text-sm font-medium"
              >
                {hasQuitPlan ? <CheckCircle className="w-4 h-4 mr-1" /> : <AlertCircle className="w-4 h-4 mr-1" />}
                {hasQuitPlan ? (profileData.progressSnapshot || "Đang thực hiện kế hoạch") : "Chưa có kế hoạch"}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="p-6 space-y-8">
          {/* No Quit Plan State */}
          {!hasQuitPlan && (
            <motion.div variants={itemVariants} className="space-y-6">
              <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
                    <PlayCircle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  <CardTitle className="text-xl text-orange-800 dark:text-orange-300">
                    Bắt đầu hành trình bỏ thuốc của bạn
                  </CardTitle>
                  <CardDescription className="text-orange-700 dark:text-orange-400">
                    Tạo kế hoạch bỏ thuốc để theo dõi tiến độ và nhận được hỗ trợ cá nhân hóa
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex flex-col items-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                      <Target className="w-6 h-6 text-orange-600 mb-2" />
                      <span className="text-sm font-medium text-orange-800 dark:text-orange-300">Đặt mục tiêu</span>
                      <span className="text-xs text-orange-600 dark:text-orange-400">Xác định lý do bỏ thuốc</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                      <BarChart3 className="w-6 h-6 text-orange-600 mb-2" />
                      <span className="text-sm font-medium text-orange-800 dark:text-orange-300">Theo dõi tiến độ</span>
                      <span className="text-xs text-orange-600 dark:text-orange-400">Xem thống kê chi tiết</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                      <Award className="w-6 h-6 text-orange-600 mb-2" />
                      <span className="text-sm font-medium text-orange-800 dark:text-orange-300">Nhận thành tựu</span>
                      <span className="text-xs text-orange-600 dark:text-orange-400">Động lực duy trì</span>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3"
                  >
                    <PlayCircle className="w-5 h-5 mr-2" />
                    Tạo kế hoạch bỏ thuốc ngay
                  </Button>
                </CardContent>
              </Card>

              {/* Basic Stats for users without quit plan */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div
                  className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/30 dark:to-slate-700/30 p-4 rounded-xl border border-slate-200 dark:border-slate-700"
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Thành viên từ</span>
                  </div>
                  <div className="text-lg font-bold text-slate-600 dark:text-slate-400">
                    {Math.floor(
                      (new Date().getTime() - new Date(profileData.accountCreationDate).getTime()) /
                      (1000 * 60 * 60 * 24),
                    )}{" "}
                    ngày
                  </div>
                </motion.div>

                <motion.div
                  className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-4 rounded-xl border border-purple-200 dark:border-purple-700"
                  whileHover={{ scale: 1.02, y: -2 }}
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

                <motion.div
                  className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-xl border border-blue-200 dark:border-blue-700"
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Tài khoản</span>
                  </div>
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {isPremiumMember ? "Premium" : "Thường"}
                  </div>
                </motion.div>

                <motion.div
                  className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-4 rounded-xl border border-green-200 dark:border-green-700"
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-xs font-medium text-green-700 dark:text-green-300">Sẵn sàng</span>
                  </div>
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">Bắt đầu</div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* With Quit Plan - Show full stats */}
          {hasQuitPlan && (
            <>
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
                      <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">Tiền tiết kiệm</span>
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
                      <Progress
                        value={Math.max(0, 100 - (profileData.averageDailyCravings / 10) * 100)}
                        className="h-2"
                      />
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

              {/* Progress Section - Only show if user has quit plan */}
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
                          <span className="font-bold text-red-800 dark:text-red-300">
                            {profileData.totalCravings || 0}
                          </span>
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
                          <span className="font-bold text-blue-800 dark:text-blue-300">
                            {profileData.cigarettesAvoided}
                          </span>
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
            </>
          )}

          {/* Achievements Section - Show regardless of quit plan status */}
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
                            onError={handleAchievementIconError}
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
                  {hasQuitPlan
                    ? "Tiếp tục hành trình bỏ thuốc để mở khóa các thành tựu đầu tiên!"
                    : "Tạo kế hoạch bỏ thuốc để bắt đầu nhận thành tựu!"}
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
    </AnimatePresence>
  )
}