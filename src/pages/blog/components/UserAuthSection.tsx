"use client"

import type React from "react"
import { Plus, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { BlogUser } from "@/types/blog"
import { getRoleIcon } from "./UserBadges"
import { useAuth } from "@/hooks/useAuth"

interface UserAuthSectionProps {
    currentUser: BlogUser | null
    handleCreateBlogClick: () => void
    handleViewMyPosts: () => void
}

// Add this helper function at the top of the component:
const getProfilePictureUrl = (profilePicture: string | null | undefined): string | null => {
    if (!profilePicture) return null

    // If it's already a full URL (starts with http/https), return as is
    if (profilePicture.startsWith("http://") || profilePicture.startsWith("https://")) {
        return profilePicture
    }

    // If it's a base64 image, return as is
    if (profilePicture.startsWith("data:")) {
        return profilePicture
    }

    // If it's a relative path, prepend the base URL
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
    if (profilePicture.startsWith("/")) {
        return `${baseUrl}${profilePicture}`
    }

    // If it doesn't start with /, add both base URL and /
    return `${baseUrl}/${profilePicture}`
}

const UserAuthSection: React.FC<UserAuthSectionProps> = ({ currentUser, handleCreateBlogClick, handleViewMyPosts }) => {
    const { user: authUser } = useAuth()
    const displayUser = currentUser || authUser

    return (
        <div className="mb-8 flex justify-between items-center p-4 bg-white/90 dark:bg-slate-800/90 rounded-xl border-2 border-emerald-200 dark:border-emerald-500/30 shadow-md">
            <div className="flex items-center gap-3">
                {displayUser ? (
                    <>
                        <div className="relative">
                            {/* Profile Picture */}
                            {getProfilePictureUrl(displayUser?.profilePicture) && (
                                <img
                                    src={getProfilePictureUrl(displayUser?.profilePicture)! || "/placeholder.svg"}
                                    alt={displayUser?.username}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-emerald-200 dark:border-emerald-500 shadow-lg"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement
                                        target.style.display = "none"
                                        const fallback = target.nextElementSibling as HTMLElement
                                        if (fallback) {
                                            fallback.style.display = "flex"
                                        }
                                    }}
                                />
                            )}

                            {/* Fallback Avatar */}
                            <div
                                className={`w-10 h-10 rounded-full border-2 border-emerald-200 dark:border-emerald-500 shadow-lg bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center ${getProfilePictureUrl(displayUser?.profilePicture) ? "hidden" : "flex"}`}
                                style={{ display: getProfilePictureUrl(displayUser?.profilePicture) ? "none" : "flex" }}
                            >
                                <span className="text-emerald-600 dark:text-emerald-300 text-sm font-bold">
                                    {(displayUser?.username || "U").charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>

                        <div>
                            <p className="font-semibold text-slate-800 dark:text-white">{displayUser?.username}</p>
                            <div className="flex items-center gap-1">
                                {getRoleIcon(displayUser?.role)}
                                <span className="text-sm text-slate-500 dark:text-slate-400">{displayUser?.role}</span>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <Avatar className="w-10 h-10">
                            <AvatarFallback>
                                <User className="w-5 h-5" />
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-slate-800 dark:text-white">Khách</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Chưa đăng nhập</p>
                        </div>
                    </>
                )}
            </div>
            <div className="flex justify-between items-center">
                <Button
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
                    style={{ marginRight: "5px" }}
                    onClick={handleViewMyPosts}
                >
                    <User className="w-4 h-4" />
                    Xem bài viết của tôi
                </Button>

                <Button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600" onClick={handleCreateBlogClick}>
                    <Plus className="w-4 h-4" />
                    Tạo bài viết mới
                </Button>
            </div>
        </div>
    )
}

export default UserAuthSection
