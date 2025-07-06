"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Heart, TrendingUp, Clock, ShieldCheck, Stethoscope } from "lucide-react"
import { AnimatedSection } from "@/components/ui/AnimatedSection"
import { Navbar } from "@/components/ui/Navbar"
import { Footer } from "@/components/ui/Footer"

interface LearningModuleContent {
    [key: string]: string | string[] | Record<string, string>
}

interface LearningModule {
    id: number
    title: string
    description: string
    category: string
    icon: React.ComponentType<{ className?: string }>
    image: string
    content: LearningModuleContent
}

const learningModules: LearningModule[] = [
    {
        id: 1,
        title: "Liệu pháp Thay thế Nicotine (NRT) là gì?",
        description:
            "Tìm hiểu về phương pháp sử dụng sản phẩm chứa nicotine liều thấp để giảm cơn thèm thuốc và các triệu chứng cai nghiện.",
        category: "Cơ bản",
        icon: Lightbulb,
        image: "/placeholder.svg?height=200&width=400",
        content: {
            overview:
                "Liệu pháp Thay thế Nicotine (NRT) bao gồm việc sử dụng các sản phẩm (như kẹo cao su và miếng dán) với liều nicotine thấp để giảm cơn thèm thuốc và các triệu chứng cai nghiện sau khi bạn bỏ hút thuốc.",
            benefits: [
                "Đây là một loại điều trị hỗ trợ bằng thuốc (MAT) cho người nghiện nicotine",
                "Các sản phẩm nicotine cho NRT không chứa các chất độc khác như chất gây ung thư",
                "NRT có thể giúp giảm các triệu chứng cai nghiện và thèm thuốc về mặt thể chất",
            ],
            target: "NRT dành cho những người nghiện nicotine nặng và muốn bỏ hút thuốc.",
        },
    },
    {
        id: 2,
        title: "Cách NRT hoạt động",
        description:
            "Hiểu cách Liệu pháp Thay thế Nicotine giúp kiểm soát cơn thèm thuốc và các triệu chứng cai nghiện một cách hiệu quả.",
        category: "Cơ chế",
        icon: TrendingUp,
        image: "/placeholder.svg?height=200&width=400",
        content: {
            mechanism:
                "Trong quá trình NRT, bạn sử dụng các sản phẩm có chứa nicotine được kiểm soát, liều thấp để kiểm soát cơn thèm thuốc và triệu chứng cai nghiện.",
            products: ["Kẹo cao su nicotine", "Viên ngậm nicotine", "Miếng dán da", "Ống hít nicotine", "Xịt mũi nicotine"],
            effectiveness:
                "Cục Quản lý Thực phẩm và Dược phẩm Hoa Kỳ (FDA) đã phê duyệt các sản phẩm này để ngừng hút thuốc.",
        },
    },
    {
        id: 3,
        title: "Hướng dẫn sử dụng NRT",
        description:
            "Hướng dẫn chi tiết cách sử dụng kẹo cao su và viên ngậm nicotine an toàn và hiệu quả để đạt kết quả tốt nhất.",
        category: "Hướng dẫn",
        icon: Clock,
        image: "/placeholder.svg?height=200&width=400",
        content: {
            gumUsage: [
                "Kẹo cao su nicotine là sản phẩm không kê đơn (OTC)",
                "Khi cảm thấy ngứa ran hoặc có vị cay, đặt kẹo giữa má và nướu trong 30 phút",
                "Đợi ít nhất 15 phút sau khi uống đồ uống có caffeine trước khi nhai kẹo",
                "Sử dụng một miếng mỗi 1-2 giờ trong 6 tuần đầu",
            ],
            lozengeUsage: [
                "Viên ngậm nicotine đặt trong miệng giữa má và nướu",
                "Viên ngậm từ từ giải phóng nicotine khi tan trong miệng",
                "Sử dụng một viên mỗi 1-2 giờ trong 6 tuần đầu",
                "Không sử dụng quá một viên tại một thời điểm",
            ],
        },
    },
    {
        id: 4,
        title: "Lợi ích và Tác dụng phụ",
        description:
            "Hiểu rõ về những lợi ích tích cực và các tác dụng phụ có thể xảy ra khi sử dụng NRT để có kế hoạch phù hợp.",
        category: "An toàn",
        icon: Heart,
        image: "/placeholder.svg?height=200&width=400",
        content: {
            benefits:
                "Sử dụng NRT hiệu quả giúp giảm ham muốn hút thuốc lá bằng cách cung cấp nicotine cho cơ thể thông qua các sản phẩm an toàn hơn. Các nghiên cứu cho thấy việc sử dụng NRT giúp tăng cơ hội bỏ hút thuốc khoảng 50% đến 70%.",
            commonSideEffects: ["Buồn nôn", "Đau đầu", "Tim đập nhanh"],
            specificSideEffects: {
                patches: "Kích ứng da, vấn đề về giấc ngủ hoặc giấc mơ bất thường",
                gum: "Kích ứng họng, loét miệng, nấc cụt",
                lozenges: "Nấc cụt, đau họng, ho, ợ nóng",
            },
        },
    },
    {
        id: 5,
        title: "An toàn và Phục hồi",
        description: "Thông tin quan trọng về thời gian sử dụng NRT, các lựa chọn thay thế và cách tránh ngộ độc nicotine.",
        category: "An toàn",
        icon: Stethoscope,
        image: "/placeholder.svg?height=200&width=400",
        content: {
            duration:
                "Liệu pháp Thay thế Nicotine (NRT) được thiết kế để sử dụng trong thời gian có hạn. Trong hầu hết các trường hợp, các nhà cung cấp dịch vụ chăm sóc sức khỏe khuyến nghị sử dụng NRT trong tám đến 12 tuần.",
            overdoseSymptoms: [
                "Buồn nôn và nôn mửa",
                "Tăng tiết nước bọt",
                "Đau bụng",
                "Đổ mồ hôi",
                "Tăng nhịp tim",
                "Thở nhanh, nặng",
            ],
            alternatives:
                "Có nhiều lựa chọn để bỏ hút thuốc vĩnh viễn. FDA phê duyệt hai loại thuốc kê đơn khác để bỏ hút thuốc: varenicline và bupropion.",
        },
    },
    {
        id: 6,
        title: "Lời khuyên quan trọng",
        description: "Những điều cần lưu ý quan trọng trước khi bắt đầu sử dụng NRT và cách tối ưu hóa hiệu quả điều trị.",
        category: "Lời khuyên",
        icon: ShieldCheck,
        image: "/placeholder.svg?height=200&width=400",
        content: {
            consultation:
                "Trước khi bạn bắt đầu sử dụng NRT, nên trao đổi với nhà cung cấp dịch vụ chăm sóc sức khỏe về cách tốt nhất - và hiệu quả nhất - để tiếp cận NRT cho bạn.",
            comprehensive:
                "NRT có thể giúp giảm các triệu chứng cai nghiện và thèm thuốc về mặt thể chất. Nhưng nó không giải quyết mọi khía cạnh của việc bỏ hút thuốc, như các khía cạnh tinh thần, cảm xúc và xã hội.",
            combination:
                "Kết hợp NRT với các chiến lược khác, như liệu pháp tâm lý hoặc chương trình ngừng hút thuốc, có thể tăng cơ hội bỏ hút thuốc vĩnh viễn của bạn.",
            motivation:
                "Hãy hỏi nhà cung cấp dịch vụ của bạn về các chương trình ngừng hút thuốc mà bạn có thể tham gia để giải quyết những thách thức này.",
        },
    },
]

