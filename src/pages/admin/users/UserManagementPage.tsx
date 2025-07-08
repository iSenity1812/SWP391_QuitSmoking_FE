import React, { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import UserTable from './components/UserTable';
import type { MemberProfile } from '@/services/api/adminService';
import { adminService } from '@/services/api/adminService';

/**
 * ====================================================================
 * USER MANAGEMENT PAGE - Trang quản lý thành viên
 * ====================================================================
 * 
 * Trang này tích hợp UserTable component để quản lý:
 * - Danh sách thành viên (Member & Premium Member)
 * - Chỉnh sửa thông tin thành viên
 * - Kích hoạt/tạm khóa tài khoản
 * - Lọc và tìm kiếm thành viên
 */

const UserManagementPage: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Handler để chỉnh sửa thông tin user
  const handleEditUser = useCallback((user: MemberProfile) => {
    // TODO: Mở modal hoặc navigate đến trang edit
    console.log('Edit user:', user);
    toast.info(`Chỉnh sửa thông tin ${user.username}`);

    // Ví dụ implementation:
    // setSelectedUser(user);
    // setIsEditModalOpen(true);
  }, []);

  // Handler để toggle trạng thái user
  const handleToggleStatus = useCallback(async (userId: string) => {
    try {
      await adminService.toggleUserStatus(userId);

      toast.success('Cập nhật trạng thái tài khoản thành công');

      // Refresh table
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái tài khoản');
    }
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Quản lý thành viên
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Quản lý danh sách thành viên, chỉnh sửa thông tin và theo dõi hoạt động
          </p>
        </div>
      </div>

      <UserTable
        onEditUser={handleEditUser}
        onToggleStatus={handleToggleStatus}
        refreshTrigger={refreshTrigger}
      />
    </div>
  );
};

export default UserManagementPage;
