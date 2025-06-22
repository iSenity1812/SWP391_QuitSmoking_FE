"use client"

import { useState, useEffect } from "react"
import type { Appointment, Coach } from "../pages/user/components/booking/types/booking.types"

const STORAGE_KEY = "appointments"

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

// Booking service functions
const generateId = (): number => {
  return Math.floor(Math.random() * 1000000)
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

const syncWithCoachSchedule = (appointment: Appointment) => {
  const coachAppointment = {
    id: Date.now(),
    clientName: "Người dùng đặt lịch",
    clientAvatar: "/placeholder.svg?height=40&width=40",
    date: appointment.date,
    time: appointment.time,
    duration: appointment.duration,
    type: appointment.type,
    method: appointment.method === "video" ? "phone" : (appointment.method as "in-person" | "phone"),
    status: "scheduled" as const,
    notes: appointment.notes,
    location: appointment.location,
    customerId: 999,
  }

  const existingCoachAppointments = JSON.parse(localStorage.getItem("coachAppointments") || "[]")
  existingCoachAppointments.push(coachAppointment)
  localStorage.setItem("coachAppointments", JSON.stringify(existingCoachAppointments))
}

const createAppointmentService = (bookingData: BookingData, coach: Coach): Appointment => {
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments))

  syncWithCoachSchedule(appointment)

  return appointment
}

const updateAppointmentService = (appointmentId: string, updates: Partial<Appointment>): boolean => {
  try {
    const appointments = getUserAppointments()
    const appointmentIndex = appointments.findIndex((appointment) => appointment.id.toString() === appointmentId)

    if (appointmentIndex !== -1) {
      appointments[appointmentIndex] = { ...appointments[appointmentIndex], ...updates }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments))
      return true
    }
    return false
  } catch (error) {
    console.error("Error updating appointment:", error)
    return false
  }
}

const cancelAppointmentService = (appointmentId: string): boolean => {
  try {
    const appointments = getUserAppointments()
    const appointmentIndex = appointments.findIndex((appointment) => appointment.id.toString() === appointmentId)

    if (appointmentIndex !== -1) {
      appointments[appointmentIndex] = { ...appointments[appointmentIndex], status: "cancelled" }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments))
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

export function useBooking() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = () => {
    try {
      const userAppointments = getUserAppointments()
      setAppointments(userAppointments)
      setError(null)
    } catch (err) {
      setError("Không thể tải danh sách lịch hẹn")
      console.error("Booking error:", err)
    } finally {
      setLoading(false)
    }
  }

  const createAppointment = async (
    bookingData: BookingData,
    coach: Coach,
  ): Promise<{ success: boolean; message: string; appointment?: Appointment }> => {
    try {
      const validation = validateBooking(bookingData)
      if (!validation.isValid) {
        return {
          success: false,
          message: validation.errors.join(", "),
        }
      }

      if (!isTimeSlotAvailable(bookingData.coachId, bookingData.date, bookingData.time)) {
        return {
          success: false,
          message: "Khung giờ này đã được đặt. Vui lòng chọn thời gian khác.",
        }
      }

      const appointment = createAppointmentService(bookingData, coach)
      loadAppointments()

      return {
        success: true,
        message: "Đặt lịch thành công! Chúng tôi sẽ liên hệ xác nhận trong vòng 24h.",
        appointment,
      }
    } catch (err) {
      console.error("Create appointment error:", err)
      return {
        success: false,
        message: "Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.",
      }
    }
  }

  const updateAppointment = async (
    appointmentId: string,
    updates: Partial<Appointment>,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const success = updateAppointmentService(appointmentId, updates)

      if (success) {
        loadAppointments()
        return {
          success: true,
          message: "Cập nhật lịch hẹn thành công",
        }
      } else {
        return {
          success: false,
          message: "Không thể cập nhật lịch hẹn",
        }
      }
    } catch (err) {
      console.error("Update appointment error:", err)
      return {
        success: false,
        message: "Có lỗi xảy ra khi cập nhật lịch hẹn",
      }
    }
  }

  const cancelAppointment = async (appointmentId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const success = cancelAppointmentService(appointmentId)

      if (success) {
        loadAppointments()
        return {
          success: true,
          message: "Hủy lịch hẹn thành công",
        }
      } else {
        return {
          success: false,
          message: "Không thể hủy lịch hẹn",
        }
      }
    } catch (err) {
      console.error("Cancel appointment error:", err)
      return {
        success: false,
        message: "Có lỗi xảy ra khi hủy lịch hẹn",
      }
    }
  }

  const upcomingAppointments = getUpcomingAppointments()
  const appointmentHistory = getAppointmentHistory()

  return {
    appointments,
    upcomingAppointments,
    appointmentHistory,
    loading,
    error,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    refreshAppointments: loadAppointments,
  }
}
