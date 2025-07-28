"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Edit, Save, Mail, Shield, AlertCircle, X } from "lucide-react"
import { userService, type CoachProfileResponse } from "@/services/userService"
import { useAuth } from "@/hooks/useAuth"
import SidebarRight, { type SidebarRightRef } from "@/pages/user/components/SidebarRight"

export function CoachProfile() {
    const [isEditing, setIsEditing] = useState(false)
    const [profile, setProfile] = useState<CoachProfileResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [editForm, setEditForm] = useState({
        username: "",
        email: "",
    })
    const [emailError, setEmailError] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)
    const { user: authUser } = useAuth()
    const sidebarRef = useRef<SidebarRightRef>(null)

    // Fetch profile data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true)
                setError(null)
                const profileData = await userService.getCoachProfile()
                setProfile(profileData)
                setEditForm({
                    username: profileData.username,
                    email: profileData.email,
                })
            } catch (err) {
                console.error("Error fetching coach profile:", err)
                setError("Không thể tải thông tin hồ sơ. Vui lòng thử lại sau.")
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [])

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const handleEmailChange = (email: string) => {
        setEditForm({ ...editForm, email })

        if (email.trim() === "") {
            setEmailError("Email không được để trống")
        } else if (!validateEmail(email)) {
            setEmailError("Email phải có định dạng hợp lệ (ví dụ: example@domain.com)")
        } else {
            setEmailError(null)
        }
    }

    const getProfilePictureUrl = (profilePicture?: string | null) => {
        if (!profilePicture) return null

        // If it's already a full URL, return as is
        if (profilePicture.startsWith("http")) {
            return profilePicture
        }

        // If it's a relative path, construct the full URL
        const baseUrl = "http://localhost:8080"
        const cleanPath = profilePicture.startsWith("/") ? profilePicture : `/${profilePicture}`
        return `${baseUrl}${cleanPath}`
    }

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "COACH":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
            case "SUPER_ADMIN":
                return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
            case "CONTENT_ADMIN":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
            case "PREMIUM_MEMBER":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
        }
    }

    const getRoleDisplayName = (role: string) => {
        switch (role) {
            case "COACH":
                return "Huấn Luyện Viên"
            case "SUPER_ADMIN":
                return "Quản Trị Viên Cấp Cao"
            case "CONTENT_ADMIN":
                return "Quản Trị Nội Dung"
            case "PREMIUM_MEMBER":
                return "Thành Viên Premium"
            case "NORMAL_MEMBER":
                return "Thành Viên"
            default:
                return role
        }
    }

    const handleSave = async () => {
        if (!profile) return

        // Validate email before saving
        if (!editForm.email.trim()) {
            setEmailError("Email không được để trống")
            return
        }

        if (!validateEmail(editForm.email)) {
            setEmailError("Email phải có định dạng hợp lệ (ví dụ: example@domain.com)")
            return
        }

        try {
            setSaving(true)
            setError(null)

            await userService.updateProfile({
                name: editForm.username,
                email: editForm.email,
            })

            // Update local state
            const updatedProfile = {
                ...profile,
                username: editForm.username,
                email: editForm.email,
            }
            setProfile(updatedProfile)
            setIsEditing(false)
            setEmailError(null)
        } catch (err) {
            console.error("Error updating profile:", err)
            setError("Không thể cập nhật hồ sơ. Vui lòng thử lại sau.")
        } finally {
            setSaving(false)
        }
    }

    const handleCancel = () => {
        if (profile) {
            setEditForm({
                username: profile.username,
                email: profile.email,
            })
        }
        setIsEditing(false)
        setError(null)
        setEmailError(null)
    }

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
                <div className="flex-1 p-6">
                    <div className="space-y-6">
                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700/50">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                                    <Skeleton className="h-24 w-24 rounded-full" />
                                    <div className="flex-1 space-y-3">
                                        <Skeleton className="h-8 w-64" />
                                        <Skeleton className="h-6 w-48" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <div className="w-80">
                    <Skeleton className="h-screen w-full" />
                </div>
            </div>
        )
    }

    if (error && !profile) {
        return (
            <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
                <div className="flex-1 p-6">
                    <div className="space-y-6">
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    </div>
                </div>
                <div className="w-80">
                    <SidebarRight currentUserId={authUser?.userId || ""} ref={sidebarRef} />
                </div>
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
                <div className="flex-1 p-6">
                    <div className="space-y-6">
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>Không tìm thấy thông tin hồ sơ.</AlertDescription>
                        </Alert>
                    </div>
                </div>
                <div className="w-80">
                    <SidebarRight currentUserId={authUser?.userId || ""} ref={sidebarRef} />
                </div>
            </div>
        )
    }

    const profileImageUrl = getProfilePictureUrl(profile.profilePicture)

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
            {/* Main Content */}
            <div className="flex-1 p-6">
                <div className="space-y-6">
                    {/* Error Alert */}
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Profile Header */}
                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700/50">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <User className="w-5 h-5 text-blue-500" />
                                    <span>Thông Tin Hồ Sơ</span>
                                </div>
                                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" disabled={saving}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Chỉnh sửa
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                                {/* Avatar */}
                                <div className="relative">
                                    <Avatar className="h-24 w-24 border-4 border-blue-200 dark:border-blue-500">
                                        {profileImageUrl ? (
                                            <AvatarImage
                                                src={profileImageUrl || "/placeholder.svg"}
                                                alt={profile.username}
                                                className="object-cover"
                                            />
                                        ) : null}
                                        <AvatarFallback className="text-2xl bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                                            {profile.username.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>

                                {/* Profile Info */}
                                <div className="flex-1 space-y-3">
                                    <div>
                                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{profile.username}</h1>
                                        <Badge className={`mt-2 ${getRoleBadgeColor(profile.role)}`}>
                                            <Shield className="w-3 h-3 mr-1" />
                                            {getRoleDisplayName(profile.role)}
                                        </Badge>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                                            <Mail className="w-4 h-4" />
                                            <span className="text-sm">{profile.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>



                    {/* Profile Details Card */}
                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700/50">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <User className="w-5 h-5 text-green-500" />
                                <span>Chi Tiết Tài Khoản</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">ID Người Dùng</label>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-mono">{profile.userId}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Vai Trò</label>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{getRoleDisplayName(profile.role)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tên Đăng Nhập</label>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{profile.username}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{profile.email}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Edit Profile Dialog */}
                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center justify-between">
                                <span>Chỉnh Sửa Hồ Sơ</span>
                                <Button variant="ghost" size="sm" onClick={handleCancel} disabled={saving}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tên Đăng Nhập</label>
                                <Input
                                    value={editForm.username}
                                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                    placeholder="Nhập tên đăng nhập"
                                    disabled={saving}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                                <Input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => handleEmailChange(e.target.value)}
                                    placeholder="Nhập địa chỉ email (ví dụ: example@domain.com)"
                                    disabled={saving}
                                    className={`mt-1 ${emailError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                                />
                                {emailError && (
                                    <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {emailError}
                                    </p>
                                )}
                            </div>
                            <div className="flex space-x-2 pt-4">
                                <Button
                                    onClick={handleSave}
                                    className="flex-1"
                                    disabled={saving || !editForm.username.trim() || !editForm.email.trim() || !!emailError}
                                >
                                    {saving ? (
                                        <>
                                            <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Đang lưu...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Lưu Thay Đổi
                                        </>
                                    )}
                                </Button>
                                <Button onClick={handleCancel} variant="outline" className="flex-1 bg-transparent" disabled={saving}>
                                    Hủy
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Sidebar Right */}
            <div className="w-80">
                <SidebarRight currentUserId={profile.userId} ref={sidebarRef} />
            </div>
        </div>
    )
}
