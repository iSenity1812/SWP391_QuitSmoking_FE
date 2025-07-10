"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Cigarette, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface DailyInputModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    cigarettesSmoked: number
    cravingCount: number
    mood: string
    notes: string
  }) => void
  isImmediatePlan: boolean
  recommendedLimit?: number
}

export function DailyInputModal({
  isOpen,
  onClose,
  onSubmit,
  isImmediatePlan,
  recommendedLimit = 0,
}: DailyInputModalProps) {
  const [cigarettesSmoked, setCigarettesSmoked] = useState("")
  const [cravingCount, setCravingCount] = useState("")
  const [mood, setMood] = useState("neutral")
  const [notes, setNotes] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    const cigarettes = Number.parseInt(cigarettesSmoked)
    if (isNaN(cigarettes) || cigarettes < 0) {
      newErrors.cigarettes = "Please enter a valid number (≥ 0)"
    }

    const cravings = Number.parseInt(cravingCount)
    if (isNaN(cravings) || cravings < 0) {
      newErrors.cravings = "Please enter a valid number (≥ 0)"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    onSubmit({
      cigarettesSmoked: Number.parseInt(cigarettesSmoked),
      cravingCount: Number.parseInt(cravingCount),
      mood,
      notes,
    })

    // Reset form
    setCigarettesSmoked("")
    setCravingCount("")
    setMood("neutral")
    setNotes("")
    setErrors({})
    onClose()
  }

  const cigarettes = Number.parseInt(cigarettesSmoked) || 0
  const isOverLimit = !isImmediatePlan && recommendedLimit !== undefined && cigarettes > recommendedLimit
  const isPlanFailed = isImmediatePlan && cigarettes > 0

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Daily Log Entry</h2>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="cigarettes" className="text-sm font-medium text-gray-700">
                  Cigarettes Smoked Today
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="cigarettes"
                    type="number"
                    min="0"
                    value={cigarettesSmoked}
                    onChange={(e) => setCigarettesSmoked(e.target.value)}
                    className={cn(
                      "pl-10",
                      errors.cigarettes && "border-red-500",
                      isOverLimit && "border-orange-500",
                      isPlanFailed && "border-red-600",
                    )}
                    placeholder="0"
                  />
                  <Cigarette className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                {errors.cigarettes && <p className="text-red-500 text-xs mt-1">{errors.cigarettes}</p>}
                {!isImmediatePlan && recommendedLimit !== undefined && (
                  <p className="text-xs text-gray-500 mt-1">Recommended limit: {recommendedLimit} cigarettes</p>
                )}
                {isOverLimit && (
                  <motion.div
                    className="flex items-center gap-2 mt-2 p-2 bg-orange-50 border border-orange-200 rounded-lg"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    <p className="text-orange-700 text-xs">
                      You're over your recommended limit by {cigarettes - recommendedLimit}
                    </p>
                  </motion.div>
                )}
                {isPlanFailed && (
                  <motion.div
                    className="flex items-center gap-2 mt-2 p-2 bg-red-50 border border-red-200 rounded-lg"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <p className="text-red-700 text-xs font-medium">
                      ⚠️ Plan marked as FAILED - Any cigarettes break the immediate quit plan
                    </p>
                  </motion.div>
                )}
              </div>

              <div>
                <Label htmlFor="cravings" className="text-sm font-medium text-gray-700">
                  Craving Count
                </Label>
                <Input
                  id="cravings"
                  type="number"
                  min="0"
                  value={cravingCount}
                  onChange={(e) => setCravingCount(e.target.value)}
                  className={cn(errors.cravings && "border-red-500")}
                  placeholder="0"
                />
                {errors.cravings && <p className="text-red-500 text-xs mt-1">{errors.cravings}</p>}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Mood</Label>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {[
                    { value: "terrible", emoji: "😫", label: "Terrible" },
                    { value: "poor", emoji: "😔", label: "Poor" },
                    { value: "neutral", emoji: "😐", label: "Neutral" },
                    { value: "good", emoji: "😊", label: "Good" },
                    { value: "excellent", emoji: "😄", label: "Excellent" },
                  ].map((moodOption) => (
                    <button
                      key={moodOption.value}
                      type="button"
                      onClick={() => setMood(moodOption.value)}
                      className={cn(
                        "p-2 rounded-lg border-2 transition-all text-center",
                        mood === moodOption.value
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-200 hover:border-gray-300",
                      )}
                    >
                      <div className="text-lg">{moodOption.emoji}</div>
                      <div className="text-xs text-gray-600">{moodOption.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                  Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How are you feeling? Any triggers or victories to note?"
                  className="mt-1 resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                >
                  Save Entry
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
