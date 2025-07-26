"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { ChevronDown, User, Settings, LogOut, Trophy, Gem } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { Link } from "react-router-dom"
import { userService, type UserProfileMeResponse } from "@/services/userService"

const UserDropdown: React.FC = () => {
  const { user, logout } = useAuth()
  const [profileData, setProfileData] = useState<UserProfileMeResponse | null>(null)
  const [imageKey, setImageKey] = useState(Date.now())
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        try {
          const data = await userService.getProfileMe()
          setProfileData(data)
          console.log("UserDropdown: Fetched profile data:", data)
        } catch (error) {
          console.error("Error fetching profile data in UserDropdown:", error)
        }
      }
    }

    fetchProfileData()
  }, [user])

  // Listen for profile picture updates
  useEffect(() => {
    const handleProfilePictureUpdate = (event: CustomEvent) => {
      console.log("UserDropdown: Profile picture updated:", event.detail.profilePicture)
      // Update profile data if available
      if (profileData) {
        setProfileData((prev) => ({
          ...prev!,
          profilePicture: event.detail.profilePicture,
        }))
      }
      // Update cache busting key
      setImageKey(Date.now())
    }

    window.addEventListener("profilePictureUpdated", handleProfilePictureUpdate as EventListener)
    return () => {
      window.removeEventListener("profilePictureUpdated", handleProfilePictureUpdate as EventListener)
    }
  }, [profileData])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Get profile picture URL with force update dependency
  const getProfilePictureUrl = () => {
    // Use profileData first (from UserProfileMeResponse), then fallback to user
    const imageToUse = profileData?.profilePicture || user?.profilePicture

    console.log("UserDropdown: getProfilePictureUrl - profileData:", profileData?.profilePicture)
    console.log("UserDropdown: getProfilePictureUrl - user:", user?.profilePicture)
    console.log("UserDropdown: getProfilePictureUrl - imageToUse:", imageToUse)

    if (!imageToUse) return null

    // If it's already a full URL (starts with http/https), return as is with cache busting
    if (imageToUse.startsWith("http://") || imageToUse.startsWith("https://")) {
      return `${imageToUse}?t=${imageKey}`
    }

    // If it's a base64 image, return as is
    if (imageToUse.startsWith("data:")) {
      return imageToUse
    }

    // If it's a relative path, prepend the base URL and add cache busting
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    if (imageToUse.startsWith("/")) {
      return `${baseUrl}${imageToUse}?t=${imageKey}`
    }

    // If it doesn't start with /, add both base URL and / with cache busting
    return `${baseUrl}/${imageToUse}?t=${imageKey}`
  }

  const getRoleBadgeText = () => {
    switch (user?.role) {
      case "SUPER_ADMIN":
        return "Admin"
      case "CONTENT_ADMIN":
        return "Content Admin"
      case "COACH":
        return "Coach"
      case "PREMIUM_MEMBER":
        return "Premium"
      case "NORMAL_MEMBER":
        return "Member"
      default:
        return ""
    }
  }

  // Get dashboard link based on role
  const getDashboardLink = () => {
    switch (user?.role) {
      case "SUPER_ADMIN":
        return "/admin"
      case "CONTENT_ADMIN":
        return "/contentadmin"
      case "COACH":
        return "/coach"
      default:
        return "/profile"
    }
  }


  const menuItems = [
    { icon: User, label: "Profile", href: "/profile" },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: Gem, label: "Achievements", href: "/achievements" }
  ]

  if (!user) {
    return null
  }

  const profileImageUrl = getProfilePictureUrl()
  console.log("UserDropdown: Final profileImageUrl:", profileImageUrl)

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-slate-700 transition-all duration-300 hover:scale-105 group relative"
      >
        <div className="relative">
          {/* Profile Picture */}
          {profileImageUrl ? (
            <img
              key={imageKey} // Use same key for both navbar and dropdown
              src={profileImageUrl || "/placeholder.svg"}
              alt={user.username}
              className="w-10 h-10 rounded-full border-2 border-emerald-200 dark:border-emerald-500 shadow-lg group-hover:border-emerald-300 dark:group-hover:border-emerald-400 transition-colors duration-300 object-cover"
              onError={(e) => {
                console.log("UserDropdown: Navbar image failed to load:", profileImageUrl)
                // Hide image and show fallback
                const target = e.target as HTMLImageElement
                target.style.display = "none"
                const fallback = target.nextElementSibling as HTMLElement
                if (fallback) {
                  fallback.style.display = "flex"
                }
              }}
              onLoad={() => {
                console.log("UserDropdown: Navbar image loaded successfully:", profileImageUrl)
              }}
            />
          ) : null}
          {/* Fallback Avatar */}
          <div
            className={`w-10 h-10 rounded-full border-2 border-emerald-200 dark:border-emerald-500 shadow-lg group-hover:border-emerald-300 dark:group-hover:border-emerald-400 transition-colors duration-300 bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center ${profileImageUrl ? "hidden" : "flex"}`}
            style={{ display: profileImageUrl ? "none" : "flex" }}
          >
            <span className="text-emerald-600 dark:text-emerald-300 text-sm font-bold">
              {user.username.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
        <div className="hidden md:block text-left">
          <p className="font-bold text-slate-800 dark:text-white text-sm">{user.username}</p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-600 dark:text-slate-300 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border-2 border-emerald-100 dark:border-slate-700 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200 min-w-[240px]">
          {/* Header with user info */}
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-b border-emerald-200 dark:border-slate-600">
            <div className="flex items-center gap-3">
              {/* Profile Picture */}
              {profileImageUrl ? (
                <img
                  key={imageKey} // Use same key for both navbar and dropdown
                  src={profileImageUrl || "/placeholder.svg"}
                  alt={user.username}
                  className="w-12 h-12 rounded-full border-2 border-emerald-300 dark:border-emerald-500 shadow-lg object-cover"
                  onError={(e) => {
                    console.log("UserDropdown: Dropdown image failed to load:", profileImageUrl)
                    // Hide image and show fallback
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                    const fallback = target.nextElementSibling as HTMLElement
                    if (fallback) {
                      fallback.style.display = "flex"
                    }
                  }}
                  onLoad={() => {
                    console.log("UserDropdown: Dropdown image loaded successfully:", profileImageUrl)
                  }}
                />
              ) : null}
              {/* Fallback Avatar */}
              <div
                className={`w-12 h-12 rounded-full border-2 border-emerald-300 dark:border-emerald-500 shadow-lg bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center ${profileImageUrl ? "hidden" : "flex"}`}
                style={{ display: profileImageUrl ? "none" : "flex" }}
              >
                <span className="text-emerald-600 dark:text-emerald-300 text-lg font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-slate-800 dark:text-white truncate">{user.username}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 truncate max-w-full">{user.email}</p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    {getRoleBadgeText()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Menu Items */}
          <div className="p-2">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors duration-200 text-left"
              >
                <item.icon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
              </Link>
            ))}
            <hr className="my-2 border-gray-200 dark:border-slate-600" />
            {/* Logout Button */}
            <button
              onClick={() => {
                setIsOpen(false)
                logout()
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 text-left text-red-600 dark:text-red-400"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-semibold">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserDropdown