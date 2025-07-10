'use client'

import { createContext, useContext, useState } from 'react'

export interface QuitPlanFormData {
  initialSmokingAmount: number
  cigarettesPerPack: number
  costPerPack: number
  // motivation?: string
  reductionType?: "IMMEDIATE" | "LINEAR" | "EXPONENTIAL" | "LOGARITHMIC"
  startDate?: Date | null
  goalDate?: Date | null
  duration?: number
}

interface QuitPlanContextType {
  formData: QuitPlanFormData
  updateFormData: (data: Partial<QuitPlanFormData>) => void
  resetFormData: () => void
}

const QuitPlanContext = createContext<QuitPlanContextType | undefined>(undefined)
// Tên khóa localStorage được định nghĩa là một hằng số để dễ quản lý
const LOCAL_STORAGE_KEY = "quitPlanData";

export const QuitPlanProvider = ({ children }: { children: React.ReactNode }) => {
  const [formData, setFormData] = useState<QuitPlanFormData>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        // Convert date strings back to Date objects
        if (parsed.startDate) parsed.startDate = new Date(parsed.startDate)
        if (parsed.goalDate) parsed.goalDate = new Date(parsed.goalDate)
        return parsed
      }
    }
    return {
      initialSmokingAmount: 0,
      cigarettesPerPack: 0,
      costPerPack: 0,
      reductionType: undefined, 
      startDate: new Date(), // Mặc định là ngày hiện tại
      goalDate: null,
      duration: 0
    }
  })

  const updateFormData = (newData: Partial<QuitPlanFormData>) => {
    const updatedData = { ...formData, ...newData }
    setFormData(updatedData)
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData))
    }
  }

  const resetFormData = () => {
    const resetData = {
      initialSmokingAmount: 0,
      cigarettesPerPack: 0,
      costPerPack: 0,
      // motivation: "",
      reductionType: undefined,
      startDate: new Date(),
      goalDate: null,
      duration: 0
    }
    setFormData(resetData)
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_STORAGE_KEY) // Xóa dữ liệu khỏi localStorage
    }
  }

  return (
    <QuitPlanContext.Provider value={{ formData, updateFormData, resetFormData }}>{children}</QuitPlanContext.Provider>
  )
}

export const useQuitPlan = () => {
  const context = useContext(QuitPlanContext)
  if (!context) {
    throw new Error('useQuitPlan must be used within a QuitPlanProvider')
  }
  return context
}