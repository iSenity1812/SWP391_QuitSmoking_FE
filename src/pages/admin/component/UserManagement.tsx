// "use client"

// import { useEffect, useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Textarea } from "@/components/ui/textarea"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Users, UserPlus, Search, Filter, BarChart3, TrendingUp, Loader2, Eye, EyeOff } from "lucide-react"
// import { adminService, type UserProfile } from "@/services/api/adminService"
// import { ChartContainer, LineChart } from "@/components/ui/Chart"
// import { useTheme } from "@/context/ThemeContext"
// import { toast } from "@/utils/toast"

// export function UserManagement() {
//     const [users, setUsers] = useState<UserProfile[]>([])
//     const [loading, setLoading] = useState(true)
//     const [currentPage, setCurrentPage] = useState(1)
//     const { theme } = useTheme()

//     // Add User Modal States
//     const [showAddUserModal, setShowAddUserModal] = useState(false)
//     const [addUserLoading, setAddUserLoading] = useState(false)
//     const [showPassword, setShowPassword] = useState(false)
//     const [userForm, setUserForm] = useState<{
//         username: string;
//         email: string;
//         password: string;
//         role: 'NORMAL_MEMBER' | 'COACH' | 'CONTENT_ADMIN' | 'SUPER_ADMIN';
//         fullName: string;
//         coachBio: string;
//         active: boolean;
//     }>({
//         username: "",
//         email: "",
//         password: "",
//         role: "NORMAL_MEMBER",
//         fullName: "",
//         coachBio: "",
//         active: true
//     })

//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 setLoading(true)
//                 const userData = await adminService.getAllUsers()
//                 setUsers(userData)
//             } catch (error) {
//                 console.error("Lỗi khi tải dữ liệu người dùng:", error)
//                 toast.error("Lỗi khi tải dữ liệu người dùng")
//             } finally {
//                 setLoading(false)
//             }
//         }

//         fetchUsers()
//     }, [currentPage])

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center h-64">
//                 <Loader2 className="w-8 h-8 animate-spin" />
//                 <span className="ml-2">Đang tải dữ liệu người dùng...</span>
//             </div>
//         )
//     }

//     const chartColors = {
//         primary: theme === "dark" ? "#60a5fa" : "#3b82f6",
//         success: theme === "dark" ? "#34d399" : "#10b981",
//         warning: theme === "dark" ? "#fbbf24" : "#f59e0b",
//         purple: theme === "dark" ? "#a78bfa" : "#8b5cf6",
//         red: theme === "dark" ? "#f87171" : "#ef4444",
//     }

//     // Generate chart data
//     const userRegistrationData = Array.from({ length: 7 }, (_, i) => ({
//         day: `Ngày ${i + 1}`,
//         registrations: Math.floor(Math.random() * 50) + 20,
//         active: Math.floor(Math.random() * 40) + 15,
//         premium: Math.floor(Math.random() * 15) + 5,
//     }))

//     const userStatusData = [
//         { status: "Hoạt động", count: users.filter((u) => u.isActive).length * 10 },
//         { status: "Không hoạt động", count: users.filter((u) => !u.isActive).length * 5 },
//     ]

//     const userActivityData = Array.from({ length: 12 }, (_, i) => ({
//         month: `T${i + 1}`,
//         newUsers: Math.floor(Math.random() * 100) + 50,
//         activeUsers: Math.floor(Math.random() * 200) + 100,
//         churnRate: Math.floor(Math.random() * 10) + 5,
//     }))

//     // Handle Add User Functions
//     const handleInputChange = (field: string, value: string | boolean) => {
//         setUserForm(prev => ({
//             ...prev,
//             [field]: field === 'role' ? value as 'NORMAL_MEMBER' | 'COACH' | 'CONTENT_ADMIN' | 'SUPER_ADMIN' : value
//         }))
//     }

//     const resetForm = () => {
//         setUserForm({
//             username: "",
//             email: "",
//             password: "",
//             role: "NORMAL_MEMBER",
//             fullName: "",
//             coachBio: "",
//             active: true
//         })
//         setShowPassword(false)
//     }

