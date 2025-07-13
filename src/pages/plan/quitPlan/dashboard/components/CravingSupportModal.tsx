"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Heart, Brain, Wind, Star, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DailyInputModal } from "./DailyInputModal"

interface CravingSupportModalProps {
    isOpen: boolean
    onClose: () => void
    onRecordSmoking: (data: { cigarettesSmoked: number; cravingCount: number }) => void
    planType: string
}

type FlowStep = "confirmation" | "support-content" | "follow-up" | "celebration" | "record-smoking"

interface SupportContent {
    type: "tip" | "question" | "breathing" | "motivation"
    title: string
    content: string
    icon: React.ReactNode
    options?: string[]
}

const supportContents: SupportContent[] = [
    {
        type: "tip",
        title: "Mẹo Vượt Qua Cơn Thèm",
        content:
            "Hãy thử uống một ly nước lạnh hoặc nhai kẹo cao su. Điều này sẽ giúp bạn chuyển hướng sự chú ý và giảm cảm giác thèm thuốc.",
        icon: <Heart className="w-6 h-6 text-red-500" />,
    },
    {
        type: "question",
        title: "Điều Gì Khiến Bạn Thèm Thuốc?",
        content: "Hãy xác định nguyên nhân khiến bạn thèm thuốc để có thể đối phó tốt hơn:",
        icon: <Brain className="w-6 h-6 text-purple-500" />,
        options: ["Căng thẳng", "Buồn chán", "Thói quen", "Áp lực xã hội"],
    },
    {
        type: "breathing",
        title: "Bài Tập Thở Sâu",
        content:
            "Hít vào sâu trong 4 giây, giữ hơi trong 4 giây, thở ra trong 6 giây. Lặp lại 3 lần để cảm thấy thư giãn hơn.",
        icon: <Wind className="w-6 h-6 text-blue-500" />,
    },
    {
        type: "motivation",
        title: "Bạn Đang Làm Rất Tốt!",
        content:
            "Mỗi lần bạn vượt qua cơn thèm là một chiến thắng. Cơ thể bạn đang hồi phục và sức khỏe đang được cải thiện từng ngày.",
        icon: <Star className="w-6 h-6 text-yellow-500" />,
    },
]

export function CravingSupportModal({ isOpen, onClose, onRecordSmoking, planType }: CravingSupportModalProps) {
    const [currentStep, setCurrentStep] = useState<FlowStep>("confirmation")
    const [currentContentIndex, setCurrentContentIndex] = useState(0)
    const [selectedTrigger, setSelectedTrigger] = useState<string>("")
    const [cigarettesSmoked, setCigarettesSmoked] = useState(1)
    const [cravingCount, setCravingCount] = useState(1)

    const resetModal = () => {
        setCurrentStep("confirmation")
        setCurrentContentIndex(0)
        setSelectedTrigger("")
        setCigarettesSmoked(1)
        setCravingCount(1)
    }

    const handleClose = () => {
        resetModal()
        onClose()
    }

    const handleWantHelp = () => {
        setCurrentStep("support-content")
    }

    const handleWillSmoke = () => {
        setCurrentStep("record-smoking")
    }

    const handleNextContent = () => {
        if (currentContentIndex < supportContents.length - 1) {
            setCurrentContentIndex(currentContentIndex + 1)
        } else {
            setCurrentStep("follow-up")
        }
    }

    const handleFollowUpResponse = (response: "overcome" | "help-again" | "no-help") => {
        switch (response) {
            case "overcome":
                setCurrentStep("celebration")
                break
            case "help-again":
                setCurrentContentIndex(0)
                setCurrentStep("support-content")
                break
            case "no-help":
                setCurrentStep("record-smoking")
                break
        }
    }

    const handleRecordSubmit = () => {
        onRecordSmoking({ cigarettesSmoked, cravingCount })
        handleClose()
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

    const renderSupportContent = () => {
        const content = supportContents[currentContentIndex]

        return (
            <motion.div
                key={currentContentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
            >
                <div className="text-center space-y-4">
                    <div className="flex justify-center">{content.icon}</div>
                    <h3 className="text-xl font-bold text-slate-800">{content.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{content.content}</p>
                </div>

                {content.options && (
                    <div className="space-y-3">
                        <p className="font-medium text-slate-700">Chọn một lý do:</p>
                        <div className="grid grid-cols-2 gap-2">
                            {content.options.map((option) => (
                                <Button
                                    key={option}
                                    variant="outline"
                                    className={cn("text-sm py-2", selectedTrigger === option && "bg-emerald-100 border-emerald-300")}
                                    onClick={() => setSelectedTrigger(option)}
                                >
                                    {option}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center pt-4">
                    <div className="flex space-x-1">
                        {supportContents.map((_, index) => (
                            <div
                                key={index}
                                className={cn("w-2 h-2 rounded-full", index === currentContentIndex ? "bg-emerald-500" : "bg-gray-300")}
                            />
                        ))}
                    </div>

                    <Button
                        onClick={handleNextContent}
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                    >
                        {currentContentIndex < supportContents.length - 1 ? "Tiếp theo" : "Hoàn thành"}
                    </Button>
                </div>
            </motion.div>
        )
    }

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
            onSubmit={handleRecordSubmit}
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
                            {currentStep === "support-content" && renderSupportContent()}
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
