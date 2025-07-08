import { useState } from 'react'
import { coachScheduleService } from '@/services/coachScheduleService'
import type { CoachScheduleRangeRequest, CoachScheduleRangeResponse } from '@/types/api'

export interface UseDateRangeRegistrationReturn {
  isRegistering: boolean
  error: string | null
  registerDateRange: (request: CoachScheduleRangeRequest) => Promise<CoachScheduleRangeResponse[]>
  clearError: () => void
}

export const useDateRangeRegistration = (): UseDateRangeRegistrationReturn => {
  const [isRegistering, setIsRegistering] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const registerDateRange = async (request: CoachScheduleRangeRequest): Promise<CoachScheduleRangeResponse[]> => {
    setIsRegistering(true)
    setError(null)

    try {
      const result = await coachScheduleService.registerTimeSlotsByRange(request)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register date range'
      setError(errorMessage)
      throw err
    } finally {
      setIsRegistering(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  return {
    isRegistering,
    error,
    registerDateRange,
    clearError
  }
}