//     const validateForm = () => {
//         if (!userForm.username.trim()) {
//             toast.error("Tên đăng nhập không được để trống")
//             return false
//         }
//         if (!userForm.email.trim()) {
//             toast.error("Email không được để trống")
//             return false
//         }
//         if (!userForm.password.trim()) {
//             toast.error("Mật khẩu không được để trống")
//             return false
//         }
//         if (userForm.role === "COACH" && !userForm.fullName.trim()) {
//             toast.error("Họ tên không được để trống cho Coach")
//             return false
//         }

//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//         if (!emailRegex.test(userForm.email)) {
//             toast.error("Email không hợp lệ")
//             return false
//         }

//         if (userForm.password.length < 6) {
//             toast.error("Mật khẩu phải có ít nhất 6 ký tự")
//             return false
//         }

//         return true
//     }

//     const handleAddUser = async () => {
//         if (!validateForm()) return

//         setAddUserLoading(true)
//         try {
//             await adminService.createUser(userForm)
//             toast.success("Thêm người dùng thành công!")

//             // Refresh user list
//             const userData = await adminService.getAllUsers()
//             setUsers(userData)

//             // Close modal and reset form
//             setShowAddUserModal(false)
//             resetForm()
//         } catch (error) {
//             console.error("Error adding user:", error)
//             toast.error(error instanceof Error ? error.message : "Lỗi khi thêm người dùng")
//         } finally {
//             setAddUserLoading(false)
//         }
//     }

//     return (
//         <div className="space-y-6">
//             <Tabs defaultValue="table" className="w-full">
//                 <TabsList className="grid w-full grid-cols-2">
//                     <TabsTrigger value="table" className="flex items-center gap-2">
//                         <Users className="w-4 h-4" />
//                         Quản Lý Người Dùng
//                     </TabsTrigger>
//                     <TabsTrigger value="analytics" className="flex items-center gap-2">
//                         <BarChart3 className="w-4 h-4" />
//                         Thống Kê & Phân Tích
//                     </TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="table" className="space-y-6">
//                     {/* User Management with Add User Button */}
//                     <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
//                         <CardHeader>
//                             <CardTitle className="flex items-center justify-between text-gray-900 dark:text-gray-100">
//                                 <span>Danh Sách Người Dùng</span>
//                                 <div className="flex space-x-2">
//                                     <Button size="sm" variant="outline">
//                                         <Search className="w-4 h-4 mr-2" />
//                                         Tìm kiếm
//                                     </Button>
//                                     <Button size="sm" variant="outline">
//                                         <Filter className="w-4 h-4 mr-2" />
//                                         Lọc
//                                     </Button>
//                                     <Dialog open={showAddUserModal} onOpenChange={setShowAddUserModal}>
//                                         <DialogTrigger asChild>
//                                             <Button size="sm">
//                                                 <UserPlus className="w-4 h-4 mr-2" />
//                                                 Thêm Người Dùng
//                                             </Button>
//                                         </DialogTrigger>
//                                         <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
//                                             <DialogHeader>
//                                                 <DialogTitle>Thêm Người Dùng Mới</DialogTitle>
//                                                 <DialogDescription>
//                                                     Nhập thông tin để tạo tài khoản người dùng mới
//                                                 </DialogDescription>
//                                             </DialogHeader>

//                                             <div className="grid gap-4 py-4">
//                                                 <div className="grid grid-cols-4 items-center gap-4">
//                                                     <Label htmlFor="username" className="text-right">
//                                                         Tên đăng nhập *
//                                                     </Label>
//                                                     <Input
//                                                         id="username"
//                                                         value={userForm.username}
//                                                         onChange={(e) => handleInputChange('username', e.target.value)}
//                                                         className="col-span-3"
//                                                         placeholder="Nhập tên đăng nhập"
//                                                     />
//                                                 </div>

//                                                 <div className="grid grid-cols-4 items-center gap-4">
//                                                     <Label htmlFor="email" className="text-right">
//                                                         Email *
//                                                     </Label>
//                                                     <Input
//                                                         id="email"
//                                                         type="email"
//                                                         value={userForm.email}
//                                                         onChange={(e) => handleInputChange('email', e.target.value)}
//                                                         className="col-span-3"
//                                                         placeholder="Nhập email"
//                                                     />
//                                                 </div>

