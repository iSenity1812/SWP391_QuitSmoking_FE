"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, ChevronLeft, ChevronRight, Lightbulb } from "lucide-react"
import type { TipResponseDTO } from "@/types/task"

interface TipTaskComponentProps {
    tips: TipResponseDTO[]
    onComplete: () => void
}

export function TipTaskComponent({ tips, onComplete }: TipTaskComponentProps) {
    const [currentTipIndex, setCurrentTipIndex] = useState(0)

    const currentTip = tips[currentTipIndex]

    const handleMarkComplete = () => {
        onComplete()
    }

    const handleNextTip = () => {
        if (currentTipIndex < tips.length - 1) {
            setCurrentTipIndex(prev => prev + 1);
        } else {
            // Khi đã xem hết tất cả tips, tự động complete
            handleMarkComplete();
        }
    };

    const handlePreviousTip = () => {
        if (currentTipIndex > 0) {
            setCurrentTipIndex(prev => prev - 1);
        }
    };

    if (!currentTip) {
        return (
            <div className="text-center space-y-4">
                <div className="text-6xl">❌</div>
                <p className="text-slate-600">Không tìm thấy mẹo nào.</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col min-h-[300px] h-full"
        >
            {/* Tip Header - Flex grow để chiếm không gian */}
            <div className="text-center space-y-4 flex-1 flex flex-col justify-center">
                <div className="flex items-center justify-center"><Lightbulb className="w-10 h-10 text-yellow-400" /></div>
                <h3 className="text-2xl font-bold text-slate-800">Mẹo Vượt Qua Cơn Thèm</h3>
                <p className="text-slate-600 mt-6 mb-10">{currentTip.content}</p>
            </div>

            {/* Navigation buttons - Luôn ở cuối */}
            {tips.length > 1 && (
                <div className="flex justify-between items-center mt-auto pt-6">
                    <button
                        onClick={handlePreviousTip}
                        disabled={currentTipIndex === 0}
                        className={`px-4 py-2 rounded-lg transition-colors ${currentTipIndex === 0
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Progress dots */}
                    <div className="flex justify-center space-x-2">
                        {tips.map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full ${index === currentTipIndex ? "bg-emerald-600" :
                                    index < currentTipIndex ? "bg-emerald-300" : "bg-gray-300"
                                    }`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={handleNextTip}
                        className={`px-4 py-2 rounded-lg transition-colors ${currentTipIndex === tips.length - 1
                            ? "bg-emerald-500 text-white hover:bg-emerald-600"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                    >
                        {currentTipIndex === tips.length - 1 ? <Check className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                </div>
            )}
        </motion.div>
    );
}
