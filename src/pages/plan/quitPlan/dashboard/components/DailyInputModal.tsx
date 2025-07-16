"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { cravingTrackingService, type CravingTrackingCreateRequest, type Situation, type WithWhom, type CravingTrackingResponse, type CravingTrackingUpdateRequest } from "@/services/cravingTrackingService"
import { toast } from "react-toastify"
import { getVietnameseTranslation } from "@/utils/enumTranslations"

interface DailyInputModalProps {
  isOpen: boolean
  onClose: () => void
  planType: string
  onRecordSuccess: () => void
  editingRecord?: CravingTrackingResponse | null
}

const situationOptions: Situation[] = [
  "AFTER_SEX", "AT_BAR", "AT_PARTY", "AT_EVENT", "WORKING", "BBQ", "DRIVING", "WATCHING_TV",
  "ON_PHONE", "ON_COMPUTER", "CANT_SLEEP", "CHATITNG", "CLEANING", "COOKING", "DRINKING",
  "SITTING_ON_CAR", "GAMING", "THINKING", "GOING_TO_BED", "HAIVNG_A_BREAK", "JUST_EATEN",
  "READING", "SHOPPING", "RELAXING", "WALKING", "WAITING", "SOCIALIZING", "WAKING_UP",
  "WORK_BREAK", "OTHER"
];

const withWhomOptions: WithWhom[] = [
  "ALONE", "CLOSE_FRIEND", "FAMILY_MEMBER", "PARTNER", "COLLEAGUE", "STRANGER", "OTHER"
];

