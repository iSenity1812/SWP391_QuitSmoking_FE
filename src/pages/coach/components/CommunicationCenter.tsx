"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MessageSquare, Mail, Send, Search, Plus, AlertCircle, Users } from "lucide-react"

interface Message {
    id: number
    sender: string
    recipient: string
    subject?: string
    content: string
    timestamp: string
    type: "chat" | "email"
    status: "sent" | "delivered" | "read" | "unread"
    urgent: boolean
    avatar: string
}

interface ChatRoom {
    id: number
    name: string
    participants: string[]
    lastMessage: string
    lastMessageTime: string
    unreadCount: number
    type: "individual" | "group"
    avatar: string
}

export function CommunicationCenter() {
    const [activeChat, setActiveChat] = useState<number | null>(null)
    const [newMessage, setNewMessage] = useState("")
    const [emailSubject, setEmailSubject] = useState("")
    const [emailContent, setEmailContent] = useState("")
    const [searchTerm, setSearchTerm] = useState("")

    const messages: Message[] = [
        {
            id: 1,
            sender: "Nguyễn Văn An",
            recipient: "Coach",
            content: "Chào coach, em đang gặp khó khăn trong việc kiểm soát cơn thèm thuốc vào buổi tối.",
            timestamp: "10:30 AM",
            type: "chat",
            status: "unread",
            urgent: true,
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: 2,
            sender: "Trần Thị Bình",
            recipient: "Coach",
            subject: "Cập nhật tiến độ tuần 2",
            content:
                "Coach ơi, em muốn báo cáo tiến độ của em trong tuần thứ 2. Em đã giảm được từ 15 điếu xuống 8 điếu mỗi ngày.",
            timestamp: "9:15 AM",
            type: "email",
            status: "read",
            urgent: false,
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: 3,
            sender: "Lê Văn Cường",
            recipient: "Coach",
            content: "Coach, em cảm ơn coach rất nhiều. Hôm nay là ngày thứ 30 em không hút thuốc!",
            timestamp: "Yesterday",
            type: "chat",
            status: "read",
            urgent: false,
            avatar: "/placeholder.svg?height=40&width=40",
        },
    ]

    const chatRooms: ChatRoom[] = [
        {
            id: 1,
            name: "Nguyễn Văn An",
            participants: ["Nguyễn Văn An", "Coach"],
            lastMessage: "Chào coach, em đang gặp khó khăn...",
            lastMessageTime: "10:30 AM",
            unreadCount: 2,
            type: "individual",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: 2,
            name: "Nhóm Hỗ Trợ Tuần 1",
            participants: ["Trần Thị Bình", "Phạm Văn Đức", "Lê Thị Mai", "Coach"],
            lastMessage: "Mọi người cùng chia sẻ kinh nghiệm nhé",
            lastMessageTime: "9:45 AM",
            unreadCount: 0,
            type: "group",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: 3,
            name: "Lê Văn Cường",
            participants: ["Lê Văn Cường", "Coach"],
            lastMessage: "Cảm ơn coach rất nhiều!",
            lastMessageTime: "Yesterday",
            unreadCount: 0,
            type: "individual",
            avatar: "/placeholder.svg?height=40&width=40",
        },
    ]

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            console.log("Sending message:", newMessage)
            setNewMessage("")
        }
    }

    const handleSendEmail = () => {
        if (emailSubject.trim() && emailContent.trim()) {
            console.log("Sending email:", { subject: emailSubject, content: emailContent })
            setEmailSubject("")
            setEmailContent("")
        }
    }

    const filteredMessages = messages.filter(
        (message) =>
            message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (message.subject && message.subject.toLowerCase().includes(searchTerm.toLowerCase())),
    )

    const filteredChatRooms = chatRooms.filter((room) => room.name.toLowerCase().includes(searchTerm.toLowerCase()))

    return (
        <div className="space-y-6">
            {/* Communication Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">24</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Tin nhắn chưa đọc</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                                <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">8</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Email mới</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">3</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Tin nhắn khẩn cấp</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">12</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Cuộc trò chuyện</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Communication Tabs */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700/50">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-slate-900 dark:text-white">Trung Tâm Giao Tiếp</CardTitle>
                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <Input
                                    placeholder="Tìm kiếm..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-64"
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="chat" className="w-full">
                        <TabsList className="grid w-full grid-cols-1">
                            <TabsTrigger value="chat">Trò Chuyện</TabsTrigger>
                        </TabsList>

                        <TabsContent value="chat" className="space-y-4">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
                                {/* Chat List */}
                                <div className="space-y-2 overflow-y-auto">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-semibold">Cuộc Trò Chuyện</h4>
                                        <Button size="sm" variant="outline">
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    {filteredChatRooms.map((room) => (
                                        <div
                                            key={room.id}
                                            onClick={() => setActiveChat(room.id)}
                                            className={`p-3 rounded-lg cursor-pointer transition-colors ${activeChat === room.id
                                                ? "bg-blue-100 dark:bg-blue-900/20"
                                                : "hover:bg-slate-100 dark:hover:bg-slate-700/50"
                                                }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="relative">
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage src={room.avatar || "/placeholder.svg"} />
                                                        <AvatarFallback>{room.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    {room.unreadCount > 0 && (
                                                        <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                                            {room.unreadCount}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <p className="font-medium text-sm truncate">{room.name}</p>
                                                        <span className="text-xs text-slate-500">{room.lastMessageTime}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{room.lastMessage}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Chat Window */}
                                <div className="lg:col-span-2 flex flex-col">
                                    {activeChat ? (
                                        <>
                                            <div className="flex-1 p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg mb-4 overflow-y-auto">
                                                <div className="space-y-4">
                                                    <div className="flex justify-start">
                                                        <div className="bg-white dark:bg-slate-700 p-3 rounded-lg max-w-xs">
                                                            <p className="text-sm">
                                                                Chào coach, em đang gặp khó khăn trong việc kiểm soát cơn thèm thuốc vào buổi tối.
                                                            </p>
                                                            <span className="text-xs text-slate-500">10:30 AM</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end">
                                                        <div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs">
                                                            <p className="text-sm">
                                                                Chào An! Coach hiểu cảm giác của em. Hãy thử áp dụng kỹ thuật thở sâu khi có cơn thèm
                                                                nhé.
                                                            </p>
                                                            <span className="text-xs text-blue-100">10:35 AM</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Input
                                                    placeholder="Nhập tin nhắn..."
                                                    value={newMessage}
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                                                    className="flex-1"
                                                />
                                                <Button onClick={handleSendMessage}>
                                                    <Send className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex-1 flex items-center justify-center text-slate-500">
                                            Chọn một cuộc trò chuyện để bắt đầu
                                        </div>
                                    )}
                                </div>
                            </div>
                        </TabsContent>


                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
