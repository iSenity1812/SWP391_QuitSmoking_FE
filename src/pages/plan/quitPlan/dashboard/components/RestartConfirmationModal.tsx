import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RestartConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    isRestarting: boolean
    restartSuccess: boolean
}

export function RestartConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    isRestarting,
    restartSuccess
}: RestartConfirmationModalProps) {
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
                        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-center">
                            {restartSuccess ? (
                                // Success state
                                <>
                                    <div className="text-green-500 text-4xl mb-4">✅</div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                                        Đã từ bỏ kế hoạch thành công!
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-6">
                                        Đang chuyển hướng về trang tạo kế hoạch mới...
                                    </p>
                                    <div className="flex justify-center">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                            className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full"
                                        />
                                    </div>
                                </>
                            ) : (
                                // Confirmation state
                                <>
                                    <div className="text-orange-500 text-4xl mb-4">⚠️</div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                                        Xác nhận khởi động lại kế hoạch
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-6">
                                        Bạn có chắc chắn muốn thực hiện lại với kế hoạch mới không?
                                        <br />
                                        <span className="text-red-500 font-medium">
                                            Lưu ý: Khi xác nhận sẽ không thể quay lại kế hoạch hiện tại
                                        </span>
                                    </p>

                                    <div className="flex gap-3">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={onClose}
                                            className="flex-1"
                                            disabled={isRestarting || restartSuccess}
                                        >
                                            Hủy
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={onConfirm}
                                            className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                                            disabled={isRestarting || restartSuccess}
                                        >
                                            {isRestarting ? (
                                                <>
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                                                    />
                                                    Đang xử lý...
                                                </>
                                            ) : (
                                                <>
                                                    <AlertTriangle className="w-4 h-4 mr-2" />
                                                    Xác nhận
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
