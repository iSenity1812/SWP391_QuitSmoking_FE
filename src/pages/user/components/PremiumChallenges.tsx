"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import {
    Crown,
    Shield,
    Coins,
    Activity,
    Users,
    Flame,
    XCircle,
    CheckCircle,
    Eye,
    Info,
    Plus,
    Loader2,
    AlertCircle,
} from "lucide-react"
import type { User } from "../../../types/user-types"
import type { ChallengeResponse } from "../../../types/challenge"
import { useChallenge } from "../../../hooks/use-challenge"
import { useChallengeForm } from "../../../hooks/use-challenge-form"
import { useAuth } from "../../../hooks/useAuth"

interface PremiumChallengesProps {
    user: User
    onUpdateUserChallenges?: (updatedChallenges: any[]) => void
}

const getChallengeIcon = (iconName: string) => {
    switch (iconName) {
        case "shield":
            return Shield
        case "coins":
            return Coins
        case "activity":
            return Activity
        case "users":
            return Users
        case "flame":
            return Flame
        default:
            return Info
    }
}

const getChallengeStatusInVietnamese = (status: string) => {
    switch (status.toLowerCase()) {
        case "active":
            return "Đang thực hiện"
        case "completed":
            return "Đã hoàn thành"
        case "given up":
            return "Đã từ bỏ"
        default:
            return "Chưa bắt đầu"
    }
}

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case "active":
            return "text-blue-600"
        case "completed":
            return "text-green-600"
        case "given up":
            return "text-red-600"
        default:
            return "text-gray-600"
    }
}

