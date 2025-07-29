"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Camera, Save, Edit3, Moon, Sun, Lock, Eye, EyeOff, Award, Share2, Users } from "lucide-react"
import type { UserProfile } from "../../types/UserProfile"
import { userService } from "@/services/userService"
import { achievementService } from "@/services/achievementService"
import { useTheme } from "@/context/ThemeContext"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "react-toastify"
import type { MemberAchievementDTO } from "@/types/achievement"

interface SettingsTabProps {
  user: UserProfile
}

export default function SettingsTab({ user }: SettingsTabProps) {
  // Helper function to translate achievement names to Vietnamese
  const translateAchievementName = (name: string): string => {
    const translations: Record<string, string> = {
      "First Day Smoke-Free": "Ngày đầu không thuốc",
      "3 Days Smoke-Free": "3 ngày không thuốc",
      "1 Week Smoke-Free": "1 tuần không thuốc",
      "1 Month Smoke-Free": "1 tháng không thuốc",
      "Money Saver": "Tiết kiệm tiền",
      "Cigarette Avoider": "Tránh thuốc lá",
      "Craving Resister": "Chống cơn thèm",
      "Health Improver": "Cải thiện sức khỏe",
      "Daily Goal": "Mục tiêu hàng ngày",
      "Weekly Goal": "Mục tiêu hàng tuần",
      "Goal Streak": "Chuỗi mục tiêu",
      "Resilience": "Kiên trì",
      "Special Achievement": "Thành tựu đặc biệt"
    }
    return translations[name] || name
  }

  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [userAchievements, setUserAchievements] = useState<MemberAchievementDTO[]>([])
  const [achievementsLoading, setAchievementsLoading] = useState(false)

  const [formData, setFormData] = useState({
    displayName: user.displayName || "",
    email: user.email || "",
    profilePicture: user.profilePicture || ""
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const [isLoading, setIsLoading] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { refreshUserInfo } = useAuth()

  // Sync formData when user prop changes (after save)
  useEffect(() => {
    setFormData({
      displayName: user.displayName || "",
      email: user.email || "",
      profilePicture: user.profilePicture || ""
    })
  }, [user])

  // Load user achievements
  useEffect(() => {
    const loadUserAchievements = async () => {
      if (!user.userId) return

      try {
        setAchievementsLoading(true)
        const achievements = await achievementService.getMemberAchievements(user.userId)
        setUserAchievements(achievements)
      } catch (error) {
        console.error("Error loading user achievements:", error)
      } finally {
        setAchievementsLoading(false)
      }
    }

    loadUserAchievements()
  }, [user.userId])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await userService.updateProfile({
        name: formData.displayName,
        email: formData.email
      })

      // Refresh user info to update the UI
      await refreshUserInfo()

      toast.success("Cập nhật thông tin thành công!")
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Có lỗi xảy ra khi cập nhật thông tin")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp")
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự")
      return
    }

    setIsLoading(true)
    try {
      await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })

      toast.success("Đổi mật khẩu thành công!")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
      setIsChangingPassword(false)
    } catch (error) {
      console.error("Error changing password:", error)
      toast.error("Có lỗi xảy ra khi đổi mật khẩu. Vui lòng kiểm tra mật khẩu hiện tại")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      displayName: user.displayName || "",
      email: user.email || "",
      profilePicture: user.profilePicture || ""
    })
    setIsEditing(false)
  }

  const handleCancelPasswordChange = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    })
    setIsChangingPassword(false)
  }

  const handleToggleAchievementShare = async (achievementId: number, currentStatus: boolean) => {
    if (!user.userId) return

    try {
      await achievementService.updateAchievementShareStatus(user.userId, achievementId, !currentStatus)

      // Update local state
      setUserAchievements(prev =>
        prev.map(achievement =>
          achievement.achievementId === achievementId
            ? { ...achievement, isShared: !currentStatus }
            : achievement
        )
      )

      toast.success(
        !currentStatus
          ? "Đã bật chia sẻ thành tựu trên profile công khai"
          : "Đã tắt chia sẻ thành tựu trên profile công khai"
      )
    } catch (error) {
      console.error("Error toggling achievement share status:", error)
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái chia sẻ")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Profile Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Thông tin cá nhân</h3>
          <button
            onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span>{isEditing ? "Hủy" : "Chỉnh sửa"}</span>
          </button>
        </div>

        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              {formData.profilePicture ? (
                <img
                  src={formData.profilePicture}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                  <span className="text-emerald-600 dark:text-emerald-400 text-2xl font-semibold">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
            <div>
              <h4 className="font-medium text-slate-900 dark:text-slate-100">Ảnh đại diện</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">JPG, PNG tối đa 5MB</p>
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Tên hiển thị
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Nhập tên hiển thị"
              />
            ) : (
              <div className="px-4 py-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-slate-900 dark:text-slate-100">
                {formData.displayName || "Chưa cập nhật"}
              </div>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Tên người dùng
            </label>
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-400">
              @{user.username}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Tên người dùng không thể thay đổi</p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Nhập email"
              />
            ) : (
              <div className="px-4 py-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-slate-900 dark:text-slate-100">
                {formData.email || "Chưa cập nhật"}
              </div>
            )}
          </div>

          {isEditing && (
            <div className="flex space-x-3">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? "Đang lưu..." : "Lưu thay đổi"}</span>
              </button>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Hủy
              </button>
            </div>
          )}
        </div>
      </div>

      {/* App Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">Cài đặt ứng dụng</h3>

        <div className="space-y-4">
          {/* Dark Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {theme === "dark" ? <Moon className="w-5 h-5 text-slate-600 dark:text-slate-400" /> : <Sun className="w-5 h-5 text-slate-600 dark:text-slate-400" />}
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">Chế độ tối</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Bật/tắt chế độ tối</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${theme === "dark" ? "bg-emerald-600" : "bg-slate-300"
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === "dark" ? "translate-x-6" : "translate-x-1"
                  }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">Tài khoản</h3>

        <div className="space-y-4">
          {!isChangingPassword ? (
            <button
              onClick={() => setIsChangingPassword(true)}
              className="w-full text-left px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">Đổi mật khẩu</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Cập nhật mật khẩu của bạn</p>
                </div>
              </div>
            </button>
          ) : (
            <div className="space-y-4 p-4 border border-slate-300 dark:border-slate-600 rounded-lg">
              <h4 className="font-medium text-slate-900 dark:text-slate-100">Đổi mật khẩu</h4>

              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Mật khẩu hiện tại
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-4 py-2 pr-10 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-2 pr-10 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Nhập mật khẩu mới"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Xác nhận mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2 pr-10 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={handlePasswordChange}
                  disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{isLoading ? "Đang lưu..." : "Đổi mật khẩu"}</span>
                </button>
                <button
                  onClick={handleCancelPasswordChange}
                  disabled={isLoading}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Achievement Sharing Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Award className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Chia sẻ thành tựu
            </h3>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Chọn những thành tựu bạn muốn hiển thị trên profile công khai của mình. Người khác có thể xem những thành tựu này khi vào trang profile của bạn.
          </p>

          {achievementsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
              <span className="ml-2 text-slate-600 dark:text-slate-400">Đang tải thành tựu...</span>
            </div>
          ) : userAchievements.length === 0 ? (
            <div className="text-center py-8">
              <Award className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-500">
                Bạn chưa có thành tựu nào. Hãy tiếp tục hành trình bỏ thuốc để mở khóa thành tựu đầu tiên!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {userAchievements.map((achievement) => (
                <div
                  key={achievement.achievementId}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                      {achievement.iconUrl ? (
                        <img
                          src={achievement.iconUrl}
                          alt={achievement.name}
                          className="w-6 h-6 object-cover rounded"
                        />
                      ) : (
                        <Award className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {translateAchievementName(achievement.name) || "Thành tựu"}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Đạt được: {new Date(achievement.dateAchieved).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {achievement.isShared && (
                      <div className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400">
                        <Users className="w-4 h-4" />
                        <span className="text-xs">Công khai</span>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        const id = achievement.achievementId;
                        if (id) {
                          handleToggleAchievementShare(id, achievement.isShared);
                        } else {
                          console.error('Achievement ID is undefined:', achievement);
                          toast.error('Không thể cập nhật: ID thành tựu không hợp lệ');
                        }
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${achievement.isShared
                        ? 'bg-emerald-600'
                        : 'bg-slate-200 dark:bg-slate-600'
                        }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${achievement.isShared ? 'translate-x-6' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700">
                <div className="flex items-start space-x-2">
                  <Share2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                      Mẹo về chia sẻ thành tựu
                    </p>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
                      Chia sẻ thành tựu giúp bạn truyền cảm hứng cho cộng đồng và nhận được sự ủng hộ từ những người khác trong hành trình bỏ thuốc.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