export function DailyInputModal({
  isOpen,
  onClose,
  onRecordSuccess,
  planType,
  editingRecord = null
}: DailyInputModalProps) {
  const [cigarettesSmoked, setCigarettesSmoked] = useState(0)
  const [cravingCount, setCravingCount] = useState(0)
  const [selectedSituation, setSelectedSituation] = useState<Situation | undefined>(undefined);
  const [selectedWithWhom, setSelectedWithWhom] = useState<WithWhom | undefined>(undefined);
  // For edit mode - multiple selections
  const [selectedSituations, setSelectedSituations] = useState<Situation[]>([]);
  const [selectedWithWhoms, setSelectedWithWhoms] = useState<WithWhom[]>([]);
  const [showAllSituations, setShowAllSituations] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Check if we're in edit mode
  const isEditMode = editingRecord !== null;

  useEffect(() => {
    if (formError) {
      const timer = setTimeout(() => setFormError(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [formError])

  // Effect to populate data when in edit mode
  useEffect(() => {
    if (isEditMode && editingRecord) {
      setCigarettesSmoked(editingRecord.smokedCount || 0);
      setCravingCount(editingRecord.cravingsCount || 0);
      setSelectedSituations(editingRecord.situations || []);
      setSelectedWithWhoms(editingRecord.withWhoms || []);
      // Clear single selections for edit mode
      setSelectedSituation(undefined);
      setSelectedWithWhom(undefined);
    }
  }, [isEditMode, editingRecord]);

  useEffect(() => {
    if (!isOpen) {
      setCigarettesSmoked(0)
      setCravingCount(0)
      setSelectedSituation(undefined)
      setSelectedWithWhom(undefined)
      setSelectedSituations([])
      setSelectedWithWhoms([])
      setShowAllSituations(false)
      setFormError(null)
      setIsSubmitting(false)
      setShowDeleteConfirm(false)
    }
  }, [isOpen])

  // Hàm xử lý chọn/bỏ chọn tình huống
  const handleSituationToggle = (situation: Situation) => {
    if (isEditMode) {
      // Edit mode: multiple selections (max 5)
      setSelectedSituations(prev => {
        if (prev.includes(situation)) {
          return prev.filter(s => s !== situation);
        } else if (prev.length < 5) {
          return [...prev, situation];
        }
        return prev; // Don't add if already at max
      });
    } else {
      // Create mode: single selection
      setSelectedSituation(prev => (prev === situation ? undefined : situation));
    }
  };

  // Hàm xử lý chọn/bỏ chọn người đi cùng
  const handleWithWhomToggle = (withWhom: WithWhom) => {
    if (isEditMode) {
      // Edit mode: multiple selections (max 5)
      setSelectedWithWhoms(prev => {
        if (prev.includes(withWhom)) {
          return prev.filter(w => w !== withWhom);
        } else if (prev.length < 5) {
          return [...prev, withWhom];
        }
        return prev; // Don't add if already at max
      });
    } else {
      // Create mode: single selection
      setSelectedWithWhom(prev => (prev === withWhom ? undefined : withWhom));
    }
  };

  const handleDelete = async () => {
    if (!isEditMode || !editingRecord) return;

    setIsSubmitting(true);
    try {
      await cravingTrackingService.deleteCravingTracking(editingRecord.cravingTrackingId);
      onRecordSuccess(); // Gọi callback khi thành công
      onClose(); // Đóng modal
      toast.success("Đã xóa ghi nhận thành công");
    } catch (error) {
      console.error("Failed to delete craving tracking record:", error);
      toast.error("Không thể xóa ghi nhận. Vui lòng thử lại sau");
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cigarettesSmoked === 0 && cravingCount === 0) {
      setFormError("Không thể lưu vì bạn chưa ghi nhận SỐ ĐIẾU ĐÃ HÚT hay số lần THÈM THUỐC");
      return;
    }

    console.log("Type of onRecordSuccess before call:", typeof onRecordSuccess);

    setIsSubmitting(true);
    try {
      if (isEditMode && editingRecord) {
        // Update existing record
        const updateData: CravingTrackingUpdateRequest = {
          smokedCount: cigarettesSmoked,
          cravingsCount: cravingCount,
          situations: selectedSituations.length > 0 ? selectedSituations : undefined,
          withWhoms: selectedWithWhoms.length > 0 ? selectedWithWhoms : undefined,
        };

        await cravingTrackingService.updateCravingTracking(editingRecord.cravingTrackingId, updateData);
      } else {
        // Create new record
        const requestData: CravingTrackingCreateRequest = {
          smokedCount: cigarettesSmoked,
          cravingsCount: cravingCount,
          situation: selectedSituation,
          withWhom: selectedWithWhom,
        };

        await cravingTrackingService.checkInCraving(requestData);
      }

      onRecordSuccess(); // Gọi callback khi thành công
      onClose(); // Đóng modal
    } catch (error) {
      console.error("Failed to save craving tracking record:", error);
      toast.error("Không thể lưu ghi nhận. Vui lòng thử lại sau");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div className="bg-white rounded-2xl p-7 w-full max-w-md shadow-2xl" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {isEditMode ? "✏️ Chỉnh Sửa Ghi Nhận" : "📝 Ghi Nhận Thông Tin"}
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="flex items-center justify-center gap-10">
                <div>
                  <Label className="text-sm font-medium text-slate-900">Số Điếu Bạn Đã Hút</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="bg-emerald-400 hover:bg-emerald-500 text-white hover:text-white"
                      onClick={() => setCigarettesSmoked(Math.max(0, cigarettesSmoked - 1))}
                      disabled={isSubmitting} // Disable button while submitting
                    ><Minus className="w-4 h-4" /></Button>
                    <span className="px-3 py-1 bg-white rounded border min-w-[3rem] text-md font-medium text-center">{cigarettesSmoked}</span>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="bg-emerald-400 hover:bg-emerald-500 text-white hover:text-white"
                      onClick={() => setCigarettesSmoked(Math.min(100, cigarettesSmoked + 1))}
                      disabled={isSubmitting} // Disable button while submitting
                    ><Plus className="w-4 h-4" /></Button>
                  </div>
                </div>
                <hr />
                <div>
                  <Label className="text-sm font-medium text-slate-900">Số Lần Thèm Thuốc</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="bg-emerald-400 hover:bg-emerald-500 text-white hover:text-white"
                      onClick={() => setCravingCount(Math.max(0, cravingCount - 1))}
                      disabled={isSubmitting} // Disable button while submitting
                    ><Minus className="w-4 h-4" />
                    </Button>
                    <span className="px-3 py-1 bg-white rounded border min-w-[3rem] text-md font-medium text-center">{cravingCount}</span>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="bg-emerald-400 hover:bg-emerald-500 text-white hover:text-white"
                      onClick={() => setCravingCount(Math.min(100, cravingCount + 1))}
                      disabled={isSubmitting} // Disable button while submitting
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Label className="text-sm font-medium text-slate-900">
                  Trong tình huống nào? {isEditMode && `(Tối đa 5 lựa chọn - đã chọn: ${selectedSituations.length})`}
                </Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(showAllSituations ? situationOptions : situationOptions.slice(0, 7)).map((opt) => {
                    const isSelected = isEditMode
                      ? selectedSituations.includes(opt)
                      : selectedSituation === opt;

                    return (
                      <Button
                        key={opt}
                        type="button"
                        size="sm"
                        className={cn(
                          "text-sm",
                          isSelected
                            ? "bg-emerald-400 text-white hover:bg-emerald-500"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                        )}
                        onClick={() => handleSituationToggle(opt)}
                        disabled={isSubmitting} // Disable button while submitting
                      >
                        {getVietnameseTranslation(opt)}
                      </Button>
                    );
                  })}
                  {situationOptions.length > 10 && (
                    <Button type="button" size="sm" variant="ghost" onClick={() => setShowAllSituations(!showAllSituations)}>
                      {showAllSituations ? "Ẩn bớt" : "Hiển thị thêm"}
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <Label className="text-sm font-medium text-slate-900">
                  Bạn đã với ai? {isEditMode && `(Tối đa 5 lựa chọn - đã chọn: ${selectedWithWhoms.length})`}
                </Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {withWhomOptions.map((opt) => {
                    const isSelected = isEditMode
                      ? selectedWithWhoms.includes(opt)
                      : selectedWithWhom === opt;

                    return (
                      <Button
                        key={opt}
                        type="button"
                        size="sm"
                        className={cn(
                          "text-sm",
                          isSelected
                            ? "bg-emerald-400 text-white hover:bg-emerald-500"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                        )}
                        onClick={() => handleWithWhomToggle(opt)}
                        disabled={isSubmitting} // Disable button while submitting
                      >
                        {getVietnameseTranslation(opt)}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-8">
                {isEditMode ? (
                  <>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      Xóa Ghi Nhận
                    </Button>
                    {/* <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                      Hủy
                    </Button> */}
                  </>
                ) : (
                  <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                    Hủy Ghi Nhận
                  </Button>
                )}
                <Button type="submit" className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                  {isEditMode ? "Cập Nhật" : "Lưu Ghi Nhận"}
                </Button>
              </div>

              {formError && (
                <div className="text-sm text-red-600 mt-3 text-center">
                  {formError}
                </div>
              )}
              <div className="text-center text-sm text-gray-500 pt-3">
                Hãy ghi nhận lại để bạn có thể theo dõi thực trạng rõ hơn
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
                Xác nhận xóa ghi nhận
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa ghi nhận này không?
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
    </AnimatePresence >
  )
}
