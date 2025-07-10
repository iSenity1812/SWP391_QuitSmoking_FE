"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, RotateCcw, Edit3, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import type { DailyRecord, QuitPlanResponseDTO } from "@/services/quitPlanService"
import { QuitPlanCalculator } from "@/utils/QuitPlanCalculator"

interface ProgressTabProps {
  quitPlan: QuitPlanResponseDTO
}

export function ProgressTab({ quitPlan }: ProgressTabProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    cigarettesPerPack: quitPlan.cigarettesPerPack,
    pricePerPack: quitPlan.pricePerPack,
  })

  // Mock daily records data
  const [dailyRecords] = useState<DailyRecord[]>([
    {
      date: "2025-01-01",
      cigarettesSmoked: 15,
      recommendedLimit: 18,
      cravingCount: 8,
      mood: "good",
      notes: "First day, feeling motivated!",
      goalMet: true,
    },
    {
      date: "2025-01-02",
      cigarettesSmoked: 14,
      recommendedLimit: 16,
      cravingCount: 12,
      mood: "neutral",
      notes: "Had some cravings after lunch",
      goalMet: true,
    },
    {
      date: "2025-01-03",
      cigarettesSmoked: 16,
      recommendedLimit: 14,
      cravingCount: 15,
      mood: "poor",
      notes: "Stressful day at work",
      goalMet: false,
    },
    {
      date: "2025-01-04",
      cigarettesSmoked: 10,
      recommendedLimit: 12,
      cravingCount: 6,
      mood: "excellent",
      notes: "Great day! Feeling strong",
      goalMet: true,
    },
    {
      date: "2025-01-05",
      cigarettesSmoked: 8,
      recommendedLimit: 10,
      cravingCount: 4,
      mood: "good",
      notes: "Weekend helping with motivation",
      goalMet: true,
    },
  ])

  const daysSinceStart = QuitPlanCalculator.getDaysSinceStart(quitPlan.startDate)
  const totalDays = QuitPlanCalculator.getTotalDays(quitPlan.startDate, quitPlan.goalDate)
  const daysRemaining = QuitPlanCalculator.getDaysUntilGoal(quitPlan.goalDate)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800"
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "FAILED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleSaveEdit = () => {
    // Here you would call the API to update the quit plan
    console.log("Saving edit:", editData)
    setIsEditing(false)
  }

  const handleRestartPlan = () => {
    // Here you would show a confirmation dialog and then restart the plan
    console.log("Restarting plan")
  }

  // Chart data for statistics
  const weeklyData = [
    { week: "Week 1", smoking: 85, cravings: 45, mood: 3.2 },
    { week: "Week 2", smoking: 70, cravings: 38, mood: 3.8 },
    { week: "Week 3", smoking: 55, cravings: 28, mood: 4.1 },
    { week: "Week 4", smoking: 40, cravings: 22, mood: 4.3 },
  ]

  const moodData = [
    { day: 1, mood: 4 },
    { day: 2, mood: 3 },
    { day: 3, mood: 2 },
    { day: 4, mood: 5 },
    { day: 5, mood: 4 },
    { day: 6, mood: 3 },
    { day: 7, mood: 4 },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Plan Details Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Plan Details
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRestartPlan}
                  className="text-orange-600 border-orange-300 hover:bg-orange-50 bg-transparent"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Restart Plan
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm text-gray-600">Plan Type</Label>
                <div className="font-medium">{quitPlan.reductionType}</div>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Status</Label>
                <Badge className={getStatusColor(quitPlan.status)}>{quitPlan.status}</Badge>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Start Date</Label>
                <div className="font-medium">{new Date(quitPlan.startDate).toLocaleDateString()}</div>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Goal Date</Label>
                <div className="font-medium">{new Date(quitPlan.goalDate).toLocaleDateString()}</div>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Initial Amount</Label>
                <div className="font-medium">{quitPlan.initialSmokingAmount} cigarettes/day</div>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Progress</Label>
                <div className="font-medium">
                  {daysSinceStart}/{totalDays} days
                </div>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Cigarettes per Pack</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editData.cigarettesPerPack}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        cigarettesPerPack: Number.parseInt(e.target.value),
                      })
                    }
                    className="h-8"
                  />
                ) : (
                  <div className="font-medium">{quitPlan.cigarettesPerPack}</div>
                )}
              </div>
              <div>
                <Label className="text-sm text-gray-600">Price per Pack</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editData.pricePerPack}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        pricePerPack: Number.parseFloat(e.target.value),
                      })
                    }
                    className="h-8"
                  />
                ) : (
                  <div className="font-medium">{quitPlan.pricePerPack.toLocaleString()} VND</div>
                )}
              </div>
            </div>
            {isEditing && (
              <div className="mt-4 flex justify-end">
                <Button onClick={handleSaveEdit} size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Statistics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Weekly Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="smoking" fill="#ef4444" name="Cigarettes" />
                    <Bar dataKey="cravings" fill="#f59e0b" name="Cravings" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Mood Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={moodData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[1, 5]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="mood"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Daily Records */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Daily Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {dailyRecords.map((record, index) => (
                <motion.div
                  key={record.date}
                  className="border rounded-lg p-4 bg-gray-50"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{new Date(record.date).toLocaleDateString()}</div>
                    <Badge className={record.goalMet ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {record.goalMet ? "✅ Goal Met" : "❌ Over Limit"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Smoked:</span>
                      <span className="ml-1 font-medium">
                        {record.cigarettesSmoked}/{record.recommendedLimit}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Cravings:</span>
                      <span className="ml-1 font-medium">{record.cravingCount}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Mood:</span>
                      <span className="ml-1 font-medium capitalize">{record.mood}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Notes:</span>
                      <span className="ml-1 text-gray-700">{record.notes || "No notes"}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
