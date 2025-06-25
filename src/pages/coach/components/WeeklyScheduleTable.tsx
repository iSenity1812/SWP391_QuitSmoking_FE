// "use client"

// import React, { useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { toast } from "react-toastify"
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
// } from "@/components/ui/dialog"
// import {
//     ChevronLeft,
//     ChevronRight,
//     Plus,
//     Edit,
//     Trash2,
//     CheckCircle,
//     Clock,
//     X,
//     Calendar,
//     Settings,
//     UserPlus,
//     Phone,
//     MapPin,
//     CheckCircle2,
//     Loader2,
//     AlertCircle
// } from "lucide-react"

// // Import custom hooks and types
// import { useTimeSlots } from "@/hooks/useTimeSlots"
// import { useWeeklySchedule, useCurrentCoachId } from "@/hooks/useWeeklySchedule"
// import type { TimeSlot, WeeklyScheduleSlot } from "@/types/api"
// import { DataTransformer } from "@/utils/dataTransformers"

// // Status Colors & Icons
// const statusColors = {
//     confirmed: 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300 cursor-pointer',
//     scheduled: 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300 cursor-pointer',
//     cancelled: 'bg-red-100 border-red-300 text-red-800 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300 cursor-pointer',
//     completed: 'bg-cyan-100 border-cyan-300 text-cyan-800 dark:bg-cyan-900/20 dark:border-cyan-700 dark:text-cyan-300 cursor-pointer',
//     missed: 'bg-orange-100 border-orange-300 text-orange-800 dark:bg-orange-900/20 dark:border-orange-700 dark:text-orange-300 cursor-pointer',
//     available: 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-900/10 dark:border-emerald-600 dark:text-emerald-400 cursor-pointer hover:bg-emerald-100 hover:border-emerald-300',
//     unavailable: 'bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 cursor-pointer'
// }

// const statusIcons = {
//     confirmed: <CheckCircle className="w-4 h-4 text-green-600" />,
//     scheduled: <Clock className="w-4 h-4 text-blue-600" />,
//     cancelled: <X className="w-4 h-4 text-red-600" />,
//     completed: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
//     missed: <AlertCircle className="w-4 h-4 text-orange-600" />,
//     available: <Plus className="w-4 h-4 text-emerald-600" />,
//     unavailable: null
// }

// // Week Navigation Component
// interface WeekNavigationProps {
//     currentWeekStart: Date
//     onWeekChange: (date: Date) => void
//     setIsRegistrationOpen: (open: boolean) => void
// }

// function WeekNavigation({ currentWeekStart, onWeekChange, setIsRegistrationOpen }: WeekNavigationProps) {

//     const formatWeekRange = (startDate: Date) => {
//         const endDate = new Date(startDate);
//         endDate.setDate(startDate.getDate() + 6);

//         const startStr = startDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
//         const endStr = endDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

//         return `${startStr} - ${endStr}`;
//     };

//     const goToPreviousWeek = () => {
//         const prevWeek = new Date(currentWeekStart)
//         prevWeek.setDate(currentWeekStart.getDate() - 7)
//         onWeekChange(prevWeek)
//     }
//     const goToNextWeek = () => {
//         const nextWeek = new Date(currentWeekStart)
//         nextWeek.setDate(currentWeekStart.getDate() + 7)
//         onWeekChange(nextWeek)
//     }

//     const goToCurrentWeek = () => {
//         const today = new Date()
//         const startOfWeek = DataTransformer.getWeekStart(today) // Sử dụng T2-CN format
//         onWeekChange(startOfWeek)
//     }

//     return (
//         <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center space-x-4">
//                 <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
//                     <ChevronLeft className="w-4 h-4" />
//                 </Button>

//                 <div className="text-lg font-semibold text-slate-900 dark:text-white">
//                     {formatWeekRange(currentWeekStart)}
//                 </div>

//                 <Button variant="outline" size="sm" onClick={goToNextWeek}>
//                     <ChevronRight className="w-4 h-4" />
//                 </Button>

//                 <Button variant="outline" size="sm" onClick={goToCurrentWeek}>
//                     Tuần này
//                 </Button>
//             </div>      <div className="flex items-center space-x-2">
//                 <Button
//                     variant="outline"
//                     size="sm"
//                     className="bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-700 hover:from-emerald-100 hover:to-emerald-200 dark:hover:from-emerald-900/30 dark:hover:to-emerald-800/30"
//                     onClick={() => setIsRegistrationOpen(true)}
//                 >
//                     <Settings className="w-4 h-4 mr-2" />
//                     Đăng ký Slots
//                 </Button>
//             </div>
//         </div>
//     )
// }

