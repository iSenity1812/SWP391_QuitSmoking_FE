
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Star } from "lucide-react"
import { vnpayService, type CreatePaymentRequest } from "@/services/vnpayService"
import { toast } from "react-toastify"

interface PlanOption {
    id: string
    displayName?: string // Tên hiển thị tùy chọn, có thể không có
    name: string
    price: string
    originalPrice?: string
    duration: string
    description: string
    features: string[]
    popular?: boolean
    savings?: string
    amount: number
    planId?: number
}

const freePlan: PlanOption = {
    id: "free",
    displayName: "Miễn Phí",
    name: "Miễn Phí",
    price: "0 VNĐ",
    amount: 0,
    duration: "Vĩnh viễn",
    description: "Bắt đầu hành trình cai thuốc với các tính năng cơ bản",
    features: [
        "Theo dõi tiến trình cơ bản",
        "Tính toán tiền tiết cơ bản",
        "Lịch cai thuốc",
        "Thành tựu cơ bản",
        "Cộng đồng hỗ trợ",
    ],
}

const premiumFeatures = [
    "Tất cả tính năng miễn phí",
    "Tư vấn với chuyên gia",
    "Kế hoạch cá nhân hóa",
    "Theo dõi sức khỏe chi tiết",
    "Bài tập thở hướng dẫn",
    "Nhắc nhở thông minh",
    "Báo cáo tiến trình chi tiết",
    "Hỗ trợ 24/7",
    "Theo dõi cảm xúc",
];

const premiumPlans: PlanOption[] = [
    {
        id: "premium-2weeks",
        displayName: "Premium 2 tuần",
        name: "Premium 2 TUAN",
        price: "119,000 VNĐ",
        amount: 119000,
        planId: 1,
        duration: "14 ngày",
        description: "Trải nghiệm đầy đủ tính năng Premium",
        features: premiumFeatures,
    },
    {
        id: "premium-1month",
        displayName: "Premium 1 tháng",
        name: "Premium 1 THANG",
        price: "209,000 VNĐ",
        amount: 209000,
        planId: 2,
        originalPrice: "239,000 VNĐ",
        duration: "30 ngày",
        description: "Lựa chọn phổ biến nhất",
        popular: true,
        savings: "Tiết kiệm 30,000 VNĐ",
        features: premiumFeatures,
    },
    {
        id: "premium-3months",
        displayName: "Premium 3 tháng",
        name: "Premium 3 THANG",
        price: "499,000 VNĐ",
        amount: 499000,
        planId: 3,
        originalPrice: "569,000 VNĐ",
        duration: "90 ngày",
        description: "Giá trị tốt nhất cho hành trình dài hạn",
        savings: "Tiết kiệm 70,000 VNĐ",
        features: premiumFeatures,
    },
]

