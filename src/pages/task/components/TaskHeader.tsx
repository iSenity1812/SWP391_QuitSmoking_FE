"use client"

import { motion } from "framer-motion"
import { Brain, Target, Trophy, Sparkles } from "lucide-react"

export function TaskHeader() {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
        >
            <div className="flex items-center justify-center gap-3 mb-4">
                <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                >
                    <Brain className="h-12 w-12 text-blue-600" />
                </motion.div>
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
                >
                    <Target className="h-10 w-10 text-green-600" />
                </motion.div>
                <motion.div
                    animate={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 4 }}
                >
                    <Trophy className="h-11 w-11 text-yellow-600" />
                </motion.div>
            </div>

            <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-purple-600 bg-clip-text text-transparent mb-4"
            >
                Thử Thách Bản Thân
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
            >
                Vượt qua cơn thèm thuốc lá với những câu hỏi thú vị và mẹo hay từ cộng đồng
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex items-center justify-center gap-2 mt-4 text-sm text-slate-500 dark:text-slate-400"
            >
                <Sparkles className="h-4 w-4 text-yellow-500" />
                <span>Mỗi thử thách hoàn thành sẽ giúp bạn mạnh mẽ hơn</span>
                <Sparkles className="h-4 w-4 text-yellow-500" />
            </motion.div>
        </motion.div>
    )
}
