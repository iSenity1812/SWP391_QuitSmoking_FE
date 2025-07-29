import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import {
  quitPlanService,
  type QuitPlanResponseDTO,
} from "@/services/quitPlanService";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle2, Calendar, Users, PlusCircle } from "lucide-react";

interface FailedPlanModalProps {
  isOpen: boolean;
  quitPlan: QuitPlanResponseDTO;
  onRefresh: () => void;
}

export function FailedPlanModal({
  isOpen,
  quitPlan,
  onRefresh,
}: FailedPlanModalProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingAction, setProcessingAction] = useState<string>("");

  const isImmediate = quitPlan.reductionType === "IMMEDIATE";
  const isPremiumMember = user?.role === "PREMIUM_MEMBER";

  const handleGetHelp = async () => {
    setIsProcessing(true);
    setProcessingAction("get-help");

    try {
      // For IMMEDIATE plans, reset status before navigating
      if (isImmediate) {
        await quitPlanService.resetQuitPlanStatus(quitPlan.quitPlanId);
      }

      // Navigate based on membership
      if (isPremiumMember) {
        navigate("/booking");
      } else {
        navigate("/subscription");
      }
    } catch (error) {
      console.error("Error getting help:", error);
      setIsProcessing(false);
      setProcessingAction("");
    }
  };

  const handleChangeStartDate = async () => {
    setIsProcessing(true);
    setProcessingAction("change-date");

    try {
      await quitPlanService.resetQuitPlanStatusByChangeStartDate(
        quitPlan.quitPlanId
      );
      onRefresh();
    } catch (error) {
      console.error("Error changing start date:", error);
    } finally {
      setIsProcessing(false);
      setProcessingAction("");
    }
  };

  const handleKeepJourney = async () => {
    setIsProcessing(true);
    setProcessingAction("keep-journey");

    try {
      await quitPlanService.resetQuitPlanStatus(quitPlan.quitPlanId);
      onRefresh();
    } catch (error) {
      console.error("Error keeping journey:", error);
    } finally {
      setIsProcessing(false);
      setProcessingAction("");
    }
  };

  const handleStartNew = () => {
    setIsProcessing(true);
    setProcessingAction("start-new");
    navigate("/plan/create");
  };

  const getModalContent = () => {
    if (isImmediate) {
      return {
        title: "Bạn đã hút thuốc?",
        subtitle:
          "Không sao, đó là một phần của quá trình. Bạn muốn làm gì tiếp theo?",
        options: [
          {
            id: "get-help",
            icon: <Users className="w-6 h-6" />,
            title: "Trò chuyện với các cố vấn",
            description:
              "Họ sẽ nhiệt tình hỗ trợ bạn và có thể giúp bạn quay trở lại đúng hướng",
            action: handleGetHelp,
          },
          {
            id: "change-date",
            icon: <Calendar className="w-6 h-6" />,
            title: "Khởi động lại",
            description:
              "Bắt đầu lại hành trình - bộ đếm thời gian sẽ thay đổi, nhưng nhật ký của bạn sẽ được giữ lại",
            action: handleChangeStartDate,
          },
          {
            id: "keep-journey",
            icon: <CheckCircle2 className="w-6 h-6" />,
            title: "Tiếp tục hành trình",
            description:
              "Xem đây như một trở ngại nhỏ. Một điều gì đó để học hỏi và tiếp tục hành trình của bạn",
            action: handleKeepJourney,
          },
          {
            id: "start-new",
            icon: <PlusCircle className="w-6 h-6" />,
            title: "Hành trình mới",
            description:
              "Tạo một kế hoạch cai thuốc hoàn toàn mới và bắt đầu lại từ đầu, kể cả nhật ký của bạn",
            action: handleStartNew,
          },
        ],
      };
    }

    // For gradual plans
    return {
      title: "Bạn đã không hoàn thành kế hoạch cai thuốc này",
      subtitle:
        "Đừng thất vọng, việc cai thuốc thật sự rất khó khăn. Hãy lựa chọn hướng đi tiếp theo cho hành trình của bạn!",
      options: [
        {
          id: "get-help",
          icon: <Users className="w-6 h-6" />,
          title: "Nhận sự tư vấn từ chuyên gia",
          description:
            "Kết nối với các chuyên gia của chúng tôi, những người có chuyên môn trong lĩnh vực cai thuốc",
          action: handleGetHelp,
        },
        {
          id: "start-new",
          icon: <PlusCircle className="w-6 h-6" />,
          title: "Bắt đầu hành trình mới",
          description:
            "Tạo một kế hoạch mới với các điều chỉnh phù hợp hơn với tình trạng hút thuốc hiện tại của bạn",
          action: handleStartNew,
        },
      ],
    };
  };

  const content = getModalContent();

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
          className="bg-white backdrop-blur-xl rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl border border-emerald-200"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 text-center border-b border-emerald-200">
            <div className="text-3xl mb-2">💔</div>
            <h2 className="text-lg font-bold text-emerald-800 mb-2">
              {content.title}
            </h2>
            <p className="text-emerald-700 text-xs leading-relaxed">
              {content.subtitle}
            </p>
          </div>

          {/* Options */}
          <div className="p-4 space-y-3 max-h-[50vh] overflow-y-auto">
            {content.options.map((option) => (
              <motion.div
                key={option.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button
                  onClick={option.action}
                  disabled={isProcessing}
                  className="w-full p-3 h-auto bg-white hover:bg-emerald-50 border-2 border-emerald-200 hover:border-emerald-400 text-left transition-all duration-200 group"
                  variant="outline"
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className="text-emerald-600 group-hover:text-emerald-700 mt-1 flex-shrink-0">
                      {option.icon}
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-start gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-emerald-800 group-hover:text-emerald-700 text-md flex-shrink-0">
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
                            className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full flex-shrink-0"
                          />
                        )}
                      </div>
                      <p className="text-xs text-emerald-700 leading-relaxed break-words whitespace-normal overflow-hidden">
                        {option.description}
                      </p>
                    </div>
                    <div className="text-emerald-600 group-hover:text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2">
                      →
                    </div>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-5 text-center border-t border-emerald-200">
            <p className="text-xs text-emerald-700">
              Hãy nhớ rằng: Lùi một bước để đi thêm vạn bước! 💪
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
