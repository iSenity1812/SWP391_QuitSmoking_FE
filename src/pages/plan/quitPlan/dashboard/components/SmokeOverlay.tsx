"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SmokeOverlayProps {
  intensity: number // 0-1, where 1 is maximum smoke
  className?: string
}

export function SmokeOverlay({ intensity, className }: SmokeOverlayProps) {
  if (intensity <= 0) return null

  return (
    <motion.div
      className={cn(
        "absolute inset-0 pointer-events-none z-10",
        "bg-gradient-to-t from-gray-900/20 via-gray-600/10 to-transparent",
        className,
      )}
      initial={{ opacity: 0 }}
      animate={{
        opacity: intensity * 0.6,
        background: `linear-gradient(to top, rgba(239, 68, 68, ${intensity * 0.3}), rgba(156, 163, 175, ${intensity * 0.2}), transparent)`,
      }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated smoke particles */}
      {Array.from({ length: Math.floor(intensity * 10) }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gray-400/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-20, -40, -60],
            opacity: [0.6, 0.3, 0],
            scale: [0.5, 1, 1.5],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </motion.div>
  )
}
