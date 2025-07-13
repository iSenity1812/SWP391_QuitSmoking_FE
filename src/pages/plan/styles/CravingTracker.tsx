"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { LineChartComponent } from "@/components/ui/Chart"
import { Brain, Plus, Clock, CheckCircle, Calendar, BarChart3, Target, X } from "lucide-react"

interface CravingEntry {
    id: string
    timestamp: Date
    intensity: number // 1-10 scale
    duration: number // in minutes
    trigger: string
    location: string
    notes?: string
    copingStrategy?: string
    overcome: boolean
}

interface CravingStats {
    totalCravings: number
    averageIntensity: number
    averageDuration: number
    overcomePct: number
    commonTriggers: { trigger: string; count: number }[]
    dailyPattern: { hour: number; count: number }[]
}

const COMMON_TRIGGERS = [
    "Căng thẳng",
    "Sau ăn",
    "Uống cà phê",
    "Làm việc",
    "Lái xe",
    "Gặp bạn bè",
    "Buồn chán",
    "Tức giận",
    "Thói quen",
    "Khác",
]

const COPING_STRATEGIES = [
    "Hít thở sâu",
    "Uống nước",
    "Đi bộ",
    "Nghe nhạc",
    "Gọi điện cho ai đó",
    "Ăn kẹo cao su",
    "Tập thể dục",
    "Thiền",
    "Đọc sách",
    "Chơi game",
]

