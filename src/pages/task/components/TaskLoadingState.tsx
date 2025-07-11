"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Loader2 } from "lucide-react"

export function TaskLoadingState() {
    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <Card className="max-w-2xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 border-0 shadow-xl">
                <CardContent className="p-8 text-center">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        >
                            <Brain className="h-8 w-8 text-blue-600" />
                        </motion.div>
                        <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                    </div>

                    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">Đang tạo thử thách mới...</h3>

                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        Hệ thống đang chuẩn bị một thử thách phù hợp với bạn
                    </p>

                    <div className="flex justify-center space-x-1">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-2 h-2 bg-blue-500 rounded-full"
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Number.POSITIVE_INFINITY,
                                    delay: i * 0.2,
                                }}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