//                                                 <div className="grid grid-cols-4 items-center gap-4">
//                                                     <Label htmlFor="password" className="text-right">
//                                                         Mật khẩu *
//                                                     </Label>
//                                                     <div className="col-span-3 relative">
//                                                         <Input
//                                                             id="password"
//                                                             type={showPassword ? "text" : "password"}
//                                                             value={userForm.password}
//                                                             onChange={(e) => handleInputChange('password', e.target.value)}
//                                                             placeholder="Nhập mật khẩu"
//                                                         />
//                                                         <Button
//                                                             type="button"
//                                                             variant="ghost"
//                                                             size="sm"
//                                                             className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                                                             onClick={() => setShowPassword(!showPassword)}
//                                                         >
//                                                             {showPassword ? (
//                                                                 <EyeOff className="h-4 w-4" />
//                                                             ) : (
//                                                                 <Eye className="h-4 w-4" />
//                                                             )}
//                                                         </Button>
//                                                     </div>
//                                                 </div>

//                                                 <div className="grid grid-cols-4 items-center gap-4">
//                                                     <Label htmlFor="role" className="text-right">
//                                                         Vai trò *
//                                                     </Label>
//                                                     <Select
//                                                         value={userForm.role}
//                                                         onValueChange={(value) => handleInputChange('role', value)}
//                                                     >
//                                                         <SelectTrigger className="col-span-3">
//                                                             <SelectValue />
//                                                         </SelectTrigger>
//                                                         <SelectContent>
//                                                             <SelectItem value="NORMAL_MEMBER">Thành viên thường</SelectItem>
//                                                             <SelectItem value="COACH">Huấn luyện viên</SelectItem>
//                                                             <SelectItem value="CONTENT_ADMIN">Quản trị nội dung</SelectItem>
//                                                             <SelectItem value="SUPER_ADMIN">Quản trị viên</SelectItem>
//                                                         </SelectContent>
//                                                     </Select>
//                                                 </div>

//                                                 {userForm.role === "COACH" && (
//                                                     <>
//                                                         <div className="grid grid-cols-4 items-center gap-4">
//                                                             <Label htmlFor="fullName" className="text-right">
//                                                                 Họ tên *
//                                                             </Label>
//                                                             <Input
//                                                                 id="fullName"
//                                                                 value={userForm.fullName}
//                                                                 onChange={(e) => handleInputChange('fullName', e.target.value)}
//                                                                 className="col-span-3"
//                                                                 placeholder="Nhập họ tên đầy đủ"
//                                                             />
//                                                         </div>

//                                                         <div className="grid grid-cols-4 items-center gap-4">
//                                                             <Label htmlFor="coachBio" className="text-right">
//                                                                 Tiểu sử
//                                                             </Label>
//                                                             <Textarea
//                                                                 id="coachBio"
//                                                                 value={userForm.coachBio}
//                                                                 onChange={(e) => handleInputChange('coachBio', e.target.value)}
//                                                                 className="col-span-3"
//                                                                 placeholder="Nhập tiểu sử của huấn luyện viên"
//                                                                 rows={3}
//                                                             />
//                                                         </div>
//                                                     </>
//                                                 )}
//                                             </div>

//                                             <div className="flex justify-end space-x-2">
//                                                 <Button variant="outline" onClick={() => setShowAddUserModal(false)}>
//                                                     Hủy
//                                                 </Button>
//                                                 <Button onClick={handleAddUser} disabled={addUserLoading}>
//                                                     {addUserLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                                                     Thêm người dùng
//                                                 </Button>
//                                             </div>
//                                         </DialogContent>
//                                     </Dialog>
//                                 </div>
//                             </CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="space-y-4">
//                                 {users.map((user) => (
//                                     <div
//                                         key={user.userId}
//                                         className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
//                                     >
//                                         <div className="flex items-center space-x-4">
//                                             <Avatar>
//                                                 <AvatarImage src={user.profilePicture || "/placeholder.svg"} />
//                                                 <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
//                                             </Avatar>
//                                             <div>
//                                                 <p className="font-medium text-gray-900 dark:text-gray-100">{user.username}</p>
//                                                 <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
//                                                 <p className="text-xs text-gray-500">Role: {user.role}</p>
//                                             </div>
//                                         </div>
//                                         <div className="flex items-center space-x-4">
//                                             <Badge
//                                                 variant={user.isActive ? "default" : "secondary"}
//                                                 className={user.isActive ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'}
//                                             >
//                                                 {user.isActive ? "Hoạt động" : "Không hoạt động"}
//                                             </Badge>
//                                             <Badge variant="outline">{user.role}</Badge>
//                                             <div className="text-right text-sm">
//                                                 <p>Tạo: {new Date(user.createdAt).toLocaleDateString('vi-VN')}</p>
//                                                 <p className="text-gray-500">Cập nhật: {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('vi-VN') : 'Chưa có'}</p>
//                                             </div>
//                                             <Button size="sm" variant="outline">
//                                                 Chi tiết
//                                             </Button>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>

