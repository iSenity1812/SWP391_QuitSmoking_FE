"use client"

import type React from "react"

import { useState } from "react"
import type { Plan, PlanFormData } from "@/pages/plan/styles/ui/types/plan"
import { CIGARETTE_PRICES } from "@/pages/plan/styles/ui/types/cigarette"

export const usePlanForm = (onPlanCreated: (plan: Plan) => void) => {
    const [isCreatingPlan, setIsCreatingPlan] = useState(false)
    const [newPlan, setNewPlan] = useState<PlanFormData>({
        title: "",
        description: "",
        startDate: new Date(),
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        dailyCigarettes: 0,
        motivation: "",
        cigaretteType: Object.keys(CIGARETTE_PRICES)[0],
    })

    const resetForm = () => {
        setNewPlan({
            title: "",
            description: "",
            startDate: new Date(),
            targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            dailyCigarettes: 0,
            motivation: "",
            cigaretteType: Object.keys(CIGARETTE_PRICES)[0],
        })
    }

    const handleCreatePlan = () => {
        if (!newPlan.title.trim() || !newPlan.description.trim() || !newPlan.motivation.trim()) {
            alert("Vui lòng điền đầy đủ tất cả các trường bắt buộc")
            return
        }

        const plan: Plan = {
            id: Date.now(),
            ...newPlan,
            dailyCigarettes: Number(newPlan.dailyCigarettes) || 0,
        }

        onPlanCreated(plan)
        setIsCreatingPlan(false)
        resetForm()
    }

    const handleEditPlan = (plan: Plan) => {
        setNewPlan({
            title: plan.title,
            description: plan.description,
            startDate: plan.startDate,
            targetDate: plan.targetDate,
            dailyCigarettes: plan.dailyCigarettes,
            motivation: plan.motivation,
            cigaretteType: plan.cigaretteType,
        })
        setIsCreatingPlan(true)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setNewPlan((prev) => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        setNewPlan((prev) => ({ ...prev, [name]: value }))
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewPlan((prev) => ({ ...prev, [name]: new Date(value) }))
    }

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewPlan((prev) => ({ ...prev, [name]: Number.parseInt(value) || 0 }))
    }

    return {
        isCreatingPlan,
        setIsCreatingPlan,
        newPlan,
        resetForm,
        handleCreatePlan,
        handleEditPlan,
        handleInputChange,
        handleSelectChange,
        handleDateChange,
        handleNumberChange,
    }
}
