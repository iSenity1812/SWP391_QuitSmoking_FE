
import type React from "react"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

interface Testimonial {
  id: number
  name: string
  username?: string
  avatar: string
  content: string
  rating: number
  smokeFreedays: number
  beforeImage?: string
  afterImage?: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    username: "@smokefree_sarah",
    avatar: "/placeholder.svg?height=60&width=60&text=SJ",
    content:
      "QuitTogether completely changed my life! The gamification aspect made quitting fun instead of stressful. I've been smoke-free for 6 months and saved over $1,800. The community support is incredible!",
    rating: 5,
    smokeFreedays: 186,
  },
  {
    id: 2,
    name: "Michael Chen",
    username: "@healthy_mike",
    avatar: "/placeholder.svg?height=60&width=60&text=MC",
    content:
      "After 15 years of smoking, I never thought I could quit. The daily challenges and progress tracking kept me motivated. My breathing has improved dramatically, and I can finally play with my kids without getting winded!",
    rating: 5,
    smokeFreedays: 243,
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    username: "@breathe_easy_em",
    avatar: "/placeholder.svg?height=60&width=60&text=ER",
    content:
      "The money-saving tracker was my biggest motivator. Seeing how much I was spending on cigarettes was shocking! Now I've saved enough for a vacation. The health milestones feature is amazing too!",
    rating: 5,
    smokeFreedays: 156,
  },
  {
    id: 4,
    name: "David Kim",
    username: "@quit_champion",
    avatar: "/placeholder.svg?height=60&width=60&text=DK",
    content:
      "The coaching feature was a game-changer. Having someone check in on me weekly and provide personalized advice made all the difference. I'm now 8 months smoke-free and feeling the best I've felt in years!",
    rating: 5,
    smokeFreedays: 234,
  },
  {
    id: 5,
    name: "Lisa Thompson",
    username: "@freedom_lisa",
    avatar: "/placeholder.svg?height=60&width=60&text=LT",
    content:
      "The community aspect is what kept me going during tough times. Sharing my journey and supporting others created accountability I never had before. The achievement badges make every milestone feel special! 🎉",
    rating: 5,
    smokeFreedays: 298,
  },
]

export const TestimonialSlider: React.FC = () => {
  console.log("TestimonialSlider: start render function");
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000) // Resume auto-play after 10 seconds
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  return (
    <div className="py-20 bg-gradient-to-tr from-emerald-50 to-white dark:from-slate-800 dark:to-slate-900">
      {/* Main Testimonial Display */}
      <div className="relative mx-40 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-slate-800 dark:to-slate-700 border-2 border-emerald-200 dark:border-slate-600 shadow-2xl">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full flex-shrink-0 p-8 md:p-12">
              <div className="text-center">
                {/* Rating Stars */}
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Testimonial Content */}
                <blockquote className="text-xl md:text-2xl font-medium text-slate-700 dark:text-slate-200 leading-relaxed mb-8 italic">
                  "{testimonial.content}"
                </blockquote>

                {/* User Info */}
                <div className="flex items-center justify-center gap-4">
                  <img
                    src={"/cham1.jpg"} // Placeholder for avatar, replace with testimonial.avatar
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full border-2 border-emerald-300 dark:border-emerald-500 shadow-lg"
                  />
                  <div className="text-left">
                    <h4 className="font-black text-lg text-slate-800 dark:text-white">{testimonial.name}</h4>
                    {/* <p className="text-emerald-600 dark:text-emerald-400 font-semibold">{testimonial.username}</p> */}
                    <div className="flex items-center gap-4 mt-1 text-sm">
                      <span className="px-3 py-1 rounded-full bg-emerald-500 text-white font-bold text-xs">
                        {testimonial.smokeFreedays} days smoke-free
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 dark:bg-slate-800/90 border-2 border-emerald-200 dark:border-slate-600 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 hover:scale-110 transition-all duration-300 shadow-lg"
        >
          <ChevronLeft className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 dark:bg-slate-800/90 border-2 border-emerald-200 dark:border-slate-600 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 hover:scale-110 transition-all duration-300 shadow-lg"
        >
          <ChevronRight className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-3 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
              ? "bg-emerald-500 scale-125 shadow-lg"
              : "bg-emerald-200 dark:bg-slate-600 hover:bg-emerald-300 dark:hover:bg-slate-500"
              }`}
          />
        ))}
      </div>

      {/* Auto-play indicator */}
      <div className="flex justify-center mt-4">
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`} />
          <span className="font-medium">{isAutoPlaying ? "Auto-playing" : "Paused"}</span>
        </div>
      </div>
    </div>
  )
}
