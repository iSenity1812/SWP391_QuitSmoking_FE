"use client"

import { motion } from "framer-motion"
import { DollarSign, Heart, Award, TrendingUp, Clock, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Achievement, HealthMilestone, QuitPlanResponseDTO } from "@/services/quitPlanService"
import { QuitPlanCalculator } from "@/utils/QuitPlanCalculator"

interface BenefitsTabProps {
  quitPlan: QuitPlanResponseDTO
}

export function BenefitsTab({ quitPlan }: BenefitsTabProps) {
  const daysSinceStart = QuitPlanCalculator.getDaysSinceStart(quitPlan.startDate)

  // Mock data for calculations
  const cigarettesAvoided = 150
  const moneySaved = QuitPlanCalculator.calculateMoneySaved(
    daysSinceStart,
    cigarettesAvoided,
    quitPlan.cigarettesPerPack,
    quitPlan.pricePerPack,
  )

  const healthMilestones: HealthMilestone[] = [
    {
      timeframe: "20 minutes",
      title: "Heart Rate Normalizes",
      description: "Your heart rate and blood pressure drop to normal levels",
      icon: "❤️",
      achieved: daysSinceStart >= 1,
    },
    {
      timeframe: "12 hours",
      title: "Carbon Monoxide Clears",
      description: "Carbon monoxide levels in your blood return to normal",
      icon: "🫁",
      achieved: daysSinceStart >= 1,
    },
    {
      timeframe: "2 weeks",
      title: "Circulation Improves",
      description: "Your circulation improves and lung function increases",
      icon: "🔄",
      achieved: daysSinceStart >= 14,
    },
    {
      timeframe: "1 month",
      title: "Coughing Decreases",
      description: "Coughing and shortness of breath decrease significantly",
      icon: "😮‍💨",
      achieved: daysSinceStart >= 30,
    },
    {
      timeframe: "1 year",
      title: "Heart Disease Risk Halved",
      description: "Your risk of coronary heart disease is cut in half",
      icon: "💪",
      achieved: daysSinceStart >= 365,
    },
    {
      timeframe: "5 years",
      title: "Stroke Risk Reduced",
      description: "Your stroke risk is reduced to that of a non-smoker",
      icon: "🧠",
      achieved: daysSinceStart >= 1825,
    },
  ]

  const achievements: Achievement[] = [
    {
      id: "first-day",
      title: "First Day Hero",
      description: "Completed your first day without exceeding limits",
      icon: "🌟",
      unlockedAt: "2025-01-01",
      progress: 1,
      maxProgress: 1,
    },
    {
      id: "week-warrior",
      title: "Week Warrior",
      description: "Completed one full week of your quit plan",
      icon: "⚡",
      unlockedAt: daysSinceStart >= 7 ? "2025-01-07" : undefined,
      progress: Math.min(daysSinceStart, 7),
      maxProgress: 7,
    },
    {
      id: "money-saver",
      title: "Money Saver",
      description: "Saved over 100,000 VND",
      icon: "💰",
      unlockedAt: moneySaved >= 100000 ? "2025-01-05" : undefined,
      progress: Math.min(moneySaved, 100000),
      maxProgress: 100000,
    },
    {
      id: "craving-crusher",
      title: "Craving Crusher",
      description: "Successfully managed 50 cravings without giving in",
      icon: "🛡️",
      unlockedAt: undefined,
      progress: 32,
      maxProgress: 50,
    },
    {
      id: "month-master",
      title: "Month Master",
      description: "Completed one full month of your quit journey",
      icon: "🏆",
      unlockedAt: daysSinceStart >= 30 ? "2025-01-30" : undefined,
      progress: Math.min(daysSinceStart, 30),
      maxProgress: 30,
    },
  ]

  const cravingStats = {
    totalCravings: 45,
    commonSituations: [
      { situation: "After meals", count: 12 },
      { situation: "When stressed", count: 10 },
      { situation: "With coffee", count: 8 },
      { situation: "Social situations", count: 7 },
      { situation: "Driving", count: 5 },
    ],
    commonCompanions: [
      { companion: "Alone", count: 18 },
      { companion: "Friends", count: 12 },
      { companion: "Colleagues", count: 8 },
      { companion: "Family", count: 5 },
      { companion: "Partner", count: 2 },
    ],
  }

  const motivationalQuotes = [
    "The best time to plant a tree was 20 years ago. The second best time is now.",
    "Every cigarette not smoked is a victory worth celebrating.",
    "Your future self will thank you for the choices you make today.",
    "Strength doesn't come from what you can do. It comes from overcoming what you thought you couldn't.",
    "The only impossible journey is the one you never begin.",
  ]

  const todayQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Motivational Quote */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-2">Quote of the Day</h2>
            <p className="text-lg italic">"{todayQuote}"</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Financial Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-700">
                <DollarSign className="w-5 h-5" />
                Money Saved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                className="text-3xl font-bold text-green-600"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
              >
                {moneySaved.toLocaleString()} VND
              </motion.div>
              <p className="text-sm text-gray-600 mt-2">In {daysSinceStart} days of progress</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <TrendingUp className="w-5 h-5" />
                Cigarettes Avoided
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                className="text-3xl font-bold text-blue-600"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
              >
                {cigarettesAvoided}
              </motion.div>
              <p className="text-sm text-gray-600 mt-2">Cigarettes not smoked</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Clock className="w-5 h-5" />
                Time Regained
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                className="text-3xl font-bold text-purple-600"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
              >
                {Math.floor((cigarettesAvoided * 5) / 60)}h
              </motion.div>
              <p className="text-sm text-gray-600 mt-2">Hours of life regained</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Health Improvement Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Health Improvement Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {healthMilestones.map((milestone, index) => (
                <motion.div
                  key={milestone.timeframe}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                    milestone.achieved ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-2xl">{milestone.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{milestone.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {milestone.timeframe}
                      </Badge>
                      {milestone.achieved && <Badge className="bg-green-100 text-green-800 text-xs">✅ Achieved</Badge>}
                    </div>
                    <p className="text-sm text-gray-600">{milestone.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Achievements & Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    achievement.unlockedAt ? "bg-yellow-50 border-yellow-200" : "bg-gray-50 border-gray-200"
                  }`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div>
                      <h3 className="font-semibold">{achievement.title}</h3>
                      {achievement.unlockedAt && (
                        <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                          Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Progress</span>
                      <span>
                        {achievement.progress}/{achievement.maxProgress}
                      </span>
                    </div>
                    <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Craving Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                Craving Triggers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-orange-600">{cravingStats.totalCravings}</div>
                  <div className="text-sm text-gray-600">Total cravings recorded</div>
                </div>

                <h4 className="font-medium text-gray-800 mb-2">Most Common Situations:</h4>
                {cravingStats.commonSituations.map((item) => (
                  <div key={item.situation} className="flex justify-between items-center">
                    <span className="text-sm">{item.situation}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(item.count / cravingStats.totalCravings) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Social Context
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h4 className="font-medium text-gray-800 mb-2">Cravings by Company:</h4>
                {cravingStats.commonCompanions.map((item) => (
                  <div key={item.companion} className="flex justify-between items-center">
                    <span className="text-sm">{item.companion}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(item.count / cravingStats.totalCravings) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{item.count}</span>
                    </div>
                  </div>
                ))}

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    💡 <strong>Insight:</strong> You experience most cravings when alone. Consider reaching out to
                    friends or engaging in social activities during high-risk times.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
