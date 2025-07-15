"use client"

import type { User } from "../../types/user-types"

interface OverviewTabProps {
    user: User
    onTestAchievement: () => void
}

export function OverviewTab(_props: OverviewTabProps) {

    return (
        <div className="space-y-6">
            {/* Empty overview tab - content moved to ProfileCard */}
        </div>
    )
}
