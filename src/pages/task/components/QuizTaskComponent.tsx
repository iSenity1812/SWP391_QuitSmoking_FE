"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { Clock, CheckCircle, XCircle, HeartHandshake } from "lucide-react"
import type { QuizResponseDTO } from "@/types/task"

interface QuizTaskComponentProps {
    quiz: QuizResponseDTO | undefined
    onAnswerSelected: (quizId: string, selectedOptionId: number | null) => void; // Callback khi chọn đáp án
    onNext: () => void; // Callback cho nút "Tiếp theo"
    isLastQuiz: boolean; // Cờ báo hiệu đây có phải câu hỏi cuối cùng không
    quizAttemptResult: boolean | undefined;
    currentQuizIndex?: number; // Current quiz index for progress dots
    totalQuizzes?: number; // Total number of quizzes for progress dots
}

export function QuizTaskComponent({ quiz, onAnswerSelected, onNext, isLastQuiz, quizAttemptResult, currentQuizIndex = 0, totalQuizzes = 1 }: QuizTaskComponentProps) {
    const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null)
    const [timeLeft, setTimeLeft] = useState(60) // 60 seconds timer
    const isChecked = quizAttemptResult !== undefined;

    // Reset state khi quiz thay đổi (chuyển sang câu hỏi mới)
    useEffect(() => {
        if (quiz?.quizId) {
            setSelectedOptionId(null);
            setTimeLeft(60); // Reset timer for new quiz
        }
    }, [quiz?.quizId]);

    // Timer logic
    useEffect(() => {
        if (timeLeft > 0 && !isChecked && quiz) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !isChecked && quiz) {
            // Auto-submit when time runs out if not already answered
            onAnswerSelected(quiz.quizId, null); // Submit null for no selection
            // Auto-advance to next question after time out
            setTimeout(() => {
                onNext();
            }, 1000);
        }
    }, [timeLeft, isChecked, quiz, onAnswerSelected, onNext]);

    // Early return after all hooks
    if (!quiz) {
        return (
            <div className="text-center space-y-4">
                <div className="text-6xl">⏳</div>
                <p className="text-slate-600">Đang tải câu hỏi...</p>
            </div>
        );
    }

    const handleSelectOption = (optionId: number) => {
        if (isChecked) return; // Prevent selection if already checked

        setSelectedOptionId(optionId);
        // Immediately call the parent callback. The parent will then handle the result
        // and eventually update `quizAttemptResult` prop here.
        onAnswerSelected(quiz.quizId, optionId);

        // Show answer for 2 seconds then auto-advance
        setTimeout(() => {
            onNext();
        }, 2000);
    };

    const progressPercentage = ((60 - timeLeft) / 60) * 100

    // Grid class logic for answer layout
    const getGridClass = () => {
        const optionCount = quiz?.options?.length || 0
        if (optionCount === 2) return 'grid-cols-2' // 2 answers in 1 row
        if (optionCount === 3) return 'grid-cols-1' // 3 answers in 3 rows (1 per row)
        if (optionCount === 4) return 'grid-cols-2' // 4 answers in 2 rows (2 per row)
        return 'grid-cols-1' // Default for other cases
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            {/* Quiz Header */}
            <div className="text-center space-y-2">
                <div className="flex items-center justify-center"><HeartHandshake className="w-8 h-8 text-red-400" /></div>
                <h3 className="text-2xl font-bold text-slate-800">{quiz.title}</h3>
                {quiz.description && (
                    <p className="text-slate-600">{quiz.description}</p>
                )}
            </div>

            {/* Timer Progress */}
            <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="h-4 w-4" />
                    <span className={`font-semibold ${timeLeft <= 10 && !isChecked ? "text-red-500 animate-pulse" : ""}`}>
                        {timeLeft} giây
                    </span>
                </div>
                <Progress value={progressPercentage} className="w-2/3 h-2 bg-blue-100" />
            </div>

            {/* Quiz Options */}
            <div className="space-y-3">
                <p className="font-medium text-slate-700">Chọn câu trả lời:</p>
                <div className={`grid gap-3 ${getGridClass()}`}>
                    {quiz.options?.map((option) => {
                        const isCurrentSelection = selectedOptionId === option.optionId;
                        const isCorrectOption = option.correct;

                        let buttonClass = `p-4 text-left rounded-lg border-2 transition-colors`;

                        if (isChecked) { // Answer has been processed by parent
                            if (isCurrentSelection) {
                                buttonClass += isCorrectOption ? " bg-green-100 border-green-500 text-green-800" : " bg-red-100 border-red-500 text-red-800";
                            } else if (isCorrectOption) { // Highlight correct answer if user chose wrong
                                buttonClass += " bg-green-50 border-green-300 text-green-700";
                            } else {
                                buttonClass += " bg-gray-50 border-gray-200 text-gray-500 opacity-70";
                            }
                            buttonClass += " cursor-not-allowed";
                        } else { // Waiting for user selection
                            buttonClass += isCurrentSelection ? " bg-purple-100 border-purple-500 text-purple-800" : " bg-white border-slate-200 text-slate-700 hover:border-purple-300 hover:bg-purple-50";
                        }

                        return (
                            <motion.button
                                key={option.optionId}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                                className={buttonClass}
                                onClick={() => handleSelectOption(option.optionId)}
                                disabled={isChecked}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{option.content}</span>
                                    {isChecked && isCurrentSelection && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                        >
                                            {quizAttemptResult ? (
                                                <CheckCircle className="h-5 w-5 text-green-600" />
                                            ) : (
                                                <XCircle className="h-5 w-5 text-red-600" />
                                            )}
                                        </motion.div>
                                    )}
                                    {isChecked && !isCurrentSelection && isCorrectOption && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                        >
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                        </motion.div>
                                    )}
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Bottom navigation */}
            <div className="flex items-center justify-between">
                {/* Progress dots bên trái */}
                <div className="flex space-x-2">
                    {Array.from({ length: totalQuizzes }, (_, index) => (
                        <div
                            key={index}
                            className={`w-2 h-2 rounded-full ${index === currentQuizIndex ? "bg-emerald-600" :
                                index < currentQuizIndex ? "bg-emerald-400" : "bg-gray-300"
                                }`}
                        />
                    ))}
                </div>

                {/* Button Tiếp theo bên phải */}
                <button
                    onClick={onNext}
                    className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                >
                    {isLastQuiz ? "Hoàn thành" : "Tiếp theo"}
                </button>
            </div>
        </motion.div>
    );
}
