"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

interface TaskErrorStateProps {
    error: string
    onRetry: () => void
}

export function TaskErrorState({ error, onRetry }: TaskErrorStateProps) {
    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <Card className="max-w-2xl mx-auto bg-gradient-to-br from-red-50 to-orange-50 dark:from-slate-800 dark:to-slate-700 border-red-200 dark:border-red-800 shadow-xl">
                <CardContent className="p-8 text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="flex justify-center mb-4"
                    >
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                        </div>
                    </motion.div>

                    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">Oops! Có lỗi xảy ra</h3>

                    <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">{error}</p>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <Button
                            onClick={onRetry}
                            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold px-6 py-2"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Thử lại
                        </Button>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-xs text-slate-500 dark:text-slate-400 mt-4"
                    >
                        Nếu vấn đề vẫn tiếp tục, vui lòng liên hệ hỗ trợ
                    </motion.p>
                </CardContent>
            </Card>
        </motion.div>
    )
}
