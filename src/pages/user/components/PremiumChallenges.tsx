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
import { useState, useEffect } from "react"
import { Crown, Shield, Coins, Activity, Users, Flame, XCircle, CheckCircle, Play, Eye, Info, Plus } from "lucide-react"
import type { Challenge, User } from "../../../types/user-types"
import { Textarea } from "@/components/ui/textarea"
// Removed: import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PremiumChallengesProps {
    user: User
    onUpdateUserChallenges: (updatedChallenges: Challenge[]) => void
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

export function PremiumChallenges({ user, onUpdateUserChallenges }: PremiumChallengesProps) {
    const [isPremium, setIsPremium] = useState(false)
    const [challenges, setChallenges] = useState<Challenge[]>(user.challenges || [])
    const [openProgressDialog, setOpenProgressDialog] = useState(false)
    const [openCreateDialog, setOpenCreateDialog] = useState(false)
    const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
    const [progressInput, setProgressInput] = useState("")
    const [newChallengeForm, setNewChallengeForm] = useState({
        name: "",
        description: "",
        requirements: "",
        reward: "",
        category: "other", // Default category
        targetValue: 0,
        icon: "info", // Default icon
    })

    useEffect(() => {
        setIsPremium(user.subscription?.type === "premium")
        setChallenges(user.challenges || [])
    }, [user])

    const handleStartChallenge = (challengeId: string) => {
        const updatedChallenges = challenges.map(
            (c): Challenge => (c.id === challengeId ? { ...c, status: "in-progress", currentValue: 0 } : c),
        )
        setChallenges(updatedChallenges)
        onUpdateUserChallenges(updatedChallenges)
    }

    const handleUpdateProgress = () => {
        if (selectedChallenge && progressInput !== "") {
            const newCurrentValue = Number.parseFloat(progressInput)
            const updatedChallenges = challenges.map(
                (c): Challenge =>
                    c.id === selectedChallenge.id
                        ? {
                            ...c,
                            currentValue: newCurrentValue,
                            status: newCurrentValue >= c.targetValue ? "completed" : "in-progress",
                        }
                        : c,
            )
            setChallenges(updatedChallenges)
            onUpdateUserChallenges(updatedChallenges)
            setOpenProgressDialog(false)
            setProgressInput("")
        }
    }

    const handleMarkFailed = (challengeId: string) => {
        const updatedChallenges = challenges.map((c): Challenge => (c.id === challengeId ? { ...c, status: "failed" } : c))
        setChallenges(updatedChallenges)
        onUpdateUserChallenges(updatedChallenges)
    }

    const openProgressUpdateDialog = (challenge: Challenge) => {
        setSelectedChallenge(challenge)
        setProgressInput(challenge.currentValue.toString())
        setOpenProgressDialog(true)
    }

    const handleCreateUserChallenge = () => {
        if (!newChallengeForm.name || !newChallengeForm.description || newChallengeForm.targetValue <= 0) {
            alert("Please fill in all required fields and ensure target value is greater than 0.")
            return
        }

        const newChallenge: Challenge = {
            id: `user-challenge-${Date.now()}`, // Unique ID for user-created challenges
            isPremium: true, // User-created challenges are inherently premium
            isUserCreated: true, // Mark as user-created
            currentValue: 0,
            status: "not-started",
            name: newChallengeForm.name,
            description: newChallengeForm.description,
            requirements: newChallengeForm.requirements,
            reward: newChallengeForm.reward,
            category: newChallengeForm.category as "health" | "mindfulness" | "social" | "streak" | "financial" | "other", // Explicitly cast category
            targetValue: Number(newChallengeForm.targetValue), // Ensure targetValue is a number
            icon: newChallengeForm.icon,
        }

        const updatedChallenges = [...challenges, newChallenge]
        setChallenges(updatedChallenges)
        onUpdateUserChallenges(updatedChallenges)
        setOpenCreateDialog(false)
        setNewChallengeForm({
            name: "",
            description: "",
            requirements: "",
            reward: "",
            category: "other",
            targetValue: 0,
            icon: "info",
        })
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
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Thử thách Premium</h1>
                <Button onClick={() => setOpenCreateDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" /> Tạo thử thách mới
                </Button>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
                Hoàn thành các thử thách độc quyền để nhận huy hiệu và điểm thưởng đặc biệt!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challenges.length === 0 && (
                    <p className="col-span-full text-center text-slate-500 dark:text-slate-400">
                        Hiện chưa có thử thách Premium nào.
                    </p>
                )}
                {challenges.map((challenge) => {
                    const IconComponent = getChallengeIcon(challenge.icon)
                    const progressPercentage = (challenge.currentValue / challenge.targetValue) * 100

                    return (
                        <Card key={challenge.id} className="flex flex-col">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg font-medium">{challenge.name}</CardTitle>
                                <IconComponent className="h-6 w-6 text-emerald-500" />
                            </CardHeader>
                            <CardContent className="flex-1">
                                <CardDescription className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                                    {challenge.description}
                                </CardDescription>


                                {challenge.status === "in-progress" && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                                            <span>Tiến độ:</span>
                                            <span>
                                                {challenge.currentValue} / {challenge.targetValue}{" "}
                                                {challenge.category === "financial" ? "VND" : challenge.category === "streak" ? "ngày" : ""}
                                            </span>
                                        </div>
                                        <Progress value={progressPercentage} className="h-2" />
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="flex justify-between gap-2 pt-4">
                                {challenge.status === "not-started" && (
                                    <Button
                                        onClick={() => handleStartChallenge(challenge.id)}
                                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                                    >
                                        <Play className="h-4 w-4 mr-2" /> Bắt đầu
                                    </Button>
                                )}
                                {challenge.status === "in-progress" && (
                                    <>
                                        <Button
                                            onClick={() => openProgressUpdateDialog(challenge)}
                                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                                        >
                                            <Eye className="h-4 w-4 mr-2" /> Xem tiến độ
                                        </Button>
                                        <Button
                                            onClick={() => handleMarkFailed(challenge.id)}
                                            variant="outline"
                                            className="flex-1 text-rose-500 border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                                        >
                                            <XCircle className="h-4 w-4 mr-2" /> Đánh dấu thất bại
                                        </Button>
                                    </>
                                )}
                                {challenge.status === "completed" && (
                                    <Button disabled className="flex-1 bg-green-500 text-white">
                                        <CheckCircle className="h-4 w-4 mr-2" /> Đã hoàn thành
                                    </Button>
                                )}
                                {challenge.status === "failed" && (
                                    <Button disabled className="flex-1 bg-red-500 text-white">
                                        <XCircle className="h-4 w-4 mr-2" /> Đã thất bại
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>

            {/* Progress Update Dialog */}
            {selectedChallenge && (
                <Dialog open={openProgressDialog} onOpenChange={setOpenProgressDialog}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Cập nhật tiến độ: {selectedChallenge.name}</DialogTitle>
                            <DialogDescription>Nhập giá trị hiện tại của bạn cho thử thách này.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="progress" className="text-right">
                                    Tiến độ hiện tại
                                </Label>
                                <Input
                                    id="progress"
                                    type="number"
                                    value={progressInput}
                                    onChange={(e) => setProgressInput(e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                                Mục tiêu: {selectedChallenge.targetValue}{" "}
                                {selectedChallenge.category === "financial"
                                    ? "VND"
                                    : selectedChallenge.category === "streak"
                                        ? "ngày"
                                        : ""}
                            </p>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleUpdateProgress}>Cập nhật</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Create New Challenge Dialog */}
            <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Tạo Thử thách Mới</DialogTitle>
                        <DialogDescription>Tạo một thử thách cá nhân để giúp bạn đạt được mục tiêu cai thuốc.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="new-challenge-name">Tên thử thách</Label>
                            <Input
                                id="new-challenge-name"
                                value={newChallengeForm.name}
                                onChange={(e) => setNewChallengeForm({ ...newChallengeForm, name: e.target.value })}
                                placeholder="Ví dụ: 7 ngày không hút thuốc"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="new-challenge-description">Mô tả</Label>
                            <Textarea
                                id="new-challenge-description"
                                value={newChallengeForm.description}
                                onChange={(e) => setNewChallengeForm({ ...newChallengeForm, description: e.target.value })}
                                placeholder="Mô tả chi tiết về thử thách này..."
                                className="min-h-[80px]"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="new-challenge-category">Danh mục</Label>
                                <select
                                    id="new-challenge-category"
                                    value={newChallengeForm.category}
                                    onChange={(e) =>
                                        setNewChallengeForm({
                                            ...newChallengeForm,
                                            category: e.target.value as
                                                | "health"
                                                | "mindfulness"
                                                | "social"
                                                | "streak"
                                                | "financial"
                                                | "other",
                                        })
                                    }
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="health">Sức khỏe</option>
                                    <option value="mindfulness">Chánh niệm</option>
                                    <option value="social">Xã hội</option>
                                    <option value="streak">Chuỗi ngày</option>
                                    <option value="financial">Tài chính</option>
                                    <option value="other">Khác</option>
                                </select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="new-challenge-target-value">Giá trị mục tiêu</Label>
                                <Input
                                    id="new-challenge-target-value"
                                    type="number"
                                    value={newChallengeForm.targetValue}
                                    onChange={(e) =>
                                        setNewChallengeForm({ ...newChallengeForm, targetValue: Number(e.target.value) || 0 })
                                    }
                                    placeholder="Ví dụ: 7 (cho 7 ngày)"
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="new-challenge-icon">Biểu tượng (Lucide React name)</Label>
                            <select
                                id="new-challenge-icon"
                                value={newChallengeForm.icon}
                                onChange={(e) => setNewChallengeForm({ ...newChallengeForm, icon: e.target.value })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="shield">Shield</option>
                                <option value="coins">Coins</option>
                                <option value="activity">Activity</option>
                                <option value="users">Users</option>
                                <option value="flame">Flame</option>
                                <option value="info">Info (Mặc định)</option>
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenCreateDialog(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleCreateUserChallenge}>Tạo thử thách</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
