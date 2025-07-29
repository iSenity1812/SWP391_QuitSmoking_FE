"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
    Users,
    BarChart3,
    Loader2,
    Crown,
    Target,
    Trash2,
    CheckCircle,
    AlertCircle,
    Eye,
    EyeOff,
} from "lucide-react"
import { adminService, type MemberProfile, type SubscriptionInfo, type QuitPlanInfo } from "@/services/api/adminService"
// Import UserTable component và UserAnalyticsCharts
import UserTable from "../users/components/UserTable"
import { UserAnalyticsCharts } from "../users/components/UserAnalyticsCharts"
import { toast } from "@/utils/toast"

interface EditUserForm {
    username: string
    email: string
    profilePicture: string
}

interface UserEditDialogState {
    subscriptions: SubscriptionInfo[]
    quitPlans: QuitPlanInfo[]
    loading: boolean
    error: string | null
}

export function UserManagement() {
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const [editingUser, setEditingUser] = useState<MemberProfile | null>(null)
    const [editForm, setEditForm] = useState<EditUserForm>({
        username: "",
        email: "",
        profilePicture: "",
    })
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [dialogState, setDialogState] = useState<UserEditDialogState>({
        subscriptions: [],
        quitPlans: [],
        loading: false,
        error: null,
    })
    const [actionFeedback, setActionFeedback] = useState<{
        type: 'success' | 'error' | null
        message: string
    }>({ type: null, message: '' })

    // Add User Modal States
    const [showAddUserModal, setShowAddUserModal] = useState(false)
    const [addUserLoading, setAddUserLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [userForm, setUserForm] = useState<{
        username: string;
        email: string;
        password: string;
        role: 'COACH' | 'CONTENT_ADMIN' | 'SUPER_ADMIN';
        fullName: string;
        coachBio: string;
        active: boolean;
    }>({
        username: "",
        email: "",
        password: "",
        role: "COACH",
        fullName: "",
        coachBio: "",
        active: true
    })

    useEffect(() => {
        // We don't need to fetch members here anymore
        // The individual components will handle their own data fetching
    }, [refreshTrigger])

    const handleEditUser = async (user: MemberProfile) => {
        setEditingUser(user)
        setEditForm({
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture || "",
        })
        setShowEditDialog(true)

        // Load user's subscriptions and quit plans
        setDialogState(prev => ({ ...prev, loading: true, error: null }))
        try {
            const [subscriptions, quitPlans] = await Promise.all([
                adminService.getUserSubscriptions(user.userId),
                adminService.getUserQuitPlans(user.userId)
            ])
            setDialogState({
                subscriptions,
                quitPlans,
                loading: false,
                error: null,
            })
        } catch (error) {
            setDialogState(prev => ({
                ...prev,
                loading: false,
                error: error instanceof Error ? error.message : 'Lỗi khi tải dữ liệu',
            }))
        }
    }

    const handleToggleStatus = async (userId: string) => {
        try {
            // Gọi API để toggle status
            const updatedUser = await adminService.toggleUserStatus(userId);

            // Show success feedback
            setActionFeedback({
                type: 'success',
                message: `Trạng thái người dùng đã được ${updatedUser.isActive ? 'kích hoạt' : 'vô hiệu hóa'} thành công.`
            })

            // Clear feedback after 3 seconds
            setTimeout(() => {
                setActionFeedback({ type: null, message: '' })
            }, 3000)

            setRefreshTrigger(prev => prev + 1)
        } catch (error) {
            setActionFeedback({
                type: 'error',
                message: error instanceof Error ? error.message : 'Lỗi khi thay đổi trạng thái người dùng'
            })

            // Clear feedback after 5 seconds
            setTimeout(() => {
                setActionFeedback({ type: null, message: '' })
            }, 5000)
        }
    }

    // Handle Add User Functions
    const handleInputChange = (field: string, value: string | boolean) => {
        setUserForm(prev => ({
            ...prev,
            [field]: field === 'role' ? value as 'COACH' | 'CONTENT_ADMIN' | 'SUPER_ADMIN' : value
        }))
    }

    const resetForm = () => {
        setUserForm({
            username: "",
            email: "",
            password: "",
            role: "COACH",
            fullName: "",
            coachBio: "",
            active: true
        })
        setShowPassword(false)
    }

    const validateForm = () => {
        if (!userForm.username.trim()) {
            toast.error("Tên đăng nhập không được để trống")
            return false
        }
        if (!userForm.email.trim()) {
            toast.error("Email không được để trống")
            return false
        }
        if (!userForm.password.trim()) {
            toast.error("Mật khẩu không được để trống")
            return false
        }
        if (userForm.role === "COACH" && !userForm.fullName.trim()) {
            toast.error("Họ tên không được để trống cho Coach")
            return false
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(userForm.email)) {
            toast.error("Email không hợp lệ")
            return false
        }

        if (userForm.password.length < 6) {
            toast.error("Mật khẩu phải có ít nhất 6 ký tự")
            return false
        }

        return true
    }

    const handleAddUser = async () => {
        if (!validateForm()) return

        setAddUserLoading(true)
        try {
            await adminService.createUser(userForm)
            toast.success("Thêm người dùng thành công!")

            // Refresh user list
            setRefreshTrigger(prev => prev + 1)

            // Close modal and reset form
            setShowAddUserModal(false)
            resetForm()
        } catch (error) {
            console.error("Error adding user:", error)
            toast.error(error instanceof Error ? error.message : "Lỗi khi thêm người dùng")
        } finally {
            setAddUserLoading(false)
        }
    }

    const handleAddUserClick = () => {
        setShowAddUserModal(true)
    }

    const handleUpdateUser = async () => {
        if (!editingUser) return

        // Validation
        if (!editForm.username.trim()) {
            setActionFeedback({
                type: 'error',
                message: 'Tên người dùng không được để trống.'
            })
            return
        }

        if (!editForm.email.trim()) {
            setActionFeedback({
                type: 'error',
                message: 'Email không được để trống.'
            })
            return
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(editForm.email)) {
            setActionFeedback({
                type: 'error',
                message: 'Email không hợp lệ.'
            })
            return
        }

        try {
            // Tạo dữ liệu update theo format backend expect
            const updateData = {
                username: editForm.username.trim(),
                email: editForm.email.trim(),
            }

            // Gọi API để update user
            await adminService.updateUserProfile(editingUser.userId, updateData)

            // Show success feedback
            setActionFeedback({
                type: 'success',
                message: 'Thông tin người dùng đã được cập nhật thành công.'
            })

            // Clear feedback after 3 seconds
            setTimeout(() => {
                setActionFeedback({ type: null, message: '' })
            }, 3000)

            setShowEditDialog(false)
            setEditingUser(null)
            setRefreshTrigger(prev => prev + 1)
        } catch (error) {
            setActionFeedback({
                type: 'error',
                message: error instanceof Error ? error.message : 'Lỗi khi cập nhật thông tin người dùng'
            })

            // Clear feedback after 5 seconds
            setTimeout(() => {
                setActionFeedback({ type: null, message: '' })
            }, 5000)
        }
    }

    const handleDeleteQuitPlan = async (quitPlanId: number) => {
        if (!confirm('Bạn có chắc chắn muốn xóa kế hoạch này?')) return

        try {
            await adminService.deleteQuitPlan(quitPlanId)

            // Update dialog state
            setDialogState(prev => ({
                ...prev,
                quitPlans: prev.quitPlans.filter(plan => plan.quitPlanId !== quitPlanId)
            }))

            setActionFeedback({
                type: 'success',
                message: 'Kế hoạch cai thuốc đã được xóa thành công.'
            })

            // Clear feedback after 3 seconds
            setTimeout(() => {
                setActionFeedback({ type: null, message: '' })
            }, 3000)
        } catch (error) {
            setActionFeedback({
                type: 'error',
                message: error instanceof Error ? error.message : 'Lỗi khi xóa kế hoạch cai thuốc'
            })

            // Clear feedback after 5 seconds
            setTimeout(() => {
                setActionFeedback({ type: null, message: '' })
            }, 5000)
        }
    }

    const handleCloseEditDialog = () => {
        setShowEditDialog(false)
        setEditingUser(null)
        setDialogState({
            subscriptions: [],
            quitPlans: [],
            loading: false,
            error: null,
        })
    }

    return (
        <div className="space-y-6">
            {/* Success/Error Feedback */}
            {actionFeedback.type && (
                <Alert className={`mb-4 ${actionFeedback.type === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20'}`}>
                    {actionFeedback.type === 'success' ? (
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    )}
                    <AlertDescription className={actionFeedback.type === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}>
                        {actionFeedback.message}
                    </AlertDescription>
                </Alert>
            )}

            {/* Main Tabs */}
            <Tabs defaultValue="table" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="table" className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Quản Lý Người Dùng
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Thống Kê & Phân Tích
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="table" className="space-y-6">
                    {/* User Management with Enhanced Table */}
                    <UserTable
                        onEditUser={handleEditUser}
                        onToggleStatus={handleToggleStatus}
                        onAddUser={handleAddUserClick}
                        refreshTrigger={refreshTrigger}
                    />
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                    {/* Analytics Charts */}
                    <UserAnalyticsCharts refreshTrigger={refreshTrigger} />
                </TabsContent>
            </Tabs>

            {/* Enhanced Edit User Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="sm:max-w-[800px] max-h-[90vh] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                            Quản lý người dùng: {editingUser?.username}
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400">
                            Cập nhật thông tin và quản lý dữ liệu người dùng
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="profile" className="w-full">
                        <TabsList className="grid w-full grid-cols-1">
                            <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
                            {/* <TabsTrigger value="subscriptions">Gói đăng ký</TabsTrigger>
                            <TabsTrigger value="quit-plans">Kế hoạch cai thuốc</TabsTrigger> */}
                        </TabsList>

                        <TabsContent value="profile" className="space-y-4">
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username" className="text-gray-700 dark:text-gray-300">Username *</Label>
                                    <Input
                                        id="username"
                                        value={editForm.username}
                                        onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                                        placeholder="Nhập tên người dùng"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={editForm.email}
                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                                        placeholder="Nhập email"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="profilePicture" className="text-gray-700 dark:text-gray-300">Ảnh đại diện URL</Label>
                                    <Input
                                        id="profilePicture"
                                        value={editForm.profilePicture}
                                        onChange={(e) => setEditForm({ ...editForm, profilePicture: e.target.value })}
                                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                                        placeholder="https://example.com/avatar.jpg"
                                    />
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                                    <p><strong>Lưu ý:</strong></p>
                                    <ul className="list-disc list-inside mt-1 space-y-1">
                                        <li>Để thay đổi trạng thái hoạt động, sử dụng nút toggle trong bảng người dùng.</li>
                                        <li>Vai trò và gói đăng ký được quản lý trong các tab riêng biệt.</li>
                                    </ul>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="subscriptions" className="space-y-4">
                            <div className="py-4">
                                <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Gói đăng ký của người dùng</h3>

                                {dialogState.loading ? (
                                    <div className="flex items-center justify-center h-32">
                                        <Loader2 className="w-6 h-6 animate-spin text-gray-600 dark:text-gray-400" />
                                        <span className="ml-2">Đang tải...</span>
                                    </div>
                                ) : dialogState.error ? (
                                    <Alert className="border-red-500 bg-red-50 dark:bg-red-900/20">
                                        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                        <AlertDescription className="text-red-800 dark:text-red-200">
                                            {dialogState.error}
                                        </AlertDescription>
                                    </Alert>
                                ) : dialogState.subscriptions.length > 0 ? (
                                    <div className="space-y-3">
                                        {dialogState.subscriptions.map((subscription) => (
                                            <Card key={subscription.subscriptionId} className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <Crown className="w-5 h-5 text-yellow-500" />
                                                        <div>
                                                            <p className="font-medium">Subscription #{subscription.subscriptionId}</p>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                Gói: {subscription.packageName}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <Badge variant={subscription.status === 'ACTIVE' ? "default" : "secondary"}>
                                                            {subscription.status === 'ACTIVE' ? "Hoạt động" : "Không hoạt động"}
                                                        </Badge>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                            {new Date(subscription.startDate).toLocaleDateString('vi-VN')} - {new Date(subscription.endDate).toLocaleDateString('vi-VN')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                        <Crown className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p>Người dùng này chưa có gói đăng ký nào.</p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="quit-plans" className="space-y-4">
                            <div className="py-4">
                                <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Kế hoạch cai thuốc</h3>

                                {dialogState.loading ? (
                                    <div className="flex items-center justify-center h-32">
                                        <Loader2 className="w-6 h-6 animate-spin text-gray-600 dark:text-gray-400" />
                                        <span className="ml-2">Đang tải...</span>
                                    </div>
                                ) : dialogState.error ? (
                                    <Alert className="border-red-500 bg-red-50 dark:bg-red-900/20">
                                        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                        <AlertDescription className="text-red-800 dark:text-red-200">
                                            {dialogState.error}
                                        </AlertDescription>
                                    </Alert>
                                ) : dialogState.quitPlans.length > 0 ? (
                                    <div className="space-y-3">
                                        {dialogState.quitPlans.map((plan) => (
                                            <Card key={plan.quitPlanId} className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <Target className="w-5 h-5 text-blue-500" />
                                                        <div>
                                                            <p className="font-medium">Kế hoạch #{plan.quitPlanId}</p>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                Bắt đầu: {new Date(plan.startDate).toLocaleDateString('vi-VN')}
                                                                {plan.goalDate && plan.goalDate !== '2999-12-31' && ` - ${new Date(plan.goalDate).toLocaleDateString('vi-VN')}`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Badge variant={
                                                            plan.status === 'ACTIVE' ? 'default' :
                                                                plan.status === 'COMPLETED' ? 'secondary' :
                                                                    plan.status === 'PAUSED' ? 'outline' : 'destructive'
                                                        }>
                                                            {plan.status === 'ACTIVE' ? 'Đang thực hiện' :
                                                                plan.status === 'COMPLETED' ? 'Hoàn thành' :
                                                                    plan.status === 'PAUSED' ? 'Tạm dừng' : 'Thất bại'}
                                                        </Badge>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleDeleteQuitPlan(plan.quitPlanId)}
                                                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                        <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p>Người dùng này chưa có kế hoạch cai thuốc nào.</p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="flex justify-end space-x-2 pt-4 border-t">
                        <Button variant="outline" onClick={handleCloseEditDialog}>
                            Đóng
                        </Button>
                        <Button onClick={handleUpdateUser}>
                            Lưu thay đổi
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Add User Modal */}
            <Dialog open={showAddUserModal} onOpenChange={setShowAddUserModal}>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Thêm Người Dùng Mới</DialogTitle>
                        <DialogDescription>
                            Nhập thông tin để tạo tài khoản người dùng mới
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                                Tên đăng nhập *
                            </Label>
                            <Input
                                id="username"
                                value={userForm.username}
                                onChange={(e) => handleInputChange('username', e.target.value)}
                                className="col-span-3"
                                placeholder="Nhập tên đăng nhập"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email *
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={userForm.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className="col-span-3"
                                placeholder="Nhập email"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">
                                Mật khẩu *
                            </Label>
                            <div className="col-span-3 relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={userForm.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    placeholder="Nhập mật khẩu"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">
                                Vai trò *
                            </Label>
                            <Select
                                value={userForm.role}
                                onValueChange={(value) => handleInputChange('role', value)}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="COACH">Huấn luyện viên</SelectItem>
                                    <SelectItem value="CONTENT_ADMIN">Quản trị nội dung</SelectItem>
                                    <SelectItem value="SUPER_ADMIN">Quản trị viên</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="fullName" className="text-right">
                                Họ tên {userForm.role === "COACH" ? "*" : ""}
                            </Label>
                            <Input
                                id="fullName"
                                value={userForm.fullName}
                                onChange={(e) => handleInputChange('fullName', e.target.value)}
                                className="col-span-3"
                                placeholder="Nhập họ tên đầy đủ"
                            />
                        </div>

                        {userForm.role === "COACH" && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="coachBio" className="text-right">
                                    Tiểu sử
                                </Label>
                                <Textarea
                                    id="coachBio"
                                    value={userForm.coachBio}
                                    onChange={(e) => handleInputChange('coachBio', e.target.value)}
                                    className="col-span-3"
                                    placeholder="Nhập tiểu sử của huấn luyện viên"
                                    rows={3}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setShowAddUserModal(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleAddUser} disabled={addUserLoading}>
                            {addUserLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Thêm người dùng
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