const categories = ["Tất cả", "Cơ bản", "Cơ chế", "Hướng dẫn", "An toàn", "Lời khuyên"]

const renderContent = (key: string, value: string | string[] | Record<string, string>) => {
    if (typeof value === "string") {
        return <p className="text-slate-700 dark:text-slate-300">{value}</p>
    }

    if (Array.isArray(value)) {
        return (
            <ul className="list-disc pl-6 space-y-2">
                {value.map((item, index) => (
                    <li key={index} className="text-slate-700 dark:text-slate-300">
                        {item}
                    </li>
                ))}
            </ul>
        )
    }

    if (typeof value === "object" && value !== null) {
        return (
            <div className="space-y-3">
                {Object.entries(value).map(([subKey, subValue]) => (
                    <div key={subKey}>
                        <h4 className="font-semibold text-slate-900 dark:text-white capitalize">
                            {subKey.replace(/([A-Z])/g, " $1").trim()}:
                        </h4>
                        <p className="text-slate-700 dark:text-slate-300 ml-4">{subValue}</p>
                    </div>
                ))}
            </div>
        )
    }

    return null
}

export function LearningPage() {
    const [selectedCategory, setSelectedCategory] = useState("Tất cả")
    const [selectedModule, setSelectedModule] = useState<number | null>(null)

    const filteredModules =
        selectedCategory === "Tất cả"
            ? learningModules
            : learningModules.filter((module) => module.category === selectedCategory)

    if (selectedModule) {
        const module = learningModules.find((m) => m.id === selectedModule)
        if (!module) return null

        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                <Navbar />
                <main className="pt-20 pb-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <AnimatedSection delay={0.2}>
                            <div className="space-y-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <button
                                        onClick={() => setSelectedModule(null)}
                                        className="text-emerald-600 hover:text-emerald-700 font-medium"
                                    >
                                        ← Quay lại danh sách
                                    </button>
                                </div>

                                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
                                    <div className="relative h-64 bg-gradient-to-r from-emerald-500 to-blue-500">
                                        <img
                                            src={module.image || "/placeholder.svg"}
                                            alt={module.title}
                                            className="w-full h-full object-cover opacity-20"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <module.icon className="h-16 w-16 text-white" />
                                        </div>
                                    </div>

                                    <div className="p-8">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                                                {module.category}
                                            </Badge>
                                        </div>

                                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{module.title}</h1>

                                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">{module.description}</p>

                                        <div className="prose prose-slate dark:prose-invert max-w-none">
                                            {Object.entries(module.content).map(([key, value]) => (
                                                <div key={key} className="mb-6">
                                                    {renderContent(key, value)}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <Navbar />
            <main className="pt-20 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AnimatedSection delay={0.2}>
                        <div className="space-y-8">
                            {/* Header Section */}
                            <div className="text-center space-y-4">
                                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Chương trình học tập NRT</h1>
                                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                                    Nhấp vào một chủ đề để khám phá các module học tập chi tiết
                                </p>
                            </div>

                            {/* Category Filter */}
                            <div className="flex flex-wrap justify-center gap-2">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                                            ? "bg-emerald-500 text-white"
                                            : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-700"
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>

                            {/* Learning Modules Grid */}
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {filteredModules.map((module) => (
                                    <Card
                                        key={module.id}
                                        className="bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group"
                                        onClick={() => setSelectedModule(module.id)}
                                    >
                                        <div className="relative h-48 overflow-hidden rounded-t-xl">
                                            <img
                                                src={module.image || "/placeholder.svg"}
                                                alt={module.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute top-3 left-3">
                                                <Badge variant="secondary" className="bg-white/90 text-slate-700">
                                                    {module.category}
                                                </Badge>
                                            </div>
                                        </div>

                                        <CardHeader className="pb-3">
                                            <div className="flex items-start gap-3">
                                                <module.icon className="h-6 w-6 text-emerald-500 mt-1 flex-shrink-0" />
                                                <div>
                                                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white line-clamp-2 group-hover:text-emerald-600 transition-colors">
                                                        {module.title}
                                                    </CardTitle>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="pt-0">
                                            <CardDescription className="text-slate-600 dark:text-slate-400 line-clamp-3">
                                                {module.description}
                                            </CardDescription>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {filteredModules.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-slate-500 dark:text-slate-400">
                                        Không tìm thấy module học tập nào cho danh mục này.
                                    </p>
                                </div>
                            )}
                        </div>
                    </AnimatedSection>
                </div>
            </main>
            <Footer />
        </div>
    )
}
