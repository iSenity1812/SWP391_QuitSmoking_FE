"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Save, Trash, Plus, FileText, Search } from "lucide-react"
import { vi } from "date-fns/locale"

interface DiaryEntry {
    id: string
    title: string
    content: string
    date: Date
    mood?: string
    tags?: string[]
}

export function DiaryTab() {
    const [entries, setEntries] = useState<DiaryEntry[]>([])
    const [currentEntry, setCurrentEntry] = useState<DiaryEntry | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [date, setDate] = useState<Date>(new Date())

    // Load entries from localStorage on component mount
    useEffect(() => {
        const savedEntries = localStorage.getItem("diaryEntries")
        if (savedEntries) {
            try {
                const parsedEntries = JSON.parse(savedEntries).map((entry: any) => ({
                    ...entry,
                    date: new Date(entry.date),
                }))
                setEntries(parsedEntries)
            } catch (error) {
                console.error("Error parsing diary entries:", error)
            }
        }
    }, [])

    // Save entries to localStorage whenever they change
    useEffect(() => {
        if (entries.length > 0) {
            localStorage.setItem("diaryEntries", JSON.stringify(entries))
        }
    }, [entries])

    const createNewEntry = () => {
        const newEntry: DiaryEntry = {
            id: Date.now().toString(),
            title: `Nhật ký ngày ${format(date, "dd/MM/yyyy")}`,
            content: "",
            date: date,
            mood: "neutral",
            tags: [],
        }
        setCurrentEntry(newEntry)
        setIsEditing(true)
    }

    const saveEntry = () => {
        if (!currentEntry) return

        const entryIndex = entries.findIndex((e) => e.id === currentEntry.id)

        if (entryIndex >= 0) {
            // Update existing entry
            const updatedEntries = [...entries]
            updatedEntries[entryIndex] = currentEntry
            setEntries(updatedEntries)
        } else {
            // Add new entry
            setEntries([...entries, currentEntry])
        }

        setIsEditing(false)
        setCurrentEntry(null)
    }

    const deleteEntry = (id: string) => {
        setEntries(entries.filter((entry) => entry.id !== id))
        if (currentEntry?.id === id) {
            setCurrentEntry(null)
            setIsEditing(false)
        }
    }

    const editEntry = (entry: DiaryEntry) => {
        setCurrentEntry(entry)
        setIsEditing(true)
    }

    const viewEntry = (entry: DiaryEntry) => {
        setCurrentEntry(entry)
        setIsEditing(false)
    }

    const filteredEntries = entries.filter(
        (entry) =>
            entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.content.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sidebar with entry list */}
            <div className="md:col-span-1">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <span>Nhật ký cá nhân</span>
                            <Button onClick={createNewEntry} size="sm" variant="outline">
                                <Plus className="h-4 w-4 mr-1" /> Tạo mới
                            </Button>
                        </CardTitle>
                        <CardDescription>Ghi lại hành trình cai thuốc của bạn</CardDescription>
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm nhật ký..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="h-[500px] overflow-y-auto">
                        {filteredEntries.length > 0 ? (
                            <div className="space-y-2">
                                {filteredEntries
                                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                    .map((entry) => (
                                        <div
                                            key={entry.id}
                                            className={`p-3 rounded-md cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 flex justify-between items-center ${currentEntry?.id === entry.id ? "bg-slate-100 dark:bg-slate-800" : ""
                                                }`}
                                            onClick={() => viewEntry(entry)}
                                        >
                                            <div>
                                                <div className="font-medium">{entry.title}</div>
                                                <div className="text-sm text-slate-500">
                                                    {format(new Date(entry.date), "dd/MM/yyyy", { locale: vi })}
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    deleteEntry(entry.id)
                                                }}
                                            >
                                                <Trash className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                                <FileText className="h-12 w-12 mb-2 text-slate-400" />
                                <p>Chưa có nhật ký nào</p>
                                <p className="text-sm">Hãy tạo nhật ký đầu tiên của bạn</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Main content area */}
            <div className="md:col-span-2">
                <Card className="h-full">
                    {currentEntry ? (
                        <>
                            <CardHeader>
                                {isEditing ? (
                                    <Input
                                        value={currentEntry.title}
                                        onChange={(e) => setCurrentEntry({ ...currentEntry, title: e.target.value })}
                                        className="text-xl font-bold"
                                    />
                                ) : (
                                    <CardTitle>{currentEntry.title}</CardTitle>
                                )}
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    {isEditing ? (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" size="sm" className="w-[180px] justify-start text-left font-normal">
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {format(date, "dd/MM/yyyy", { locale: vi })}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={(date) => {
                                                        if (date) {
                                                            setDate(date)
                                                            setCurrentEntry({ ...currentEntry, date })
                                                        }
                                                    }}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    ) : (
                                        <div className="flex items-center">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {format(new Date(currentEntry.date), "dd/MM/yyyy", { locale: vi })}
                                        </div>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {isEditing ? (
                                    <Textarea
                                        value={currentEntry.content}
                                        onChange={(e) => setCurrentEntry({ ...currentEntry, content: e.target.value })}
                                        placeholder="Viết nhật ký của bạn ở đây..."
                                        className="min-h-[400px] resize-none"
                                    />
                                ) : (
                                    <div className="prose dark:prose-invert max-w-none">
                                        {currentEntry.content ? (
                                            <div className="whitespace-pre-wrap">{currentEntry.content}</div>
                                        ) : (
                                            <p className="text-slate-500 italic">Không có nội dung</p>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                {isEditing ? (
                                    <>
                                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                                            Hủy
                                        </Button>
                                        <Button onClick={saveEntry}>
                                            <Save className="h-4 w-4 mr-2" /> Lưu nhật ký
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button variant="outline" onClick={() => setCurrentEntry(null)}>
                                            Quay lại
                                        </Button>
                                        <Button onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>
                                    </>
                                )}
                            </CardFooter>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[600px] text-center">
                            <FileText className="h-16 w-16 mb-4 text-slate-400" />
                            <h3 className="text-2xl font-semibold mb-2">Nhật ký cá nhân</h3>
                            <p className="text-slate-500 mb-6 max-w-md">
                                Ghi lại cảm xúc, suy nghĩ và tiến trình cai thuốc của bạn. Viết nhật ký thường xuyên sẽ giúp bạn theo
                                dõi hành trình của mình.
                            </p>
                            <Button onClick={createNewEntry}>
                                <Plus className="h-4 w-4 mr-2" /> Tạo nhật ký mới
                            </Button>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}