// // Render the Registration Dialog separately
// const RegistrationDialog = ({
//     isOpen,
//     onClose,
//     onSuccess,
//     timeSlots,
//     registerSlots
// }: {
//     isOpen: boolean
//     onClose: () => void
//     onSuccess: () => void
//     timeSlots: TimeSlot[]
//     registerSlots: (timeSlotIds: number[]) => Promise<void>
// }) => {
//     const [selectedSlots, setSelectedSlots] = useState<number[]>([])
//     const [isLoading, setIsLoading] = useState(false)
//     const [showSuccess, setShowSuccess] = useState(false)

//     // Reset states when dialog opens/closes
//     React.useEffect(() => {
//         if (!isOpen) {
//             setSelectedSlots([])
//             setIsLoading(false)
//             setShowSuccess(false)
//         }
//     }, [isOpen])

//     const handleSlotToggle = (slotId: number) => {
//         setSelectedSlots(prev =>
//             prev.includes(slotId)
//                 ? prev.filter(id => id !== slotId)
//                 : [...prev, slotId]
//         )
//     }
//     const handleRegister = async () => {
//         if (selectedSlots.length === 0) {
//             toast.warn("Vui lòng chọn ít nhất một time slot", {
//                 position: "top-right",
//                 autoClose: 3000,
//             })
//             return
//         }

//         setIsLoading(true)

//         try {
//             // Call API to register slots
//             await registerSlots(selectedSlots)

//             setIsLoading(false)
//             setShowSuccess(true)

//             toast.success(`Đã đăng ký thành công ${selectedSlots.length} time slot${selectedSlots.length > 1 ? 's' : ''}!`, {
//                 position: "top-right",
//                 autoClose: 3000,
//             })

//             // Auto close after success
//             setTimeout(() => {
//                 setShowSuccess(false)
//                 onSuccess()
//                 onClose()
//             }, 1500)

//         } catch (error) {
//             console.error("Error registering slots:", error)
//             setIsLoading(false)

//             const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra khi đăng ký slots"
//             toast.error(errorMessage, {
//                 position: "top-right",
//                 autoClose: 5000,
//             })
//         }
//     }

//     if (!isOpen) return null

//     return (
//         <Dialog open={isOpen} onOpenChange={onClose}>
//             <DialogContent className="max-w-lg">
//                 <DialogHeader className="relative">
//                     <DialogTitle>Quản lý Time Slots</DialogTitle>
//                     <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={onClose}
//                         className="absolute right-0 top-0 text-slate-400 hover:text-slate-600"
//                     >
//                         <X className="w-4 h-4" />
//                     </Button>
//                 </DialogHeader>

//                 {showSuccess ? (
//                     <div className="text-center space-y-4 py-8">
//                         <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center animate-bounce">
//                             <CheckCircle2 className="w-10 h-10 text-white" />
//                         </div>
//                         <div className="space-y-2">
//                             <h3 className="text-xl font-bold text-slate-900 dark:text-white">
//                                 Đăng ký thành công! 🎉
//                             </h3>
//                             <p className="text-slate-600 dark:text-slate-400">
//                                 Bạn đã đăng ký {selectedSlots.length} time slot{selectedSlots.length > 1 ? 's' : ''}
//                             </p>
//                         </div>
//                     </div>
//                 ) : isLoading ? (
//                     <div className="text-center space-y-4 py-8">
//                         <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mx-auto" />
//                         <div className="space-y-2">
//                             <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
//                                 Đang đăng ký slots...
//                             </h3>
//                             <p className="text-slate-600 dark:text-slate-400">
//                                 Vui lòng đợi một chút
//                             </p>
//                         </div>
//                     </div>
//                 ) : (
//                     <div className="space-y-6">
//                         {/* Header */}
//                         <div className="text-center space-y-4">
//                             <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/20 rounded-full flex items-center justify-center">
//                                 <Calendar className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
//                             </div>
//                             <div>
//                                 <h3 className="text-lg font-bold text-slate-900 dark:text-white">
//                                     Đăng ký Time Slots 🗓️
//                                 </h3>
//                                 <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
//                                     Chọn các khung giờ bạn muốn mở để nhận lịch hẹn từ thành viên
//                                 </p>
//                             </div>
//                         </div>

