import axiosConfig from '@/config/axiosConfig'
import type { 
  ApiResponse, 
  WeeklyScheduleApiResponse, 
  TimeSlotResponse, 
  SlotRegistrationRequest
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
  }

  /**
   * Register time slots for a coach
   * POST /api/coaches/schedules/register
   */  /**
   * Register time slots for a coach
   * POST /api/coaches/schedules/register
   * Sử dụng coachId từ JWT token, không cần truyền trong request
   */
  async registerTimeSlots(request: SlotRegistrationRequest): Promise<void> {
    try {
      const response = await axiosConfig.post<ApiResponse<void>>(
        `/coaches/schedules/register`,
        request
      )
      
      if (response.data.status !== 200) {
        throw new Error(response.data.message || 'Failed to register time slots')      }
    } catch (error: unknown) {
      console.error('Error registering time slots:', error)
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Cancel a time slot registration
   * DELETE /api/coaches/schedules/slots/{slotId}
   */
  async cancelSlotRegistration(slotId: number): Promise<void> {
    try {
      const response = await axiosConfig.delete<ApiResponse<void>>(
        `/coaches/schedules/slots/${slotId}`
      )
      
      if (response.data.status !== 200) {
        throw new Error(response.data.message || 'Failed to cancel slot registration')      }
    } catch (error: unknown) {
      console.error('Error cancelling slot registration:', error)
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Update appointment status
   * PATCH /api/appointments/{appointmentId}/status
   */
  async updateAppointmentStatus(
    appointmentId: number, 
    status: 'confirmed' | 'cancelled' | 'completed'
  ): Promise<void> {
    try {
      const response = await axiosConfig.patch<ApiResponse<void>>(
        `/appointments/${appointmentId}/status`,
        { status }
      )
      
      if (response.data.status !== 200) {
        throw new Error(response.data.message || 'Failed to update appointment status')      }
    } catch (error: unknown) {
      console.error('Error updating appointment status:', error)
      throw new Error(handleApiError(error))
    }
  }
}

// Create and export singleton instance
export const coachScheduleService = CoachScheduleService.getInstance()
