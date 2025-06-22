"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
    Calendar,
    BookOpen,
    Edit3,
    Save,
    Search,
    Heart,
    Star,
    Smile,
    Frown,
    Meh,
    Plus,
    Trash2,
    Eye,
    Filter,
    SortDesc,
    Download,
    RefreshCw,
} from "lucide-react"

interface DiaryEntry {
    id: string
    title: string
    content: string
    date: string
    mood: "happy" | "neutral" | "sad" | "excited" | "anxious"
    tags: string[]
    cravingLevel: number
    smokeFree: boolean
    wordCount?: number
}

const moodIcons = {
    happy: { icon: Smile, color: "text-green-500", label: "Vui vẻ", bgColor: "bg-green-50" },
    excited: { icon: Star, color: "text-yellow-500", label: "Hào hứng", bgColor: "bg-yellow-50" },
    neutral: { icon: Meh, color: "text-gray-500", label: "Bình thường", bgColor: "bg-gray-50" },
    anxious: { icon: Heart, color: "text-orange-500", label: "Lo lắng", bgColor: "bg-orange-50" },
    sad: { icon: Frown, color: "text-red-500", label: "Buồn", bgColor: "bg-red-50" },
}

const commonTags = [
    "Khó khăn",
    "Thành công",
    "Cảm xúc",
    "Sức khỏe",
    "Gia đình",
    "Công việc",
    "Bạn bè",
    "Thể thao",
    "Ăn uống",
    "Giải trí",
    "Căng thẳng",
    "Hạnh phúc",
]

const sortOptions = [
    { value: "newest", label: "Mới nhất" },
    { value: "oldest", label: "Cũ nhất" },
    { value: "title", label: "Theo tiêu đề" },
    { value: "mood", label: "Theo tâm trạng" },
]

