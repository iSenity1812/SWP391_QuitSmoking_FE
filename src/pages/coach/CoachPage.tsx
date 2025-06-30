"use client"

import CoachDashboard from "./CoachDashBoard"
import { AppointmentProvider } from "./AppointmentContext"

export default function CoachPage() {
    return (
        <AppointmentProvider>
            <CoachDashboard />
        </AppointmentProvider>
    )
}
