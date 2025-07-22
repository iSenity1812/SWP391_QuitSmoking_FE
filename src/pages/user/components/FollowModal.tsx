"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Search, UserPlus, UserMinus, Eye, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { followService } from "@/services/followService"
import type { UserSearchResult, FollowRelation } from "@/services/followService"
import { toast } from "react-toastify"

interface FollowModalProps {
  isOpen: boolean
  onClose: () => void
  type: "followers" | "following"
  userId: string
  title: string
}

export default function FollowModal({ isOpen, onClose, type, userId, title }: FollowModalProps) {
  const navigate = useNavigate()
  const [users, setUsers] = useState<UserSearchResult[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [followingStates, setFollowingStates] = useState<Record<string, boolean>>({})
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})

  // Helper function to convert FollowRelation to UserSearchResult for display
  const convertFollowRelationToUserResult = (relation: FollowRelation, viewingUserId: string): UserSearchResult => {
    // Determine if we're looking at the follower or the followed user
    const isFollower = relation.followerId !== viewingUserId

    return {
      userId: isFollower ? relation.followerId : relation.followedId,
      username: isFollower ? relation.followerUsername : relation.followedUsername,
      email: "", // Not available in FollowRelation
      profilePicture: isFollower ? relation.followerProfilePicture : relation.followedProfilePicture,
      role: "NORMAL_MEMBER", // Default role, could be enhanced later
      createdAt: relation.createdAt,
      streakCount: 0, // Not available in FollowRelation, could be fetched separately
      subscriptions: [],
      quitPlans: null,
      active: true
    }
  }

  // Load users when modal opens
  useEffect(() => {
    const loadData = async () => {
      if (!isOpen) return

      setLoading(true)
      try {
        const response = type === "followers"
          ? await followService.getFollowers(0, 50) // Load more items for modal
          : await followService.getFollowing(0, 50)

        const convertedUsers = response.content.map(relation =>
          convertFollowRelationToUserResult(relation, userId)
        )

        setUsers(convertedUsers)

        // Initialize follow states to false since we don't have this info from the relation data
        // Users will need to check individual profiles to see follow status
        const states: Record<string, boolean> = {}
        for (const user of convertedUsers) {
          states[user.userId] = false // Default to not following
        }
        setFollowingStates(states)
      } catch (error) {
        console.error("Error loading users:", error)
        toast.error("Không thể tải danh sách người dùng")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [isOpen, userId, type])

  const handleToggleFollow = async (targetUserId: string, currentlyFollowing: boolean) => {
    setLoadingStates(prev => ({ ...prev, [targetUserId]: true }))

    try {
      if (currentlyFollowing) {
        await followService.unfollowUser(targetUserId)
        setFollowingStates(prev => ({ ...prev, [targetUserId]: false }))
        toast.success("Đã bỏ theo dõi")
      } else {
        await followService.followUser(targetUserId)
        setFollowingStates(prev => ({ ...prev, [targetUserId]: true }))
        toast.success("Đã theo dõi")
      }
    } catch (error) {
      console.error("Error toggling follow:", error)
      toast.error("Có lỗi xảy ra")
    } finally {
      setLoadingStates(prev => ({ ...prev, [targetUserId]: false }))
    }
  }

  const handleUserClick = (targetUserId: string) => {
    // Navigate to user profile using React Router
    navigate(`/profile/${targetUserId}`)
    onClose() // Close modal after navigation
  }

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const UserItem = ({ user }: { user: UserSearchResult }) => {
    const isFollowing = followingStates[user.userId] || false
    const isLoading = loadingStates[user.userId] || false
    const showFollowButton = user.userId !== userId // Don't show follow button for self

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
      >
        <div className="relative">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.username}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          {user.role === "PREMIUM_MEMBER" && (
            <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-1">
              <span className="text-yellow-800 text-xs">👑</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-slate-900 dark:text-slate-100 truncate">
            {user.username}
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
            {user.email}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500">
            {user.streakCount} ngày • {new Date(user.createdAt).toLocaleDateString("vi-VN")}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleUserClick(user.userId)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors"
            title="Xem hồ sơ"
          >
            <Eye className="w-4 h-4" />
          </button>

          {showFollowButton && (
            <button
              onClick={() => handleToggleFollow(user.userId, isFollowing)}
              disabled={isLoading}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isFollowing
                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isFollowing ? (
                <UserMinus className="w-4 h-4" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              <span>{isFollowing ? "Bỏ theo dõi" : "Theo dõi"}</span>
            </button>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg mx-4 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 max-h-[80vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                {title} ({users.length})
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto max-h-96">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                  <span className="ml-2 text-slate-600 dark:text-slate-400">Đang tải...</span>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-500 dark:text-slate-400">
                    {searchQuery ? "Không tìm thấy người dùng nào" : "Chưa có ai trong danh sách"}
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-2">
                  {filteredUsers.map((user) => (
                    <UserItem key={user.userId} user={user} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
