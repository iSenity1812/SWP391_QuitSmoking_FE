"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Crown, Calendar, Target, TrendingUp, Award, Users, UserPlus, Loader2, Shield, Star, ArrowLeft, UserMinus } from "lucide-react"
import { motion } from "framer-motion"
import { userService, type PublicProfileResponse, type Achievement } from "@/services/userService"
import { followService } from "@/services/followService"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "react-toastify"

interface PublicProfileCardProps {
  onFollowChange?: () => void
}

export default function PublicProfileCard({ onFollowChange }: PublicProfileCardProps) {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [profileData, setProfileData] = useState<PublicProfileResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) {
        setError("User ID không hợp lệ")
        setIsLoading(false)
        return
      }

      // Check if viewing own profile
      if (user && user.userId === userId) {
        setError("Không thể xem profile công khai của chính mình")
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        console.log("Fetching profile for userId:", userId)

        // Get profile data (now includes follow status)
        const profileResponse = await userService.getPublicProfileById(userId)
        console.log("Profile response:", profileResponse)
        setProfileData(profileResponse)

        // Set follow status from API response
        if (user) {
          console.log("Follow status from API:", profileResponse.following)
          setIsFollowing(profileResponse.following)
        } else {
          setIsFollowing(false)
        }
      } catch (error) {
        console.error("Error fetching public profile data:", error)
        setError("Không thể tải thông tin profile")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfileData()
  }, [userId, user])

  const handleToggleFollow = async () => {
    if (!user || !userId) return

    try {
      setFollowLoading(true)

      if (isFollowing) {
        await followService.unfollowUser(userId)
        toast.success("Đã bỏ theo dõi")
      } else {
        await followService.followUser(userId)
        toast.success("Đã theo dõi")
      }

      // Refetch profile data to get updated follow status and follower count
      try {
        const updatedProfile = await userService.getPublicProfileById(userId)
        setProfileData(updatedProfile)
        setIsFollowing(updatedProfile.following)
        console.log("Updated follow status:", updatedProfile.following)

        // Notify parent component to refresh sidebar
        onFollowChange?.()
      } catch (refetchError) {
        console.error("Error refetching profile:", refetchError)
        // Fallback to manual state update if refetch fails
        setIsFollowing(!isFollowing)
      }
    } catch (error) {
      console.error("Error toggling follow:", error)
      toast.error("Có lỗi xảy ra")
    } finally {
      setFollowLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
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

  if (isLoading) {
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

  if (error || !profileData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
      >
        <div className="text-center py-12">
          <div className="text-red-500 text-xl mb-4">❌</div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Không thể tải profile
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {error || "Đã xảy ra lỗi khi tải thông tin người dùng"}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Quay lại
          </button>
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
      {/* Back Button */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>
      </div>

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
            {profileData.hasPremiumBadge && (
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
            <motion.div
              variants={itemVariants}
              className="flex items-center text-sm text-white/70 mt-2"
            >
              <Calendar className="w-4 h-4 mr-1" />
              Thành viên từ {profileData.memberSince}
            </motion.div>

            {/* Progress Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center mt-2 px-3 py-1 bg-white/20 rounded-full text-sm font-medium"
            >
              <Target className="w-4 h-4 mr-1" />
              {profileData.quitJourneyStatus}
            </motion.div>

            {/* Premium Badge */}
            {profileData.premium && profileData.premiumSince && (
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center mt-2 ml-2 px-3 py-1 bg-yellow-400/20 rounded-full text-sm font-medium"
              >
                <Crown className="w-4 h-4 mr-1" />
                Premium từ {formatDate(profileData.premiumSince)}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="p-6 space-y-8">
        {/* Public Stats Grid */}
        <motion.div
          variants={itemVariants}
          className="space-y-6"
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
            Thông tin công khai
          </h3>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 p-4 rounded-xl border border-emerald-200 dark:border-emerald-700"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Streak hiện tại</span>
              </div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {profileData.streakCount}
              </div>
              <div className="text-xs text-emerald-500 dark:text-emerald-400">ngày</div>
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

            <motion.div
              className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 p-4 rounded-xl border border-yellow-200 dark:border-yellow-700"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">Thành tựu</span>
              </div>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {profileData.totalAchievementsEarned}
              </div>
              <div className="text-xs text-yellow-500 dark:text-yellow-400">đã đạt được</div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-xl border border-blue-200 dark:border-blue-700"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Loại tài khoản</span>
              </div>
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {profileData.premium ? "Premium" : "Standard"}
              </div>
              {profileData.premium && (
                <div className="flex items-center text-xs text-blue-500 dark:text-blue-400">
                  <Crown className="w-3 h-3 mr-1" />
                  VIP
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Shared Achievements Section */}
        <motion.div
          variants={itemVariants}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-600" />
              Thành tựu chia sẻ
            </h3>
          </div>

          {profileData.sharedAchievements && profileData.sharedAchievements.length > 0 ? (
            <div className="space-y-3">
              {profileData.sharedAchievements.map((achievement: Achievement, index: number) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  {/* Achievement Icon */}
                  <div className="relative flex-shrink-0">
                    {achievement.iconUrl ? (
                      <img
                        src={achievement.iconUrl}
                        alt={achievement.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Achievement Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {achievement.name}
                    </h4>
                    {achievement.detailedDescription && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {achievement.detailedDescription}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      {new Date(achievement.dateAchieved).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                      })}
                    </p>
                  </div>

                  {/* Shared Badge */}
                  <div className="flex-shrink-0">
                    <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-medium">
                      <Star className="w-3 h-3 inline mr-1" />
                      Đã chia sẻ
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h4 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
                Chưa có thành tựu chia sẻ
              </h4>
              <p className="text-slate-500 dark:text-slate-500">
                Người dùng này chưa chia sẻ thành tựu nào công khai
              </p>
            </div>
          )}
        </motion.div>

        {/* Follow Section */}
        <motion.div
          variants={itemVariants}
          className="text-center py-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200 dark:border-emerald-700"
        >
          {isFollowing ? (
            <UserMinus className="w-12 h-12 text-red-600 mx-auto mb-3" />
          ) : (
            <UserPlus className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
          )}
          <h4 className="text-lg font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
            {isFollowing ? `Đang theo dõi ${profileData.username}` : `Kết nối với ${profileData.username}`}
          </h4>
          <p className="text-emerald-600 dark:text-emerald-400 mb-4">
            {isFollowing
              ? "Bỏ theo dõi để ngừng nhận cập nhật"
              : "Theo dõi để cùng nhau thực hiện hành trình bỏ thuốc lá"
            }
          </p>
          {user && userId !== user.userId && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleFollow}
              disabled={followLoading}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg ${isFollowing
                ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                } ${followLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {followLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isFollowing ? "Đang bỏ theo dõi..." : "Đang theo dõi..."}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {isFollowing ? (
                    <>
                      <UserMinus className="w-4 h-4" />
                      Bỏ theo dõi
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Theo dõi
                    </>
                  )}
                </div>
              )}
            </motion.button>
          )}
          {user && userId === user.userId && (
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Đây là profile của bạn
            </p>
          )}
          {!user && (
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Đăng nhập để theo dõi người dùng này
            </p>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
