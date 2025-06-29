"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, HelpCircle, AlertCircle, Star } from "lucide-react"
import type { TaskResponseDTO, QuizResponseDTO } from "@/types/task"

interface QuizTaskComponentProps {
    task: TaskResponseDTO
    quiz: QuizResponseDTO
    onSubmit: (selectedOptionId: number, timeSpent: number) => void
}

export function QuizTaskComponent({ task, quiz, onSubmit }: QuizTaskComponentProps) {
    const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null)
    const [timeLeft, setTimeLeft] = useState(60) // 60 seconds timer
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [showResult, setShowResult] = useState(false)
    const [startTime] = useState(Date.now())

    useEffect(() => {
        if (timeLeft > 0 && !isSubmitted) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
            return () => clearTimeout(timer)
        } else if (timeLeft === 0 && !isSubmitted) {
            handleSubmit()
        }
    }, [timeLeft, isSubmitted])

    const handleSubmit = () => {
        if (selectedOptionId === null && timeLeft > 0) return

        const timeSpent = Math.floor((Date.now() - startTime) / 1000)
        setIsSubmitted(true)
        setShowResult(true)

        // Show result for 2 seconds then submit
        setTimeout(() => {
            onSubmit(selectedOptionId || 0, timeSpent)
        }, 2000)
    }

    const progressPercentage = ((60 - timeLeft) / 60) * 100

    // Find correct option (assuming first correct option is the answer)
    const correctOption = quiz.options.find((opt, index) => {
        // Since we don't have isCorrect field in OptionResponseDTO,
        // we'll need to handle this differently or assume first option is correct
        // For now, let's assume the backend will handle correctness validation
        return false // We can't determine correct answer from frontend
    })

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <Card className="max-w-3xl mx-auto shadow-xl border-0 bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-900">
                <CardHeader className="text-center pb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <HelpCircle className="h-6 w-6 text-blue-600" />
                        <Badge variant="outline" className="text-blue-600 border-blue-600">
                            Câu hỏi trắc nghiệm
                        </Badge>
                        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                            <Star className="h-3 w-3 mr-1" />
                            {quiz.scorePossible} điểm
                        </Badge>
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">{quiz.title}</CardTitle>

                    {quiz.description && <p className="text-slate-600 dark:text-slate-300 mt-2">{quiz.description}</p>}

                    {/* Timer and Progress */}
                    <div className="flex items-center justify-center gap-4 mt-4">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                            <Clock className="h-4 w-4" />
                            <span className={`font-mono ${timeLeft <= 10 ? "text-red-500" : ""}`}>
                                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                            </span>
                        </div>
                        <Progress value={progressPercentage} className="w-32" />
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Question - using quiz title as question since we don't have separate question field */}
                    <div className="text-center bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                        <p className="text-lg text-slate-700 dark:text-slate-200 leading-relaxed">
                            {quiz.description || quiz.title}
                        </p>
                    </div>

                    {/* Answer Options */}
                    <div className="space-y-3">
                        <AnimatePresence>
                            {quiz.options.map((option, index) => {
                                const isSelected = selectedOptionId === option.optionId

                                let buttonClass =
                                    "w-full justify-start text-left p-4 h-auto transition-all duration-300 hover:shadow-md hover:scale-[1.02]"

                                if (isSelected) {
                                    buttonClass += " ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20 border-blue-500"
                                }

                                return (
                                    <motion.div
                                        key={option.optionId}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Button
                                            variant="outline"
                                            className={buttonClass}
                                            onClick={() => !isSubmitted && setSelectedOptionId(option.optionId)}
                                            disabled={isSubmitted}
                                        >
                                            <div className="flex items-center gap-3 w-full">
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-sm font-semibold">
                                                    {String.fromCharCode(65 + index)}
                                                </div>
                                                <span className="flex-1">{option.content}</span>
                                            </div>
                                        </Button>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Submit Button */}
                    {!isSubmitted && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-center pt-4"
                        >
                            <Button
                                onClick={handleSubmit}
                                disabled={selectedOptionId === null}
                                size="lg"
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 disabled:opacity-50"
                            >
                                Nộp bài
                            </Button>
                        </motion.div>
                    )}

                    {/* Result Message - Will be shown after backend response */}
                    <AnimatePresence>
                        {showResult && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="text-center"
                            >
                                <div className="p-4 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <AlertCircle className="h-6 w-6 text-blue-600" />
                                        <span className="font-semibold text-lg">Đang xử lý kết quả... ⏳</span>
                                    </div>
                                    <p className="text-sm opacity-90">Vui lòng chờ trong giây lát</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
        </motion.div>
    )
}
