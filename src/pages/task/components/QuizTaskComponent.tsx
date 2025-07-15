"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, HelpCircle, Star, ChevronRight, CheckCircle, XCircle } from "lucide-react"
import type { QuizResponseDTO } from "@/types/task"
import { cn } from "@/lib/utils"

interface QuizTaskComponentProps {
    quiz: QuizResponseDTO
    onAnswerSelected: (quizId: string, selectedOptionId: number | null) => void; // Callback khi chọn đáp án
    isLastQuiz: boolean; // Cờ báo hiệu đây có phải câu hỏi cuối cùng không
    quizAttemptResult: boolean | undefined;
}

export function QuizTaskComponent({ quiz, onAnswerSelected, isLastQuiz, quizAttemptResult }: QuizTaskComponentProps) {
    const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null)
    const [timeLeft, setTimeLeft] = useState(60) // 60 seconds timer
    const isChecked = quizAttemptResult !== undefined;

    // Reset state khi quiz thay đổi (chuyển sang câu hỏi mới)
    useEffect(() => {
        setSelectedOptionId(null);
        setTimeLeft(60); // Reset timer for new quiz
    }, [quiz.quizId]);

    // Timer logic
    useEffect(() => {
        if (timeLeft > 0 && !isChecked) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !isChecked) {
            // Auto-submit when time runs out if not already answered
            onAnswerSelected(quiz.quizId, null); // Submit null for no selection
        }
    }, [timeLeft, isChecked, quiz.quizId, onAnswerSelected]);

    const handleSelectOption = (optionId: number) => {
        if (isChecked) return; // Prevent selection if already checked

        setSelectedOptionId(optionId);
        // Immediately call the parent callback. The parent will then handle the result
        // and eventually update `quizAttemptResult` prop here.
        onAnswerSelected(quiz.quizId, optionId);
    };

    const progressPercentage = ((60 - timeLeft) / 60) * 100

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
                            <Star className="h-3 w-3 mr-1" /> {quiz.options.filter(o => o.correct).length > 0 ? "Có đáp án đúng" : "Không có đáp án đúng"}
                        </Badge>
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">{quiz.title}</CardTitle>
                    {quiz.description && <p className="text-slate-600 dark:text-slate-300 mt-2">{quiz.description}</p>}

                    {/* Timer and Progress */}
                    <div className="flex items-center justify-center gap-4 mt-4">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                            <Clock className="h-4 w-4" />
                            <span className={`font-semibold ${timeLeft <= 10 && !isChecked ? "text-red-500 animate-pulse" : ""}`}>
                                {timeLeft} giây
                            </span>
                        </div>
                        <Progress value={progressPercentage} className="w-2/3 h-2 bg-blue-100 dark:bg-blue-900/30" indicatorClassName="bg-blue-500" />
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 p-6 pt-0">
                    {/* Quiz Options */}
                    <div className="grid grid-cols-1 gap-3">
                        {quiz.options.map((option) => {
                            const isCurrentSelection = selectedOptionId === option.optionId;
                            const isCorrectOption = option.correct;

                            let buttonClass = `w-full justify-start text-left py-3 h-auto rounded-lg relative pr-10`;

                            if (isChecked) { // Answer has been processed by parent
                                if (isCurrentSelection) {
                                    buttonClass = cn(buttonClass, isCorrectOption ? "bg-green-100 border-green-500 text-green-800 shadow-md" : "bg-red-100 border-red-500 text-red-800 shadow-md");
                                } else if (isCorrectOption) { // Highlight correct answer if user chose wrong
                                    buttonClass = cn(buttonClass, "bg-green-50 border-green-300 text-green-700");
                                } else {
                                    buttonClass = cn(buttonClass, "bg-white border-gray-200 text-gray-700 opacity-70"); // Dim unselected incorrect
                                }
                                buttonClass = cn(buttonClass, "cursor-not-allowed"); // Always disable after checked
                            } else { // Waiting for user selection
                                buttonClass = cn(buttonClass, isCurrentSelection ? "bg-blue-100 border-blue-500 text-blue-800 shadow-md" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50");
                            }

                            return (
                                <motion.div
                                    key={option.optionId}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                >
                                    <Button
                                        variant="outline"
                                        className={buttonClass}
                                        onClick={() => handleSelectOption(option.optionId)}
                                        disabled={isChecked} // Disable if answer is already checked
                                    >
                                        {option.content}
                                        {isChecked && isCurrentSelection && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                            >
                                                {quizAttemptResult ? (
                                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                                ) : (
                                                    <XCircle className="h-6 w-6 text-red-600" />
                                                )}
                                            </motion.div>
                                        )}
                                        {isChecked && !isCurrentSelection && isCorrectOption && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                            >
                                                <CheckCircle className="h-6 w-6 text-green-600" />
                                            </motion.div>
                                        )}
                                    </Button>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* No "Next" button here. TaskPage will handle advancing after a delay. */}
                </CardContent>
            </Card>
        </motion.div>
    );
}
