"use client"

import { useState, useEffect } from "react"
import { bookingService, type BookingData } from "../services/bookingService"
import type { Appointment, Coach } from "../pages/user/components/booking/types/booking.types"

export function useBooking() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = () => {
    try {
      const userAppointments = bookingService.getUserAppointments()
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
      // Validate booking data
      const validation = bookingService.validateBooking(bookingData)
      if (!validation.isValid) {
        return {
          success: false,
          message: validation.errors.join(", "),
        }
      }

      // Check time slot availability
      if (!bookingService.isTimeSlotAvailable(bookingData.coachId, bookingData.date, bookingData.time)) {
        return {
          success: false,
          message: "Khung giờ này đã được đặt. Vui lòng chọn thời gian khác.",
        }
      }

      // Create appointment
      const appointment = bookingService.createAppointment(bookingData, coach)

      // Refresh appointments list
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
      const success = bookingService.updateAppointment(appointmentId, updates)

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
      const success = bookingService.cancelAppointment(appointmentId)

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

  const upcomingAppointments = bookingService.getUpcomingAppointments()
  const appointmentHistory = bookingService.getAppointmentHistory()

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
