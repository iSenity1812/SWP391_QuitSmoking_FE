import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import {
  quitPlanService,
  type QuitPlanResponseDTO,
} from "@/services/quitPlanService";
import { PlusCircle, Trophy } from "lucide-react";

interface CompletedPlanModalProps {
  isOpen: boolean;
  quitPlan: QuitPlanResponseDTO;
  onRefresh: () => void;
}

export function CompletedPlanModal({
  isOpen,
  quitPlan,
  onRefresh,
}: CompletedPlanModalProps) {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingAction, setProcessingAction] = useState<string>("");

  const handleStartNew = () => {
    setIsProcessing(true);
    setProcessingAction("start-new");
    navigate("/plan/create");
  };

  const handleContinueJourney = async () => {
    setIsProcessing(true);
    setProcessingAction("continue-journey");

    try {
      await quitPlanService.convertToImmediatePlan();
      onRefresh(); // Refresh the quit plan dashboard
    } catch (error) {
      console.error("Error converting to immediate plan:", error);
    } finally {
      setIsProcessing(false);
      setProcessingAction("");
    }
  };

  const modalContent = {
    title: "Chúc mừng! Bạn đã hoàn thành kế hoạch cai thuốc!",
    subtitle:
      "Đây là một thành tựu đáng tự hào! Bạn muốn tiếp tục hành trình như thế nào?",
    options: [
      {
        id: "continue-journey",
        icon: <Trophy className="w-6 h-6" />,
        title: "Tiếp tục hành trình hiện tại",
        description:
          "Chuyển sang kế hoạch dừng hẳn để duy trì thành quả và tiếp tục theo dõi tiến trình không hút thuốc",
        action: handleContinueJourney,
      },
      {
        id: "start-new",
        icon: <PlusCircle className="w-6 h-6" />,
        title: "Bắt đầu hành trình mới",
        description:
          "Tạo một kế hoạch cai thuốc hoàn toàn mới với mục tiêu và phương pháp khác",
        action: handleStartNew,
      },
    ],
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white backdrop-blur-xl rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl border border-green-200"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 text-center border-b border-green-200">
            <div className="text-3xl mb-2">🎉</div>
            <h2 className="text-lg font-bold text-green-800 mb-2">
              {modalContent.title}
            </h2>
            <p className="text-green-700 text-xs leading-relaxed">
              {modalContent.subtitle}
            </p>
          </div>

          {/* Options */}
          <div className="p-4 space-y-3 max-h-[50vh] overflow-y-auto">
            {modalContent.options.map((option) => (
              <motion.div
                key={option.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button
                  onClick={option.action}
                  disabled={isProcessing}
                  className="w-full p-3 h-auto bg-white hover:bg-green-50 border-2 border-green-200 hover:border-green-400 text-left transition-all duration-200 group"
                  variant="outline"
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className="text-green-600 group-hover:text-green-700 mt-1 flex-shrink-0">
                      {option.icon}
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-start gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-green-800 group-hover:text-green-700 text-md flex-shrink-0">
                          {option.title}
                        </h3>
                        {isProcessing && processingAction === option.id && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "linear",
                            }}
                            className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full flex-shrink-0"
                          />
                        )}
                      </div>
                      <p className="text-xs text-green-700 leading-relaxed break-words whitespace-normal overflow-hidden">
                        {option.description}
                      </p>
                    </div>
                    <div className="text-green-600 group-hover:text-green-700 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2">
                      →
                    </div>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 text-center border-t border-green-200">
            <p className="text-xs text-green-700">
              Bạn đã làm được điều tuyệt vời! Hãy tiếp tục duy trì thành quả
              này! 🌟
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
