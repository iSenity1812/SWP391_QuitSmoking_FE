"use client"

import { Wind, BarChart3, Trophy, Settings, Calendar, LogOut } from "lucide-react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"

interface SidebarLeftProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: "overview", label: "Tổng quan", icon: BarChart3 },
  { id: "achievements", label: "Thành tựu", icon: Trophy },
  { id: "settings", label: "Tùy chỉnh cá nhân", icon: Settings },
  { id: "booking", label: "Đặt lịch", icon: Calendar },
  { id: "leaderboard", label: "Bảng xếp hạng", icon: Trophy, premium: true },
]

export default function SidebarLeft({ activeTab, onTabChange }: SidebarLeftProps) {
  const { logout } = useAuth();
  const handleTabClick = (tabId: string) => {
    if (tabId === "booking") {
      window.location.href = "/booking"
    } else if (tabId === "leaderboard") {
      window.location.href = "/leaderboard"
    }
    else {
      onTabChange(tabId)
    }
  }

  return (
    <div className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <Wind className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          <Link to={"/"} className="text-2xl font-bold text-slate-800 dark:text-white">
            QuitTogether
          </Link>
        </div>

        <nav className="space-y-2">
          {tabs.map((tab) => {
            const IconComponent = tab.icon
            const isActive = activeTab === tab.id

            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${isActive
                  ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </motion.button>
            )
          })}
        </nav>
        <Button
          variant="outline"
          className="w-full justify-start mt-2 text-rose-600 dark:text-rose-400"
          size="sm"
          onClick={() => {
            logout()
          }}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Đăng xuất
        </Button>
      </div>
    </div>
  )
}
