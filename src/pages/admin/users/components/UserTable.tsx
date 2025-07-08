import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Edit,
  ToggleLeft,
  ToggleRight,
  Search,
  ChevronDown,
  ChevronUp,
  Crown,
  User,
  Shield,
  ChevronLeft,
  ChevronRight,
  UserPlus
} from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import UserDetailsRow from './UserDetailsRow';

// Types and Services
import { adminService, type MemberProfile } from '@/services/api/adminService';

interface UserTableProps {
  onEditUser: (user: MemberProfile) => void;
  onToggleStatus: (userId: string) => void;
  onAddUser?: () => void;
  refreshTrigger?: number;
}

interface UserTableFilters {
  searchTerm: string;
  role: 'ALL' | 'MEMBER' | 'PREMIUM_MEMBER' | 'COACH';
  status: 'ALL' | 'ACTIVE' | 'INACTIVE';
  subscriptionStatus: 'ALL' | 'ACTIVE' | 'EXPIRED';
  quitPlanStatus: 'ALL' | 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  dateRange: Record<string, unknown>;
}

interface UserTableSort {
  field: keyof MemberProfile;
  direction: 'ASC' | 'DESC';
}

interface UserTablePagination {
  page: number;
  size: number;
  totalElements: number;
}

const UserTable: React.FC<UserTableProps> = ({
  onEditUser,
  onToggleStatus,
  onAddUser,
  refreshTrigger = 0
}) => {
  // State management
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Search state for debouncing
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Filters and sorting
  const [filters, setFilters] = useState<UserTableFilters>({
    searchTerm: '',
    role: 'ALL',
    status: 'ALL',
    subscriptionStatus: 'ALL',
    quitPlanStatus: 'ALL',
    dateRange: {}
  });

  const [sort, setSort] = useState<UserTableSort>({
    field: 'createdAt',
    direction: 'DESC'
  });

  const [pagination, setPagination] = useState<UserTablePagination>({
    page: 1,
    size: 10,
    totalElements: 0
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchInput);
    }, 300); // Reduced to 300ms for faster response

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Update filters when debounced search term changes
  useEffect(() => {
    setFilters(prev => ({ ...prev, searchTerm: debouncedSearchTerm }));
    // Only reset to first page if we're not already on the first page
    setPagination(prev => prev.page === 1 ? prev : { ...prev, page: 1 });
  }, [debouncedSearchTerm]);

  // Fetch members data with server-side filtering
  useEffect(() => {
    console.log('🔄 [UserTable] useEffect triggered:', {
      refreshTrigger,
      filters,
      sort,
      page: pagination.page,
      size: pagination.size
    });

    const fetchMembers = async () => {
      try {
        setLoading(true);
        setError(null);

        // Create pagination object without totalElements to avoid infinite loop
        const paginationParams = {
          page: pagination.page,
          size: pagination.size,
          totalElements: 0 // This will be updated after the API call
        };

        // Use server-side search with filters, sorting, and pagination
        const result = await adminService.searchMembers(filters, sort, paginationParams);

        setMembers(result.members);
        setPagination(prev => ({ ...prev, totalElements: result.total }));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi không xác định');
        console.error('Error fetching members:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [refreshTrigger, filters, sort, pagination.page, pagination.size]);

  // Event handlers
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleFilterChange = (key: keyof UserTableFilters, value: string) => {
    if (key === 'searchTerm') {
      setSearchInput(value);
    } else {
      setFilters(prev => {
        // Only update if the value has actually changed
        if (prev[key] !== value) {
          return { ...prev, [key]: value };
        }
        return prev;
      });
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  };

  const handleSortChange = (field: keyof MemberProfile) => {
    setSort(prev => ({
      field: field as UserTableSort['field'],
      direction: prev.field === field && prev.direction === 'ASC' ? 'DESC' : 'ASC'
    }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleToggleDetails = (userId: string) => {
    setExpandedRow(prev => (prev === userId ? null : userId));
  };

  const handleQuitPlanDeleted = (memberId: string, planId: number) => {
    // Update the local state to remove the deleted quit plan
    setMembers(prev => prev.map(member =>
      member.userId === memberId
        ? {
          ...member,
          quitPlans: member.quitPlans?.filter(plan => plan.quitPlanId !== planId) || []
        }
        : member
    ));
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    if (onToggleStatus) {
      // Chỉ gọi callback, để UserManagement xử lý API call
      await onToggleStatus(userId);
    } else {
      // Fallback: nếu không có callback thì gọi API trực tiếp
      try {
        await adminService.toggleUserStatus(userId);

        // Update local state
        setMembers(prev => prev.map(member =>
          member.userId === userId
            ? { ...member, isActive: !currentStatus }
            : member
        ));
      } catch (error) {
        console.error('Error toggling status:', error);
        setError('Lỗi khi cập nhật trạng thái người dùng');
      }
    }
  };

  // Utility functions
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'PREMIUM_MEMBER':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'COACH':
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge
        variant={isActive ? 'default' : 'secondary'}
        className={isActive ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'}
      >
        {isActive ? 'Hoạt động' : 'Tạm khóa'}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const totalPages = Math.ceil(pagination.totalElements / pagination.size);

  // Render
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Danh sách thành viên</span>
            <Badge variant="outline">{pagination.totalElements} thành viên</Badge>
          </div>
          {onAddUser && (
            <Button onClick={onAddUser} size="sm" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Thêm Người Dùng
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
              {searchInput !== debouncedSearchTerm && (
                <div className="absolute right-3 top-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                </div>
              )}
            </div>
          </div>
          <Select
            value={filters.role}
            onValueChange={(value) => handleFilterChange('role', value)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả vai trò</SelectItem>
              <SelectItem value="MEMBER">Member</SelectItem>
              <SelectItem value="PREMIUM_MEMBER">Premium Member</SelectItem>
              <SelectItem value="COACH">Coach</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.status}
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
              <SelectItem value="ACTIVE">Hoạt động</SelectItem>
              <SelectItem value="INACTIVE">Tạm khóa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => handleSortChange('username')}
                >
                  Thành viên
                  {sort.field === 'username' && (
                    sort.direction === 'ASC' ? <ChevronUp className="inline w-4 h-4 ml-1" /> : <ChevronDown className="inline w-4 h-4 ml-1" />
                  )}
                </TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => handleSortChange('createdAt')}
                >
                  Ngày tạo
                  {sort.field === 'createdAt' && (
                    sort.direction === 'ASC' ? <ChevronUp className="inline w-4 h-4 ml-1" /> : <ChevronDown className="inline w-4 h-4 ml-1" />
                  )}
                </TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : members.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    {filters.searchTerm ? 'Không tìm thấy thành viên phù hợp' : 'Không có thành viên nào'}
                  </TableCell>
                </TableRow>
              ) : (
                members.map((member) => (
                  <React.Fragment key={member.userId}>
                    <TableRow>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleDetails(member.userId)}
                        >
                          {expandedRow === member.userId ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage src={member.profilePicture} alt={member.username} />
                            <AvatarFallback>{member.username.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.username}</div>
                            <div className="text-sm text-gray-500">{member.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getRoleIcon(member.role)}
                          {member.role === 'PREMIUM_MEMBER' ? 'Premium' :
                            member.role === 'COACH' ? 'Coach' :
                              member.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Normal'}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(member.isActive)}</TableCell>
                      <TableCell>{formatDate(member.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => onEditUser(member)}>
                            <Edit className="w-4 h-4 mr-1" /> Sửa
                          </Button>
                          <Button
                            variant={member.isActive ? 'destructive' : 'default'}
                            size="sm"
                            onClick={() => handleToggleStatus(member.userId, member.isActive)}
                          >
                            {member.isActive ? <ToggleLeft className="w-4 h-4 mr-1" /> : <ToggleRight className="w-4 h-4 mr-1" />}
                            {member.isActive ? 'Cấm' : 'Bỏ cấm'}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedRow === member.userId && (
                      <TableRow>
                        <UserDetailsRow
                          subscriptions={member.subscriptions || []}
                          quitPlans={member.quitPlans || []}
                          onQuitPlanDeleted={(planId) => handleQuitPlanDeleted(member.userId, planId)}
                        />
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-500">
            Hiển thị {((pagination.page - 1) * pagination.size) + 1} - {Math.min(pagination.page * pagination.size, pagination.totalElements)} của {pagination.totalElements} thành viên
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Trước
            </Button>
            <span className="px-3 py-1 text-sm">
              {pagination.page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === totalPages}
            >
              Sau
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserTable;
