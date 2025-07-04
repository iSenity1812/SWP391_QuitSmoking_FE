"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
    Users,
    UserPlus,
    Search,
    Filter,
    BarChart3,
    TrendingUp,
    Loader2,
    Eye,
    EyeOff,
    Edit,
    Trash2,
    X,
} from "lucide-react"
import { adminService, type User } from "@/pages/admin/component/service/adminService"
import { ChartContainer, LineChart } from "@/components/ui/Chart"
import { useTheme } from "@/context/ThemeContext"

interface EditUserForm {
    name: string
    username: string
    email: string
    password: string
    phone: string
    status: "active" | "inactive"
    plan: "Cơ Bản" | "Premium"
}

export function UserManagement() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({})
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [editForm, setEditForm] = useState<EditUserForm>({
        name: "",
        username: "",
        email: "",
        password: "",
        phone: "",
        status: "active",
        plan: "Cơ Bản",
    })
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [userToDelete, setUserToDelete] = useState<User | null>(null)
    const { theme } = useTheme()

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true)
                const userData = await adminService.getUsers(currentPage, 10)
                setUsers(userData)
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu người dùng:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [currentPage])

    const togglePasswordVisibility = (userId: string) => {
        setShowPasswords((prev) => ({
            ...prev,
            [userId]: !prev[userId],
        }))
    }

    const handleEditUser = (user: User) => {
        setEditingUser(user)
        setEditForm({
            name: user.name,
            username: user.username,
            email: user.email,
            password: user.password,
            phone: user.phone,
            status: user.status,
            plan: user.plan,
        })
        setShowEditDialog(true)
    }

    const handleUpdateUser = async () => {
        if (!editingUser) return

        try {
            const updatedUser = await adminService.updateUser(editingUser.id, editForm)
            setUsers(users.map((user) => (user.id === editingUser.id ? updatedUser : user)))
            setShowEditDialog(false)
            setEditingUser(null)
        } catch (error) {
            console.error("Lỗi khi cập nhật người dùng:", error)
        }
    }

    const handleDeleteUser = (user: User) => {
        setUserToDelete(user)
        setShowDeleteDialog(true)
    }

    const confirmDeleteUser = async () => {
        if (!userToDelete) return

        try {
            await adminService.deleteUser(userToDelete.id)
            setUsers(users.filter((user) => user.id !== userToDelete.id))
            setShowDeleteDialog(false)
            setUserToDelete(null)
        } catch (error) {
            console.error("Lỗi khi xóa người dùng:", error)
        }
    }

    const handleCloseEditDialog = () => {
        setShowEditDialog(false)
        setEditingUser(null)
    }

    const handleCloseDeleteDialog = () => {
        setShowDeleteDialog(false)
        setUserToDelete(null)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="ml-2">Đang tải dữ liệu người dùng...</span>
            </div>
        )
    }

    const chartColors = {
        primary: theme === "dark" ? "#60a5fa" : "#3b82f6",
        success: theme === "dark" ? "#34d399" : "#10b981",
        warning: theme === "dark" ? "#fbbf24" : "#f59e0b",
        purple: theme === "dark" ? "#a78bfa" : "#8b5cf6",
        red: theme === "dark" ? "#f87171" : "#ef4444",
    }

    // Generate chart data
    const userRegistrationData = Array.from({ length: 7 }, (_, i) => ({
        day: `Ngày ${i + 1}`,
        registrations: Math.floor(Math.random() * 50) + 20,
        active: Math.floor(Math.random() * 40) + 15,
        premium: Math.floor(Math.random() * 15) + 5,
    }))

    const userStatusData = [
        { status: "Hoạt động", count: users.filter((u) => u.status === "active").length * 10 },
        { status: "Không hoạt động", count: users.filter((u) => u.status === "inactive").length * 5 },
    ]

    const userActivityData = Array.from({ length: 12 }, (_, i) => ({
        month: `T${i + 1}`,
        newUsers: Math.floor(Math.random() * 100) + 50,
        activeUsers: Math.floor(Math.random() * 200) + 100,
        churnRate: Math.floor(Math.random() * 10) + 5,
    }))

    return (
        <div className="space-y-6">
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Registration Trends */}
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <span>Xu Hướng Đăng Ký</span>
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                            Đăng ký và hoạt động người dùng theo ngày
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer className="h-[300px]">
                            <LineChart
                                dataset={userRegistrationData}
                                xAxis={[{ scaleType: "point", dataKey: "day" }]}
                                series={[
                                    { dataKey: "registrations", label: "Đăng ký", color: chartColors.primary },
                                    { dataKey: "active", label: "Hoạt động", color: chartColors.success },
                                    { dataKey: "premium", label: "Premium", color: chartColors.warning },
                                ]}
                                width={500}
                                height={300}
                            />
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* User Status Distribution */}
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                            <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                            <span>Phân Bố Trạng Thái</span>
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                            Tình trạng hoạt động của người dùng
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer className="h-[300px]">
                            <LineChart
                                dataset={userStatusData}
                                xAxis={[{ scaleType: "point", dataKey: "status" }]}
                                series={[{ dataKey: "count", label: "Số lượng", color: chartColors.success }]}
                                width={500}
                                height={300}
                            />
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Monthly User Activity */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                        <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <span>Hoạt Động Người Dùng Hàng Tháng</span>
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                        Người dùng mới, hoạt động và tỷ lệ rời bỏ theo tháng
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer className="h-[400px]">
                        <LineChart
                            dataset={userActivityData}
                            xAxis={[{ scaleType: "point", dataKey: "month" }]}
                            series={[
                                { dataKey: "newUsers", label: "Người dùng mới", color: chartColors.primary },
                                { dataKey: "activeUsers", label: "Người dùng hoạt động", color: chartColors.success },
                                { dataKey: "churnRate", label: "Tỷ lệ rời bỏ (%)", color: chartColors.red },
                            ]}
                            width={800}
                            height={400}
                        />
                    </ChartContainer>
                </CardContent>
            </Card>

            {/* User Management Actions */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between text-gray-900 dark:text-gray-100">
                        <span>Quản Lý Người Dùng</span>
                        <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                                <Search className="w-4 h-4 mr-2" />
                                Tìm kiếm
                            </Button>
                            <Button size="sm" variant="outline">
                                <Filter className="w-4 h-4 mr-2" />
                                Lọc
                            </Button>
                            <Button size="sm">
                                <UserPlus className="w-4 h-4 mr-2" />
                                Thêm Người Dùng
                            </Button>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {users.map((user) => (
                            <div
                                key={user.id}
                                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                            >
                                <div className="flex items-center space-x-4">
                                    <Avatar>
                                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <p className="font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                                            <Badge variant={user.status === "active" ? "default" : "secondary"}>
                                                {user.status === "active" ? "Hoạt động" : "Không hoạt động"}
                                            </Badge>
                                            <Badge variant="outline">{user.plan}</Badge>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400">Username: </span>
                                                <span className="text-gray-900 dark:text-gray-100">{user.username}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400">Email: </span>
                                                <span className="text-gray-900 dark:text-gray-100">{user.email}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-gray-500 dark:text-gray-400">Password: </span>
                                                <span className="text-gray-900 dark:text-gray-100 font-mono">
                                                    {showPasswords[user.id.toString()] ? user.password : "••••••••"}
                                                </span>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => togglePasswordVisibility(user.id.toString())}
                                                    className="h-6 w-6 p-0"
                                                >
                                                    {showPasswords[user.id.toString()] ? (
                                                        <EyeOff className="h-3 w-3" />
                                                    ) : (
                                                        <Eye className="h-3 w-3" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="text-right text-sm">
                                        <p className="text-gray-900 dark:text-gray-100">Tham gia: {user.joinDate}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button size="sm" variant="outline" onClick={() => handleEditUser(user)}>
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => handleDeleteUser(user)}>
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center mt-6">
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                            >
                                Trước
                            </Button>
                            <Button variant="outline">{currentPage}</Button>
                            <Button variant="outline" onClick={() => setCurrentPage(currentPage + 1)}>
                                Sau
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Edit User Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader className="flex flex-row items-center justify-between">
                        <div>
                            <DialogTitle>Chỉnh Sửa Người Dùng</DialogTitle>
                            <DialogDescription>Cập nhật thông tin người dùng</DialogDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleCloseEditDialog}>
                            <X className="h-4 w-4" />
                        </Button>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Họ tên *</Label>
                                <Input
                                    id="name"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="username">Username *</Label>
                                <Input
                                    id="username"
                                    value={editForm.username}
                                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={editForm.email}
                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Mật khẩu *</Label>
                            <Input
                                id="password"
                                type="password"
                                value={editForm.password}
                                onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Số điện thoại</Label>
                            <Input
                                id="phone"
                                value={editForm.phone}
                                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="status">Trạng thái</Label>
                                <select
                                    id="status"
                                    value={editForm.status}
                                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as "active" | "inactive" })}
                                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="active">Hoạt động</option>
                                    <option value="inactive">Không hoạt động</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="plan">Gói dịch vụ</Label>
                                <select
                                    id="plan"
                                    value={editForm.plan}
                                    onChange={(e) => setEditForm({ ...editForm, plan: e.target.value as "Cơ Bản" | "Premium" })}
                                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="Cơ Bản">Cơ Bản</option>
                                    <option value="Premium">Premium</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={handleCloseEditDialog}>
                            Hủy
                        </Button>
                        <Button onClick={handleUpdateUser}>Cập nhật</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader className="flex flex-row items-center justify-between">
                        <div>
                            <DialogTitle>Xác nhận xóa</DialogTitle>
                            <DialogDescription>Bạn có chắc chắn muốn xóa người dùng này?</DialogDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleCloseDeleteDialog}>
                            <X className="h-4 w-4" />
                        </Button>
                    </DialogHeader>
                    {userToDelete && (
                        <div className="py-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Người dùng: <strong>{userToDelete.name}</strong>
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Email: <strong>{userToDelete.email}</strong>
                            </p>
                            <p className="text-sm text-red-600 mt-2">Hành động này không thể hoàn tác!</p>
                        </div>
                    )}
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={handleCloseDeleteDialog}>
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={confirmDeleteUser}>
                            Xóa
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
