import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { useDateRangeRegistration } from '@/hooks/useDateRangeRegistration'
import type { TimeSlot, CoachScheduleRangeRequest } from '@/types/api'
import { toast } from 'react-toastify'

// Helper function to get today's date in YYYY-MM-DD format
const getTodayString = () => {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

interface DateRangeRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  timeSlots: TimeSlot[]
  onSuccess?: () => void
}

export const DateRangeRegistrationModal: React.FC<DateRangeRegistrationModalProps> = ({
  isOpen,
  onClose,
  timeSlots,
  onSuccess
}) => {
  const [startDate, setStartDate] = useState(getTodayString())
  const [endDate, setEndDate] = useState(getTodayString())
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<number[]>([])

  const { isRegistering, error, registerDateRange, clearError } = useDateRangeRegistration()

  // Debug: Log selectedTimeSlots changes
  useEffect(() => {
    console.log('🎯 selectedTimeSlots changed to:', selectedTimeSlots)
  }, [selectedTimeSlots])

  // Debug: Log component renders
  console.log('🔄 Component render - selectedTimeSlots:', selectedTimeSlots)

  // Reset form when modal opens
  useEffect(() => {
    console.log('🔄 Modal state changed - isOpen:', isOpen)
    if (isOpen) {
      const today = getTodayString()
      console.log('🔄 Resetting form state...')
      setStartDate(today)
      setEndDate(today)
      setSelectedTimeSlots([])
      console.log('🔄 Form reset complete')
    }
  }, [isOpen])

  // Clear error when modal opens
  useEffect(() => {
    if (isOpen && clearError) {
      clearError()
    }
  }, [isOpen, clearError])

  // Handle start date change with auto-adjust end date
  const handleStartDateChange = (value: string) => {
    setStartDate(value)
    // Auto adjust end date if it's before start date
    if (endDate && value && endDate < value) {
      setEndDate(value)
    }
  }

  // Handle end date change  
  const handleEndDateChange = (value: string) => {
    setEndDate(value)
  }

  // Handle time slot selection - with logging for debugging
  const handleTimeSlotToggle = (timeSlotId: number, event?: React.MouseEvent | React.KeyboardEvent) => {
    console.log('🔍 handleTimeSlotToggle called with timeSlotId:', timeSlotId)
    console.log('🔍 Current selectedTimeSlots before update:', selectedTimeSlots)
    
    // Prevent any event bubbling or default behavior
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    setSelectedTimeSlots(prevSlots => {
      const isCurrentlySelected = prevSlots.includes(timeSlotId)
      console.log('🔍 isCurrentlySelected:', isCurrentlySelected)
      console.log('🔍 prevSlots:', prevSlots)
      
      if (isCurrentlySelected) {
        const newSlots = prevSlots.filter(id => id !== timeSlotId)
        console.log('🔍 Removing timeSlot, new array:', newSlots)
        return newSlots
      } else {
        const newSlots = [...prevSlots, timeSlotId]
        console.log('🔍 Adding timeSlot, new array:', newSlots)
        return newSlots
      }
    })
  }

  // Validation helpers
  const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? null : date
  }

  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  // Form validation
  const canSubmit = startDate && endDate && selectedTimeSlots.length > 0 && !isRegistering

  // Handle form submission
  const handleSubmit = async () => {
    if (!canSubmit) return

    const startDateObj = parseDate(startDate)
    const endDateObj = parseDate(endDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Validation before submit
    if (!startDateObj || !endDateObj) {
      toast.error('Vui lòng nhập ngày hợp lệ', {
        position: 'top-right',
        autoClose: 3000,
      })
      return
    }

    if (startDateObj < today) {
      toast.error('Ngày bắt đầu không thể là ngày quá khứ', {
        position: 'top-right',
        autoClose: 3000,
      })
      return
    }

    if (endDateObj < startDateObj) {
      toast.error('Ngày kết thúc phải sau hoặc bằng ngày bắt đầu', {
        position: 'top-right',
        autoClose: 3000,
      })
      return
    }

    try {
      const request: CoachScheduleRangeRequest = {
        startDate: startDate,
        endDate: endDate,
        timeSlotIds: selectedTimeSlots
      }

      await registerDateRange(request)

      toast.success('Đăng ký lịch theo khoảng thời gian thành công!', {
        position: 'top-right',
        autoClose: 3000,
      })

      onSuccess?.()
      onClose()
    } catch (err) {
      console.error('Registration failed:', err)
    }
  }

  // Filter and sort available time slots
  const availableTimeSlots = timeSlots
    .filter(slot => !slot.deleted)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Đăng ký lịch theo khoảng thời gian</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Date Range Selection */}
          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="start-date">Ngày bắt đầu</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label htmlFor="end-date">Ngày kết thúc</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => handleEndDateChange(e.target.value)}
              />
            </div>
          </div>

          {/* Time Slots Selection */}
          <div className="space-y-3">
            <Label>Chọn khung giờ muốn đăng ký</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-1 border rounded-md">
              {availableTimeSlots.map((timeSlot) => {
                const isSelected = selectedTimeSlots.includes(timeSlot.timeSlotId)

                return (
                  <div
                    key={timeSlot.timeSlotId}
                    className={`flex items-center space-x-2 p-2 rounded cursor-pointer select-none transition-colors text-left w-full ${isSelected
                      ? 'bg-blue-100 border border-blue-300'
                      : 'hover:bg-gray-50 border border-transparent'
                      }`}
                    onClick={(e) => {
                      console.log('🖱️ Clicked on timeSlot:', timeSlot.timeSlotId)
                      console.log('🖱️ isSelected at click time:', isSelected)
                      handleTimeSlotToggle(timeSlot.timeSlotId, e)
                    }}
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        console.log('⌨️ Keyboard activated on timeSlot:', timeSlot.timeSlotId)
                        handleTimeSlotToggle(timeSlot.timeSlotId, e)
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <div
                        className={`h-4 w-4 border rounded flex items-center justify-center ${isSelected
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-300 bg-white'
                          }`}
                      >
                        {isSelected && (
                          <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-normal">
                      {timeSlot.label}
                    </span>
                  </div>
                )
              })}
            </div>
            {selectedTimeSlots.length === 0 && (
              <p className="text-sm text-gray-500">
                Vui lòng chọn ít nhất một khung giờ
              </p>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Summary */}
          {startDate && endDate && selectedTimeSlots.length > 0 && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Tóm tắt:</strong> Đăng ký {selectedTimeSlots.length} khung giờ
                từ {formatDateForDisplay(startDate)}
                đến {formatDateForDisplay(endDate)}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isRegistering}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            {isRegistering && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Đăng ký
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
