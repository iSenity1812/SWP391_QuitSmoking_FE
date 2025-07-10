export interface Coach {
  id: number
  name: string
  title: string
  avatar: string
  rating: number
  reviewCount: number
  experience: number
  specializations: string[]
  languages: string[]
  successRate: number
  totalClients: number
  bio: string
  availability: {
    [key: string]: string[]
  }
  pricing: {
    consultation: number
    therapy: number
    coaching: number
  }
}

export interface Appointment {
  id: number
  coachId: number
  coachName: string
  coachAvatar: string
  date: string
  time: string
  duration: number
  type: "consultation" | "therapy" | "coaching"
  method: "phone" | "video" | "in-person"
  status: "scheduled" | "confirmed" | "completed" | "cancelled"
  notes: string
  location?: string
  price: number
}

export interface BookingForm {
  date: string
  time: string
  duration: number
  type: "consultation" | "therapy" | "coaching"
  method: "phone" | "video" | "in-person"
  notes: string
  location: string
}

export interface PremiumBookingProps {
  userSubscription?: "free" | "premium"
}
