"use client"

import type React from "react"
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Target, Sparkles } from "lucide-react"

interface PlanFormData {
    title: string
    description: string
    startDate: Date
    targetDate: Date
    dailyCigarettes: number
    motivation: string
    cigaretteType: string
}

interface PlanFormDialogProps {
    newPlan: PlanFormData
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onSubmit: () => void
    onCancel: () => void
    cigarettePrices: { [key: string]: number }
    isEditing?: boolean
    isPremium?: boolean
}

export const PlanFormDialog: React.FC<PlanFormDialogProps> = ({
    newPlan,
    onInputChange,
    onSelectChange,
    onDateChange,
    onNumberChange,
    onSubmit,
    onCancel,
    cigarettePrices,
    isEditing = false,
    isPremium = false,
}) => {
    return (
        <DialogContent className="sm:max-w-[600px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-2 border-emerald-100 dark:border-slate-700">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                    <Target className="w-5 h-5 text-emerald-500" />
                    {isEditing ? "Chỉnh Sửa Kế Hoạch" : "Tạo Kế Hoạch Cai Thuốc"}
                    {isPremium && <Badge className="bg-emerald-500 text-white text-xs">PREMIUM</Badge>}
                </DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
                {isPremium && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-700">
                        <p className="text-emerald-700 dark:text-emerald-300 text-sm flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Bạn đang sử dụng gói Premium! Tận hưởng các tính năng cao cấp và tư vấn cá nhân hóa.
                        </p>
                    </div>
                )}

                <div className="grid gap-2">
                    <Label htmlFor="title" className="text-sm font-medium text-slate-900 dark:text-white">
                        Tên Kế Hoạch <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="title"
                        name="title"
                        value={newPlan.title}
                        onChange={onInputChange}
                        placeholder="VD: Hành trình cai thuốc 30 ngày"
                        className="border-2 border-emerald-100 dark:border-slate-600 focus:border-emerald-300 dark:focus:border-emerald-500 text-slate-900 dark:text-white bg-white dark:bg-slate-800 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                        required
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="description" className="text-sm font-medium text-slate-900 dark:text-white">
                        Mô Tả <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                        id="description"
                        name="description"
                        value={newPlan.description}
                        onChange={onInputChange}
                        placeholder="Mô tả chi tiết kế hoạch cai thuốc lá của bạn"
                        className="border-2 border-emerald-100 dark:border-slate-600 focus:border-emerald-300 dark:focus:border-emerald-500 text-slate-900 dark:text-white bg-white dark:bg-slate-800 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                        rows={3}
                        required
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="cigaretteType" className="text-sm font-medium text-slate-900 dark:text-white">
                        Loại Thuốc Lá
                    </Label>
                    <select
                        id="cigaretteType"
                        name="cigaretteType"
                        value={newPlan.cigaretteType}
                        onChange={onSelectChange}
                        className="flex h-10 w-full rounded-md border-2 border-emerald-100 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm ring-offset-background focus:border-emerald-300 dark:focus:border-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 text-slate-900 dark:text-white"
                    >
                        {Object.keys(cigarettePrices).map((type) => (
                            <option key={type} value={type} className="text-slate-900 dark:text-white bg-white dark:bg-slate-800">
                                {type} - {cigarettePrices[type].toLocaleString("vi-VN")} VNĐ/gói
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label className="text-sm font-medium text-slate-900 dark:text-white">Ngày Bắt Đầu</Label>
                        <Input
                            type="date"
                            name="startDate"
                            value={newPlan.startDate?.toISOString().split("T")[0]}
                            onChange={onDateChange}
                            className="border-2 border-emerald-100 dark:border-slate-600 focus:border-emerald-300 dark:focus:border-emerald-500 text-slate-900 dark:text-white bg-white dark:bg-slate-800"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label className="text-sm font-medium text-slate-900 dark:text-white">Ngày Mục Tiêu</Label>
                        <Input
                            type="date"
                            name="targetDate"
                            value={newPlan.targetDate?.toISOString().split("T")[0]}
                            onChange={onDateChange}
                            className="border-2 border-emerald-100 dark:border-slate-600 focus:border-emerald-300 dark:focus:border-emerald-500 text-slate-900 dark:text-white bg-white dark:bg-slate-800"
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="dailyCigarettes" className="text-sm font-medium text-slate-900 dark:text-white">
                        Số Điếu Thuốc Hàng Ngày (trước khi cai)
                    </Label>
                    <Input
                        id="dailyCigarettes"
                        name="dailyCigarettes"
                        type="number"
                        value={newPlan.dailyCigarettes}
                        onChange={onNumberChange}
                        placeholder="VD: 20"
                        min="0"
                        className="border-2 border-emerald-100 dark:border-slate-600 focus:border-emerald-300 dark:focus:border-emerald-500 text-slate-900 dark:text-white bg-white dark:bg-slate-800 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="motivation" className="text-sm font-medium text-slate-900 dark:text-white">
                        Động Lực Của Bạn <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                        id="motivation"
                        name="motivation"
                        value={newPlan.motivation}
                        onChange={onInputChange}
                        placeholder="Viết lý do tại sao bạn muốn cai thuốc lá..."
                        className="border-2 border-emerald-100 dark:border-slate-600 focus:border-emerald-300 dark:focus:border-emerald-500 text-slate-900 dark:text-white bg-white dark:bg-slate-800 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                        rows={3}
                        required
                    />
                </div>
            </div>
            <div className="flex justify-end gap-4 text-black">
                <Button variant="outline" onClick={onCancel}>
                    Hủy
                </Button>
                <Button
                    onClick={onSubmit}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                >
                    {isEditing ? "Cập Nhật Kế Hoạch" : "Tạo Kế Hoạch"}
                </Button>
            </div>
        </DialogContent>
    )
}
