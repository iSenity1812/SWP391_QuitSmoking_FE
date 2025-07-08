import axiosConfig from '@/config/axiosConfig'
import type {
  ApiResponse,
  WeeklyScheduleApiResponse,
  TimeSlotResponse,
  ScheduleRegistrationResponse,
  CoachScheduleRangeRequest,
  CoachScheduleRangeResponse
} from '@/types/api'
import { handleApiError } from '@/utils/dataTransformers'

export class CoachScheduleService {
  private static instance: CoachScheduleService

  public static getInstance(): CoachScheduleService {
    if (!CoachScheduleService.instance) {
      CoachScheduleService.instance = new CoachScheduleService()
    }
    return CoachScheduleService.instance
  }
  /**
   * Fetch weekly schedule for a coach
   * GET /api/coaches/schedules/weekly/{coachId}
   * @param requestedCoachId ID của Coach cần lấy lịch trình (nếu null, sẽ lấy của chính Coach đang đăng nhập)
   * @param dateInWeek Ngày trong tuần để lấy lịch trình (nếu không cung cấp, sẽ lấy tuần hiện tại)
   */
  async getWeeklySchedule(requestedCoachId: string | null, dateInWeek: string): Promise<WeeklyScheduleApiResponse> {
    try {
      const url = requestedCoachId
        ? `/coaches/schedules/weekly/${requestedCoachId}`
        : `/coaches/schedules/weekly`

      const response = await axiosConfig.get<ApiResponse<WeeklyScheduleApiResponse>>(
        url,
        {
          params: { dateInWeek }
        }
      )

      if (response.data.status !== 200) {
        throw new Error(response.data.message || 'Failed to fetch weekly schedule')
      }
      return response.data.data
    } catch (error: unknown) {
      console.error('Error fetching weekly schedule:', error)
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Fetch all time slots
   * GET /api/timeslots
   */
  async getTimeSlots(): Promise<TimeSlotResponse[]> {
    try {
      const response = await axiosConfig.get<ApiResponse<TimeSlotResponse[]>>('/timeslots')

      if (response.data.status !== 200) {
        throw new Error(response.data.message || 'Failed to fetch time slots')
      }
      return response.data.data
    } catch (error: unknown) {
      console.error('Error fetching time slots:', error)
      throw new Error(handleApiError(error))
    }
  }  /**
   * Register time slots for a coach
   * POST /api/coaches/schedules
   * Request format: [{ "timeSlotId": 1, "scheduleDate": "2025-06-22" }]
   */
  async registerTimeSlots(slots: { timeSlotId: number; scheduleDate: string }[]): Promise<ScheduleRegistrationResponse[]> {
    try {
      const response = await axiosConfig.post<ApiResponse<ScheduleRegistrationResponse[]>>(
        `/coaches/schedules`,
        slots
      )

      if (response.data.status !== 200) {
        throw new Error(response.data.message || 'Failed to register time slots')
      }

      return response.data.data
    } catch (error: unknown) {
      console.error('Error registering time slots:', error)
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Register time slots for a coach by date range
   * POST /api/coaches/schedules/range
   * Request format: { "startDate": "2025-06-22", "endDate": "2025-07-22", "timeSlotIds": [1, 2, 3] }
   */
  async registerTimeSlotsByRange(request: CoachScheduleRangeRequest): Promise<CoachScheduleRangeResponse[]> {
    try {
      const response = await axiosConfig.post<ApiResponse<CoachScheduleRangeResponse[]>>(
        `/coaches/schedules/range`,
        request
      )

      if (response.data.status !== 200) {
        throw new Error(response.data.message || 'Failed to register time slots by range')
      }

      return response.data.data
    } catch (error: unknown) {
      console.error('Error registering time slots by range:', error)
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Cancel a time slot registration
   * DELETE /api/coaches/schedules/{scheduleId}
   */
  async unregisterSlot(scheduleId: number): Promise<void> {
    try {
      const response = await axiosConfig.delete<ApiResponse<void>>(
        `/coaches/schedules/${scheduleId}`
      )

      if (response.data.status !== 200) {
        throw new Error(response.data.message || 'Failed to unregister slot')
      }
    } catch (error: unknown) {
      console.error('Error unregistering slot:', error)
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Update appointment status
   * PUT /api/appointments/{appointmentId}/status?newStatus={status}
   */
  async updateAppointmentStatus(
    appointmentId: number,
    status: 'confirmed' | 'cancelled' | 'completed'
  ): Promise<void> {
    try {
      // Map frontend status to backend enum format
      const statusMapping = {
        'confirmed': 'CONFIRMED',
        'cancelled': 'CANCELLED',
        'completed': 'COMPLETED'
      }

      const backendStatus = statusMapping[status]

      const response = await axiosConfig.put<ApiResponse<void>>(
        `/appointments/${appointmentId}/status?newStatus=${backendStatus}`
      )

      if (response.data.status !== 200) {
        throw new Error(response.data.message || 'Failed to update appointment status')
      }
    } catch (error: unknown) {
      console.error('Error updating appointment status:', error)
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Cancel appointment directly using the cancel API
   * PUT /api/appointments/{appointmentId}/cancel
   */
  async cancelAppointment(appointmentId: number): Promise<void> {
    try {
      const response = await axiosConfig.put<ApiResponse<void>>(
        `/appointments/${appointmentId}/cancel`
      )

      if (response.data.status !== 200) {
        throw new Error(response.data.message || 'Failed to cancel appointment')
      }
    } catch (error: unknown) {
      console.error('Error cancelling appointment:', error)
      throw new Error(handleApiError(error))
    }
  }
}

// Create and export singleton instance
export const coachScheduleService = CoachScheduleService.getInstance()