//                         {/* Slots Selection */}
//                         <div className="space-y-4">
//                             <div className="flex items-center justify-between">
//                                 <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                                     Chọn khung giờ
//                                 </span>
//                                 <span className="text-xs text-emerald-600 dark:text-emerald-400">
//                                     {selectedSlots.length} đã chọn
//                                 </span>
//                             </div>              <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
//                                 {timeSlots.map((slot) => {
//                                     const isSelected = selectedSlots.includes(slot.timeSlotId)
//                                     return (
//                                         <button
//                                             key={slot.timeSlotId}
//                                             onClick={() => handleSlotToggle(slot.timeSlotId)}
//                                             className={`p-3 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${isSelected
//                                                 ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
//                                                 : 'border-slate-200 dark:border-slate-700 hover:border-emerald-200'
//                                                 }`}
//                                         >
//                                             <div className="flex items-center justify-between">
//                                                 <div className="text-left">
//                                                     <div className="font-semibold text-sm">{slot.label}</div>
//                                                     <div className="text-xs opacity-75">
//                                                         {slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)}
//                                                     </div>
//                                                 </div>
//                                                 <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected
//                                                     ? 'border-emerald-500 bg-emerald-500'
//                                                     : 'border-slate-300'
//                                                     }`}>
//                                                     {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
//                                                 </div>
//                                             </div>
//                                         </button>
//                                     )
//                                 })}
//                             </div>
//                         </div>

//                         {/* Action Buttons */}
//                         <div className="flex space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
//                             <Button
//                                 variant="outline"
//                                 onClick={onClose}
//                                 className="flex-1"
//                             >
//                                 Hủy
//                             </Button>
//                             <Button
//                                 onClick={handleRegister}
//                                 disabled={selectedSlots.length === 0}
//                                 className={`flex-1 ${selectedSlots.length > 0
//                                     ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
//                                     : ''
//                                     }`}
//                             >
//                                 <Plus className="w-4 h-4 mr-2" />
//                                 Đăng ký {selectedSlots.length > 0 && `(${selectedSlots.length})`}
//                             </Button>
//                         </div>
//                     </div>
//                 )}
//             </DialogContent>
//         </Dialog>
//     )
// }

// // Time Slot Cell Component
// interface TimeSlotCellProps {
//     date: string
//     timeSlot: TimeSlot
//     slotData?: WeeklyScheduleSlot
//     isToday: boolean
//     onClick: () => void
// }

// function TimeSlotCell({ slotData, isToday, onClick }: TimeSlotCellProps) {
//     const getSlotStatus = (): keyof typeof statusColors => {
//         if (!slotData) return 'unavailable'
//         if (slotData.primaryAppointment) return slotData.primaryAppointment.status
//         return 'available'
//     }

//     const status = getSlotStatus()
//     const primaryAppointment = slotData?.primaryAppointment

//     return (
//         <div
//             onClick={onClick}
//             className={`
//         min-h-[110px] p-2 border-2 rounded-lg transition-all duration-200
//         ${statusColors[status]}
//         ${isToday ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}
//         ${status !== 'unavailable' ? 'hover:shadow-md' : ''}
//       `}
//         >
//             <div className="flex flex-col h-full">
//                 {/* Status Icon */}
//                 <div className="flex justify-center mb-1">
//                     {statusIcons[status]}
//                 </div>

//                 {/* Content */}
//                 {primaryAppointment ? (
//                     <div className="text-center">
//                         <div className="font-medium text-xs truncate">
//                             {primaryAppointment.clientName}
//                         </div>
//                         <div className="text-xs opacity-75 mt-1">
//                             {status === 'confirmed' && 'Đã xác nhận'}
//                             {status === 'scheduled' && 'Chờ xác nhận'}
//                             {status === 'cancelled' && 'Đã hủy'}
//                             {status === 'completed' && 'Đã hoàn thành'}
//                             {status === 'missed' && 'Đã bỏ lỡ'}
//                         </div>
//                         {primaryAppointment.method === 'phone' && (
//                             <Phone className="w-3 h-3 mx-auto mt-1 opacity-60" />
//                         )}
//                         {primaryAppointment.method === 'in-person' && (
//                             <MapPin className="w-3 h-3 mx-auto mt-1 opacity-60" />
//                         )}
//                         {/* Show appointment count if multiple */}
//                         {slotData?.appointments && slotData.appointments.length > 1 && (
//                             <div className="text-xs opacity-60 mt-1">
//                                 +{slotData.appointments.length - 1} khác
//                             </div>
//                         )}
//                     </div>
//                 ) : status === 'available' ? (
//                     <div className="text-center">
//                         <div className="text-xs font-medium">Có sẵn</div>
//                         <div className="text-xs opacity-75 mt-1">Tạo lịch hẹn</div>
//                     </div>
//                 ) : (
//                     <div className="text-center">
//                         <div className="text-xs opacity-75">Chưa đăng ký</div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     )
// }

