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
    AlertTriangle,
    Pill,
    Stethoscope,
} from "lucide-react"
import { AnimatedSection } from "@/components/ui/AnimatedSection"

export function LearningProgramTab() {
    return (
        <AnimatedSection delay={0.2}>
            <div className="space-y-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Chương trình học tập</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                    Tìm hiểu về Liệu pháp Thay thế Nicotine (NRT) - một phương pháp hiệu quả giúp bạn bỏ thuốc lá an toàn và thành
                    công.
                </p>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Section 1: What is NRT? */}
                    <Card className="bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <Lightbulb className="h-8 w-8 text-emerald-500 mb-2" />
                            <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                                Liệu pháp Thay thế Nicotine (NRT) là gì?
                            </CardTitle>
                            <CardDescription className="text-slate-500 dark:text-slate-400">
                                Tìm hiểu về phương pháp sử dụng sản phẩm chứa nicotine liều thấp để giảm cơn thèm thuốc.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-slate-700 dark:text-slate-300">
                            <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <Heart className="h-5 w-5 text-red-500" /> NRT là gì?
                                </h4>
                                <p className="text-sm">
                                    Liệu pháp Thay thế Nicotine (NRT) bao gồm việc sử dụng các sản phẩm (như kẹo cao su và miếng dán) với
                                    liều nicotine thấp để giảm cơn thèm thuốc và các triệu chứng cai nghiện sau khi bạn bỏ hút thuốc.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-green-500" /> Lợi ích của NRT:
                                </h4>
                                <ul className="list-disc pl-5 space-y-1 text-sm">
                                    <li>
                                        Đây là một loại điều trị hỗ trợ bằng thuốc (MAT) cho người nghiện nicotine (rối loạn sử dụng thuốc
                                        lá).
                                    </li>
                                    <li>
                                        Các sản phẩm nicotine cho NRT không chứa các chất độc khác (như chất gây ung thư) mà việc hút thuốc
                                        đưa vào cơ thể bạn.
                                    </li>
                                    <li>NRT có thể giúp giảm các triệu chứng cai nghiện và thèm thuốc về mặt thể chất.</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <Users className="h-5 w-5 text-blue-500" /> NRT dành cho ai?
                                </h4>
                                <p className="text-sm">
                                    NRT dành cho những người nghiện nicotine nặng và muốn bỏ hút thuốc. Các nhà nghiên cứu chưa nghiên cứu
                                    nhiều về NRT cho việc bỏ thuốc lá không khói.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Section 2: How NRT Works */}
                    <Card className="bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <TrendingUp className="h-8 w-8 text-purple-500 mb-2" />
                            <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                                Liệu pháp Thay thế Nicotine hoạt động như thế nào?
                            </CardTitle>
                            <CardDescription className="text-slate-500 dark:text-slate-400">
                                Hiểu cách NRT giúp kiểm soát cơn thèm thuốc và các triệu chứng cai nghiện.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-slate-700 dark:text-slate-300">
                            <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <Brain className="h-5 w-5 text-orange-500" /> Cách thức hoạt động:
                                </h4>
                                <p className="text-sm">
                                    Trong quá trình NRT, bạn sử dụng các sản phẩm có chứa nicotine được kiểm soát, liều thấp để kiểm soát
                                    cơn thèm thuốc và triệu chứng cai nghiện sau khi bỏ hút thuốc. Các sản phẩm NRT chứa lượng nicotine
                                    thấp hơn điếu thuốc lá trung bình, và tác động lên cơ thể bạn nhẹ nhàng hơn.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <Pill className="h-5 w-5 text-blue-500" /> Các sản phẩm NRT bao gồm:
                                </h4>
                                <ul className="list-disc pl-5 space-y-1 text-sm">
                                    <li>
                                        <strong>Kẹo cao su nicotine</strong>
                                    </li>
                                    <li>
                                        <strong>Viên ngậm nicotine</strong>
                                    </li>
                                    <li>
                                        <strong>Miếng dán da</strong>
                                    </li>
                                    <li>
                                        <strong>Ống hít nicotine</strong>
                                    </li>
                                    <li>
                                        <strong>Xịt mũi nicotine</strong>
                                    </li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-500" /> Hiệu quả:
                                </h4>
                                <p className="text-sm">
                                    Cục Quản lý Thực phẩm và Dược phẩm Hoa Kỳ (FDA) đã phê duyệt các sản phẩm này để ngừng hút thuốc. Sử
                                    dụng chúng quá nhiều hoặc sử dụng chúng và tiếp tục hút thuốc có thể dẫn đến tích tụ mức độc của
                                    nicotine trong cơ thể, dẫn đến ngộ độc nicotine.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Section 3: How to Use NRT Products */}
                    <Card className="bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <Clock className="h-8 w-8 text-orange-500 mb-2" />
                            <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                                Cách sử dụng các sản phẩm NRT
                            </CardTitle>
                            <CardDescription className="text-slate-500 dark:text-slate-400">
                                Hướng dẫn chi tiết cách sử dụng kẹo cao su và viên ngậm nicotine an toàn và hiệu quả.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-slate-700 dark:text-slate-300">
                            <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <Pill className="h-5 w-5 text-blue-500" /> Cách sử dụng kẹo cao su nicotine:
                                </h4>
                                <ul className="list-disc pl-5 space-y-1 text-sm">
                                    <li>Kẹo cao su nicotine là sản phẩm không kê đơn (OTC). Bạn nhai kẹo để giải phóng nicotine.</li>
                                    <li>Khi bạn cảm thấy ngứa ran hoặc có vị cay, hãy đặt kẹo giữa má và nướu trong khoảng 30 phút.</li>
                                    <li>
                                        Đợi ít nhất 15 phút sau khi uống đồ uống có caffeine và đồ uống có tính axit trước khi nhai kẹo cao
                                        su nicotine.
                                    </li>
                                    <li>
                                        Thường bạn có thể sử dụng một miếng kẹo mỗi một đến hai giờ để kiểm soát các triệu chứng thèm thuốc
                                        trong sáu tuần đầu.
                                    </li>
                                    <li>
                                        Sau sáu tuần sử dụng, bạn có thể giảm xuống một miếng mỗi hai đến bốn giờ, sau đó một miếng mỗi bốn
                                        đến tám giờ.
                                    </li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <Pill className="h-5 w-5 text-purple-500" /> Cách sử dụng viên ngậm nicotine:
                                </h4>
                                <ul className="list-disc pl-5 space-y-1 text-sm">
                                    <li>
                                        Viên ngậm nicotine là sản phẩm OTC mà bạn đặt trong miệng giữa má và nướu (như kẹo cứng hoặc viên
                                        ho).
                                    </li>
                                    <li>
                                        Viên ngậm từ từ giải phóng nicotine khi tan trong miệng. Bạn có thể cảm thấy ấm hoặc ngứa ran.
                                    </li>
                                    <li>
                                        Thường bạn có thể sử dụng một viên ngậm mỗi một đến hai giờ để kiểm soát các triệu chứng thèm thuốc
                                        trong sáu tuần đầu.
                                    </li>
                                    <li>
                                        Sau sáu tuần sử dụng, bạn có thể giảm xuống một viên ngậm mỗi hai đến bốn giờ, sau đó một viên ngậm
                                        mỗi bốn đến tám giờ.
                                    </li>
                                    <li>Không sử dụng quá một viên ngậm tại một thời điểm.</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Section 4: Benefits and Side Effects */}
                    <Card className="bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <Heart className="h-8 w-8 text-red-500 mb-2" />
                            <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                                Lợi ích và Tác dụng phụ của NRT
                            </CardTitle>
                            <CardDescription className="text-slate-500 dark:text-slate-400">
                                Hiểu rõ về lợi ích và các tác dụng phụ có thể xảy ra khi sử dụng NRT.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-slate-700 dark:text-slate-300">
                            <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-500" /> Lợi ích của NRT:
                                </h4>
                                <p className="text-sm">
                                    Sử dụng NRT hiệu quả giúp giảm ham muốn hút thuốc lá bằng cách cung cấp nicotine cho cơ thể thông qua
                                    các sản phẩm an toàn hơn. Các nghiên cứu cho thấy việc sử dụng NRT giúp tăng cơ hội bỏ hút thuốc
                                    khoảng 50% đến 70%.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-yellow-500" /> Tác dụng phụ chung:
                                </h4>
                                <ul className="list-disc pl-5 space-y-1 text-sm">
                                    <li>
                                        <strong>Buồn nôn</strong>
                                    </li>
                                    <li>
                                        <strong>Đau đầu</strong>
                                    </li>
                                    <li>
                                        <strong>Tim đập nhanh</strong>
                                    </li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-orange-500" /> Tác dụng phụ khác:
                                </h4>
                                <ul className="list-disc pl-5 space-y-1 text-sm">
                                    <li>
                                        <strong>Miếng dán nicotine:</strong> Kích ứng da, vấn đề về giấc ngủ hoặc giấc mơ bất thường
                                    </li>
                                    <li>
                                        <strong>Kẹo cao su nicotine:</strong> Kích ứng họng, loét miệng, nấc cụt
                                    </li>
                                    <li>
                                        <strong>Viên ngậm nicotine:</strong> Nấc cụt, đau họng, ho, ợ nóng
                                    </li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Section 5: Safety and Recovery */}
                    <Card className="bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <Stethoscope className="h-8 w-8 text-blue-500 mb-2" />
                            <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                                An toàn và Phục hồi
                            </CardTitle>
                            <CardDescription className="text-slate-500 dark:text-slate-400">
                                Thông tin quan trọng về thời gian sử dụng NRT và các lựa chọn thay thế.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-slate-700 dark:text-slate-300">
                            <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-green-500" /> NRT kéo dài bao lâu?
                                </h4>
                                <p className="text-sm">
                                    Liệu pháp Thay thế Nicotine (NRT) được thiết kế để sử dụng trong thời gian có hạn. Trong hầu hết các
                                    trường hợp, các nhà cung cấp dịch vụ chăm sóc sức khỏe khuyến nghị sử dụng NRT trong tám đến 12 tuần.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-red-500" /> Ngộ độc Nicotine:
                                </h4>
                                <p className="text-sm">
                                    Điều quan trọng là sử dụng các sản phẩm NRT đúng cách. Sử dụng chúng quá thường xuyên hoặc sử dụng
                                    chúng trong khi vẫn tiếp tục hút thuốc có thể dẫn đến ngộ độc nicotine (quá liều).
                                </p>
                                <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                                    <li>Buồn nôn và nôn mửa</li>
                                    <li>Tăng tiết nước bọt</li>
                                    <li>Đau bụng</li>
                                    <li>Đổ mồ hôi</li>
                                    <li>Tăng nhịp tim</li>
                                    <li>Thở nhanh, nặng (tăng thông khí)</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <Leaf className="h-5 w-5 text-green-600" /> Nếu NRT không hiệu quả?
                                </h4>
                                <p className="text-sm">
                                    Có nhiều lựa chọn để bỏ hút thuốc vĩnh viễn. FDA phê duyệt hai loại thuốc kê đơn khác để bỏ hút thuốc:
                                    varenicline và bupropion. Chúng không chứa nicotine. Nhà cung cấp dịch vụ của bạn có thể khuyến nghị
                                    dùng một trong những loại thuốc này cùng với sản phẩm NRT để bỏ hút thuốc.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Section 6: Important Considerations */}
                    <Card className="bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <ShieldCheck className="h-8 w-8 text-purple-500 mb-2" />
                            <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                                Những điều cần lưu ý quan trọng
                            </CardTitle>
                            <CardDescription className="text-slate-500 dark:text-slate-400">
                                Lời khuyên quan trọng trước khi bắt đầu sử dụng NRT và cách tối ưu hóa hiệu quả.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-slate-700 dark:text-slate-300">
                            <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <Stethoscope className="h-5 w-5 text-blue-500" /> Tư vấn y tế:
                                </h4>
                                <p className="text-sm">
                                    Trước khi bạn bắt đầu sử dụng NRT, nên trao đổi với nhà cung cấp dịch vụ chăm sóc sức khỏe về cách tốt
                                    nhất - và hiệu quả nhất - để tiếp cận NRT cho bạn.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <Brain className="h-5 w-5 text-orange-500" /> Phương pháp tổng hợp:
                                </h4>
                                <p className="text-sm">
                                    NRT có thể giúp giảm các triệu chứng cai nghiện và thèm thuốc về mặt thể chất. Nhưng nó không giải
                                    quyết mọi khía cạnh của việc bỏ hút thuốc, như các khía cạnh tinh thần, cảm xúc và xã hội. Ngay cả với
                                    sự hỗ trợ của NRT, việc bỏ hút thuốc vẫn có thể khó khăn.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <Users className="h-5 w-5 text-green-500" /> Kết hợp với liệu pháp khác:
                                </h4>
                                <p className="text-sm">
                                    Kết hợp NRT với các chiến lược khác, như liệu pháp tâm lý hoặc chương trình ngừng hút thuốc, có thể
                                    tăng cơ hội bỏ hút thuốc vĩnh viễn của bạn. Giải quyết các khía cạnh tâm lý, cảm xúc và xã hội của
                                    việc hút thuốc cũng rất quan trọng để bỏ hút thuốc vĩnh viễn.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <Heart className="h-5 w-5 text-red-500" /> Động lực:
                                </h4>
                                <p className="text-sm">
                                    Hãy hỏi nhà cung cấp dịch vụ của bạn về các chương trình ngừng hút thuốc mà bạn có thể tham gia để
                                    giải quyết những thách thức này. Điều tốt nhất bạn có thể làm là tiếp tục cố gắng.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AnimatedSection>
    )
}
