"use client"

import { useState, useEffect } from "react"
import type { Plan, UserSubscription } from "@/pages/plan/styles/ui/types/plan"
import { STORAGE_KEYS } from "@/pages/plan/styles/ui/types/cigarette"

export const usePlanStorage = () => {
    const [currentPlan, setCurrentPlan] = useState<Plan | null>(null)
    const [userSubscription, setUserSubscription] = useState<UserSubscription>({ type: "free" })

    // Load from localStorage
    useEffect(() => {
        const savedPlan = localStorage.getItem(STORAGE_KEYS.PLAN)
        if (savedPlan) {
            try {
                const parsedPlan = JSON.parse(savedPlan)
                parsedPlan.startDate = new Date(parsedPlan.startDate)
                parsedPlan.targetDate = new Date(parsedPlan.targetDate)
                setCurrentPlan(parsedPlan)
            } catch (error) {
                console.error("Error loading plan:", error)
                localStorage.removeItem(STORAGE_KEYS.PLAN)
            }
        }

        const savedSubscription = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION)
        if (savedSubscription) {
            try {
                const parsedSubscription = JSON.parse(savedSubscription)
                if (parsedSubscription.expiryDate) {
                    parsedSubscription.expiryDate = new Date(parsedSubscription.expiryDate)
                }
                setUserSubscription(parsedSubscription)
            } catch (error) {
                console.error("Error loading subscription:", error)
                localStorage.removeItem(STORAGE_KEYS.SUBSCRIPTION)
            }
        }
    }, [])

    // Save to localStorage
    useEffect(() => {
        if (currentPlan) {
            localStorage.setItem(STORAGE_KEYS.PLAN, JSON.stringify(currentPlan))
        } else {
            localStorage.removeItem(STORAGE_KEYS.PLAN)
        }
    }, [currentPlan])

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(userSubscription))
    }, [userSubscription])

    return {
        currentPlan,
        setCurrentPlan,
        userSubscription,
        setUserSubscription,
    }
}
