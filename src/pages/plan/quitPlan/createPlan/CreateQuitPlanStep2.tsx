"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft, Heart, Calendar, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useQuitPlan } from "@/context/QuitPlanContext"

interface TimelineMilestone {
  period: string
  days: number
  amount: number
  emotionalNote: string
  icon: string
  color: string
}

const AnimatedCounter = ({
  value,
  duration = 2000,
  delay = 0,
}: { value: number; duration?: number; delay?: number }) => {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasStarted(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!hasStarted) return

    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      setCount(Math.floor(progress * value))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [value, duration, hasStarted])

  return (
    <motion.span
      className="font-bold text-2xl text-emerald-600"
      initial={{ scale: 1 }}
      animate={{ scale: hasStarted ? [1, 1.1, 1] : 1 }}
      transition={{ duration: 0.3 }}
    >
      +{count.toLocaleString("vi-VN")} VNĐ
    </motion.span>
  )
}

const TimelineCard = ({
  milestone,
  index,
  isVisible,
}: { milestone: TimelineMilestone; index: number; isVisible: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={isVisible ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 50, scale: 0.9 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="flex-shrink-0 w-80 mr-6"
    >
      <Card
        className={`h-full bg-gradient-to-br ${milestone.color} border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
      >
        <div className="absolute top-4 right-4 text-6xl opacity-10">{milestone.icon}</div>
        <CardContent className="p-6 h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">{milestone.icon}</div>
              <h3 className="text-xl font-bold text-gray-800">{milestone.period}</h3>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">You could save</p>
              {isVisible && <AnimatedCounter value={milestone.amount} delay={index * 200} />}
            </div>
          </div>

          <div className="mt-3">
            {/* <p className="text-sm text-gray-700 italic leading-relaxed">{milestone.emotionalNote}</p> */}
            <div className="flex items-center gap-2 text-xs text-emerald-600">
              <Calendar className="w-3 h-3" />
              <span>{milestone.days} smoke-free days</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

const CreateQuitPlanStep2 = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const { formData } = useQuitPlan()
  const [visibleCards, setVisibleCards] = useState<boolean[]>([])

  const calculateSavings = (): TimelineMilestone[] => {
    const dailyCost = (formData.costPerPack / formData.cigarettesPerPack) * formData.initialSmokingAmount

    return [
      {
        period: "1 week smoke-free",
        days: 7,
        amount: dailyCost * 7,
        emotionalNote: "Your sense of taste and smell begin to improve",
        icon: "🌱",
        color: "from-emerald-100 to-green-50",
      },
      {
        period: "1 month smoke-free",
        days: 30,
        amount: dailyCost * 30,
        emotionalNote: "More energy for the things you love",
        icon: "💪",
        color: "from-blue-100 to-cyan-50",
      },
      {
        period: "3 months smoke-free",
        days: 90,
        amount: dailyCost * 90,
        emotionalNote: "Your lung function starts to improve significantly",
        icon: "🫁",
        color: "from-purple-100 to-pink-50",
      },
      {
        period: "6 months smoke-free",
        days: 180,
        amount: dailyCost * 180,
        emotionalNote: "You can treat yourself to something special",
        icon: "🎁",
        color: "from-orange-100 to-yellow-50",
      },
      {
        period: "1 year smoke-free",
        days: 365,
        amount: dailyCost * 365,
        emotionalNote: "A whole new chapter of your life begins",
        icon: "🎉",
        color: "from-rose-100 to-red-50",
      },
    ]
  }

  const milestones = calculateSavings()

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleCards(new Array(milestones.length).fill(true))
    }, 500)

    return () => clearTimeout(timer)
  }, [milestones.length])

  return (
    <div className="min-h-screen pt-25 relative overflow-hidden bg-gradient-to-bl from-emerald-50 to-white dark:from-slate-900/99 dark:to-slate-800">
      <AnimatePresence>

        <div className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-emerald-100 opacity-30 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-20 h-[300px] w-[300px] rounded-full bg-teal-100 opacity-30 blur-3xl pointer-events-none"></div>

        <div className="container mx-auto px-4 py-8">
          {/* <div className="max-w-7xl mx-auto"> */}
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Your{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                Journey to Freedom
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover the amazing benefits waiting for you at every milestone
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={onBack}
              variant="outline"
              size="lg"
              className="px-8 py-3 text-base font-medium border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-transparent"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back to Previous Step
            </Button>

            <Button
              onClick={onNext}
              size="lg"
              className="px-8 py-3 text-base font-medium bg-emerald-500 hover:bg-emerald-600 text-white group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Start My Personalized Plan
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
          </motion.div>

          {/* Personal Motivation Section */}
          {/* {formData.motivation && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mb-12"
            >
              <Card className="bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 border-emerald-200 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Heart className="w-6 h-6 text-red-500 animate-pulse" />
                    <h3 className="text-2xl font-bold text-foreground">Your Personal Why</h3>
                  </div>
                  <blockquote className="text-xl italic text-gray-700 dark:text-gray-300 leading-relaxed">
                    "{formData.motivation}"
                  </blockquote>
                  <div className="mt-4 w-16 h-1 bg-emerald-400 mx-auto rounded-full"></div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        {/* </div> */}
        </div>

        {/* Timeline Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-12"
        >
          <div className="relative overflow-hidden">
            <div className="relative overflow-hidden">
              <motion.div
                className="flex"
                animate={{
                  x: [0, -320 * milestones.length],
                }}
                transition={{
                  x: {
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                    duration: milestones.length * 4,
                    ease: "linear",
                  },
                }}
                style={{
                  width: `${milestones.length * 2 * 320}px`,
                }}
              >
                {/* First set of cards */}
                {milestones.map((milestone, index) => (
                  <TimelineCard
                    key={`first-${milestone.period}`}
                    milestone={milestone}
                    index={index}
                    isVisible={visibleCards[index] || false}
                  />
                ))}
                {/* Duplicate set for seamless loop */}
                {milestones.map((milestone, index) => (
                  <TimelineCard
                    key={`second-${milestone.period}`}
                    milestone={milestone}
                    index={index}
                    isVisible={visibleCards[index] || false}
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Health Milestones Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 border-emerald-200 shadow-lg">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Heart className="w-6 h-6 text-red-500 animate-pulse" />
                  <h3 className="text-2xl font-bold text-foreground">Your Health Journey: Next Milestones</h3>
                </div>
                <p className="text-muted-foreground">
                  Discover the incredible positive changes happening in your body as you stay smoke-free
                </p>
              </div>

              {/* Health Milestones Timeline */}
              <div className="space-y-6">
                {/* Current Achievement */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="bg-emerald-50 dark:bg-emerald-900/30 rounded-xl p-6 border-2 border-emerald-200 dark:border-emerald-700"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">✓</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
                        Right Now - You've Already Started!
                      </h4>
                      <p className="text-emerald-600 dark:text-emerald-400 text-sm leading-relaxed">
                        Within 20 minutes of your last cigarette, your heart rate and blood pressure begin to drop.
                        Your body is already starting to heal itself!
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Upcoming Milestones */}
                <div className="grid md:grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-lg">🫁</span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-foreground mb-1">After 2 Weeks</h5>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Your blood's carbon monoxide levels return to normal. You'll feel more energetic and
                          breathe easier!
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 text-lg">💪</span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-foreground mb-1">After 3 Months</h5>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Your lung function significantly improves. You can breathe deeper and exercise more
                          easily!
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 text-lg">❤️</span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-foreground mb-1">After 6 Months</h5>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Your risk of heart attack is halved. Your skin and teeth look healthier and more vibrant!
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-lg">🎉</span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-foreground mb-1">After 1 Year</h5>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Your risk of coronary heart disease is cut in half. You've given yourself the gift of a
                          healthier future!
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Motivational Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-8 text-center"
              >
                <p className="text-sm text-muted-foreground italic">
                  "Every milestone represents incredible healing happening in your body. Celebrate these victories
                  and stay motivated!"
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>


      </AnimatePresence>
    </div>
  )
}

export default CreateQuitPlanStep2
