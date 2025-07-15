"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Brain, Sparkles, Lightbulb } from "lucide-react"
import { DailyInputModal } from "./DailyInputModal"
import { cravingTrackingService, type CravingTrackingCreateRequest } from "@/services/cravingTrackingService";
import { toast } from "react-toastify"
import { useTask } from "@/hooks/use-task"
import { QuizTaskComponent } from "@/pages/task/components/QuizTaskComponent"
import { TipTaskComponent } from "@/pages/task/components/TipTaskComponent"
import { Button } from "@/components/ui/button"

interface CravingSupportModalProps {
    isOpen: boolean
    onClose: () => void
    onRecordSuccess: () => void
    planType: string
}

type FlowStep = "confirmation" | "task-content" | "motivation" | "follow-up" | "celebration" | "record-smoking"

const motivationalQuotes = [
    "Every craving you resist makes you stronger.",
    "You are in control — not your cravings.",
    "This urge will pass. Breathe through it.",
    "Think about how far you've come. Don't give up now.",
    "Your future self will thank you for this moment.",
    "Freedom from smoking is worth every breath you take today.",
    "Just one more minute — you're doing amazing.",
];

export function CravingSupportModal({ isOpen, onClose, onRecordSuccess, planType }: CravingSupportModalProps) {
    const [currentStep, setCurrentStep] = useState<FlowStep>("confirmation")
    const [hasOvercomeCraving, setHasOvercomeCraving] = useState(false)
    const [currentMotivation, setCurrentMotivation] = useState("")

    // Task logic
    const {
        currentTask,
        isLoading: taskLoading,
        error: taskError,
        generateNewTask,
        resetSession,
        handleQuizAnswer,
        currentQuizIndex,
        markQuizTaskCompleted,
        markTipTaskCompleted,
        goToNextQuiz,
    } = useTask()

    const resetModal = () => {
        setCurrentStep("confirmation")
        setCurrentMotivation("")
    }

    const handleClose = () => {
        // Only call onRecordSuccess if a craving was successfully overcome
        if (hasOvercomeCraving) {
            onRecordSuccess(); // Trigger refetch in parent component (OverviewTab)
            setHasOvercomeCraving(false); // Reset the state
        }
        resetModal();
        onClose();
    }

    const handleWantHelp = () => {
        // Generate new task when user wants help
        generateNewTask()
        setCurrentStep("task-content")
    }

    const handleTaskCompleted = () => {
        // Select random motivation
        const randomMotivation = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
        setCurrentMotivation(randomMotivation)
        setCurrentStep("motivation")
    }

    const handleMotivationNext = () => {
        setCurrentStep("follow-up")
    }

    const handleWillSmoke = () => {
        setCurrentStep("record-smoking")
    }

    const handleFollowUpResponse = async (response: "overcome" | "help-again" | "no-help") => {
        switch (response) {
            case "overcome": {
                try {
                    // Create a new craving tracking record for overcoming a craving
                    const newCravingTracking: CravingTrackingCreateRequest = {
                        smokedCount: 0, // User overcame craving, so smoked count is 0
                        cravingsCount: 1 // Increment craving count by 1
                    };

                    await cravingTrackingService.checkInCraving(newCravingTracking);
                    toast.success("Đã ghi nhận 1 lượt thèm thuốc được vượt qua!");
                    setHasOvercomeCraving(true);
                } catch (error) {
                    console.error("Error recording craving tracking:", error);
                    toast.error(`Lỗi khi ghi nhận lượt thèm thuốc: ${error instanceof Error ? error.message : "Lỗi không xác định"}`);
                    setHasOvercomeCraving(false);
                }
                setCurrentStep("celebration")
                break
            }
            case "help-again":
                resetSession() // Reset task session like in original task logic
                generateNewTask() // Generate new task
                setCurrentStep("task-content")
                break
            case "no-help":
                setCurrentStep("record-smoking")
                break
        }
    }

    const handleDailyInputSuccessFromCravingModal = () => {
        onRecordSuccess(); // Trigger the success callback passed from OverviewTab
        handleClose(); // Close the CravingSupportModal
    }

    const renderConfirmationStep = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-6"
        >
            <div className="">
                <div className="text-6xl">🤔</div>
                <h3 className="text-2xl font-bold text-slate-800 mt-10 mb-2">Bạn có muốn chúng tôi hỗ trợ vượt qua cơn thèm?</h3>
                <p className="text-slate-600">Chúng tôi ở đây để giúp bạn!</p>
            </div>

            <div className="flex flex-col gap-3 pt-5">
                <Button
                    onClick={handleWantHelp}
                    variant="outline"
                    className="
                    w-full py-5 text-lg border-2 border-emerald-500 text-emerald-600
                    hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-600 hover:text-white"
                >
                    Hãy hỗ trợ tôi
                </Button>
                <Button
                    onClick={handleWillSmoke}
                    variant="outline"
                    className="
                        w-full py-5 text-lg border-2 border-red-300 text-red-600 
                        hover:bg-gradient-to-r hover:from-orange-400 hover:to-red-500 hover:text-white"
                >
                    Không, tôi sẽ hút thuốc
                </Button>
            </div>
        </motion.div>
    )

    const renderTaskContent = () => {
        if (taskLoading) {
            return (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center space-y-6"
                >
                    <div className="text-6xl">⏳</div>
                    <h3 className="text-xl font-bold text-slate-800">Đang tải thử thách...</h3>
                    <p className="text-slate-600">Vui lòng chờ một chút</p>
                </motion.div>
            )
        }

        if (taskError) {
            return (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center space-y-6"
                >
                    <div className="text-6xl">❌</div>
                    <h3 className="text-xl font-bold text-red-600">Có lỗi xảy ra</h3>
                    <p className="text-slate-600">{taskError}</p>
                    <Button onClick={generateNewTask} className="bg-emerald-500 hover:bg-emerald-600">
                        Thử lại
                    </Button>
                </motion.div>
            )
        }

        if (!currentTask) {
            return (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center space-y-6"
                >
                    <div className="text-6xl">🎯</div>
                    <h3 className="text-xl font-bold text-slate-800">Sẵn sàng cho thử thách?</h3>
                    <p className="text-slate-600">Nhấn nút để bắt đầu</p>
                    <Button onClick={generateNewTask} className="bg-emerald-500 hover:bg-emerald-600">
                        Bắt đầu thử thách
                    </Button>
                </motion.div>
            )
        }

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
            >
                {currentTask.type === 'QUIZ' && currentTask.quizzes && (
                    <div className="space-y-4">
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center justify-center gap-2">
                                <Brain className="w-6 h-6 text-purple-500" />
                                Thử thách Quiz
                            </h3>
                            <p className="text-slate-600">Câu {currentQuizIndex + 1} / {currentTask.quizzes.length}</p>
                        </div>

                        <QuizTaskComponent
                            quiz={currentTask.quizzes[currentQuizIndex]}
                            onAnswerSelected={(quizId, selectedOptionId) => {
                                if (selectedOptionId !== null) {
                                    handleQuizAnswer(quizId, selectedOptionId)

                                    // Move to next quiz or complete task
                                    if (currentQuizIndex < currentTask.quizzes!.length - 1) {
                                        setTimeout(() => goToNextQuiz(), 1000)
                                    } else {
                                        setTimeout(() => {
                                            markQuizTaskCompleted()
                                            handleTaskCompleted()
                                        }, 1000)
                                    }
                                }
                            }}
                            isLastQuiz={currentQuizIndex === currentTask.quizzes.length - 1}
                            quizAttemptResult={undefined}
                        />
                    </div>
                )}

                {currentTask.type === 'TIP' && currentTask.tips && (
                    <div className="space-y-4">
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center justify-center gap-2">
                                <Lightbulb className="w-6 h-6 text-yellow-500" />
                                Lời khuyên hữu ích
                            </h3>
                            <p className="text-slate-600">Hãy đọc và áp dụng những lời khuyên này</p>
                        </div>

                        <TipTaskComponent
                            tips={currentTask.tips}
                            onComplete={() => {
                                markTipTaskCompleted()
                                handleTaskCompleted()
                            }}
                        />
                    </div>
                )}
            </motion.div>
        )
    }

    const renderMotivation = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center space-y-6"
        >
            <div className="space-y-4">
                <div className="text-6xl">💪</div>
                <h3 className="text-2xl font-bold text-emerald-600">Tuyệt vời!</h3>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-lg text-emerald-800 dark:text-emerald-200 font-medium italic">
                        "{currentMotivation}"
                    </p>
                </div>
                <p className="text-slate-600">
                    Bạn đã hoàn thành thử thách một cách xuất sắc! Hãy tiếp tục với tinh thần này.
                </p>
            </div>

            <Button
                onClick={handleMotivationNext}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
            >
                Tiếp tục
            </Button>
        </motion.div>
    )

    const renderFollowUp = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-6"
        >
            <div className="space-y-1">
                <div className="text-6xl">🤔</div>
                <h3 className="text-2xl font-bold text-slate-800 mt-8">Bạn đã vượt qua cơn thèm chưa?</h3>
                <p className="text-slate-600">Hãy cho chúng tôi biết cảm giác của bạn hiện tại</p>
            </div>

            <div className="space-y-3">
                <Button
                    onClick={() => handleFollowUpResponse("overcome")}
                    variant="outline"
                    className="
                    w-full py-5 text-md border-2 border-emerald-500 text-emerald-600
                    hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-600 hover:text-white"
                >
                    Tôi đã vượt qua cơn thèm
                </Button>
                <Button
                    onClick={() => handleFollowUpResponse("help-again")}
                    variant="outline"
                    className="
                    w-full py-5 text-md border-2 border-sky-400 text-sky-600
                    hover:bg-gradient-to-r hover:from-sky-500 hover:to-blue-500 hover:text-white"
                >
                    Chưa, hãy hỗ trợ tôi lần nữa
                </Button>
                <Button
                    onClick={() => handleFollowUpResponse("no-help")}
                    variant="outline"
                    className="
                        w-full py-5 text-md border-2 border-red-300 text-red-600 
                        hover:bg-gradient-to-r hover:from-orange-400 hover:to-red-500 hover:text-white"
                >
                    Chưa, nhưng tôi không cần hỗ trợ nữa
                </Button>
            </div>
        </motion.div>
    )

    const renderCelebration = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center space-y-6"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="relative"
            >
                <div className="text-8xl">🎉</div>
                <motion.div
                    animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                    }}
                    className="absolute -top-2 -right-2"
                >
                    <Sparkles className="w-8 h-8 text-yellow-500" />
                </motion.div>
            </motion.div>

            <div className="space-y-4">
                <h3 className="text-3xl font-bold text-emerald-600">Tuyệt vời!</h3>
                <p className="text-xl text-slate-700">Bạn đã chiến thắng cơn thèm thuốc</p>
                <p className="text-slate-600">
                    Đây là một bước tiến lớn trong hành trình cai thuốc của bạn. Hãy tự hào về bản thân!
                </p>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                <Button
                    onClick={handleClose}
                    className="w-full py-5 mt-5 text-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                >
                    Tiếp tục hành trình 💪
                </Button>
            </motion.div>

            {/* Confetti Animation */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                        initial={{
                            x: Math.random() * 400,
                            y: -10,
                            rotate: 0,
                        }}
                        animate={{
                            y: 500,
                            rotate: 360,
                            x: Math.random() * 400,
                        }}
                        transition={{
                            duration: 3,
                            delay: Math.random() * 2,
                            repeat: Number.POSITIVE_INFINITY,
                        }}
                    />
                ))}
            </div>
        </motion.div>
    )

    const renderRecordSmoking = () => (
        <DailyInputModal
            isOpen={isOpen}
            onClose={handleClose}
            onRecordSuccess={handleDailyInputSuccessFromCravingModal}
            planType={planType}
        />
    )

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                >
                    <motion.div
                        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative overflow-hidden"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-end mb-6">
                            <Button variant="ghost" size="icon" onClick={handleClose} className="text-gray-500 hover:text-gray-700">
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <AnimatePresence mode="wait">
                            {currentStep === "confirmation" && renderConfirmationStep()}
                            {currentStep === "task-content" && renderTaskContent()}
                            {currentStep === "motivation" && renderMotivation()}
                            {currentStep === "follow-up" && renderFollowUp()}
                            {currentStep === "celebration" && renderCelebration()}
                            {currentStep === "record-smoking" && renderRecordSmoking()}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
