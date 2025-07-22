"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Minus, Plus, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
    dailySummaryService,
    type DailySummaryCreateRequest,
    type DailySummaryUpdateRequest,
    type DailySummaryResponse,
    type Mood
} from "@/services/dailySummaryService"
import type { QuitPlanResponseDTO } from "@/services/quitPlanService"
import { toast } from "react-toastify"
import { getVietnameseTranslation } from "@/utils/enumTranslations"

interface DiaryInputModalProps {
    isOpen: boolean
    onClose: () => void
    onRecordSuccess: () => void
    quitPlan: QuitPlanResponseDTO
    editingRecord?: DailySummaryResponse | null
}

const moodOptions: Mood[] = [
    "HAPPY", "RELAXED", "EXCITED", "STRESSED", "ANXIOUS", "ANGRY", "SAD", "BORED",
    "ANNOYED", "DEPRESSED", "DISSAPOINTED", "DISCOURAGED",
    "DOWN", "FRUSTATED", "HUNGRY", "LONELY", "TIRED", "UNCOMFORTABLE",
    "UNHAPPY", "UNSATISFIED", "UPSET", "WORRIED", "OTHER"
];

export function DiaryInputModal({
    isOpen,
    onClose,
    onRecordSuccess,
    quitPlan,
    editingRecord = null
}: DiaryInputModalProps) {
    const [totalSmokedCount, setTotalSmokedCount] = useState(0)
    const [totalCravingCount, setTotalCravingCount] = useState(0)
    const [selectedMood, setSelectedMood] = useState<Mood | undefined>(undefined)
    const [note, setNote] = useState("")
    const [trackDate, setTrackDate] = useState(() => new Date().toISOString().split('T')[0]) // Initialize with today's date
    const [showAllMoods, setShowAllMoods] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    // Check if we're in edit mode
    const isEditMode = editingRecord !== null

    // Date calculations
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format

    // Fix timezone issue: extract only the date part from LocalDateTime string  
    const minDate = quitPlan.startDate ? quitPlan.startDate.split('T')[0] : today
    const maxDate = today
    const isToday = trackDate === today

    // Validation helpers
    const isSmokedCountValid = totalSmokedCount >= 0 && totalSmokedCount <= 100
    const isCravingCountValid = totalCravingCount >= 0 && totalCravingCount <= 100
    // Only check if both values are 0 on submit, not for real-time validation
    const isFormValid = isSmokedCountValid && isCravingCountValid

    useEffect(() => {
        if (formError) {
            const timer = setTimeout(() => setFormError(null), 3000)
            return () => clearTimeout(timer)
        }
    }, [formError])

    // Effect to populate data when in edit mode or when modal opens
    useEffect(() => {
        if (isOpen) {
            if (isEditMode && editingRecord) {
                // Load data from existing record
                setTotalSmokedCount(editingRecord.totalSmokedCount || 0)
                setTotalCravingCount(editingRecord.totalCravingCount || 0)
                setSelectedMood(editingRecord.mood || undefined)
                setNote(editingRecord.note || "")
                setTrackDate(editingRecord.trackDate || today)
            } else {
                // Create mode: reset to default values
                setTotalSmokedCount(0)
                setTotalCravingCount(0)
                setSelectedMood(undefined)
                setNote("")
                setTrackDate(today)
            }
        }
    }, [isOpen, isEditMode, editingRecord, today])

    // Effect to ensure trackDate is always set when modal opens
    useEffect(() => {
        if (isOpen && !trackDate) {
            setTrackDate(today)
        }
    }, [isOpen, trackDate, today])

    useEffect(() => {
        if (!isOpen) {
            // Only reset form when modal closes in CREATE mode
            // In EDIT mode, keep the existing record data
            if (!isEditMode) {
                setTotalSmokedCount(0)
                setTotalCravingCount(0)
                setSelectedMood(undefined)
                setNote("")
                setTrackDate(today)
            }
            // Always reset UI states
            setShowAllMoods(false)
            setFormError(null)
            setIsSubmitting(false)
            setShowDeleteConfirm(false)
        }
    }, [isOpen, today, isEditMode])

    // Hàm xử lý chọn/bỏ chọn tâm trạng
    const handleMoodToggle = (mood: Mood) => {
        setSelectedMood(prev => (prev === mood ? undefined : mood))
    }

    const handleDelete = async () => {
        if (!isEditMode || !editingRecord) return

        setIsSubmitting(true)
        try {
            await dailySummaryService.deleteDailySummary(editingRecord.dailySummaryId)
            onRecordSuccess() // Gọi callback khi thành công
            onClose() // Đóng modal
            toast.success("Đã xóa nhật ký thành công")
        } catch (error) {
            console.error("Failed to delete daily summary:", error)
            toast.error("Không thể xóa nhật ký. Vui lòng thử lại sau")
        } finally {
            setIsSubmitting(false)
            setShowDeleteConfirm(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validation: Date must be valid
        if (!trackDate) {
            setFormError("Vui lòng chọn ngày theo dõi")
            return
        }

        // Validation: Date must be within allowed range
        if (trackDate < minDate || trackDate > maxDate) {
            setFormError("Ngày theo dõi phải nằm trong khoảng từ ngày bắt đầu kế hoạch đến hôm nay")
            return
        }

        // Validation: Both values cannot be 0
        if (totalSmokedCount === 0 && totalCravingCount === 0) {
            setFormError("Không thể lưu ghi nhận, vì các dữ liệu cần thiết đều là 0")
            return
        }

        // Validation: Values must be between 0-100
        if (totalSmokedCount < 0 || totalSmokedCount > 100) {
            setFormError("Tổng số điếu đã hút phải từ 0 đến 100")
            return
        }

        if (totalCravingCount < 0 || totalCravingCount > 100) {
            setFormError("Tổng số lần thèm thuốc phải từ 0 đến 100")
            return
        }

        setIsSubmitting(true)
        try {
            if (isEditMode && editingRecord) {
                // Update existing record
                const updateData: DailySummaryUpdateRequest = {
                    updateSmokedCount: totalSmokedCount,
                    updateCravingCount: totalCravingCount,
                    mood: selectedMood,
                    note: note.trim() || undefined,
                }

                const result = await dailySummaryService.updateDailySummary(editingRecord.dailySummaryId, updateData)

                // Check if the record was deleted (when values are 0)
                if (result === null) {
                    toast.success("Nhật ký đã được xóa do tất cả giá trị bằng 0")
                } else {
                    toast.success("Đã cập nhật nhật ký thành công")
                }
            } else {
                // Create new record - use the selected trackDate
                const requestData: DailySummaryCreateRequest = {
                    trackDate,
                    totalSmokedCount,
                    totalCravingCount,
                    mood: selectedMood,
                    note: note.trim() || undefined,
                }

                await dailySummaryService.createDailySummary(requestData)
                toast.success("Đã tạo nhật ký thành công")
            }

            onRecordSuccess() // Gọi callback khi thành công
            onClose() // Đóng modal
        } catch (error) {
            console.error("Failed to save daily summary:", error)
            toast.error("Không thể lưu nhật ký. Vui lòng thử lại sau")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-white rounded-2xl p-7 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800">
                                {isEditMode ? "✏️ Chỉnh Sửa Nhật Ký" : "📝 Ghi Nhận Nhật Ký Hôm Nay"}
                            </h2>
                            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-500 hover:text-gray-700">
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* Date Picker Field - Only show in create mode */}
                            {!isEditMode && (
                                <div className="mb-6">
                                    <label className="text-sm font-medium text-slate-900 block mb-2">
                                        Ghi nhận cho ngày
                                    </label>

                                    <div className="relative">
                                        {/* Calendar icon bên trái */}
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                                        {/* Badge Hôm nay bên phải trong input */}
                                        {isToday && (
                                            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 -translate-x-12 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 pointer-events-none">
                                                Hôm nay
                                            </span>
                                        )}
                                        <input
                                            key={`date-input-${isEditMode ? 'edit' : 'create'}-${trackDate}`}
                                            type="date"
                                            value={trackDate || today}
                                            onChange={(e) => setTrackDate(e.target.value)}
                                            min={minDate}
                                            max={maxDate}
                                            className="w-full py-2 pl-10 pr-5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />

                                    </div>
                                </div>
                            )}

                            {/* Số lượng hút và thèm thuốc */}
                            <div className="flex items-center justify-center gap-10 mb-6">
                                <div>
                                    <Label className="text-sm font-medium text-slate-900">Tổng Số Điếu Đã Hút</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="outline"
                                            className="bg-emerald-400 hover:bg-emerald-500 text-white"
                                            onClick={() => setTotalSmokedCount(Math.max(0, totalSmokedCount - 1))}
                                            disabled={isSubmitting}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </Button>
                                        <span className={cn(
                                            "px-3 py-1 bg-white rounded border min-w-[3rem] text-md font-medium text-center",
                                            !isSmokedCountValid ? "border-red-300 text-red-600" : "border-gray-300"
                                        )}>
                                            {totalSmokedCount}
                                        </span>
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="outline"
                                            className="bg-emerald-400 hover:bg-emerald-500 text-white"
                                            onClick={() => setTotalSmokedCount(Math.min(100, totalSmokedCount + 1))}
                                            disabled={isSubmitting}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    {!isSmokedCountValid && (
                                        <p className="text-xs text-red-500 mt-1">Giá trị phải từ 0 đến 100</p>
                                    )}
                                </div>

                                <hr className="w-px h-16 bg-gray-300" />

                                <div>
                                    <Label className="text-sm font-medium text-slate-900">Tổng Lần Thèm Thuốc</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="outline"
                                            className="bg-emerald-400 hover:bg-emerald-500 text-white"
                                            onClick={() => setTotalCravingCount(Math.max(0, totalCravingCount - 1))}
                                            disabled={isSubmitting}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </Button>
                                        <span className={cn(
                                            "px-3 py-1 bg-white rounded border min-w-[3rem] text-md font-medium text-center",
                                            !isCravingCountValid ? "border-red-300 text-red-600" : "border-gray-300"
                                        )}>
                                            {totalCravingCount}
                                        </span>
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="outline"
                                            className="bg-emerald-400 hover:bg-emerald-500 text-white"
                                            onClick={() => setTotalCravingCount(Math.min(100, totalCravingCount + 1))}
                                            disabled={isSubmitting}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    {!isCravingCountValid && (
                                        <p className="text-xs text-red-500 mt-1">Giá trị phải từ 0 đến 100</p>
                                    )}
                                </div>
                            </div>

                            {/* Real-time validation messages */}
                            {(!isSmokedCountValid || !isCravingCountValid) && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="text-sm text-red-600 space-y-1">
                                        {!isSmokedCountValid && (
                                            <div>• Tổng số điếu đã hút phải từ 0 đến 100</div>
                                        )}
                                        {!isCravingCountValid && (
                                            <div>• Tổng số lần thèm thuốc phải từ 0 đến 100</div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Tâm trạng */}
                            <div className="mb-6">
                                <Label className="text-sm font-medium text-slate-900">
                                    Tâm trạng hôm nay của bạn? (Tùy chọn)
                                </Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {(showAllMoods ? moodOptions : moodOptions.slice(0, 8)).map((mood) => {
                                        const isSelected = selectedMood === mood
                                        const translatedText = getVietnameseTranslation(mood)

                                        return (
                                            <Button
                                                key={mood}
                                                type="button"
                                                size="sm"
                                                className={cn(
                                                    "text-sm",
                                                    isSelected
                                                        ? "bg-emerald-500 text-white hover:bg-emerald-600"
                                                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                                                )}
                                                onClick={() => handleMoodToggle(mood)}
                                                disabled={isSubmitting}
                                            >
                                                {translatedText}
                                            </Button>
                                        )
                                    })}
                                    {moodOptions.length > 8 && (
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setShowAllMoods(!showAllMoods)}
                                            disabled={isSubmitting}
                                        >
                                            {showAllMoods ? "Ẩn bớt" : "Hiển thị thêm"}
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Ghi chú */}
                            <div className="mb-6">
                                <Label className="text-sm font-medium text-slate-900">
                                    Ghi chú thêm (Tùy chọn)
                                </Label>
                                <Textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Ghi lại cảm nghĩ, trải nghiệm của bạn trong ngày hôm nay..."
                                    className="mt-2 resize-none"
                                    rows={3}
                                    maxLength={500}
                                    disabled={isSubmitting}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {note.length}/500 ký tự
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-4">
                                {isEditMode ? (
                                    <>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={() => setShowDeleteConfirm(true)}
                                            className="flex-1"
                                            disabled={isSubmitting}
                                        >
                                            Xóa Nhật Ký
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={onClose}
                                        className="flex-1 bg-transparent"
                                        disabled={isSubmitting}
                                    >
                                        Hủy Ghi Nhận
                                    </Button>
                                )}
                                <Button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isSubmitting || !isFormValid}
                                >
                                    {isSubmitting ? "Đang xử lý..." : (isEditMode ? "Cập Nhật" : "Lưu Nhật Ký")}
                                </Button>
                            </div>

                            {formError && (
                                <div className="text-sm text-red-600 mt-3 text-center">
                                    {formError}
                                </div>
                            )}

                            <div className="text-center text-sm text-gray-500 pt-3">
                                Hãy ghi nhận hành trình của bạn để theo dõi tiến bộ mỗi ngày
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <motion.div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowDeleteConfirm(false)}
                >
                    <motion.div
                        className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-center">
                            <div className="text-red-500 text-4xl mb-4">🗑️</div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">
                                Xác nhận xóa nhật ký
                            </h3>
                            <p className="text-sm text-gray-600 mb-6">
                                Bạn có chắc chắn muốn xóa nhật ký này không?
                                <br />
                                <span className="text-red-500 font-medium">
                                    Lưu ý: Record này sẽ mất vĩnh viễn và không thể khôi phục lại.
                                </span>
                            </p>

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1"
                                    disabled={isSubmitting}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={handleDelete}
                                    className="flex-1"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Đang xóa..." : "Xóa"}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
