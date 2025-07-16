"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Minus, Plus } from "lucide-react"
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
import { toast } from "react-toastify"
import { getVietnameseTranslation } from "@/utils/enumTranslations"

interface DiaryInputModalProps {
    isOpen: boolean
    onClose: () => void
    onRecordSuccess: () => void
    editingRecord?: DailySummaryResponse | null
}

const moodOptions: Mood[] = [
    "HAPPY", "RELAXED", "EXCITED", "STRESSED", "ANXIOUS", "ANGRY", "SAD",
    "BORED", "ANNOYED", "DEPRESSED", "DISSAPOINTED", "DISCOURAGED",
    "DOWN", "FRUSTATED", "HUNGRY", "LONELY", "TIRED", "UNCOMFORTABLE",
    "UNHAPPY", "UNSATISFIED", "UPSET", "WORRIED", "OTHER"
];

export function DiaryInputModal({
    isOpen,
    onClose,
    onRecordSuccess,
    editingRecord = null
}: DiaryInputModalProps) {
    const [totalSmokedCount, setTotalSmokedCount] = useState(0)
    const [totalCravingCount, setTotalCravingCount] = useState(0)
    const [selectedMood, setSelectedMood] = useState<Mood | undefined>(undefined)
    const [note, setNote] = useState("")
    const [showAllMoods, setShowAllMoods] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    // Check if we're in edit mode
    const isEditMode = editingRecord !== null

    useEffect(() => {
        if (formError) {
            const timer = setTimeout(() => setFormError(null), 3000)
            return () => clearTimeout(timer)
        }
    }, [formError])

    // Effect to populate data when in edit mode
    useEffect(() => {
        if (isEditMode && editingRecord) {
            setTotalSmokedCount(editingRecord.totalSmokedCount || 0)
            setTotalCravingCount(editingRecord.totalCravingCount || 0)
            setSelectedMood(editingRecord.mood || undefined)
            setNote(editingRecord.note || "")
        }
    }, [isEditMode, editingRecord])

    useEffect(() => {
        if (!isOpen) {
            setTotalSmokedCount(0)
            setTotalCravingCount(0)
            setSelectedMood(undefined)
            setNote("")
            setShowAllMoods(false)
            setFormError(null)
            setIsSubmitting(false)
            setShowDeleteConfirm(false)
        }
    }, [isOpen])

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
        if (totalSmokedCount === 0 && totalCravingCount === 0) {
            setFormError("Không thể lưu vì bạn chưa ghi nhận SỐ ĐIẾU ĐÃ HÚT hay số lần THÈM THUỐC")
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
                // Create new record
                const requestData: DailySummaryCreateRequest = {
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
                            {/* Số lượng hút và thèm thuốc */}
                            <div className="flex items-center justify-center gap-10 mb-6">
                                <div>
                                    <Label className="text-sm font-medium text-slate-900">Tổng Số Điếu Đã Hút</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="outline"
                                            className="bg-red-400 hover:bg-red-500 text-white hover:text-white"
                                            onClick={() => setTotalSmokedCount(Math.max(0, totalSmokedCount - 1))}
                                            disabled={isSubmitting}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </Button>
                                        <span className="px-3 py-1 bg-white rounded border min-w-[3rem] text-md font-medium text-center">
                                            {totalSmokedCount}
                                        </span>
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="outline"
                                            className="bg-red-400 hover:bg-red-500 text-white hover:text-white"
                                            onClick={() => setTotalSmokedCount(Math.min(100, totalSmokedCount + 1))}
                                            disabled={isSubmitting}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <hr className="w-px h-16 bg-gray-300" />

                                <div>
                                    <Label className="text-sm font-medium text-slate-900">Tổng Lần Thèm Thuốc</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="outline"
                                            className="bg-orange-400 hover:bg-orange-500 text-white hover:text-white"
                                            onClick={() => setTotalCravingCount(Math.max(0, totalCravingCount - 1))}
                                            disabled={isSubmitting}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </Button>
                                        <span className="px-3 py-1 bg-white rounded border min-w-[3rem] text-md font-medium text-center">
                                            {totalCravingCount}
                                        </span>
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="outline"
                                            className="bg-orange-400 hover:bg-orange-500 text-white hover:text-white"
                                            onClick={() => setTotalCravingCount(Math.min(100, totalCravingCount + 1))}
                                            disabled={isSubmitting}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Tâm trạng */}
                            <div className="mb-6">
                                <Label className="text-sm font-medium text-slate-900">
                                    Tâm trạng hôm nay của bạn? (Tùy chọn)
                                </Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {(showAllMoods ? moodOptions : moodOptions.slice(0, 8)).map((mood) => {
                                        const isSelected = selectedMood === mood

                                        return (
                                            <Button
                                                key={mood}
                                                type="button"
                                                size="sm"
                                                className={cn(
                                                    "text-sm",
                                                    isSelected
                                                        ? "bg-blue-500 text-white hover:bg-blue-600"
                                                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                                                )}
                                                onClick={() => handleMoodToggle(mood)}
                                                disabled={isSubmitting}
                                            >
                                                {getVietnameseTranslation(mood)}
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
                                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                                    disabled={isSubmitting}
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
                                    Lưu ý: Sau khi xóa sẽ không thể khôi phục lại.
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