// // Main Weekly Schedule Table Component
// export function WeeklyScheduleTable() {
//     // Get current coach ID from auth context
//     const coachId = useCurrentCoachId()
//     const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
//         const today = new Date()
//         return DataTransformer.getWeekStart(today) // Sử dụng T2-CN format
//     })
//     // Use custom hooks for API data
//     const { timeSlots, isLoading: timeSlotsLoading, error: timeSlotsError } = useTimeSlots()
//     const {
//         scheduleData,
//         isLoading: scheduleLoading,
//         error: scheduleError,
//         refetch,
//         registerSlots
//     } = useWeeklySchedule(null, currentWeekStart) // null để lấy lịch của coach hiện tại

//     const [selectedSlot, setSelectedSlot] = useState<{
//         date: string
//         timeSlot: TimeSlot
//         slotData?: WeeklyScheduleSlot
//     } | null>(null)

//     const [isRegistrationOpen, setIsRegistrationOpen] = useState(false)

//     const handleRegistrationSuccess = () => {
//         // Refresh weekly schedule data
//         refetch()
//     }

//     // Generate week dates (Sunday to Saturday)
//     const getWeekDates = (startDate: Date) => {
//         const dates = []
//         for (let i = 0; i < 7; i++) {
//             const date = new Date(startDate)
//             date.setDate(startDate.getDate() + i)
//             dates.push(date)
//         }
//         return dates
//     }

//     const weekDates = getWeekDates(currentWeekStart)
//     const today = new Date().toDateString()
//     // Day labels từ T2-CN (Monday to Sunday)
//     const dayLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

//     const handleSlotClick = (date: string, timeSlot: TimeSlot, slotData?: WeeklyScheduleSlot) => {
//         setSelectedSlot({ date, timeSlot, slotData })
//     }

//     const handleWeekChange = (newWeekStart: Date) => {
//         setCurrentWeekStart(newWeekStart)
//         // Data will be automatically refetched by the hook
//     }

//     // Loading state
//     if (timeSlotsLoading || scheduleLoading) {
//         return (
//             <div className="flex items-center justify-center h-64">
//                 <div className="text-center space-y-4">
//                     <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600" />
//                     <p className="text-slate-600 dark:text-slate-400">
//                         Đang tải lịch trình...
//                     </p>
//                 </div>
//             </div>
//         )
//     }

//     // Error state
//     if (timeSlotsError || scheduleError) {
//         return (
//             <div className="flex items-center justify-center h-64">
//                 <div className="text-center space-y-4">
//                     <AlertCircle className="w-8 h-8 mx-auto text-red-500" />
//                     <div>
//                         <h3 className="font-semibold text-slate-900 dark:text-white">
//                             Có lỗi xảy ra
//                         </h3>
//                         <p className="text-slate-600 dark:text-slate-400 mt-1">
//                             {timeSlotsError || scheduleError}
//                         </p>
//                         <Button
//                             variant="outline"
//                             size="sm"
//                             className="mt-3"
//                             onClick={() => {
//                                 refetch()
//                                 // Also refresh time slots if needed
//                             }}
//                         >
//                             Thử lại
//                         </Button>
//                     </div>
//                 </div>
//             </div>
//         )
//     }
//     // No coach ID
//     if (!coachId) {
//         return (
//             <div className="flex items-center justify-center h-64">
//                 <div className="text-center space-y-4">
//                     <AlertCircle className="w-8 h-8 mx-auto text-amber-500" />
//                     <div>
//                         <h3 className="font-semibold text-slate-900 dark:text-white">
//                             Chỉ dành cho Coach
//                         </h3>
//                         <p className="text-slate-600 dark:text-slate-400 mt-1">
//                             Bạn cần có quyền Coach để truy cập trang này
//                         </p>
//                     </div>
//                 </div>
//             </div>)
//     }

//     return (
//         <div className="space-y-6">      {/* Week Navigation */}
//             <WeekNavigation
//                 currentWeekStart={currentWeekStart}
//                 onWeekChange={handleWeekChange}
//                 setIsRegistrationOpen={setIsRegistrationOpen}
//             />

