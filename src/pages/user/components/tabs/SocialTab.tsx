"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, MessageCircle, Trophy } from "lucide-react"
import type { User } from "../../../../types/user-types"
import ChatWindow from "../chat/ChatWindow"

interface SocialTabProps {
    user: User
}

export function SocialTab({ user }: SocialTabProps) {
    const [selectedFriend, setSelectedFriend] = useState<any>(null)
    const [isChatOpen, setIsChatOpen] = useState(false)

    const handleChatClick = (friend: any) => {
        setSelectedFriend(friend)
        setIsChatOpen(true)
    }

    const handleClosChat = () => {
        setIsChatOpen(false)
        setSelectedFriend(null)
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Bạn bè</span>
                            <Button size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Thêm bạn
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {user.friends.map((friend, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={friend.avatar || "/placeholder.svg"} alt={friend.name} />
                                                <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div
                                                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800 ${friend.status === "online" ? "bg-green-500" : "bg-slate-400"
                                                    }`}
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white">{friend.name}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{friend.streak} ngày streak</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleChatClick(friend)}
                                        className="hover:bg-emerald-50 hover:border-emerald-200 dark:hover:bg-emerald-900/20"
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Bảng xếp hạng</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                                    1
                                </div>
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>LC</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-medium text-slate-900 dark:text-white">Lê Văn C</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">67 ngày</p>
                                </div>
                                <Trophy className="h-5 w-5 text-yellow-500" />
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                                    2
                                </div>
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-medium text-slate-900 dark:text-white">{user.name} (Bạn)</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{user.daysSmokeFreee} ngày</p>
                                </div>
                                <Badge variant="secondary" className="dark:bg-slate-700 dark:text-slate-300">
                                    Bạn
                                </Badge>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div className="w-8 h-8 bg-slate-500 rounded-full flex items-center justify-center text-white font-bold">
                                    3
                                </div>
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>TTB</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-medium text-slate-900 dark:text-white">Trần Thị B</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">32 ngày</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div className="w-8 h-8 bg-slate-500 rounded-full flex items-center justify-center text-white font-bold">
                                    4
                                </div>
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>PTD</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-medium text-slate-900 dark:text-white">Phạm Thị D</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">21 ngày</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Chat Window */}
            {isChatOpen && selectedFriend && (
                <ChatWindow friend={selectedFriend} currentUser={user} onClose={handleClosChat} />
            )}
        </div>
    )
}