export const CravingTracker = () => {
    const [cravings, setCravings] = useState<CravingEntry[]>([])
    const [isLogging, setIsLogging] = useState(false)
    const [newCraving, setNewCraving] = useState({
        intensity: 5,
        duration: 5,
        trigger: "",
        location: "",
        notes: "",
        copingStrategy: "",
        overcome: false,
    })
    const [activeTab, setActiveTab] = useState<"log" | "stats" | "history">("log")

    // Load cravings from localStorage
    useEffect(() => {
        const savedCravings = localStorage.getItem("cravingData")
        if (savedCravings) {
            try {
                const parsed = JSON.parse(savedCravings)
                setCravings(
                    parsed.map((c: any) => ({
                        ...c,
                        timestamp: new Date(c.timestamp),
                    })),
                )
            } catch (error) {
                console.error("Error loading craving data:", error)
            }
        }
    }, [])

    // Save cravings to localStorage
    useEffect(() => {
        if (cravings.length > 0) {
            localStorage.setItem("cravingData", JSON.stringify(cravings))
        }
    }, [cravings])

    // Calculate statistics
    const calculateStats = (): CravingStats => {
        if (cravings.length === 0) {
            return {
                totalCravings: 0,
                averageIntensity: 0,
                averageDuration: 0,
                overcomePct: 0,
                commonTriggers: [],
                dailyPattern: [],
            }
        }

        const totalIntensity = cravings.reduce((sum, c) => sum + c.intensity, 0)
        const totalDuration = cravings.reduce((sum, c) => sum + c.duration, 0)
        const overcomeCount = cravings.filter((c) => c.overcome).length

        // Count triggers
        const triggerCounts: { [key: string]: number } = {}
        cravings.forEach((c) => {
            triggerCounts[c.trigger] = (triggerCounts[c.trigger] || 0) + 1
        })

        const commonTriggers = Object.entries(triggerCounts)
            .map(([trigger, count]) => ({ trigger, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)

        // Daily pattern (by hour)
        const hourCounts: { [key: number]: number } = {}
        cravings.forEach((c) => {
            const hour = c.timestamp.getHours()
            hourCounts[hour] = (hourCounts[hour] || 0) + 1
        })

        const dailyPattern = Object.entries(hourCounts)
            .map(([hour, count]) => ({ hour: Number.parseInt(hour), count }))
            .sort((a, b) => a.hour - b.hour)

        return {
            totalCravings: cravings.length,
            averageIntensity: totalIntensity / cravings.length,
            averageDuration: totalDuration / cravings.length,
            overcomePct: (overcomeCount / cravings.length) * 100,
            commonTriggers,
            dailyPattern,
        }
    }

    const stats = calculateStats()

    const handleLogCraving = () => {
        const craving: CravingEntry = {
            id: Date.now().toString(),
            timestamp: new Date(),
            intensity: newCraving.intensity,
            duration: newCraving.duration,
            trigger: newCraving.trigger,
            location: newCraving.location,
            notes: newCraving.notes,
            copingStrategy: newCraving.copingStrategy,
            overcome: newCraving.overcome,
        }

        setCravings([craving, ...cravings])
        setNewCraving({
            intensity: 5,
            duration: 5,
            trigger: "",
            location: "",
            notes: "",
            copingStrategy: "",
            overcome: false,
        })
        setIsLogging(false)
    }

    const getIntensityColor = (intensity: number) => {
        if (intensity <= 3) return "text-green-600 bg-green-100"
        if (intensity <= 6) return "text-yellow-600 bg-yellow-100"
        if (intensity <= 8) return "text-orange-600 bg-orange-100"
        return "text-red-600 bg-red-100"
    }

    const getIntensityLabel = (intensity: number) => {
        if (intensity <= 3) return "Nhẹ"
        if (intensity <= 6) return "Trung bình"
        if (intensity <= 8) return "Mạnh"
        return "Rất mạnh"
    }

    // Get today's cravings
    const todayCravings = cravings.filter((c) => {
        const today = new Date()
        const cravingDate = new Date(c.timestamp)
        return (
            cravingDate.getDate() === today.getDate() &&
            cravingDate.getMonth() === today.getMonth() &&
            cravingDate.getFullYear() === today.getFullYear()
        )
    })

    // Prepare chart data for last 7 days
    const chartData = []
    for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dayName = date.toLocaleDateString("vi-VN", { weekday: "short" })
        const dayCravings = cravings.filter((c) => {
            const cravingDate = new Date(c.timestamp)
            return (
                cravingDate.getDate() === date.getDate() &&
                cravingDate.getMonth() === date.getMonth() &&
                cravingDate.getFullYear() === date.getFullYear()
            )
        })
        chartData.push({
            day: dayName,
            cravings: dayCravings.length,
            avgIntensity:
                dayCravings.length > 0 ? dayCravings.reduce((sum, c) => sum + c.intensity, 0) / dayCravings.length : 0,
        })
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Theo Dõi Cơn Thèm</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">Quản lý và vượt qua cơn thèm thuốc lá</p>
                    </div>
                </div>
                <Button onClick={() => setIsLogging(true)} className="bg-purple-500 hover:bg-purple-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Ghi Nhận Cơn Thèm
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-purple-100 dark:border-slate-700">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-300">Hôm nay</p>
                                <p className="text-2xl font-bold text-purple-600">{todayCravings.length}</p>
                            </div>
                            <Calendar className="w-8 h-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-emerald-100 dark:border-slate-700">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-300">Vượt qua</p>
                                <p className="text-2xl font-bold text-emerald-600">{Math.round(stats.overcomePct)}%</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-emerald-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-orange-100 dark:border-slate-700">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-300">Cường độ TB</p>
                                <p className="text-2xl font-bold text-orange-600">{stats.averageIntensity.toFixed(1)}/10</p>
                            </div>
                            <BarChart3 className="w-8 h-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-blue-100 dark:border-slate-700">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-300">Thời gian TB</p>
                                <p className="text-2xl font-bold text-blue-600">{Math.round(stats.averageDuration)}p</p>
                            </div>
                            <Clock className="w-8 h-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <button
                    onClick={() => setActiveTab("log")}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === "log"
                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                        }`}
                >
                    Ghi Nhận
                </button>
                <button
                    onClick={() => setActiveTab("stats")}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === "stats"
                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                        }`}
                >
                    Thống Kê
                </button>
                <button
                    onClick={() => setActiveTab("history")}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === "history"
                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                        }`}
                >
                    Lịch Sử
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === "log" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Cravings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-purple-500" />
                                Cơn Thèm Gần Đây
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {todayCravings.length === 0 ? (
                                <div className="text-center py-8">
                                    <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                                    <p className="text-slate-600 dark:text-slate-300">Tuyệt vời! Hôm nay bạn chưa có cơn thèm nào.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {todayCravings.slice(0, 5).map((craving) => (
                                        <div
                                            key={craving.id}
                                            className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2">
                                                    <Badge className={`text-xs ${getIntensityColor(craving.intensity)}`}>
                                                        {getIntensityLabel(craving.intensity)}
                                                    </Badge>
                                                    {craving.overcome && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{craving.trigger}</p>
                                                    <p className="text-xs text-slate-500">
                                                        {craving.timestamp.toLocaleTimeString("vi-VN", {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium">{craving.duration}p</p>
                                                <p className="text-xs text-slate-500">{craving.intensity}/10</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Tips */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="w-5 h-5 text-emerald-500" />
                                Mẹo Vượt Qua Cơn Thèm
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700">
                                    <h4 className="font-medium text-emerald-800 dark:text-emerald-300 mb-1">Quy tắc 4-7-8</h4>
                                    <p className="text-sm text-emerald-700 dark:text-emerald-300">
                                        Hít vào 4 giây, giữ 7 giây, thở ra 8 giây. Lặp lại 3-4 lần.
                                    </p>
                                </div>
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                                    <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">Chuyển hướng chú ý</h4>
                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                        Làm việc gì đó bằng tay: vẽ, viết, chơi game, hoặc giải ô chữ.
                                    </p>
                                </div>
                                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
                                    <h4 className="font-medium text-orange-800 dark:text-orange-300 mb-1">Thay thế thói quen</h4>
                                    <p className="text-sm text-orange-700 dark:text-orange-300">
                                        Uống nước, nhai kẹo cao su, hoặc ăn cà rót thay vì hút thuốc.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {activeTab === "stats" && (
                <div className="space-y-6">
                    {/* Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Xu Hướng 7 Ngày Qua</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64">
                                <LineChartComponent
                                    dataset={chartData}
                                    xAxis={[{ dataKey: "day", scaleType: "point" }]}
                                    series={[
                                        {
                                            dataKey: "cravings",
                                            label: "Số cơn thèm",
                                            color: "#8b5cf6",
                                        },
                                    ]}
                                    width={600}
                                    height={250}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Triggers and Patterns */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Nguyên Nhân Phổ Biến</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {stats.commonTriggers.map((trigger, index) => (
                                        <div key={trigger.trigger} className="flex items-center justify-between">
                                            <span className="text-sm">{trigger.trigger}</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-20 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                    <div
                                                        className="bg-purple-500 h-2 rounded-full"
                                                        style={{
                                                            width: `${(trigger.count / stats.totalCravings) * 100}%`,
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium w-8">{trigger.count}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Thời Gian Trong Ngày</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {stats.dailyPattern.map((pattern) => (
                                        <div key={pattern.hour} className="flex items-center justify-between text-sm">
                                            <span>{pattern.hour}:00</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                    <div
                                                        className="bg-orange-500 h-2 rounded-full"
                                                        style={{
                                                            width: `${(pattern.count / Math.max(...stats.dailyPattern.map((p) => p.count))) * 100}%`,
                                                        }}
                                                    />
                                                </div>
                                                <span className="w-6">{pattern.count}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {activeTab === "history" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Lịch Sử Cơn Thèm</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {cravings.length === 0 ? (
                            <div className="text-center py-8">
                                <Brain className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                                <p className="text-slate-600 dark:text-slate-300">Chưa có dữ liệu cơn thèm nào được ghi nhận.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {cravings.slice(0, 20).map((craving) => (
                                    <div key={craving.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Badge className={`text-xs ${getIntensityColor(craving.intensity)}`}>
                                                    {getIntensityLabel(craving.intensity)} ({craving.intensity}/10)
                                                </Badge>
                                                {craving.overcome && (
                                                    <Badge className="text-xs bg-emerald-100 text-emerald-800">Đã vượt qua</Badge>
                                                )}
                                            </div>
                                            <span className="text-xs text-slate-500">{craving.timestamp.toLocaleString("vi-VN")}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-slate-600 dark:text-slate-300">Nguyên nhân:</span>
                                                <span className="ml-2 font-medium">{craving.trigger}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-600 dark:text-slate-300">Thời gian:</span>
                                                <span className="ml-2 font-medium">{craving.duration} phút</span>
                                            </div>
                                            {craving.location && (
                                                <div>
                                                    <span className="text-slate-600 dark:text-slate-300">Địa điểm:</span>
                                                    <span className="ml-2 font-medium">{craving.location}</span>
                                                </div>
                                            )}
                                            {craving.copingStrategy && (
                                                <div>
                                                    <span className="text-slate-600 dark:text-slate-300">Cách đối phó:</span>
                                                    <span className="ml-2 font-medium">{craving.copingStrategy}</span>
                                                </div>
                                            )}
                                        </div>
                                        {craving.notes && (
                                            <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-700 rounded text-sm">
                                                <span className="text-slate-600 dark:text-slate-300">Ghi chú:</span>
                                                <span className="ml-2">{craving.notes}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Logging Dialog */}
            {isLogging && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-slate-900 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Ghi Nhận Cơn Thèm</h3>
                            <Button variant="outline" size="sm" onClick={() => setIsLogging(false)} className="h-8 w-8 p-0">
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {/* Intensity */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                                    Cường độ (1-10)
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={newCraving.intensity}
                                        onChange={(e) => setNewCraving({ ...newCraving, intensity: Number.parseInt(e.target.value) })}
                                        className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                                    />
                                    <span className="w-8 text-center font-medium text-slate-900 dark:text-white">
                                        {newCraving.intensity}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    {getIntensityLabel(newCraving.intensity)}
                                </p>
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                                    Thời gian (phút)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="120"
                                    value={newCraving.duration}
                                    onChange={(e) => setNewCraving({ ...newCraving, duration: Number.parseInt(e.target.value) })}
                                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            {/* Trigger */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Nguyên nhân</label>
                                <select
                                    value={newCraving.trigger}
                                    onChange={(e) => setNewCraving({ ...newCraving, trigger: e.target.value })}
                                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="">Chọn nguyên nhân</option>
                                    {COMMON_TRIGGERS.map((trigger) => (
                                        <option key={trigger} value={trigger}>
                                            {trigger}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Địa điểm</label>
                                <input
                                    type="text"
                                    value={newCraving.location}
                                    onChange={(e) => setNewCraving({ ...newCraving, location: e.target.value })}
                                    placeholder="Ví dụ: Văn phòng, Nhà, Quán cà phê..."
                                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            {/* Coping Strategy */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                                    Cách đối phó
                                </label>
                                <select
                                    value={newCraving.copingStrategy}
                                    onChange={(e) => setNewCraving({ ...newCraving, copingStrategy: e.target.value })}
                                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="">Chọn cách đối phó</option>
                                    {COPING_STRATEGIES.map((strategy) => (
                                        <option key={strategy} value={strategy}>
                                            {strategy}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Overcome */}
                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <input
                                    type="checkbox"
                                    id="overcome"
                                    checked={newCraving.overcome}
                                    onChange={(e) => setNewCraving({ ...newCraving, overcome: e.target.checked })}
                                    className="w-4 h-4 text-purple-600 bg-white border-slate-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                                />
                                <label htmlFor="overcome" className="text-sm text-slate-700 dark:text-slate-300">
                                    Tôi đã vượt qua cơn thèm này mà không hút thuốc
                                </label>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                                    Ghi chú (tùy chọn)
                                </label>
                                <Textarea
                                    value={newCraving.notes}
                                    onChange={(e) => setNewCraving({ ...newCraving, notes: e.target.value })}
                                    placeholder="Mô tả thêm về cơn thèm này..."
                                    rows={3}
                                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <Button
                                variant="outline"
                                onClick={() => setIsLogging(false)}
                                className="flex-1 bg-white text-slate-700 border-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                            >
                                Hủy
                            </Button>
                            <Button
                                onClick={handleLogCraving}
                                disabled={!newCraving.trigger}
                                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Lưu Cơn Thèm
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