//                             <div className="flex justify-center mt-6">
//                                 <div className="flex space-x-2">
//                                     <Button
//                                         variant="outline"
//                                         onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//                                         disabled={currentPage === 1}
//                                     >
//                                         Trước
//                                     </Button>
//                                     <Button variant="outline">{currentPage}</Button>
//                                     <Button variant="outline" onClick={() => setCurrentPage(currentPage + 1)}>
//                                         Sau
//                                     </Button>
//                                 </div>
//                             </div>
//                         </CardContent>
//                     </Card>
//                 </TabsContent>

//                 <TabsContent value="analytics" className="space-y-6">
//                     {/* Charts Section */}
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                         {/* User Registration Trends */}
//                         <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
//                             <CardHeader>
//                                 <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
//                                     <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//                                     <span>Xu Hướng Đăng Ký</span>
//                                 </CardTitle>
//                                 <CardDescription className="text-gray-600 dark:text-gray-400">
//                                     Đăng ký và hoạt động người dùng theo ngày
//                                 </CardDescription>
//                             </CardHeader>
//                             <CardContent>
//                                 <ChartContainer className="h-[300px]">
//                                     <LineChart
//                                         dataset={userRegistrationData}
//                                         xAxis={[{ scaleType: "point", dataKey: "day" }]}
//                                         series={[
//                                             { dataKey: "registrations", label: "Đăng ký", color: chartColors.primary },
//                                             { dataKey: "active", label: "Hoạt động", color: chartColors.success },
//                                             { dataKey: "premium", label: "Premium", color: chartColors.warning },
//                                         ]}
//                                         width={500}
//                                         height={300}
//                                     />
//                                 </ChartContainer>
//                             </CardContent>
//                         </Card>

//                         {/* User Status Distribution */}
//                         <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
//                             <CardHeader>
//                                 <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
//                                     <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
//                                     <span>Phân Bố Trạng Thái</span>
//                                 </CardTitle>
//                                 <CardDescription className="text-gray-600 dark:text-gray-400">
//                                     Tình trạng hoạt động của người dùng
//                                 </CardDescription>
//                             </CardHeader>
//                             <CardContent>
//                                 <ChartContainer className="h-[300px]">
//                                     <LineChart
//                                         dataset={userStatusData}
//                                         xAxis={[{ scaleType: "point", dataKey: "status" }]}
//                                         series={[{ dataKey: "count", label: "Số lượng", color: chartColors.success }]}
//                                         width={500}
//                                         height={300}
//                                     />
//                                 </ChartContainer>
//                             </CardContent>
//                         </Card>
//                     </div>

//                     {/* Monthly User Activity */}
//                     <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
//                         <CardHeader>
//                             <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
//                                 <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
//                                 <span>Hoạt Động Người Dùng Hàng Tháng</span>
//                             </CardTitle>
//                             <CardDescription className="text-gray-600 dark:text-gray-400">
//                                 Người dùng mới, hoạt động và tỷ lệ rời bỏ theo tháng
//                             </CardDescription>
//                         </CardHeader>
//                         <CardContent>
//                             <ChartContainer className="h-[400px]">
//                                 <LineChart
//                                     dataset={userActivityData}
//                                     xAxis={[{ scaleType: "point", dataKey: "month" }]}
//                                     series={[
//                                         { dataKey: "newUsers", label: "Người dùng mới", color: chartColors.primary },
//                                         { dataKey: "activeUsers", label: "Người dùng hoạt động", color: chartColors.success },
//                                         { dataKey: "churnRate", label: "Tỷ lệ rời bỏ (%)", color: chartColors.red },
//                                     ]}
//                                     width={800}
//                                     height={400}
//                                 />
//                             </ChartContainer>
//                         </CardContent>
//                     </Card>
//                 </TabsContent>
//             </Tabs>
//         </div>
//     )
// }
