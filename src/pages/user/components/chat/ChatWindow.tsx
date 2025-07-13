"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, Send, Smile, Paperclip, MoreVertical, Check, CheckCheck } from "lucide-react"

interface Message {
    id: string
    text: string
    sender: "me" | "friend"
    timestamp: Date
    status: "sent" | "delivered" | "read"
    type: "text" | "image" | "file"
}

interface ChatWindowProps {
    friend: {
        name: string
        avatar?: string
        status: "online" | "offline"
        streak: number
    }
    currentUser: {
        name: string
        avatar?: string
    }
    onClose: () => void
}

export default function ChatWindow({ friend, currentUser, onClose }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: `Chào ${currentUser.name}! Bạn có khỏe không?`,
            sender: "friend",
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            status: "read",
            type: "text",
        },
        {
            id: "2",
            text: `Chào ${friend.name}! Mình khỏe, cảm ơn bạn. Hôm nay là ngày thứ 45 không hút thuốc của mình đấy!`,
            sender: "me",
            timestamp: new Date(Date.now() - 1000 * 60 * 25),
            status: "read",
            type: "text",
        },
        {
            id: "3",
            text: "Tuyệt vời! Chúc mừng bạn! Mình cũng đang cố gắng bỏ thuốc, hiện tại được 32 ngày rồi.",
            sender: "friend",
            timestamp: new Date(Date.now() - 1000 * 60 * 20),
            status: "read",
            type: "text",
        },
        {
            id: "4",
            text: "Cùng nhau cố gắng nhé! Có lúc nào bạn cảm thấy khó khăn không?",
            sender: "me",
            timestamp: new Date(Date.now() - 1000 * 60 * 15),
            status: "read",
            type: "text",
        },
        {
            id: "5",
            text: "Có đấy, đặc biệt là những ngày đầu. Nhưng giờ đã quen rồi. Bạn thì sao?",
            sender: "friend",
            timestamp: new Date(Date.now() - 1000 * 60 * 10),
            status: "read",
            type: "text",
        },
    ])

    const [newMessage, setNewMessage] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const formatTime = (date: Date) => {
        const now = new Date()
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

        if (diffInMinutes < 1) return "Vừa xong"
        if (diffInMinutes < 60) return `${diffInMinutes} phút trước`
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`
        return date.toLocaleDateString("vi-VN")
    }

    const handleSendMessage = () => {
        if (!newMessage.trim()) return

        const message: Message = {
            id: Date.now().toString(),
            text: newMessage,
            sender: "me",
            timestamp: new Date(),
            status: "sent",
            type: "text",
        }

        setMessages((prev) => [...prev, message])
        setNewMessage("")

        // Simulate friend typing and response
        setTimeout(() => {
            setIsTyping(true)
        }, 1000)

        setTimeout(() => {
            setIsTyping(false)
            const responses = [
                "Cảm ơn bạn đã chia sẻ!",
                "Mình hiểu cảm giác của bạn.",
                "Cùng nhau cố gắng nhé!",
                "Bạn làm rất tốt rồi đấy!",
                "Mình cũng gặp tình huống tương tự.",
                "Hãy tiếp tục như vậy!",
            ]

            const randomResponse = responses[Math.floor(Math.random() * responses.length)]

            const friendMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: randomResponse,
                sender: "friend",
                timestamp: new Date(),
                status: "sent",
                type: "text",
            }

            setMessages((prev) => [...prev, friendMessage])
        }, 3000)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const getMessageStatus = (status: string) => {
        switch (status) {
            case "sent":
                return <Check className="h-3 w-3 text-slate-400" />
            case "delivered":
                return <CheckCheck className="h-3 w-3 text-slate-400" />
            case "read":
                return <CheckCheck className="h-3 w-3 text-blue-500" />
            default:
                return null
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md h-[600px] flex flex-col">
                {/* Chat Header */}
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={friend.avatar || "/placeholder.svg"} alt={friend.name} />
                                <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div
                                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${friend.status === "online" ? "bg-green-500" : "bg-slate-400"
                                    }`}
                            />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white">{friend.name}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {friend.status === "online" ? "Đang hoạt động" : "Không hoạt động"} • {friend.streak} ngày streak
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>

                {/* Messages Area */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
                            <div
                                className={`max-w-[80%] rounded-lg px-3 py-2 ${message.sender === "me"
                                        ? "bg-emerald-500 text-white"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                                    }`}
                            >
                                <p className="text-sm">{message.text}</p>
                                <div
                                    className={`flex items-center gap-1 mt-1 ${message.sender === "me" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    <span
                                        className={`text-xs ${message.sender === "me" ? "text-emerald-100" : "text-slate-500 dark:text-slate-400"
                                            }`}
                                    >
                                        {formatTime(message.timestamp)}
                                    </span>
                                    {message.sender === "me" && getMessageStatus(message.status)}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2">
                                <div className="flex items-center gap-1">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                        <div
                                            className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                                            style={{ animationDelay: "0.1s" }}
                                        ></div>
                                        <div
                                            className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                                            style={{ animationDelay: "0.2s" }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-slate-500 ml-2">đang gõ...</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </CardContent>

                {/* Message Input */}
                <div className="border-t p-4">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                            <Paperclip className="h-4 w-4" />
                        </Button>
                        <div className="flex-1 relative">
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Nhập tin nhắn..."
                                className="pr-10"
                            />
                            <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2">
                                <Smile className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}