export default function DiaryTab() {
    // Original state variables
    const [entries, setEntries] = useState<DiaryEntry[]>([])
    const [isWriting, setIsWriting] = useState(false)
    const [currentEntry, setCurrentEntry] = useState<Partial<DiaryEntry>>({
        title: "",
        content: "",
        mood: "neutral",
        tags: [],
        cravingLevel: 0,
        smokeFree: true,
    })
    const [searchTerm, setSearchTerm] = useState("")
    const [filterMood, setFilterMood] = useState<string>("all")

    // Enhanced state variables
    const [sortBy, setSortBy] = useState("newest")
    const [isLoading, setIsLoading] = useState(false)
    const [showFilters, setShowFilters] = useState(false)
    const [selectedTags, setSelectedTags] = useState<string[]>([])

    // Original date helper functions (kept intact)
    const isToday = useCallback((date: Date) => {
        const today = new Date()
        return date.toDateString() === today.toDateString()
    }, [])

    const isYesterday = useCallback((date: Date) => {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        return date.toDateString() === yesterday.toDateString()
    }, [])

    const isThisWeek = useCallback((date: Date) => {
        const today = new Date()
        const weekStart = new Date(today.setDate(today.getDate() - today.getDay()))
        const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6))
        return date >= weekStart && date <= weekEnd
    }, [])

    const isThisMonth = useCallback((date: Date) => {
        const today = new Date()
        return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()
    }, [])

    const getVietnameseDayName = useCallback((date: Date) => {
        const days = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"]
        return days[date.getDay()]
    }, [])

    // Enhanced word count function
    const getWordCount = useCallback((text: string) => {
        return text
            .trim()
            .split(/\s+/)
            .filter((word) => word.length > 0).length
    }, [])

    // Original localStorage functions (enhanced with loading states)
    useEffect(() => {
        setIsLoading(true)
        const savedEntries = localStorage.getItem("diaryEntries")
        if (savedEntries) {
            try {
                const parsedEntries = JSON.parse(savedEntries)
                // Add word count to existing entries if missing
                const enhancedEntries = parsedEntries.map((entry: DiaryEntry) => ({
                    ...entry,
                    wordCount: entry.wordCount || getWordCount(entry.content),
                }))
                setEntries(enhancedEntries)
            } catch (error) {
                console.error("Error parsing diary entries:", error)
                setEntries([])
            }
        } else {
            // Original sample entries (enhanced with word count)
            const sampleEntries: DiaryEntry[] = [
                {
                    id: "1",
                    title: "Ngày đầu tiên không hút thuốc",
                    content:
                        "Hôm nay là ngày đầu tiên tôi quyết định bỏ thuốc. Cảm giác rất khó khăn nhưng tôi quyết tâm vì sức khỏe của mình và gia đình. Tôi đã vứt hết thuốc lá và bật lửa. Hy vọng tôi có thể kiên trì được.",
                    date: "2024-01-15T09:00:00Z",
                    mood: "anxious",
                    tags: ["Khó khăn", "Quyết tâm"],
                    cravingLevel: 8,
                    smokeFree: true,
                    wordCount: 42,
                },
                {
                    id: "2",
                    title: "Tuần đầu tiên thành công",
                    content:
                        "Đã 7 ngày không hút thuốc! Cảm giác thật tuyệt vời. Hôm nay tôi chạy bộ và cảm thấy hơi thở dễ dàng hơn. Vợ tôi rất vui và nấu món tôi thích để chúc mừng.",
                    date: "2024-01-22T18:30:00Z",
                    mood: "happy",
                    tags: ["Thành công", "Sức khỏe", "Gia đình"],
                    cravingLevel: 3,
                    smokeFree: true,
                    wordCount: 35,
                },
                {
                    id: "3",
                    title: "Gặp khó khăn trong công việc",
                    content:
                        "Hôm nay công việc căng thẳng quá. Tôi suýt muốn hút thuốc để giảm stress. May mắn là tôi nhớ ra lý do tại sao mình bỏ thuốc và đã uống nước, đi dạo thay vì hút thuốc.",
                    date: "2024-01-28T14:15:00Z",
                    mood: "anxious",
                    tags: ["Khó khăn", "Công việc", "Cảm xúc", "Căng thẳng"],
                    cravingLevel: 7,
                    smokeFree: true,
                    wordCount: 38,
                },
            ]
            setEntries(sampleEntries)
            localStorage.setItem("diaryEntries", JSON.stringify(sampleEntries))
        }
        setIsLoading(false)
    }, [getWordCount])

    // Enhanced save function
    useEffect(() => {
        if (entries.length > 0) {
            localStorage.setItem("diaryEntries", JSON.stringify(entries))
        }
    }, [entries])

    // Original save entry function (enhanced)
    const handleSaveEntry = useCallback(() => {
        if (!currentEntry.title?.trim() || !currentEntry.content?.trim()) return

        const wordCount = getWordCount(currentEntry.content || "")
        const newEntry: DiaryEntry = {
            id: Date.now().toString(),
            title: currentEntry.title?.trim() || "",
            content: currentEntry.content?.trim() || "",
            date: new Date().toISOString(),
            mood: currentEntry.mood || "neutral",
            tags: currentEntry.tags || [],
            cravingLevel: currentEntry.cravingLevel || 0,
            smokeFree: currentEntry.smokeFree ?? true,
            wordCount,
        }

        setEntries((prev) => [newEntry, ...prev])
        setCurrentEntry({
            title: "",
            content: "",
            mood: "neutral",
            tags: [],
            cravingLevel: 0,
            smokeFree: true,
        })
        setIsWriting(false)
    }, [currentEntry, getWordCount])

    // Original tag toggle function (kept intact)
    const handleTagToggle = useCallback((tag: string) => {
        setCurrentEntry((prev) => ({
            ...prev,
            tags: prev.tags?.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...(prev.tags || []), tag],
        }))
    }, [])

    // Original delete function (kept intact)
    const handleDeleteEntry = useCallback((id: string) => {
        setEntries((prev) => prev.filter((entry) => entry.id !== id))
    }, [])

    // Enhanced filtering and sorting
    const filteredAndSortedEntries = useMemo(() => {
        const filtered = entries.filter((entry) => {
            const matchesSearch =
                entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                entry.content.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesMood = filterMood === "all" || entry.mood === filterMood
            const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => entry.tags.includes(tag))
            return matchesSearch && matchesMood && matchesTags
        })

        // Sort entries
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "oldest":
                    return new Date(a.date).getTime() - new Date(b.date).getTime()
                case "title":
                    return a.title.localeCompare(b.title)
                case "mood":
                    return a.mood.localeCompare(b.mood)
                case "newest":
                default:
                    return new Date(b.date).getTime() - new Date(a.date).getTime()
            }
        })

        return filtered
    }, [entries, searchTerm, filterMood, selectedTags, sortBy])

    // Original date formatting functions (kept intact)
    const getDateLabel = useCallback(
        (dateString: string) => {
            const date = new Date(dateString)
            if (isToday(date)) return "Hôm nay"
            if (isYesterday(date)) return "Hôm qua"
            if (isThisWeek(date)) return getVietnameseDayName(date)
            if (isThisMonth(date)) {
                return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}`
            }
            return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`
        },
        [isToday, isYesterday, isThisWeek, isThisMonth, getVietnameseDayName],
    )

    const getMoodIcon = useCallback((mood: string) => {
        const moodData = moodIcons[mood as keyof typeof moodIcons] || moodIcons.neutral
        const IconComponent = moodData.icon
        return <IconComponent className={`w-4 h-4 ${moodData.color}`} />
    }, [])

    const formatDetailedDate = useCallback((dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }, [])

    // Enhanced statistics (original logic kept) - removed totalWords
    const stats = useMemo(
        () => ({
            totalEntries: entries.length,
            thisWeekEntries: entries.filter((entry) => isThisWeek(new Date(entry.date))).length,
            smokeFreeEntries: entries.filter((entry) => entry.smokeFree).length,
            averageCraving:
                entries.length > 0
                    ? Math.round(entries.reduce((sum, entry) => sum + entry.cravingLevel, 0) / entries.length)
                    : 0,
            longestStreak: entries.filter((entry) => entry.smokeFree).length, // Simplified calculation
        }),
        [entries, isThisWeek],
    )

    // Enhanced export function
    const handleExportEntries = useCallback(() => {
        const exportData = entries.map((entry) => ({
            ...entry,
            formattedDate: formatDetailedDate(entry.date),
        }))

        const dataStr = JSON.stringify(exportData, null, 2)
        const dataBlob = new Blob([dataStr], { type: "application/json" })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement("a")
        link.href = url
        link.download = `diary-entries-${new Date().toISOString().split("T")[0]}.json`
        link.click()
        URL.revokeObjectURL(url)
    }, [entries, formatDetailedDate])

    // Tag filter toggle
    const handleTagFilterToggle = useCallback((tag: string) => {
        setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
    }, [])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-8 h-8 animate-spin text-green-600" />
                <span className="ml-2 text-lg">Đang tải nhật ký...</span>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Enhanced Header Stats - Removed "Tổng từ" card */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="p-4 text-center">
                        <BookOpen className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                        <div className="text-2xl font-bold">{stats.totalEntries}</div>
                        <div className="text-sm text-muted-foreground">Tổng số bài</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <Calendar className="w-6 h-6 mx-auto mb-2 text-green-500" />
                        <div className="text-2xl font-bold">{stats.thisWeekEntries}</div>
                        <div className="text-sm text-muted-foreground">Tuần này</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <Heart className="w-6 h-6 mx-auto mb-2 text-red-500" />
                        <div className="text-2xl font-bold">{stats.smokeFreeEntries}</div>
                        <div className="text-sm text-muted-foreground">Ngày không hút</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <Star className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                        <div className="text-2xl font-bold">{stats.averageCraving}/10</div>
                        <div className="text-sm text-muted-foreground">Mức thèm TB</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <Download className="w-6 h-6 mx-auto mb-2 text-indigo-500" />
                        <Button variant="ghost" size="sm" onClick={handleExportEntries} className="text-xs p-1 h-auto">
                            Xuất dữ liệu
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Enhanced Header with Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold">Nhật ký của tôi</h2>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                        <Filter className="w-4 h-4 mr-2" />
                        Bộ lọc
                    </Button>
                    <Button onClick={() => setIsWriting(true)} className="bg-green-600 hover:bg-green-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Viết nhật ký mới
                    </Button>
                </div>
            </div>

            {/* Original Writing Interface - Removed word count display */}
            {isWriting && (
                <Card className="border-2 border-green-200 bg-green-50/50">
                    <CardHeader className="bg-gradient-to-r from-green-100 to-blue-100">
                        <CardTitle className="flex items-center gap-2">
                            <Edit3 className="w-5 h-5" />
                            Viết nhật ký mới
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        {/* Original form fields kept intact */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Tiêu đề</label>
                            <Input
                                placeholder="Nhập tiêu đề cho nhật ký..."
                                value={currentEntry.title || ""}
                                onChange={(e) => setCurrentEntry((prev) => ({ ...prev, title: e.target.value }))}
                                className="text-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Nội dung</label>
                            <Textarea
                                placeholder="Hôm nay bạn cảm thấy thế nào? Có gì đặc biệt trong hành trình bỏ thuốc không?..."
                                value={currentEntry.content || ""}
                                onChange={(e) => setCurrentEntry((prev) => ({ ...prev, content: e.target.value }))}
                                className="min-h-[200px] text-base leading-relaxed resize-none border-0 focus:ring-0 focus:border-0"
                                style={{
                                    backgroundImage: `
                    linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                    linear-gradient(transparent 24px, #e5e7eb 25px)
                  `,
                                    backgroundSize: "100% 25px",
                                    lineHeight: "25px",
                                    paddingTop: "25px",
                                    paddingLeft: "20px",
                                    backgroundColor: "#fefefe",
                                }}
                            />
                        </div>

                        {/* Original mood selection kept intact */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Tâm trạng hôm nay</label>
                            <div className="flex gap-2 flex-wrap">
                                {Object.entries(moodIcons).map(([mood, data]) => {
                                    const IconComponent = data.icon
                                    return (
                                        <Button
                                            key={mood}
                                            variant={currentEntry.mood === mood ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setCurrentEntry((prev) => ({ ...prev, mood: mood as any }))}
                                            className="flex items-center gap-2"
                                        >
                                            <IconComponent className={`w-4 h-4 ${data.color}`} />
                                            {data.label}
                                        </Button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Original craving level kept intact */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Mức độ thèm thuốc: {currentEntry.cravingLevel}/10
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="10"
                                value={currentEntry.cravingLevel || 0}
                                onChange={(e) =>
                                    setCurrentEntry((prev) => ({ ...prev, cravingLevel: Number.parseInt(e.target.value) }))
                                }
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                style={{
                                    background: `linear-gradient(to right, #ef4444 0%, #f97316 25%, #eab308 50%, #84cc16 75%, #22c55e 100%)`,
                                }}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>Không thèm</span>
                                <span>Rất thèm</span>
                            </div>
                        </div>

                        {/* Enhanced tags section */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Thẻ (chọn những gì phù hợp)</label>
                            <div className="flex gap-2 flex-wrap">
                                {commonTags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant={currentEntry.tags?.includes(tag) ? "default" : "outline"}
                                        className="cursor-pointer hover:bg-primary/80 transition-colors"
                                        onClick={() => handleTagToggle(tag)}
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Original smoke free toggle kept intact */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="smokeFree"
                                checked={currentEntry.smokeFree}
                                onChange={(e) => setCurrentEntry((prev) => ({ ...prev, smokeFree: e.target.checked }))}
                                className="w-4 h-4"
                            />
                            <label htmlFor="smokeFree" className="text-sm font-medium">
                                Hôm nay tôi không hút thuốc
                            </label>
                        </div>

                        {/* Original action buttons kept intact */}
                        <div className="flex gap-2 pt-4">
                            <Button onClick={handleSaveEntry} className="bg-green-600 hover:bg-green-700">
                                <Save className="w-4 h-4 mr-2" />
                                Lưu nhật ký
                            </Button>
                            <Button variant="outline" onClick={() => setIsWriting(false)}>
                                Hủy
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Enhanced Search and Filter */}
            <div className="space-y-4">
                <div className="flex gap-4 items-center">
                    <div className="flex-1 relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Tìm kiếm trong nhật ký..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <select
                        value={filterMood}
                        onChange={(e) => setFilterMood(e.target.value)}
                        className="px-3 py-2 border rounded-md bg-background"
                    >
                        <option value="all">Tất cả tâm trạng</option>
                        {Object.entries(moodIcons).map(([mood, data]) => (
                            <option key={mood} value={mood}>
                                {data.label}
                            </option>
                        ))}
                    </select>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-2 border rounded-md bg-background"
                    >
                        {sortOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                    <Card>
                        <CardContent className="p-4">
                            <div className="space-y-3">
                                <h4 className="font-medium">Lọc theo thẻ:</h4>
                                <div className="flex gap-2 flex-wrap">
                                    {commonTags.map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant={selectedTags.includes(tag) ? "default" : "outline"}
                                            className="cursor-pointer hover:bg-primary/80 transition-colors"
                                            onClick={() => handleTagFilterToggle(tag)}
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                                {selectedTags.length > 0 && (
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedTags([])}>
                                        Xóa bộ lọc thẻ
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Enhanced Diary Entries Display - Removed word count displays */}
            <div className="space-y-4">
                {filteredAndSortedEntries.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="text-lg font-semibold mb-2">
                                {entries.length === 0 ? "Chưa có nhật ký nào" : "Không tìm thấy kết quả"}
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                {entries.length === 0
                                    ? "Hãy bắt đầu viết nhật ký đầu tiên để ghi lại hành trình bỏ thuốc của bạn!"
                                    : "Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc."}
                            </p>
                            {entries.length === 0 && (
                                <Button onClick={() => setIsWriting(true)} className="bg-green-600 hover:bg-green-700">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Viết nhật ký đầu tiên
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                                Hiển thị {filteredAndSortedEntries.length} / {entries.length} bài viết
                            </span>
                            <SortDesc className="w-4 h-4 text-muted-foreground" />
                        </div>
                        {filteredAndSortedEntries.map((entry) => {
                            const moodData = moodIcons[entry.mood]
                            return (
                                <Card
                                    key={entry.id}
                                    className={`hover:shadow-md transition-all duration-200 border-l-4 border-l-${moodData.color.split("-")[1]}-500 ${moodData.bgColor}`}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-lg font-semibold">{entry.title}</h3>
                                                {getMoodIcon(entry.mood)}
                                                {!entry.smokeFree && (
                                                    <Badge variant="destructive" className="text-xs">
                                                        Có hút thuốc
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-muted-foreground">{getDateLabel(entry.date)}</span>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="hover:bg-white/50">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                                        <DialogHeader>
                                                            <DialogTitle className="flex items-center gap-2">
                                                                {getMoodIcon(entry.mood)}
                                                                {entry.title}
                                                            </DialogTitle>
                                                        </DialogHeader>
                                                        <div className="space-y-4">
                                                            <div className="text-sm text-muted-foreground">{formatDetailedDate(entry.date)}</div>
                                                            <div className="whitespace-pre-wrap text-base leading-relaxed">{entry.content}</div>
                                                            <div className="flex items-center gap-4 text-sm">
                                                                <span>Mức thèm: {entry.cravingLevel}/10</span>
                                                                <span className={entry.smokeFree ? "text-green-600" : "text-red-600"}>
                                                                    {entry.smokeFree ? "✓ Không hút thuốc" : "✗ Có hút thuốc"}
                                                                </span>
                                                            </div>
                                                            {entry.tags.length > 0 && (
                                                                <div className="flex gap-2 flex-wrap">
                                                                    {entry.tags.map((tag) => (
                                                                        <Badge key={tag} variant="secondary">
                                                                            {tag}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteEntry(entry.id)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <p
                                            className="text-muted-foreground mb-3"
                                            style={{
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                            }}
                                        >
                                            {entry.content}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-2 flex-wrap">
                                                {entry.tags.slice(0, 3).map((tag) => (
                                                    <Badge key={tag} variant="secondary" className="text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                                {entry.tags.length > 3 && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        +{entry.tags.length - 3}
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <span>Thèm: {entry.cravingLevel}/10</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </>
                )}
            </div>
        </div>
    )
}