export default function SubscriptionPage() {
    const [selectedPremiumId, setSelectedPremiumId] = useState<string>(premiumPlans[1]?.id || premiumPlans[0].id) // Mặc định chọn gói phổ biến nhất
    const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false)

    // Tìm gói Premium đã chọn
    const selectedPremiumPlan = premiumPlans.find((plan) => plan.id === selectedPremiumId) || premiumPlans[0];
    // Handler cho các nút Premium ở dưới
    const handlePremiumSelect = (id: string) => {
        setSelectedPremiumId(id);
    };

    // Handler cho premium payment
    const handlePremiumPayment = async (plan: PlanOption) => {
        if (isProcessingPayment) return; // Tránh nhấn nhiều lần
        try {
            setIsProcessingPayment(true);

            // Prepare request thanh toán
            const paymentRequest: CreatePaymentRequest = {
                amount: plan.amount,
                orderInfo: `THANH TOAN GOI ${plan.name.toLocaleUpperCase()}`,
                orderType: "PLAN_SUBSCRIPTION",
                bankCode: "", // Hoặc ngân hàng khác nếu cần
                planId: plan.planId || 0, // Sử dụng planId nếu có, nếu không thì mặc định là 0
            };

            console.log("Yêu cầu thanh toán cho plan:", plan.name, paymentRequest);

            // Tao yêu cầu thanh toán
            const response = await vnpayService.createPayment(paymentRequest);
            console.log("Phản hồi từ VNPay:", response.data);

            // Chuyển hướng đến URL thanh toán
            if (response.data.paymentUrl) {
                toast.success("Đang chuyển hướng đến cổng thanh toán VNPay...", {
                    position: "top-right",
                    autoClose: 3000,
                });

                // Redirect đến URL thanh toán
                setTimeout(() => {
                    window.location.href = response.data.paymentUrl;
                }, 1000); // Chờ 1 giây trước khi chuyển hướng
            } else throw new Error("Không có URL thanh toán trong phản hồi VNPay");
        } catch (error: unknown) {
            console.error('Lỗi khi xử lý thanh toán:', error);
            const errorMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi khi xử lý thanh toán.";

            toast.error(`Không thể xử lý thanh toán: ${errorMessage}`, {
                position: "top-right",
                autoClose: 5000,
            });
        } finally {
            setIsProcessingPayment(false); // Reset trạng thái sau khi hoàn thành
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pt-20 flex flex-col justify-between">
            <div className="max-w-6xl mx-auto w-full flex flex-col gap-8 flex-1">
                {/* Section 1: Free Plan (Top Full-Width Block) */}
                <div className="mt-6 flex justify-center">
                    <Card className="border-2 border-gray-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 w-full">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-xl">{freePlan.displayName}</CardTitle>
                                    <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">{freePlan.description}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-emerald-600">{freePlan.price}</div>
                                    <div className="text-sm text-slate-500">{freePlan.duration}</div>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {freePlan.features.map((feature, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-emerald-500" />
                                            <span className="text-sm">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                <Button
                                    onClick={() => {
                                        toast.success("Bạn đã chọn gói miễn phí!");

                                        setTimeout(() => {
                                            window.location.href = "/profile";
                                        }, 1000); // Chờ 1 giây trước khi chuyển hướng
                                    }}
                                    className="w-full bg-emerald-500 hover:bg-emerald-600"
                                >
                                    Tiếp Tục Miễn Phí
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Section 2: Premium Plans (Large Central Block) */}
                <div className="flex-1 flex flex-col justify-center">
                    <Card className="border-2 border-emerald-400 dark:border-emerald-700 shadow-xl w-full">
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <Crown className="w-8 h-8 text-emerald-500" />
                                <CardTitle className="text-2xl">{selectedPremiumPlan.displayName}</CardTitle>
                                {selectedPremiumPlan.popular && (
                                    <Badge className="bg-emerald-500 text-white px-3 py-1 ml-2">
                                        <Star className="w-3 h-3 mr-1" /> Phổ biến nhất
                                    </Badge>
                                )}
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                <div className="text-slate-600 dark:text-slate-300 text-base">{selectedPremiumPlan.description}</div>
                                <div className="flex flex-col md:items-end">
                                    <div className="flex items-center gap-2">
                                        <span className="text-3xl font-bold text-emerald-600">{selectedPremiumPlan.price}</span>
                                        {selectedPremiumPlan.originalPrice && (
                                            <span className="text-base text-slate-500 line-through">{selectedPremiumPlan.originalPrice}</span>
                                        )}
                                    </div>
                                    <div className="text-sm text-slate-500">{selectedPremiumPlan.duration}</div>
                                    {selectedPremiumPlan.savings && (
                                        <Badge variant="secondary" className="mt-2 bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                                            {selectedPremiumPlan.savings}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {selectedPremiumPlan.features.map((feature, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                            <span className="text-sm">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                <Button
                                    onClick={() => handlePremiumPayment(selectedPremiumPlan)}
                                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                                    disabled={isProcessingPayment}
                                >
                                    {isProcessingPayment ? "Đang xử lý..." : "Chọn Gói Này"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Section 3, 4, 5: Bottom Row as Buttons */}
                <div className="flex flex-row gap-4 mt-8 w-full">
                    {premiumPlans.map((plan) => {
                        // Tính toán phần trăm giảm giá nếu có
                        let discountPercent = null;
                        if (plan.originalPrice && plan.price) {
                            const orig = parseInt(plan.originalPrice.replace(/[^\d]/g, ""));
                            const curr = parseInt(plan.price.replace(/[^\d]/g, ""));
                            if (orig > curr) {
                                discountPercent = Math.round(((orig - curr) / orig) * 100);
                            }
                        }
                        return (
                            <button
                                key={plan.id}
                                onClick={() => handlePremiumSelect(plan.id)}
                                className={`flex-1 rounded-xl border-2 px-6 py-4 flex flex-col items-center transition-all duration-200 cursor-pointer focus:outline-none
                                    ${selectedPremiumId === plan.id
                                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-lg scale-105"
                                        : "border-gray-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 bg-white dark:bg-slate-800"
                                    }`}
                                style={{ minWidth: 0 }}
                            >
                                <div className="font-semibold text-lg mb-1">{plan.displayName?.replace('Premium ', '')}</div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xl font-bold text-emerald-600">{plan.price}</span>
                                    {plan.originalPrice && (
                                        <span className="text-sm text-slate-500 line-through">{plan.originalPrice}</span>
                                    )}
                                </div>
                                {discountPercent && (
                                    <span className="text-xs text-orange-600 bg-orange-100 dark:bg-orange-900/30 rounded px-2 py-0.5 mb-1">Giảm {discountPercent}%</span>
                                )}
                                {plan.savings && (
                                    <span className="text-xs text-orange-700 dark:text-orange-300">{plan.savings}</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}