//             {/* Weekly Schedule Table */}
//             <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
//                 <CardHeader>
//                     <CardTitle className="flex items-center space-x-2">
//                         <Calendar className="w-5 h-5" />
//                         <span>Lịch Tuần</span>
//                     </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="overflow-x-auto">
//                         <table className="w-full border-collapse">
//                             {/* Table Header */}
//                             <thead>
//                                 <tr>
//                                     <th className="p-3 text-left font-semibold text-slate-700 dark:text-slate-300 border-b">
//                                         Giờ
//                                     </th>
//                                     {weekDates.map((date, index) => {
//                                         const isToday = date.toDateString() === today
//                                         return (
//                                             <th
//                                                 key={index}
//                                                 className={`p-3 text-center font-semibold border-b min-w-[120px] ${isToday
//                                                     ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
//                                                     : 'text-slate-700 dark:text-slate-300'
//                                                     }`}
//                                             >
//                                                 <div className="flex flex-col">
//                                                     <span className="text-sm">{dayLabels[index]}</span>
//                                                     <span className="text-xs opacity-75">
//                                                         {date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
//                                                     </span>
//                                                 </div>
//                                             </th>
//                                         )
//                                     })}
//                                 </tr>
//                             </thead>

//                             {/* Table Body */}              <tbody>
//                                 {timeSlots.map((timeSlot) => (
//                                     <tr key={timeSlot.timeSlotId}>
//                                         {/* Time Slot Label */}
//                                         <td className="p-3 font-medium text-slate-700 dark:text-slate-300 border-r">
//                                             <div>
//                                                 <div className="text-sm">{timeSlot.label}</div>
//                                                 <div className="text-xs opacity-75">
//                                                     {timeSlot.startTime.slice(0, 5)} - {timeSlot.endTime.slice(0, 5)}
//                                                 </div>
//                                             </div>
//                                         </td>

//                                         {/* Week Day Cells */}
//                                         {weekDates.map((date, dayIndex) => {
//                                             const dateStr = date.toISOString().split('T')[0]
//                                             const isToday = date.toDateString() === today
//                                             const slotData = scheduleData?.registeredSlots.find(
//                                                 slot => slot.date === dateStr && slot.timeSlotId === timeSlot.timeSlotId
//                                             )

//                                             return (
//                                                 <td key={dayIndex} className="p-2 border-r border-b">
//                                                     <TimeSlotCell
//                                                         date={dateStr}
//                                                         timeSlot={timeSlot}
//                                                         slotData={slotData}
//                                                         isToday={isToday}
//                                                         onClick={() => handleSlotClick(dateStr, timeSlot, slotData)}
//                                                     />
//                                                 </td>
//                                             )
//                                         })}
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </CardContent>
//             </Card>      {/* Slot Details Dialog */}
//             {selectedSlot && (
//                 <Dialog open={!!selectedSlot} onOpenChange={() => setSelectedSlot(null)}>
//                     <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
//                         <DialogHeader>
//                             <DialogTitle>
//                                 Chi tiết Slot - {selectedSlot.timeSlot.label}
//                             </DialogTitle>
//                         </DialogHeader>
//                         <div className="space-y-4">
//                             <div className="text-sm text-slate-600 dark:text-slate-400">
//                                 <strong>Ngày:</strong> {new Date(selectedSlot.date).toLocaleDateString('vi-VN')}
//                             </div>
//                             <div className="text-sm text-slate-600 dark:text-slate-400">
//                                 <strong>Thời gian:</strong> {selectedSlot.timeSlot.startTime.slice(0, 5)} - {selectedSlot.timeSlot.endTime.slice(0, 5)}
//                             </div>

//                             {selectedSlot.slotData?.appointments && selectedSlot.slotData.appointments.length > 0 ? (
//                                 <div className="space-y-4">
//                                     <div className="flex items-center justify-between">
//                                         <h4 className="font-medium">Danh sách lịch hẹn ({selectedSlot.slotData.appointments.length})</h4>
//                                         <Badge variant="secondary" className="text-xs">
//                                             {selectedSlot.slotData.appointments.length} cuộc hẹn
//                                         </Badge>
//                                     </div>

