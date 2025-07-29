// src/components/auth/AuthHeader.tsx
import type React from "react"
import { motion } from "framer-motion"

export const AuthHeader: React.FC = () => {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
      className="mb-8 text-center"
    >
      <h1 className="text-4xl font-bold text-primary mb-2">Khởi đầu mới</h1>
      <p className="text-muted-foreground">Hành trình của bạn đến một cuộc sống không khói thuốc bắt đầu từ đây</p>
    </motion.div>
  )
}