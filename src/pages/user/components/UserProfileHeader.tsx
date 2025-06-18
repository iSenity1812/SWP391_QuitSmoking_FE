"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Bell, Settings, Menu } from "lucide-react"
import type { User } from "../types/user-types"

interface UserProfileHeaderProps {
    user: User
    onMenuToggle: () => void
}

export function UserProfileHeader({ user, onMenuToggle }: UserProfileHeaderProps) {
    return (
        <div className="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden p-2 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                            onClick={onMenuToggle}
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <Avatar className="h-12 w-12 border-2 border-emerald-200">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback className="bg-emerald-500 text-white">{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Chào mừng, {user.name}!</h1>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-3">
                        <Button variant="outline" size="sm">
                            <Bell className="h-4 w-4 mr-2" />
                            Thông báo
                        </Button>
                        <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4 mr-2" />
                            Cài đặt
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
