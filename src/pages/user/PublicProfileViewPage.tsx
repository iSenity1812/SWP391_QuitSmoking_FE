"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import SidebarLeft from "./components/SidebarLeft"
import SidebarRight, { type SidebarRightRef } from "./components/SidebarRight"
import PublicProfileCard from "./components/PublicProfileCard"
import { useAuth } from "@/hooks/useAuth"

export default function PublicProfilePage() {
  const { user, isLoading } = useAuth()
  const sidebarRightRef = useRef<SidebarRightRef>(null)

  // Show loading or error if user not authenticated
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Cần đăng nhập
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Vui lòng đăng nhập để xem profile người dùng
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {/* Left Sidebar */}
      <SidebarLeft
        activeTab="public-profile"
        onTabChange={() => { }} // No tab change needed for public profile
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PublicProfileCard onFollowChange={() => sidebarRightRef.current?.refreshFollowData()} />
          </motion.div>
        </main>
      </div>

      {/* Right Sidebar */}
      <SidebarRight ref={sidebarRightRef} currentUserId={user.userId} />
    </div>
  )
}
