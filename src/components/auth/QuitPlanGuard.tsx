"use client"

import { useEffect, useState, type ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { QuitPlanService } from "@/services/quitPlanService"
import { toast } from "react-toastify"

interface QuitPlanGuardProps {
    children: ReactNode
}

export function QuitPlanGuard({ children }: QuitPlanGuardProps) {
    const [hasActivePlan, setHasActivePlan] = useState<boolean | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkForActivePlan = async () => {
            try {
                setIsLoading(true)
                const quitPlanService = QuitPlanService.getInstance()
                const currentPlan = await quitPlanService.getCurrentQuitPlan()

                // If we successfully received a plan, and its status is IN_PROGRESS, user has an active plan
                if (currentPlan && (currentPlan.status === 'IN_PROGRESS' || currentPlan.status === 'NOT_STARTED')) {
                    setHasActivePlan(true)
                    toast.error("Bạn chỉ có thể có một kế hoạch đang hoạt động. Không thể tạo kế hoạch mới bây giờ")
                } else {
                    setHasActivePlan(false)
                }
            } catch (error) {
                setHasActivePlan(false)
                console.log("Error checking for active quit plan:", error)
            } finally {
                setIsLoading(false)
            }
        }

        checkForActivePlan()
    }, [])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                    <p className="text-sm text-muted-foreground">Checking plan status...</p>
                </div>
            </div>
        )
    }

    if (hasActivePlan) {
        return <Navigate to="/plan" replace />
    }

    return <>{children}</>
}