export function PremiumChallenges({ user, onUpdateUserChallenges }: PremiumChallengesProps) {
    const [isPremium, setIsPremium] = useState(false)
    const [openCreateDialog, setOpenCreateDialog] = useState(false)

    // Get auth context to verify user data

    // Use challenge hooks
    const {
        challenges,
        isLoading,
        error,
        validationErrors,
        createChallenge,
        getMyChallenges,
        clearError,
        clearValidationErrors,
    } = useChallenge()

    const {
        formData,
        errors: formErrors,
        isValid,
        isSubmitting,
        updateField,
        validateForm,
        validateField,
        resetForm,
        getSubmitData,
        clearErrors: clearFormErrors,
        setErrors: setFormErrors,
        setSubmitting,
    } = useChallengeForm()

    useEffect(() => {
        setIsPremium(user.role === "PREMIUM_MEMBER")
        if (user.role === "PREMIUM_MEMBER") {
            getMyChallenges()
        }
    }, [user, getMyChallenges])

    const handleCreateChallenge = async () => {
        console.log("=== Starting challenge creation ===")

        // Set submitting state
        setSubmitting(true)

        // Clear previous backend errors
        clearValidationErrors()
        clearError()

        // Validate form first
        const isFormValid = validateForm()
        console.log("Form validation result:", isFormValid)
        console.log("Form errors:", formErrors)

        if (!isFormValid) {
            console.log("Form validation failed, stopping submission")
            setSubmitting(false)
            return
        }

        const submitData = getSubmitData()
        console.log("Submitting challenge data:", submitData)

        try {
            const success = await createChallenge(submitData)
            console.log("Create challenge result:", success)

            if (success) {
                console.log("Challenge created successfully")
                setOpenCreateDialog(false)
                resetForm()
                clearFormErrors()
                clearValidationErrors()
                clearError()

                // Optionally notify parent component
                if (onUpdateUserChallenges) {
                    onUpdateUserChallenges(challenges)
                }
            }
        } catch (err) {
            console.error("Error in handleCreateChallenge:", err)
        } finally {
            setSubmitting(false)
        }
    }

    const handleDialogClose = (open: boolean) => {
        if (!open) {
            // Clear all states when closing dialog
            resetForm()
            clearFormErrors()
            clearValidationErrors()
            clearError()
        }
        setOpenCreateDialog(open)
    }

    const handleFieldBlur = (field: keyof typeof formData) => {
        validateField(field)
    }

    const handleFieldChange = (field: keyof typeof formData, value: string) => {
        updateField(field, value)
        // Validate related fields when dates change
        if (field === "startDate" || field === "endDate") {
            setTimeout(() => {
                validateField("startDate")
                validateField("endDate")
            }, 0)
        }
    }

    const calculateProgress = (challenge: ChallengeResponse) => {
        // Since backend doesn't have currentValue, we'll simulate it
        // In real implementation, you might need to track progress separately
        return 0 // Default to 0 for now
    }

    const getProgressPercentage = (challenge: ChallengeResponse) => {
        const currentValue = calculateProgress(challenge)
        return (currentValue / challenge.targetValue) * 100
    }

    if (!isPremium) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900 rounded-lg shadow-md text-center">
                <Crown className="h-16 w-16 text-amber-500 mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Nâng cấp lên Premium để mở khóa Thử thách!
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Tham gia các thử thách độc quyền, nhận phần thưởng đặc biệt và tăng tốc hành trình cai thuốc của bạn.
                </p>
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    Nâng cấp ngay
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-6">Thử thách Premium</h1>
                <Button className="mt-8" onClick={() => setOpenCreateDialog(true)} disabled={isLoading}>
                    <Plus className="h-4 w-4 mr-2" /> Tạo thử thách mới
                </Button>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
                Hoàn thành các thử thách độc quyền để nhận huy hiệu và điểm thưởng đặc biệt!
            </p>

            {/* Error Display - Only show if not in dialog */}
            {error && !openCreateDialog && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                    <Button variant="outline" size="sm" onClick={clearError} className="mt-2">
                        Đóng
                    </Button>
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                    <span className="ml-2 text-slate-600 dark:text-slate-400">Đang tải...</span>
                </div>
            )}

            {/* Challenges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {!isLoading && challenges.length === 0 && (
                    <p className="col-span-full text-center text-slate-500 dark:text-slate-400">
                        Hiện chưa có thử thách Premium nào. Hãy tạo thử thách đầu tiên của bạn!
                    </p>
                )}

                {challenges.map((challenge) => {
                    const IconComponent = getChallengeIcon("activity") // Default icon since backend doesn't store icon
                    const progressPercentage = getProgressPercentage(challenge)
                    const currentValue = calculateProgress(challenge)

                    return (
                        <Card key={challenge.challengeID} className="flex flex-col">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg font-medium">{challenge.challengeName}</CardTitle>
                                <IconComponent className="h-6 w-6 text-emerald-500" />
                            </CardHeader>
                            <CardContent className="flex-1">
                                <CardDescription className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                                    {challenge.description || "Không có mô tả"}
                                </CardDescription>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600 dark:text-slate-400">Trạng thái:</span>
                                        <span className={`font-medium ${getStatusColor(challenge.status)}`}>
                                            {getChallengeStatusInVietnamese(challenge.status)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600 dark:text-slate-400">Mục tiêu:</span>
                                        <span className="font-medium">
                                            {challenge.targetValue} {challenge.unit}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600 dark:text-slate-400">Kết thúc:</span>
                                        <span className="font-medium">{new Date(challenge.endDate).toLocaleDateString("vi-VN")}</span>
                                    </div>
                                </div>

                                {challenge.status.toLowerCase() === "active" && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                                            <span>Tiến độ:</span>
                                            <span>
                                                {currentValue} / {challenge.targetValue} {challenge.unit}
                                            </span>
                                        </div>
                                        <Progress value={progressPercentage} className="h-2" />
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="flex justify-between gap-2 pt-4">
                                {challenge.status.toLowerCase() === "active" && (
                                    <Button
                                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                                        onClick={() => {
                                            // Handle progress update - you might want to implement this
                                            console.log("Update progress for challenge:", challenge.challengeID)
                                        }}
                                    >
                                        <Eye className="h-4 w-4 mr-2" /> Cập nhật tiến độ
                                    </Button>
                                )}
                                {challenge.status.toLowerCase() === "completed" && (
                                    <Button disabled className="flex-1 bg-green-500 text-white">
                                        <CheckCircle className="h-4 w-4 mr-2" /> Đã hoàn thành
                                    </Button>
                                )}
                                {challenge.status.toLowerCase() === "given up" && (
                                    <Button disabled className="flex-1 bg-red-500 text-white">
                                        <XCircle className="h-4 w-4 mr-2" /> Đã từ bỏ
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>

            {/* Create New Challenge Dialog */}
            <Dialog open={openCreateDialog} onOpenChange={handleDialogClose}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Tạo Thử thách Mới</DialogTitle>
                        <DialogDescription>Tạo một thử thách cá nhân để giúp bạn đạt được mục tiêu cai thuốc.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {/* Challenge Name */}
                        <div className="grid gap-2">
                            <Label htmlFor="challengeName">
                                Tên thử thách <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="challengeName"
                                value={formData.challengeName}
                                onChange={(e) => handleFieldChange("challengeName", e.target.value)}
                                onBlur={() => handleFieldBlur("challengeName")}
                                placeholder="Ví dụ: 7 ngày không hút thuốc"
                                className={formErrors.challengeName ? "border-red-500 focus:border-red-500" : ""}
                            />
                            {formErrors.challengeName && (
                                <div className="flex items-center gap-2 text-sm text-red-600">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>{formErrors.challengeName}</span>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="grid gap-2">
                            <Label htmlFor="description">Mô tả</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleFieldChange("description", e.target.value)}
                                onBlur={() => handleFieldBlur("description")}
                                placeholder="Mô tả chi tiết về thử thách này..."
                                className={`min-h-[80px] ${formErrors.description ? "border-red-500 focus:border-red-500" : ""}`}
                            />
                            {formErrors.description && (
                                <div className="flex items-center gap-2 text-sm text-red-600">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>{formErrors.description}</span>
                                </div>
                            )}
                            <p className="text-xs text-slate-500">{formData.description.length}/500 ký tự</p>
                        </div>

                        {/* Date Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="startDate">Ngày bắt đầu</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => handleFieldChange("startDate", e.target.value)}
                                    onBlur={() => handleFieldBlur("startDate")}
                                    className={formErrors.startDate ? "border-red-500 focus:border-red-500" : ""}
                                />
                                {formErrors.startDate && (
                                    <div className="flex items-center gap-2 text-sm text-red-600">
                                        <AlertCircle className="h-4 w-4" />
                                        <span>{formErrors.startDate}</span>
                                    </div>
                                )}
                                <p className="text-xs text-slate-500">Để trống nếu muốn bắt đầu ngay hôm nay</p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="endDate">
                                    Ngày kết thúc <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => handleFieldChange("endDate", e.target.value)}
                                    onBlur={() => handleFieldBlur("endDate")}
                                    className={formErrors.endDate ? "border-red-500 focus:border-red-500" : ""}
                                />
                                {formErrors.endDate && (
                                    <div className="flex items-center gap-2 text-sm text-red-600">
                                        <AlertCircle className="h-4 w-4" />
                                        <span>{formErrors.endDate}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Target Value and Unit */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="targetValue">
                                    Giá trị mục tiêu <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="targetValue"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.targetValue}
                                    onChange={(e) => handleFieldChange("targetValue", e.target.value)}
                                    onBlur={() => handleFieldBlur("targetValue")}
                                    placeholder="Ví dụ: 7"
                                    className={formErrors.targetValue ? "border-red-500 focus:border-red-500" : ""}
                                />
                                {formErrors.targetValue && (
                                    <div className="flex items-center gap-2 text-sm text-red-600">
                                        <AlertCircle className="h-4 w-4" />
                                        <span>{formErrors.targetValue}</span>
                                    </div>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="unit">
                                    Đơn vị <span className="text-red-500">*</span>
                                </Label>
                                <select
                                    id="unit"
                                    value={formData.unit}
                                    onChange={(e) => handleFieldChange("unit", e.target.value)}
                                    onBlur={() => handleFieldBlur("unit")}
                                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${formErrors.unit ? "border-red-500 focus:border-red-500" : ""
                                        }`}
                                >
                                    <option value="cigarettes">Điếu thuốc</option>
                                    <option value="days">Ngày</option>
                                    <option value="VND">VND</option>
                                </select>
                                {formErrors.unit && (
                                    <div className="flex items-center gap-2 text-sm text-red-600">
                                        <AlertCircle className="h-4 w-4" />
                                        <span>{formErrors.unit}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Backend validation errors */}
                        {validationErrors.general && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                    <p className="text-sm text-red-600 dark:text-red-400">{validationErrors.general}</p>
                                </div>
                            </div>
                        )}

                        {/* Individual backend validation errors */}
                        {Object.entries(validationErrors).map(([field, message]) => {
                            if (field === "general" || !message) return null
                            return (
                                <div
                                    key={field}
                                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"
                                >
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                        <p className="text-sm text-red-600 dark:text-red-400">
                                            <strong>{field}:</strong> {message}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => handleDialogClose(false)} disabled={isSubmitting}>
                            Hủy
                        </Button>
                        <Button onClick={handleCreateChallenge} disabled={isSubmitting || !isValid}>
                            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            {isSubmitting ? "Đang tạo..." : "Tạo thử thách"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
