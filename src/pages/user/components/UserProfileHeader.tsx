"use client"

import { Bell, Settings, Menu, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { User } from "../types/user-types"
import { useNavigate } from "react-router-dom"

interface UserProfileHeaderProps {
    user: User
    onMenuToggle: () => void
}

export function UserProfileHeader({ user, onMenuToggle }: UserProfileHeaderProps) {
    const navigate = useNavigate()

    const handleGoHome = () => {
        navigate("/")
    }

    return (
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left section with back button and menu */}
                    <div className="flex items-center space-x-3">
                        {/* Back to Homepage Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleGoHome}
                            className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">Trang chủ</span>
                        </Button>

                        {/* Mobile menu button */}
                        <Button variant="ghost" size="sm" className="md:hidden" onClick={onMenuToggle}>
                            <Menu className="h-5 w-5" />
                        </Button>

                        {/* User info */}
                        <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                                    {user.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden sm:block">
                                <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Chào mừng, {user.name}!</h1>
                            </div>
                        </div>
                    </div>

                    {/* Right section */}
                    <div className="flex items-center space-x-3">
                        {/* Premium badge */}
                        {user.subscription?.plan === "premium" && (
                            <Badge variant="secondary" className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0">
                                ⭐ Premium
                            </Badge>
                        )}

                        {/* Notifications */}
                        <Button variant="ghost" size="sm" className="relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                                3
                            </span>
                            <span className="sr-only">Thông báo</span>
                        </Button>

                        {/* Settings */}
                        <Button variant="ghost" size="sm">
                            <Settings className="h-5 w-5" />
                            <span className="sr-only">Cài đặt</span>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}
