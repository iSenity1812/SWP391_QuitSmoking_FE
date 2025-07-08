# User Management - Quản lý thành viên

## 📋 Tổng quan

Module quản lý thành viên cho admin dashboard, bao gồm:

- Hiển thị danh sách thành viên (Member & Premium Member)
- Lọc và tìm kiếm thành viên
- Chỉnh sửa thông tin thành viên
- Kích hoạt/tạm khóa tài khoản
- Theo dõi tiến độ và thành tích

## 🗂️ Cấu trúc file

```
src/pages/admin/users/
├── components/
│   └── UserTable.tsx           # Component bảng danh sách thành viên
├── UserManagementPage.tsx      # Trang chính quản lý thành viên
└── README.md                   # Tài liệu này
```

## 🚀 Cách sử dụng

### 1. UserTable Component

Component chính hiển thị danh sách thành viên với các tính năng:

```tsx
import UserTable from "@/pages/admin/users/components/UserTable";
import type { MemberProfile } from "@/services/api/adminService";

function MyComponent() {
  const handleEditUser = (user: MemberProfile) => {
    // Xử lý chỉnh sửa user
  };

  const handleToggleStatus = async (userId: string, newStatus: boolean) => {
    // Xử lý toggle trạng thái user
  };

  return (
    <UserTable
      onEditUser={handleEditUser}
      onToggleStatus={handleToggleStatus}
      refreshTrigger={0} // Optional: trigger refresh
    />
  );
}
```

### 2. UserManagementPage

Trang hoàn chỉnh với layout và logic xử lý:

```tsx
import UserManagementPage from "@/pages/admin/users/UserManagementPage";

// Sử dụng trong router hoặc component khác
<UserManagementPage />;
```

## 🔧 Props của UserTable

| Prop             | Type                                           | Mô tả                                |
| ---------------- | ---------------------------------------------- | ------------------------------------ |
| `onEditUser`     | `(user: MemberProfile) => void`                | Callback khi nhấn nút edit           |
| `onToggleStatus` | `(userId: string, newStatus: boolean) => void` | Callback khi toggle trạng thái       |
| `refreshTrigger` | `number`                                       | Optional: Số để trigger refresh data |

## 📊 Tính năng hiện có

### ✅ Đã hoàn thành

- [x] Hiển thị danh sách thành viên với avatar, tên, email
- [x] Phân loại Member vs Premium Member
- [x] Lọc theo: vai trò, trạng thái, subscription, quit plan
- [x] Tìm kiếm theo tên hoặc email
- [x] Sắp xếp theo: tên, email, ngày tạo, streak, tiền tiết kiệm
- [x] Pagination với thống kê tổng quan
- [x] Hiển thị tiến độ (streak, tiền tiết kiệm)
- [x] Trạng thái subscription và quit plan
- [x] Actions: Edit và Toggle status
- [x] Loading và error states
- [x] Responsive design

### 🔄 Đang phát triển

- [ ] Modal chỉnh sửa thông tin chi tiết
- [ ] Xuất dữ liệu (CSV/Excel)
- [ ] Bulk actions (chọn nhiều để thực hiện hành động)
- [ ] Advanced filters (date range, amount range)
- [ ] Real-time updates qua WebSocket

### 🎯 Kế hoạch tương lai

- [ ] Tích hợp biểu đồ thống kê
- [ ] Notification system
- [ ] Activity timeline cho mỗi user
- [ ] Integration với messaging system
- [ ] Advanced analytics dashboard

## 🛠️ Dependencies

### Required Types

```typescript
// Từ @/types/userManagement
-UserTableFilters -
  UserTableSort -
  UserTablePagination -
  // Từ @/services/api/adminService
  MemberProfile;
```

### Required Services

```typescript
// adminService.getMembers() method
```

### UI Components

```typescript
-Card,
  CardHeader,
  CardTitle,
  CardContent - Button - Badge - Input - Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue - Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow - Avatar,
  AvatarImage,
  AvatarFallback;
```

## 🎨 Styling

Component sử dụng Tailwind CSS với design system:

- Dark mode support
- Consistent spacing và typography
- Hover effects và transitions
- Responsive breakpoints
- Color scheme phù hợp với admin dashboard

## 🔍 API Integration

### getMembers Method

```typescript
adminService.getMembers(
  filters: UserTableFilters,
  sort: UserTableSort,
  pagination: UserTablePagination
): Promise<{
  members: MemberProfile[];
  total: number;
  totalPages: number;
}>
```

### Required Backend Endpoints

```
GET /api/superadmin/users/members  # Lấy danh sách members
PUT /api/superadmin/users/{id}     # Cập nhật thông tin user
PATCH /api/superadmin/users/{id}/status  # Toggle user status
```

## 🚨 Error Handling

Component xử lý các lỗi phổ biến:

- Network errors
- Authentication errors (401)
- Authorization errors (403)
- Validation errors
- Server errors (500)

## 📱 Responsive Design

- Mobile: Stack layout, simplified columns
- Tablet: Condensed layout với horizontal scroll
- Desktop: Full layout với tất cả columns

## 🔒 Security

- Kiểm tra quyền truy cập qua auth tokens
- Validate inputs trước khi gửi API
- Sanitize hiển thị dữ liệu user
- Rate limiting cho API calls

## 📈 Performance

- Pagination để giảm load data
- Debounced search để giảm API calls
- Memoized callbacks để tránh re-render
- Lazy loading cho avatar images
- Efficient filtering và sorting

## 🧪 Testing

```bash
# Unit tests
npm run test UserTable

# Integration tests
npm run test:integration users

# E2E tests
npm run test:e2e user-management
```

## 📝 Changelog

### v1.0.0 (Current)

- ✅ Basic user table với filtering và pagination
- ✅ Member profile hiển thị với avatar
- ✅ Role-based styling và icons
- ✅ Progress tracking (streak, money saved)
- ✅ Subscription và quit plan status
- ✅ Edit và toggle status actions

### v1.1.0 (Planned)

- 🔄 Advanced filtering options
- 🔄 Export functionality
- 🔄 Bulk actions
- 🔄 User detail modal

---

**💡 Lưu ý**: File này dành cho việc quản lý thành viên (Member/Premium Member), không phải giao dịch. Để quản lý giao dịch, sử dụng TransactionTable trong `/admin/transactions/`.
