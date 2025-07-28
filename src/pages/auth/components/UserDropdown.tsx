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
  const [imageError, setImageError] = useState(false)
  const [headerImageError, setHeaderImageError] = useState(false)
  const [forceRefresh, setForceRefresh] = useState(0) // Add force refresh counter
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

  // Reset image error states when user changes
  useEffect(() => {
    setImageError(false)
    setHeaderImageError(false)
    setForceRefresh(prev => prev + 1) // Force component to re-evaluate image URLs
  }, [user?.userId, user?.profilePicture, user?.email]) // Add more dependencies to ensure refresh

  // Listen for profile picture update events
  useEffect(() => {
    const handleProfilePictureUpdate = () => {
      console.log("UserDropdown: Profile picture update event received")
      setImageError(false)
      setHeaderImageError(false)
      setForceRefresh(prev => prev + 1)

      // Force a small delay to ensure localStorage is updated
      setTimeout(() => {
        setForceRefresh(prev => prev + 1)
      }, 100)
    }

    window.addEventListener('profilePictureUpdated', handleProfilePictureUpdate)
    window.addEventListener('userInfoUpdated', handleProfilePictureUpdate) // Also listen for general user info updates

    return () => {
      window.removeEventListener('profilePictureUpdated', handleProfilePictureUpdate)
      window.removeEventListener('userInfoUpdated', handleProfilePictureUpdate)
    }
  }, [])

  // Additional effect to watch for user object changes
  useEffect(() => {
    if (user) {
      console.log("UserDropdown: User object changed, forcing refresh...")
      setImageError(false)
      setHeaderImageError(false)
      setForceRefresh(prev => prev + 1)
    }
  }, [user]) // Watch entire user object

  if (!user) return null

  // Debug logging
  console.log("=== UserDropdown Debug ===")
  console.log("User object:", user)
  console.log("Profile picture from user:", user?.profilePicture)
  console.log("Image error state:", imageError)
  console.log("Header image error state:", headerImageError)
  console.log("Force refresh counter:", forceRefresh)
  console.log("=== End UserDropdown Debug ===")

  // Get profile picture URL
  const getProfilePictureUrl = () => {
    // Use forceRefresh to ensure function re-evaluates
    const refresh = forceRefresh
    console.log("UserDropdown: Getting profile picture URL, refresh:", refresh)

    if (!imageError && user?.profilePicture) {
      // If it's a full URL, use it directly
      if (user.profilePicture.startsWith("http")) {
        console.log("UserDropdown: Using full URL:", user.profilePicture)
        return user.profilePicture
      }
      // If it's a relative path, prepend base URL
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
      const fullUrl = `${baseUrl}${user.profilePicture}`
      console.log("UserDropdown: Constructed URL:", fullUrl)
      return fullUrl
    }
    console.log("UserDropdown: No profile picture or error occurred")
    // Default fallback when error occurred or no profile picture
    return null
  }

  // Get header profile picture URL
  const getHeaderProfilePictureUrl = () => {
    // Use forceRefresh to ensure function re-evaluates
    const refresh = forceRefresh
    console.log("UserDropdown: Getting header profile picture URL, refresh:", refresh)

    if (!headerImageError && user?.profilePicture) {
      // If it's a full URL, use it directly
      if (user.profilePicture.startsWith("http")) {
        console.log("UserDropdown: Using full URL for header:", user.profilePicture)
        return user.profilePicture
      }
      // If it's a relative path, prepend base URL
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
      const fullUrl = `${baseUrl}${user.profilePicture}`
      console.log("UserDropdown: Constructed header URL:", fullUrl)
      return fullUrl
    }
    console.log("UserDropdown: No header profile picture or error occurred")
    // Default fallback when error occurred or no profile picture
    return null
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
          {getProfilePictureUrl() ? (
            <img
              src={getProfilePictureUrl()!}
              alt={user.username}
              className="w-10 h-10 rounded-full border-2 border-emerald-200 dark:border-emerald-500 shadow-lg group-hover:border-emerald-300 dark:group-hover:border-emerald-400 transition-colors duration-300 object-cover"
              onError={() => setImageError(true)}
              onLoad={() => setImageError(false)}
            />
          ) : (
            <div className="w-10 h-10 rounded-full border-2 border-emerald-200 dark:border-emerald-500 shadow-lg group-hover:border-emerald-300 dark:group-hover:border-emerald-400 transition-colors duration-300 bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center">
              <span className="text-emerald-600 dark:text-emerald-300 font-bold text-lg">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          {/* Role Badge */}
          {/* {getRoleBadgeText() && (
            <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
              {getRoleBadgeText()}
            </span>
          )} */}
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
              {getHeaderProfilePictureUrl() ? (
                <img
                  src={getHeaderProfilePictureUrl()!}
                  alt={user.username}
                  className="w-12 h-12 rounded-full border-2 border-emerald-300 dark:border-emerald-500 shadow-lg object-cover"
                  onError={() => setHeaderImageError(true)}
                  onLoad={() => setHeaderImageError(false)}
                />
              ) : (
                <div className="w-12 h-12 rounded-full border-2 border-emerald-300 dark:border-emerald-500 shadow-lg bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center">
                  <span className="text-emerald-600 dark:text-emerald-300 font-bold text-xl">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
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