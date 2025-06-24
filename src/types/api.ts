// API Response Types
export interface ApiResponse<T> {
  status: number
  message: string
  data: T
}

// Coach Schedule Registration Types
export interface ScheduleRegistrationResponse {
  scheduleId: number
  coach: {
    coachId: string
    username: string
    email: string
    fullName: string
    rating: number
  }
  timeSlot: {
    timeSlotId: number
    label: string
    startTime: string
    endTime: string
    deleted: boolean
  }
  scheduleDate: string
  booked: boolean
}

// Time Slot Types
export interface TimeSlot {
  timeSlotId: number
  label: string
  startTime: string
  endTime: string
  deleted: boolean
}

export interface TimeSlotResponse {
  timeSlotId: number
  label: string
  startTime: string
  endTime: string
  deleted: boolean
}

// Weekly Schedule Types (API Response Format)
export interface WeeklyScheduleApiSlot {
  coachScheduleId: number
  date: string
  timeSlotId: number
  label: string
  startTime: string
  endTime: string
  appointmentDetails: Array<{
    appointmentId: number
    clientName: string
    clientId: string
    status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'MISSED'
    notes?: string
  }>
  available: boolean
}

export interface WeeklyScheduleApiResponse {
  weekStartDate: string
  weekEndDate: string
  registeredSlots: WeeklyScheduleApiSlot[]
}

// Frontend format after transformation
export interface WeeklyScheduleSlot {
  coachScheduleId: number
  date: string
  timeSlotId: number
  isAvailable: boolean
  appointments: Array<{
    appointmentId: number
    clientName: string
    clientId: number
    status: 'confirmed' | 'scheduled' | 'cancelled' | 'completed' | 'missed'
    notes?: string
    method: 'phone' | 'in-person'
    location?: string
    createdAt: string
  }>
  // Computed fields for display
  primaryAppointment?: {
    appointmentId: number
    clientName: string
    clientId: number
    status: 'confirmed' | 'scheduled' | 'cancelled' | 'completed' | 'missed'
    notes?: string
    method: 'phone' | 'in-person'
    location?: string
    createdAt: string
  }
}

export interface WeeklyScheduleResponse {
  weekStart: string
  weekEnd: string
  registeredSlots: WeeklyScheduleSlot[]
}

// Coach Types
export interface Coach {
  coachId: number
  name: string
  email: string
  // Add other coach fields as needed
}

// Error Types
export interface ApiError {
  status: number
  message: string
  errors?: string[]
}

// Request Types
export interface SlotRegistrationRequest {
  timeSlotIds: number[]
  weekStart: string
}

export interface SlotUnregisterRequest {
  scheduleId: number
}

export interface AppointmentCreateRequest {
  coachId: number
  clientId: number
  date: string
  timeSlotId: number
  notes?: string
  method: 'phone' | 'in-person'
  location?: string
}

// Hook State Types
export interface UseWeeklyScheduleState {
  scheduleData: WeeklyScheduleResponse | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export interface UseTimeSlotsState {
  timeSlots: TimeSlot[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

// appointment status: CONFIRMED | CANCELLED | COMPLETED | MISSED
export type AppointmentStatus = {
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  MISSED: 'MISSED',
};