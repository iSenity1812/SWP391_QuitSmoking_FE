"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"

export interface Appointment {
  id: number
  clientName: string
  clientAvatar: string
  date: string
  time: string
  duration: number
  type: "individual" | "group" | "emergency"
  method: "in-person" | "phone"
  status: "scheduled" | "confirmed" | "completed" | "cancelled" | "no-show"
  notes: string
  location?: string
  customerId: number
}

interface AppointmentContextType {
  appointments: Appointment[]
  addAppointment: (appointment: Omit<Appointment, "id">) => void
  updateAppointment: (id: number, appointment: Partial<Appointment>) => void
  deleteAppointment: (id: number) => void
  getTodayAppointments: () => Appointment[]
  getUpcomingAppointments: () => Appointment[]
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined)

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([])

  // Load appointments from localStorage and default data
  useEffect(() => {
    const defaultAppointments = [
      {
        id: 1,
        clientName: "Nguyễn Văn An",
        clientAvatar: "/placeholder.svg?height=40&width=40",
        date: "2024-06-14",
        time: "09:00",
        duration: 60,
        type: "individual" as const,
        method: "phone" as const,
        status: "confirmed" as const,
        notes: "Tư vấn về kỹ thuật thở sâu và quản lý stress",
        location: "",
        customerId: 1,
      },
      {
        id: 2,
        clientName: "Trần Thị Bình",
        clientAvatar: "/placeholder.svg?height=40&width=40",
        date: "2024-06-14",
        time: "10:30",
        duration: 45,
        type: "individual" as const,
        method: "phone" as const,
        status: "scheduled" as const,
        notes: "Theo dõi tiến độ tuần thứ 2",
        location: "",
        customerId: 2,
      },
      {
        id: 3,
        clientName: "Nhóm Hỗ Trợ Tuần 1",
        clientAvatar: "/placeholder.svg?height=40&width=40",
        date: "2024-06-14",
        time: "14:00",
        duration: 90,
        type: "group" as const,
        method: "phone" as const,
        status: "confirmed" as const,
        notes: "Buổi chia sẻ kinh nghiệm và động viên lẫn nhau",
        location: "",
        customerId: 0,
      },
      {
        id: 4,
        clientName: "Lê Văn Cường",
        clientAvatar: "/placeholder.svg?height=40&width=40",
        date: "2024-06-15",
        time: "09:30",
        duration: 30,
        type: "individual" as const,
        method: "in-person" as const,
        status: "scheduled" as const,
        notes: "Tư vấn duy trì sau khi hoàn thành chương trình",
        location: "Phòng tư vấn A - Tầng 2",
        customerId: 3,
      },
    ]

    // Load additional appointments from localStorage (from user bookings)
    const storedAppointments = JSON.parse(localStorage.getItem("coachAppointments") || "[]")

    // Combine default and stored appointments
    const allAppointments = [...defaultAppointments, ...storedAppointments]
    setAppointments(allAppointments)
  }, [])

  const addAppointment = (appointment: Omit<Appointment, "id">) => {
    const newAppointment = {
      ...appointment,
      id: Math.max(...appointments.map((a) => a.id), 0) + 1,
    }
    const updatedAppointments = [...appointments, newAppointment]
    setAppointments(updatedAppointments)

    // Update localStorage
    const storedAppointments = JSON.parse(localStorage.getItem("coachAppointments") || "[]")
    storedAppointments.push(newAppointment)
    localStorage.setItem("coachAppointments", JSON.stringify(storedAppointments))
  }

  const updateAppointment = (id: number, updatedAppointment: Partial<Appointment>) => {
    setAppointments((prev) =>
      prev.map((appointment) => (appointment.id === id ? { ...appointment, ...updatedAppointment } : appointment)),
    )
  }

  const deleteAppointment = (id: number) => {
    setAppointments((prev) => prev.filter((appointment) => appointment.id !== id))
  }

  const getTodayAppointments = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")
    const todayString = `${year}-${month}-${day}`

    return appointments.filter((appointment) => appointment.date === todayString)
  }

  const getUpcomingAppointments = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")
    const todayString = `${year}-${month}-${day}`

    return appointments.filter((appointment) => appointment.date > todayString)
  }

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        getTodayAppointments,
        getUpcomingAppointments,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  )
}

export function useAppointments() {
  const context = useContext(AppointmentContext)
  if (context === undefined) {
    throw new Error("useAppointments must be used within an AppointmentProvider")
  }
  return context
}
