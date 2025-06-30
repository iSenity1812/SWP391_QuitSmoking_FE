"use client"

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Bell, Settings, Wind } from "lucide-react"
// import type { User } from "../types/user-types"
import { Link } from "react-router-dom"

// interface UserProfileHeaderProps {
//     user: User
//     onMenuToggle: () => void
// }

export function UserProfileHeader() {
    return (
        <div className="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-700">
            <div className="max-w-1xl mx-auto px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-2xl font-black text-slate-800 dark:text-white">
                        <Wind className="h-8 w-8 text-emerald-500" />
                        <Link to="/" className="text-xl font-bold">
                            QuitTogether
                        </Link>
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
