"use client"

import React, { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DayRecord {
  date: string // YYYY-MM-DD
  actual: number | null
  recommended: number
}

interface StreakCalendarProps {
  data: DayRecord[]
}

export const StreakCalendar: React.FC<StreakCalendarProps> = ({ data }) => {
  const [currentDate, setCurrentDate] = useState(new Date())

  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

  const blankDays = Array.from({ length: firstDayOfMonth }, (_, i) => i)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const formatDate = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate(),
    ).padStart(2, "0")}`

  const getEntryForDay = (day: number): DayRecord | undefined => {
    const date = new Date(currentYear, currentMonth, day)
    return data.find((entry) => entry.date === formatDate(date))
  }

  const getDayClass = (day: number) => {
    const entry = getEntryForDay(day)
    const today = new Date()
    const isToday =
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear

    let base = "w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all"

    if (isToday) {
      base += " ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-400"
    }

    if (!entry || entry.actual === null) {
      return `${base} bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500`
    }

    if (entry.actual <= entry.recommended) {
      return `${base} bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300`
    }

    return `${base} bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300`
  }

  const prevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1))

  const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ]

  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]

  return (
    <div className="
    bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl 
    border-2 border-emerald-100 dark:border-emerald-700 shadow-xl rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Lịch Theo Dõi Quá Trình</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-slate-700 dark:text-slate-300 font-medium">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-slate-500 dark:text-slate-400">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {blankDays.map((_, i) => (
            <div key={`blank-${i}`} className="w-10 h-10" />
          ))}
          {days.map((day) => (
            <div key={day} className="flex items-center justify-center">
              <button className={getDayClass(day)}>{day}</button>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center mt-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30"></div>
          <span className="text-xs text-slate-700 dark:text-slate-300">Hoàn thành</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-900/30"></div>
          <span className="text-xs text-slate-700 dark:text-slate-300">Thất bại</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800"></div>
          <span className="text-xs text-slate-700 dark:text-slate-300">Chưa ghi nhận</span>
        </div>
      </div>
    </div>
  )
}
