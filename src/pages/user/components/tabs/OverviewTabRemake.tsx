"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { BarChart3 } from "lucide-react"
import { motion } from "framer-motion"

// Mock data for demonstration
const mockData = [
  { day: "T2", cigarettes: 0 },
  { day: "T3", cigarettes: 0 },
  { day: "T4", cigarettes: 0 },
  { day: "T5", cigarettes: 0 },
  { day: "T6", cigarettes: 0 },
  { day: "T7", cigarettes: 0 },
  { day: "CN", cigarettes: 0 },
]

export default function OverviewTabRemake() {
  const hasData = false // Set to true when API is integrated

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-2 mb-6">
          <BarChart3 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Tăng Trưởng Tuần</h2>
        </div>

        {hasData ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="day" className="text-slate-600 dark:text-slate-400" />
                <YAxis className="text-slate-600 dark:text-slate-400" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgb(30 41 59)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="cigarettes"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: "#10b981", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 flex flex-col items-center justify-center text-center">
            <BarChart3 className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
              Không có dữ liệu tăng trưởng
            </h3>
            <p className="text-slate-500 dark:text-slate-500">Dữ liệu sẽ được hiển thị khi có API tích hợp</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
