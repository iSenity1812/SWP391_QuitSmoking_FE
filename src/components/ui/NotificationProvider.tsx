"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { Bell, X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { Button } from "./button"
import { Card, CardContent } from "./card"
import { Badge } from "./badge"

export interface Notification {
    id: string
    title: string
    message: string
    type: "success" | "error" | "warning" | "info" | "motivational"
    priority: "low" | "medium" | "high" | "urgent"
    timestamp: Date
    read: boolean
    category: "system" | "achievement" | "reminder" | "social" | "health" | "milestone"
    actionUrl?: string
    actionText?: string
    expiresAt?: Date
    userId?: string
    targetAudience?: "all" | "premium" | "free" | "specific"
}

interface NotificationContextType {
    notifications: Notification[]
    unreadCount: number
    addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
    markAsRead: (id: string) => void
    markAllAsRead: () => void
    removeNotification: (id: string) => void
    clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotifications() {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error("useNotifications must be used within a NotificationProvider")
    }
    return context
}

interface NotificationProviderProps {
    children: ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
    const [notifications, setNotifications] = useState<Notification[]>([])

    // Load notifications from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem("app_notifications")
        if (stored) {
            try {
                const parsed = JSON.parse(stored).map((n: any) => ({
                    ...n,
                    timestamp: new Date(n.timestamp),
                    expiresAt: n.expiresAt ? new Date(n.expiresAt) : undefined,
                }))
                setNotifications(parsed)
            } catch (error) {
                console.error("Failed to load notifications:", error)
            }
        }

        // Add some sample motivational notifications for demo
        const sampleNotifications: Omit<Notification, "id" | "timestamp" | "read">[] = [
            {
                title: "🎉 Chúc mừng! Bạn đã hoàn thành 7 ngày không hút thuốc!",
                message:
                    "Đây là một cột mốc quan trọng! Phổi của bạn đang bắt đầu tự làm sạch và khả năng thở đã cải thiện đáng kể.",
                type: "motivational",
                priority: "high",
                category: "milestone",
                actionUrl: "/profile",
                actionText: "Xem tiến trình",
            },
            {
                title: "💪 Thời gian cho thử thách hàng ngày!",
                message: "Hãy thực hiện 10 phút tập thở sâu để giảm căng thẳng và cảm giác thèm thuốc.",
                type: "info",
                priority: "medium",
                category: "reminder",
                actionUrl: "/plan",
                actionText: "Bắt đầu ngay",
            },
            {
                title: "🌟 Bạn đã tiết kiệm được 500,000đ!",
                message: "Số tiền bạn tiết kiệm được có thể mua một bữa ăn ngon cho gia đình. Hãy tự thưởng cho bản thân!",
                type: "success",
                priority: "medium",
                category: "achievement",
            },
        ]

        // Add sample notifications if none exist
        if (notifications.length === 0) {
            sampleNotifications.forEach((notification) => {
                addNotification(notification)
            })
        }
    }, [])

    // Save to localStorage whenever notifications change
    useEffect(() => {
        localStorage.setItem("app_notifications", JSON.stringify(notifications))
    }, [notifications])

    const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
        const newNotification: Notification = {
            ...notification,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            timestamp: new Date(),
            read: false,
        }

        setNotifications((prev) => [newNotification, ...prev])

        // Show browser notification if permission granted
        if (Notification.permission === "granted") {
            new Notification(notification.title, {
                body: notification.message,
                icon: "/favicon.ico",
                tag: newNotification.id,
            })
        }
    }

    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
        )
    }

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
    }

    const removeNotification = (id: string) => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id))
    }

    const clearAll = () => {
        setNotifications([])
    }

    const unreadCount = notifications.filter((n) => !n.read).length

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                addNotification,
                markAsRead,
                markAllAsRead,
                removeNotification,
                clearAll,
            }}
        >
            {children}
        </NotificationContext.Provider>
    )
}

// Notification Bell Component
export function NotificationBell() {
    const { notifications, unreadCount, markAsRead, removeNotification, markAllAsRead } = useNotifications()
    const [isOpen, setIsOpen] = useState(false)

    const getIcon = (type: Notification["type"]) => {
        switch (type) {
            case "success":
            case "motivational":
                return <CheckCircle className="h-4 w-4 text-green-500" />
            case "error":
                return <AlertCircle className="h-4 w-4 text-red-500" />
            case "warning":
                return <AlertTriangle className="h-4 w-4 text-yellow-500" />
            default:
                return <Info className="h-4 w-4 text-blue-500" />
        }
    }

    const getPriorityColor = (priority: Notification["priority"]) => {
        switch (priority) {
            case "urgent":
                return "bg-red-500"
            case "high":
                return "bg-orange-500"
            case "medium":
                return "bg-yellow-500"
            default:
                return "bg-gray-500"
        }
    }

    const formatTime = (date: Date) => {
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(diff / 3600000)
        const days = Math.floor(diff / 86400000)

        if (days > 0) return `${days} ngày trước`
        if (hours > 0) return `${hours} giờ trước`
        if (minutes > 0) return `${minutes} phút trước`
        return "Vừa xong"
    }

    return (
        <div className="relative">
            <Button variant="ghost" size="sm" className="relative" onClick={() => setIsOpen(!isOpen)}>
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </Badge>
                )}
            </Button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-96 max-h-96 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Thông báo ({unreadCount})</h3>
                            <div className="flex gap-2">
                                {unreadCount > 0 && (
                                    <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                                        Đánh dấu đã đọc
                                    </Button>
                                )}
                                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">Không có thông báo nào</div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${!notification.read ? "bg-blue-50 dark:bg-blue-900/20" : ""
                                        }`}
                                    onClick={() => {
                                        markAsRead(notification.id)
                                        if (notification.actionUrl) {
                                            window.location.href = notification.actionUrl
                                        }
                                    }}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-medium text-sm truncate">{notification.title}</p>
                                                <div className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`} />
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{notification.message}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-500">{formatTime(notification.timestamp)}</span>
                                                {notification.actionText && (
                                                    <span className="text-xs text-blue-500 hover:text-blue-700">{notification.actionText}</span>
                                                )}
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="flex-shrink-0"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                removeNotification(notification.id)
                                            }}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

// Toast Notification Component
export function NotificationToast({ notification, onClose }: { notification: Notification; onClose: () => void }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose()
        }, 5000)

        return () => clearTimeout(timer)
    }, [onClose])

    return (
        <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg">
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                        {notification.type === "motivational" && <CheckCircle className="h-5 w-5 text-green-500" />}
                        {notification.type === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
                        {notification.type === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
                        {notification.type === "warning" && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                        {notification.type === "info" && <Info className="h-5 w-5 text-blue-500" />}
                    </div>
                    <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">{notification.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{notification.message}</p>
                        {notification.actionText && notification.actionUrl && (
                            <Button
                                variant="link"
                                size="sm"
                                className="p-0 h-auto mt-2"
                                onClick={() => (window.location.href = notification.actionUrl!)}
                            >
                                {notification.actionText}
                            </Button>
                        )}
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
