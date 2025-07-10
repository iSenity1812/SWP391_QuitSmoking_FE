import type { Coach, Appointment } from "../pages/user/components/booking/types/booking.types"

const STORAGE_KEY = "appointments"
const COACH_APPOINTMENTS_KEY = "coachAppointments"

export type BookingData = {
    coachId: number
    date: string
    time: string
    duration: number
    type: "consultation" | "therapy" | "coaching"
    method: "in-person" | "video" | "phone"
    notes: string
    location: string
}

const generateId = (): number => {
    return Date.now() + Math.floor(Math.random() * 1000)
}

const getUserAppointments = (): Appointment[] => {
    try {
        const appointments = localStorage.getItem(STORAGE_KEY)
        return appointments ? JSON.parse(appointments) : []
    } catch (error) {
        console.error("Error getting appointments from localStorage", error)
        return []
    }
}

const saveUserAppointments = (appointments: Appointment[]): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments))
    } catch (error) {
        console.error("Error saving appointments to localStorage", error)
    }
}

const syncWithCoachSchedule = (appointment: Appointment): void => {
    try {
        const coachAppointment = {
            id: generateId(),
            clientName: "Người dùng đặt lịch",
            clientAvatar: "/placeholder.svg?height=40&width=40",
            date: appointment.date,
            time: appointment.time,
            duration: appointment.duration,
            type: appointment.type,
            method: appointment.method === "video" ? "phone" : (appointment.method as "in-person" | "phone"),
            status: "scheduled" as const,
            notes: appointment.notes,
            location: appointment.location || "",
            customerId: 999,
        }

        const existingCoachAppointments = JSON.parse(localStorage.getItem(COACH_APPOINTMENTS_KEY) || "[]")
        existingCoachAppointments.push(coachAppointment)
        localStorage.setItem(COACH_APPOINTMENTS_KEY, JSON.stringify(existingCoachAppointments))
    } catch (error) {
        console.error("Error syncing with coach schedule", error)
    }
}

const createAppointment = (bookingData: BookingData, coach: Coach): Appointment => {
    const appointment: Appointment = {
        id: generateId(),
        coachId: bookingData.coachId,
        coachName: coach.name,
        coachAvatar: coach.avatar,
        date: bookingData.date,
        time: bookingData.time,
        duration: bookingData.duration,
        type: bookingData.type,
        method: bookingData.method,
        status: "scheduled",
        notes: bookingData.notes,
        location: bookingData.location,
        price: coach.pricing[bookingData.type],
    }

    const appointments = getUserAppointments()
    appointments.push(appointment)
    saveUserAppointments(appointments)

    // Sync with coach schedule
    syncWithCoachSchedule(appointment)

    return appointment
}

const updateAppointment = (appointmentId: string, updates: Partial<Appointment>): boolean => {
    try {
        const appointments = getUserAppointments()
        const appointmentIndex = appointments.findIndex((appointment) => appointment.id.toString() === appointmentId)

        if (appointmentIndex !== -1) {
            appointments[appointmentIndex] = { ...appointments[appointmentIndex], ...updates }
            saveUserAppointments(appointments)
            return true
        }
        return false
    } catch (error) {
        console.error("Error updating appointment:", error)
        return false
    }
}

const cancelAppointment = (appointmentId: string): boolean => {
    try {
        const appointments = getUserAppointments()
        const appointmentIndex = appointments.findIndex((appointment) => appointment.id.toString() === appointmentId)

        if (appointmentIndex !== -1) {
            appointments[appointmentIndex] = { ...appointments[appointmentIndex], status: "cancelled" }
            saveUserAppointments(appointments)
            return true
        }
        return false
    } catch (error) {
        console.error("Error cancelling appointment:", error)
        return false
    }
}

const validateBooking = (bookingData: BookingData): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (!bookingData.date) {
        errors.push("Vui lòng chọn ngày")
    }

    if (!bookingData.time) {
        errors.push("Vui lòng chọn giờ")
    }

    if (!bookingData.type) {
        errors.push("Vui lòng chọn loại dịch vụ")
    }

    if (!bookingData.method) {
        errors.push("Vui lòng chọn hình thức tư vấn")
    }

    if (bookingData.duration <= 0) {
        errors.push("Thời gian tư vấn phải lớn hơn 0")
    }

    return {
        isValid: errors.length === 0,
        errors,
    }
}

const isTimeSlotAvailable = (coachId: number, date: string, time: string): boolean => {
    const appointments = getUserAppointments()
    return !appointments.some(
        (appointment) =>
            appointment.coachId === coachId &&
            appointment.date === date &&
            appointment.time === time &&
            appointment.status === "scheduled",
    )
}

const getUpcomingAppointments = (): Appointment[] => {
    const appointments = getUserAppointments()
    const now = new Date()
    return appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.date)
        return appointmentDate >= now && appointment.status === "scheduled"
    })
}

const getAppointmentHistory = (): Appointment[] => {
    const appointments = getUserAppointments()
    return appointments.filter((appointment) => appointment.status === "completed" || appointment.status === "cancelled")
}

export const bookingService = {
    getUserAppointments,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    validateBooking,
    isTimeSlotAvailable,
    getUpcomingAppointments,
    getAppointmentHistory,
}

export {
    getUserAppointments,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    validateBooking,
    isTimeSlotAvailable,
    getUpcomingAppointments,
    getAppointmentHistory,
}
