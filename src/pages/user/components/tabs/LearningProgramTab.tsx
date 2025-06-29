"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Lightbulb,
    Heart,
    CheckCircle,
    TrendingUp,
    Clock,
    Users,
    ShieldCheck,
    Brain,
    Leaf,
    PiggyBank,
} from "lucide-react"
import { AnimatedSection } from "@/components/ui/AnimatedSection"

export function LearningProgramTab() {
    return (
        <AnimatedSection delay={0.2}>
            <div className="space-y-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Chương trình học tập</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                    Khám phá các tài nguyên chuyên sâu để giúp bạn bỏ thuốc lá, cải thiện sức khỏe và tiết kiệm tiền một cách hiệu
                    quả.
                </p>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Section 1: Why Quit Smoking? */}
                    <Card className="bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <Lightbulb className="h-8 w-8 text-emerald-500 mb-2" />
                            <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                                Tại sao nên bỏ thuốc lá?
                            </CardTitle>
                            <CardDescription className="text-slate-500 dark:text-slate-400">
                                Hiểu rõ lợi ích toàn diện của việc bỏ thuốc lá đối với sức khỏe, tài chính và cuộc sống của bạn.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-slate-700 dark:text-slate-300">
                            <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <Heart className="h-5 w-5 text-red-500" /> Lợi ích sức khỏe:
                                </h4>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>
                                        Giảm đáng kể nguy cơ mắc bệnh tim mạch, đột quỵ và ung thư (phổi, miệng, họng, thực quản, bàng
                                        quang, v.v.).
                                    </li>
                                    <li>Cải thiện chức năng phổi, giúp bạn thở dễ dàng hơn và tăng cường sức bền.</li>
                                    <li>Tăng cường hệ miễn dịch, giúp cơ thể chống lại bệnh tật tốt hơn.</li>
                                    <li>Cải thiện vị giác và khứu giác, giúp bạn thưởng thức đồ ăn ngon hơn.</li>
                                    <li>Làn da khỏe mạnh hơn, giảm nếp nhăn và làm chậm quá trình lão hóa.</li>
                                    <li>Giảm nguy cơ mắc các bệnh về răng miệng và hôi miệng.</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <PiggyBank className="h-5 w-5 text-green-500" /> Lợi ích tài chính:
                                </h4>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>
                                        Tiết kiệm hàng triệu đồng mỗi năm, số tiền này có thể dùng cho các mục tiêu khác như du lịch, đầu tư
                                        hoặc giáo dục.
                                    </li>
                                    <li>Giảm chi phí bảo hiểm y tế và các chi phí liên quan đến bệnh tật do hút thuốc.</li>
                                    <li>
                                        Tránh các khoản phạt hoặc chi phí làm sạch liên quan đến việc hút thuốc ở nơi công cộng hoặc tài
                                        sản.
                                    </li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <Users className="h-5 w-5 text-blue-500" /> Lợi ích xã hội và cá nhân:
                                </h4>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Bảo vệ những người thân yêu khỏi khói thuốc thụ động.</li>
                                    <li>Làm gương tốt cho con cái và những người xung quanh.</li>
                                    <li>Tăng cường sự tự tin và cảm giác kiểm soát cuộc sống.</li>
                                    <li>Cải thiện chất lượng cuộc sống tổng thể và tuổi thọ.</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Section 2: How to Quit Effectively */}
                    <Card className="bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <TrendingUp className="h-8 w-8 text-purple-500 mb-2" />
                            <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                                Cách bỏ thuốc hiệu quả
                            </CardTitle>
                            <CardDescription className="text-slate-500 dark:text-slate-400">
                                Khám phá các chiến lược, công cụ và lời khuyên từ chuyên gia để giúp bạn thành công trên hành trình bỏ
                                thuốc.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-slate-700 dark:text-slate-300">
                            <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-emerald-500" /> Chuẩn bị và đặt mục tiêu:
                                </h4>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>
                                        **Đặt ngày bỏ thuốc:** Chọn một ngày cụ thể trong vòng 1-2 tuần tới. Điều này giúp bạn có thời gian
                                        chuẩn bị tinh thần và vật chất.
                                    </li>
                                    <li>
                                        **Thông báo cho người thân:** Chia sẻ quyết định của bạn với gia đình và bạn bè để nhận được sự hỗ
                                        trợ và động viên.
                                    </li>
                                    <li>
                                        **Loại bỏ thuốc lá và vật dụng liên quan:** Dọn dẹp nhà cửa, xe hơi, nơi làm việc khỏi tất cả thuốc
                                        lá, gạt tàn, bật lửa.
                                    </li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <Brain className="h-5 w-5 text-orange-500" /> Quản lý cơn thèm thuốc:
                                </h4>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>
                                        **Quy tắc 4D:** Delay (Trì hoãn), Deep breath (Hít thở sâu), Drink water (Uống nước), Do something
                                        else (Làm việc khác).
                                    </li>
                                    <li>
                                        **Tìm kiếm hoạt động thay thế:** Nhai kẹo cao su, ăn vặt lành mạnh, tập thể dục nhẹ, đọc sách, nghe
                                        nhạc.
                                    </li>
                                    <li>
                                        **Tránh các yếu tố kích hoạt:** Xác định và tránh những tình huống, địa điểm, hoặc cảm xúc thường
                                        khiến bạn muốn hút thuốc.
                                    </li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-purple-500" /> Các phương pháp hỗ trợ:
                                </h4>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>
                                        **Liệu pháp thay thế nicotine (NRT):** Bao gồm miếng dán, kẹo cao su, viên ngậm, bình xịt mũi hoặc
                                        ống hít nicotine. Chúng giúp giảm các triệu chứng cai nghiện.
                                    </li>
                                    <li>
                                        **Thuốc kê đơn:** Bupropion (Zyban) và Varenicline (Chantix) có thể giúp giảm cảm giác thèm thuốc và
                                        các triệu chứng cai nghiện. Tham khảo ý kiến bác sĩ.
                                    </li>
                                    <li>
                                        **Tư vấn và hỗ trợ nhóm:** Tham gia các nhóm hỗ trợ hoặc tìm kiếm tư vấn từ chuyên gia để nhận được
                                        sự động viên và chiến lược đối phó.
                                    </li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <Leaf className="h-5 w-5 text-green-600" /> Duy trì và phòng ngừa tái nghiện:
                                </h4>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>**Khen thưởng bản thân:** Tự thưởng cho những cột mốc quan trọng trên hành trình bỏ thuốc.</li>
                                    <li>
                                        **Học hỏi từ những lần trượt dốc:** Nếu bạn lỡ hút một điếu, đừng bỏ cuộc. Hãy coi đó là một bài học
                                        và tiếp tục hành trình.
                                    </li>
                                    <li>
                                        **Duy trì lối sống lành mạnh:** Ăn uống cân bằng, tập thể dục đều đặn và ngủ đủ giấc để tăng cường
                                        sức khỏe và giảm căng thẳng.
                                    </li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Section 3: Health Improvement Timeline */}
                    <Card className="bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <Clock className="h-8 w-8 text-orange-500 mb-2" />
                            <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                                Lộ trình cải thiện sức khỏe
                            </CardTitle>
                            <CardDescription className="text-slate-500 dark:text-slate-400">
                                Xem những thay đổi tích cực đáng kinh ngạc mà cơ thể bạn trải qua sau khi bỏ thuốc lá, từng bước một.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-slate-700 dark:text-slate-300">
                            <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <span className="font-bold text-slate-900 dark:text-white">20 phút:</span>
                                </h4>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Nhịp tim và huyết áp trở lại bình thường.</li>
                                    <li>Nhiệt độ bàn tay và bàn chân tăng lên mức bình thường.</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <span className="font-bold text-slate-900 dark:text-white">12 giờ:</span>
                                </h4>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Mức carbon monoxide trong máu giảm về bình thường.</li>
                                    <li>Mức oxy trong máu tăng lên mức bình thường.</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <span className="font-bold text-slate-900 dark:text-white">24 giờ:</span>
                                </h4>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Nguy cơ đau tim bắt đầu giảm.</li>
                                    <li>Các đầu dây thần kinh bị tổn thương bắt đầu phục hồi, cải thiện vị giác và khứu giác.</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <span className="font-bold text-slate-900 dark:text-white">2-12 tuần:</span>
                                </h4>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Tuần hoàn máu cải thiện đáng kể.</li>
                                    <li>Chức năng phổi tăng lên tới 30%.</li>
                                    <li>Đi bộ và tập thể dục trở nên dễ dàng hơn.</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <span className="font-bold text-slate-900 dark:text-white">1-9 tháng:</span>
                                </h4>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Ho và khó thở giảm đáng kể.</li>
                                    <li>
                                        Lông mao trong phổi bắt đầu hoạt động bình thường trở lại, làm sạch phổi và giảm nguy cơ nhiễm
                                        trùng.
                                    </li>
                                    <li>Mức năng lượng tổng thể tăng lên.</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <span className="font-bold text-slate-900 dark:text-white">1 năm:</span>
                                </h4>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Nguy cơ bệnh tim mạch vành giảm một nửa so với người hút thuốc.</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <span className="font-bold text-slate-900 dark:text-white">5 năm:</span>
                                </h4>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Nguy cơ đột quỵ giảm xuống mức của người không hút thuốc.</li>
                                    <li>Nguy cơ ung thư miệng, họng, thực quản và bàng quang giảm một nửa.</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <span className="font-bold text-slate-900 dark:text-white">10 năm:</span>
                                </h4>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Nguy cơ tử vong do ung thư phổi giảm một nửa so với người hút thuốc.</li>
                                    <li>Nguy cơ ung thư thanh quản và tuyến tụy giảm đáng kể.</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <span className="font-bold text-slate-900 dark:text-white">15 năm:</span>
                                </h4>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Nguy cơ bệnh tim mạch vành trở lại mức của người không hút thuốc.</li>
                                    <li>Nguy cơ ung thư tuyến tụy tương đương với người không hút thuốc.</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AnimatedSection>
    )
}
