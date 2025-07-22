"use client"

import { useState, useEffect, useImperativeHandle, forwardRef } from "react"
import { Search, UserPlus, Users, Eye, UserMinus, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { followService } from "@/services/followService"
import type { UserSearchResult, FollowRelation } from "@/services/followService"
import FollowModal from "./FollowModal"
import { toast } from "react-toastify"

interface SidebarRightProps {
  currentUserId: string
}

export interface SidebarRightRef {
  refreshFollowData: () => Promise<void>
}

const SidebarRight = forwardRef<SidebarRightRef, SidebarRightProps>(({ currentUserId }, ref) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<"followers" | "following">("followers")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([])
  const [followers, setFollowers] = useState<FollowRelation[]>([])
  const [following, setFollowing] = useState<FollowRelation[]>([])
  const [followingStates, setFollowingStates] = useState<Record<string, boolean>>({})
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const [searchLoading, setSearchLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<"followers" | "following">("followers")

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

  // Load followers and following on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [followersData, followingData] = await Promise.all([
          followService.getFollowers(0, 10), // Load first page with 10 items for sidebar
          followService.getFollowing(0, 10)
        ])

        setFollowers(followersData.content)
        setFollowing(followingData.content)
      } catch (error) {
        console.error("Error loading followers/following:", error)
      }
    }

    loadData()
  }, [])

  // Expose refresh function via ref
  useImperativeHandle(ref, () => ({
    refreshFollowData: async () => {
      try {
        const [followersData, followingData] = await Promise.all([
          followService.getFollowers(0, 10),
          followService.getFollowing(0, 10)
        ])

        setFollowers(followersData.content)
        setFollowing(followingData.content)
      } catch (error) {
        console.error("Error refreshing followers/following:", error)
      }
    }
  }), [])

  // Search users when query changes
  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([])
        return
      }

      setSearchLoading(true)
      try {
        const results = await followService.searchUsers(searchQuery)
        setSearchResults(results)

        // Initialize follow states to false since we don't have this info from search results
        // Users will need to check individual profiles to see follow status
        const states: Record<string, boolean> = {}
        for (const user of results) {
          if (user.userId !== currentUserId) {
            states[user.userId] = false // Default to not following
          }
        }
        setFollowingStates(prev => ({ ...prev, ...states }))
      } catch (error) {
        console.error("Error searching users:", error)
      } finally {
        setSearchLoading(false)
      }
    }

    const timeoutId = setTimeout(searchUsers, 300) // Debounce
    return () => clearTimeout(timeoutId)
  }, [searchQuery, currentUserId])

  const loadFollowersAndFollowing = async () => {
    try {
      const [followersData, followingData] = await Promise.all([
        followService.getFollowers(0, 10),
        followService.getFollowing(0, 10)
      ])

      setFollowers(followersData.content)
      setFollowing(followingData.content)
    } catch (error) {
      console.error("Error loading followers/following:", error)
    }
  }

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

      // Reload followers/following lists
      loadFollowersAndFollowing()
    } catch (error) {
      console.error("Error toggling follow:", error)
      toast.error("Có lỗi xảy ra")
    } finally {
      setLoadingStates(prev => ({ ...prev, [targetUserId]: false }))
    }
  }

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`)
  }

  const handleViewMore = (type: "followers" | "following") => {
    setModalType(type)
    setModalOpen(true)
  }

  const displayedFollowers = followers.slice(0, 5).map(follower =>
    convertFollowRelationToUserResult(follower, currentUserId)
  )
  const displayedFollowing = following.slice(0, 5).map(followed =>
    convertFollowRelationToUserResult(followed, currentUserId)
  )

  const UserItem = ({ user, showFollowButton = false }: { user: UserSearchResult; showFollowButton?: boolean }) => {
    const isFollowing = followingStates[user.userId] || false
    const isLoading = loadingStates[user.userId] || false
    const isSelf = user.userId === currentUserId

    return (
      <div className="flex items-center space-x-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
        <div className="relative">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.username}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
              <span className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
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
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
            {user.username}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {user.streakCount} ngày
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleUserClick(user.userId)}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <Eye className="w-4 h-4" />
          </button>
          {showFollowButton && !isSelf && (
            <button
              onClick={() => handleToggleFollow(user.userId, isFollowing)}
              disabled={isLoading}
              className={`p-1 transition-colors ${isFollowing
                ? "text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isFollowing ? (
                <UserMinus className="w-4 h-4" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        {/* Search Section */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Search Results */}
          <AnimatePresence>
            {searchQuery && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 shadow-lg"
              >
                <div className="p-3">
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Kết quả tìm kiếm
                  </h4>
                  {searchLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-1">
                      {searchResults.map((user) => (
                        <UserItem key={user.userId} user={user} showFollowButton />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Không tìm thấy người dùng nào
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Followers/Following Section */}
        <div>
          <div className="flex border-b border-slate-200 dark:border-slate-600 mb-4">
            <button
              onClick={() => setActiveTab("followers")}
              className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${activeTab === "followers"
                ? "text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Followers ({followers.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("following")}
              className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${activeTab === "following"
                ? "text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <UserPlus className="w-4 h-4" />
                <span>Following ({following.length})</span>
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "followers" ? (
                <div>
                  <div className="space-y-1">
                    {displayedFollowers.map((user) => (
                      <UserItem key={user.userId} user={user} />
                    ))}
                  </div>

                  {followers.length > 5 && (
                    <button
                      onClick={() => handleViewMore("followers")}
                      className="w-full mt-3 py-2 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
                    >
                      Xem thêm {followers.length - 5} người
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  <div className="space-y-1">
                    {displayedFollowing.map((user) => (
                      <UserItem key={user.userId} user={user} />
                    ))}
                  </div>

                  {following.length > 5 && (
                    <button
                      onClick={() => handleViewMore("following")}
                      className="w-full mt-3 py-2 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
                    >
                      Xem thêm {following.length - 5} người
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Follow Modal */}
      <FollowModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
        userId={currentUserId}
        title={modalType === "followers" ? "Followers" : "Following"}
      />
    </div>
  )
})

SidebarRight.displayName = "SidebarRight"
export default SidebarRight
