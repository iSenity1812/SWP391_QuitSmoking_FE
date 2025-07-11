"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Sparkles, Target } from "lucide-react"

interface TaskEmptyStateProps {
    onCreateTask: () => void
}

export function TaskEmptyState({ onCreateTask }: TaskEmptyStateProps) {
    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <Card className="max-w-2xl mx-auto bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-700 border-0 shadow-xl">
                <CardContent className="p-8 text-center">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex justify-center items-center gap-3 mb-6"
                    >
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                        >
                            <Brain className="h-12 w-12 text-purple-600" />
                        </motion.div>
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
                            <Target className="h-10 w-10 text-pink-600" />
                        </motion.div>
                    </motion.div>

                    <motion.h3
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3"
                    >
                        Sẵn sàng cho thử thách?
                    </motion.h3>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed"
                    >
                        Hãy bắt đầu hành trình vượt qua cơn thèm thuốc lá với những thử thách thú vị và bổ ích
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-4"
                    >
                        <Button
                            onClick={onCreateTask}
                            size="lg"
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-3"
                        >
                            <Sparkles className="h-5 w-5 mr-2" />
                            Bắt đầu thử thách đầu tiên
                        </Button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-sm">
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                                <div className="text-blue-600 font-semibold mb-1">🧠 Quiz thú vị</div>
                                <div className="text-slate-600 dark:text-slate-400">Trả lời câu hỏi về tác hại của thuốc lá</div>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                                <div className="text-green-600 font-semibold mb-1">💡 Mẹo hay</div>
                                <div className="text-slate-600 dark:text-slate-400">Học cách vượt qua cơn thèm hiệu quả</div>
                            </div>
                        </div>
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
