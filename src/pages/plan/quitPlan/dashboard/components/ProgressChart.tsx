"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { motion } from "framer-motion"
import { ChartContainer } from "@/components/ui/Chart"

interface ProgressChartProps {
  data: Array<{
    day: number
    recommended: number
    actual: number
    date: string
  }>
}

export function ProgressChart({ data }: ProgressChartProps) {
  const chartConfig = {
    recommended: {
      label: "Recommended Limit",
      color: "hsl(var(--chart-1))",
    },
    actual: {
      label: "Cigarettes Smoked",
      color: "hsl(var(--chart-2))",
    },
  }
  interface CustomTooltipProps {
    active?: boolean
    payload?: Array<{
      payload: {
        day: number
        recommended: number
        actual: number
        date: string
      }
      value: number
      name: string
    }>
    label?: string | number
  }

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{`Day ${label}`}</p>
          <p className="text-sm text-gray-600">{data.date}</p>
          <div className="mt-2 space-y-1">
            <p className="text-emerald-600">Recommended: {payload[0].value} cigarettes</p>
            <p className="text-red-500">Actual: {payload[1].value} cigarettes</p>
            {payload[1].value > payload[0].value && (
              <p className="text-red-600 text-xs font-medium">⚠️ Over limit by {payload[1].value - payload[0].value}</p>
            )}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-[400px]"
    >
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="recommended"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: "#bb3e03", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#bb3e03", strokeWidth: 2 }}
              name="Recommended Limit"
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#ef4444", strokeWidth: 2 }}
              name="Cigarettes Smoked"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </motion.div>
  )
}