//                                     <div className="space-y-3 max-h-96 overflow-y-auto">
//                                         {selectedSlot.slotData.appointments.map((appointment, index) => (
//                                             <div
//                                                 key={appointment.appointmentId}
//                                                 className={`p-4 rounded-lg border-2 ${index === 0 ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700' :
//                                                     'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
//                                                     }`}
//                                             >
//                                                 {index === 0 && (
//                                                     <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-2">
//                                                         📌 Ưu tiên cao nhất
//                                                     </div>
//                                                 )}

//                                                 <div className="space-y-2 text-sm">
//                                                     <div className="flex items-center justify-between">
//                                                         <span><strong>Thành viên:</strong> {appointment.clientName}</span>
//                                                         <Badge className={`${statusColors[appointment.status as keyof typeof statusColors]} text-xs`}>
//                                                             {appointment.status === 'confirmed' && 'Đã xác nhận'}
//                                                             {appointment.status === 'scheduled' && 'Chờ xác nhận'}
//                                                             {appointment.status === 'cancelled' && 'Đã hủy'}
//                                                             {appointment.status === 'completed' && 'Đã hoàn thành'}
//                                                             {appointment.status === 'missed' && 'Đã bỏ lỡ'}
//                                                         </Badge>
//                                                     </div>
//                                                     <div><strong>Phương thức:</strong> {appointment.method === 'phone' ? 'Điện thoại' : 'Trực tiếp'}</div>
//                                                     {appointment.notes && (
//                                                         <div><strong>Ghi chú:</strong> {appointment.notes}</div>
//                                                     )}
//                                                     <div className="text-xs text-slate-500 dark:text-slate-400">
//                                                         <strong>ID:</strong> {appointment.appointmentId}
//                                                     </div>
//                                                 </div>

//                                                 {/* Action buttons for each appointment */}
//                                                 <div className="flex space-x-2 mt-3">
//                                                     <Button size="sm" variant="outline" className="text-xs">
//                                                         <Edit className="w-3 h-3 mr-1" />
//                                                         Sửa
//                                                     </Button>
//                                                     {appointment.status === 'confirmed' && (
//                                                         <Button size="sm" variant="outline" className="text-xs">
//                                                             <CheckCircle2 className="w-3 h-3 mr-1" />
//                                                             Hoàn thành
//                                                         </Button>
//                                                     )}
//                                                     {appointment.status !== 'cancelled' && (
//                                                         <Button size="sm" variant="outline" className="text-xs">
//                                                             <X className="w-3 h-3 mr-1" />
//                                                             Hủy
//                                                         </Button>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>

//                                     <div className="flex space-x-2 pt-4 border-t border-slate-200 dark:border-slate-700">
//                                         <Button size="sm" variant="outline">
//                                             <UserPlus className="w-4 h-4 mr-1" />
//                                             Thêm lịch hẹn
//                                         </Button>
//                                         <Button size="sm" variant="outline">
//                                             <Trash2 className="w-4 h-4 mr-1" />
//                                             Hủy đăng ký slot
//                                         </Button>
//                                     </div>
//                                 </div>
//                             ) : selectedSlot.slotData ? (
//                                 <div className="space-y-3">
//                                     <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
//                                         <p className="text-sm text-emerald-700 dark:text-emerald-300">
//                                             Slot này đã được đăng ký và sẵn sàng nhận lịch hẹn từ thành viên.
//                                         </p>
//                                     </div>

//                                     <div className="flex space-x-2">
//                                         <Button size="sm" variant="outline">
//                                             <UserPlus className="w-4 h-4 mr-1" />
//                                             Tạo lịch hẹn
//                                         </Button>
//                                         <Button size="sm" variant="outline">
//                                             <Trash2 className="w-4 h-4 mr-1" />
//                                             Hủy đăng ký
//                                         </Button>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <div className="space-y-3">
//                                     <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
//                                         <p className="text-sm text-slate-600 dark:text-slate-400">
//                                             Slot này chưa được đăng ký. Đăng ký để có thể nhận lịch hẹn từ thành viên.
//                                         </p>
//                                     </div>

//                                     <Button size="sm" className="w-full">
//                                         <Plus className="w-4 h-4 mr-1" />
//                                         Đăng ký Slot
//                                     </Button>
//                                 </div>
//                             )}
//                         </div>
//                     </DialogContent>
//                 </Dialog>
//             )}{/* Registration Dialog */}
//             <RegistrationDialog
//                 isOpen={isRegistrationOpen}
//                 onClose={() => setIsRegistrationOpen(false)}
//                 onSuccess={handleRegistrationSuccess}
//                 timeSlots={timeSlots}
//                 registerSlots={registerSlots}
//             />
//         </div>
//     )
// }