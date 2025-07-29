/**
 * ====================================================================
 * ADMIN SERVICE - Dịch vụ quản lý API cho Admin Dashboard
 * ====================================================================
 * 
 * Chức năng chính:
 * - Quản lý users (Members & Coaches)
 * - Lấy thống kê và analytics
 * - Thực hiện các actions admin (activate/deactivate users)
 */

import axiosConfig from "@/config/axiosConfig";
import { authService } from "@/services/authService";

/**
 * ====================================================================
 * INTERFACES & TYPES
 * ====================================================================
 */

export interface UserProfile {
  userId: string;
  username: string;
  email: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt?: string;
  isActive: boolean;
  role: 'NORMAL_MEMBER' | 'PREMIUM_MEMBER' | 'COACH' | 'SUPER_ADMIN' | 'CONTENT_ADMIN';
}

export interface MemberProfile extends UserProfile {
  // Member specific fields
  streak: number;
  moneySaved?: number;
  cigarettesAvoided?: number;
  subscriptionStatus: 'NONE' | 'ACTIVE' | 'EXPIRED';
  currentPlan?: string;
  quitPlanStatus: 'NONE' | 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  totalAchievements: number;
  // Add subscriptions and quit plans for admin management
  subscriptions?: SubscriptionInfo[];
  quitPlans?: QuitPlanInfo[];
}

export interface CoachProfile extends UserProfile {
  // Coach specific fields
  fullName: string;
  coachBio?: string;
  rating: number;
  specialties: string;
  totalRevenue?: number;
  totalAppointments?: number;
}

export interface UserStatsOverview {
  totalUsers: number;
  totalMembers: number;
  totalPremiumMembers: number;
  totalCoaches: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsersLast24h: number;
  newUsersLast7d: number;
  newUsersLast30d: number;
  subscriptionRate: number; // Percentage of members with subscriptions
  quitPlanCompletionRate: number; // Percentage of members who completed quit plans
}

export interface UserGrowthData {
  date: string;
  newUsers: number;
  totalUsers: number;
  newMembers: number;
  newCoaches: number;
}

export interface SubscriptionStatsData {
  planName: string;
  subscriberCount: number;
  revenue: number;
  percentage: number;
}

export interface UserTableFilters {
  role: 'ALL' | 'NORMAL_MEMBER' | 'PREMIUM_MEMBER' | 'COACH' | 'CONTENT_ADMIN';
  status: 'ALL' | 'ACTIVE' | 'INACTIVE';
  subscriptionStatus: 'ALL' | 'ACTIVE' | 'EXPIRED';
  quitPlanStatus: 'ALL' | 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  searchTerm: string;
}

export interface UserTableSort {
  field: keyof MemberProfile;
  direction: 'ASC' | 'DESC';
}

export interface UserTablePagination {
  page: number;
  size: number;
}

export interface SubscriptionInfo {
  subscriptionId: number;
  packageName: string;
  startDate: string;
  endDate: string;
  price: number;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
}

export interface QuitPlanInfo {
  quitPlanId: number;
  memberId: string;
  memberUsername: string;
  reductionType: string;
  createdAt: string;
  startDate: string;
  goalDate: string;
  initialSmokingAmount: number;
  pricePerPack: number;
  cigarettesPerPack: number;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'FAILED' | 'IN_PROGRESS';
}

/**
 * ====================================================================
 * ADMIN SERVICE CLASS
 * ====================================================================
 */

class AdminService {
  private static instance: AdminService;

  public static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  /**
   * Helper method to handle API errors
   */
  private handleError(error: unknown, context: string, defaultMessage: string): never {
    console.error(`❌ [AdminService] ${context}:`, error);

    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status: number } };
      if (axiosError.response?.status === 401) {
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (axiosError.response?.status === 403) {
        throw new Error('Bạn không có quyền truy cập dữ liệu này.');
      } else if (axiosError.response?.status === 404) {
        throw new Error('Không tìm thấy dữ liệu yêu cầu.');
      } else if (axiosError.response?.status === 400) {
        throw new Error('Dữ liệu không hợp lệ.');
      }
    }

    throw new Error(defaultMessage);
  }

  /**
   * ====================================================================
   * USER MANAGEMENT METHODS
   * ====================================================================
   */

  /**
   * Get all users (for overview)
   */
  async getAllUsers(): Promise<UserProfile[]> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Bạn cần đăng nhập để truy cập dữ liệu này');
      }

      console.log('👥 [AdminService] Fetching all users...');

      const response = await axiosConfig.get('/superadmin/users');

      if (response.data && response.data.data) {
        console.log('✅ [AdminService] Users fetched successfully:', response.data.data.length);
        console.log('📊 [AdminService] Sample user data:', response.data.data.slice(0, 3)); // Debug first 3 users
        return response.data.data;
      }

      return response.data || [];
    } catch (error: unknown) {
      console.error('❌ [AdminService] Error fetching users:', error);

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status: number } };
        if (axiosError.response?.status === 401) {
          throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else if (axiosError.response?.status === 403) {
          throw new Error('Bạn không có quyền truy cập dữ liệu người dùng.');
        }
      }

      throw new Error('Lỗi khi tải dữ liệu người dùng. Vui lòng thử lại.');
    }
  }

  /**
   * Get all members (including premium members)
   */
  async getAllMembers(): Promise<MemberProfile[]> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Bạn cần đăng nhập để truy cập dữ liệu này');
      }

      console.log('👤 [AdminService] Fetching all members...');

      const response = await axiosConfig.get('/superadmin/users/members');

      if (response.data && response.data.data) {
        console.log('✅ [AdminService] Members fetched successfully:', response.data.data.length);

        // Transform data to include member-specific fields
        return response.data.data.map((user: UserProfile & Record<string, unknown>) => {
          const memberProfile = {
            ...user,
            isActive: (user.active as boolean) ?? true, // Convert 'active' from API to 'isActive'
            streak: (user.streak as number) || 0,
            moneySaved: (user.moneySaved as number) || 0,
            cigarettesAvoided: (user.cigarettesAvoided as number) || 0,
            currentPlan: (user.currentPlan as string) || 'Không có gói',
            quitPlanStatus: (user.quitPlanStatus as MemberProfile['quitPlanStatus']) || 'NONE',
            totalAchievements: (user.totalAchievements as number) || 0,
            subscriptionStatus: 'NONE' as const,
          } as MemberProfile;

          memberProfile.subscriptionStatus = this.determineSubscriptionStatus(memberProfile);

          // Override role based on subscription status for display purposes
          if (memberProfile.subscriptionStatus === 'NONE' && memberProfile.role === 'PREMIUM_MEMBER') {
            // If user has no active subscription but role is premium, show as normal member
            memberProfile.role = 'NORMAL_MEMBER';
          }

          return memberProfile;
        });
      }

      return response.data || [];
    } catch (error: unknown) {
      console.error('❌ [AdminService] Error fetching members:', error);

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status: number } };
        if (axiosError.response?.status === 401) {
          throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else if (axiosError.response?.status === 403) {
          throw new Error('Bạn không có quyền truy cập dữ liệu thành viên.');
        }
      }

      throw new Error('Lỗi khi tải dữ liệu thành viên. Vui lòng thử lại.');
    }
  }

  /**
   * Get all coaches
   */
  async getAllCoaches(): Promise<CoachProfile[]> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Bạn cần đăng nhập để truy cập dữ liệu này');
      }

      console.log('🎓 [AdminService] Fetching all coaches...');

      const response = await axiosConfig.get('/superadmin/users/coaches');

      if (response.data && response.data.data) {
        console.log('✅ [AdminService] Coaches fetched successfully:', response.data.data.length);
        return response.data.data;
      }

      return response.data || [];
    } catch (error: unknown) {
      this.handleError(error, 'Error fetching coaches', 'Lỗi khi tải dữ liệu huấn luyện viên. Vui lòng thử lại.');
    }
  }

  /**
   * ====================================================================
   * USER STATS & ANALYTICS METHODS
   * ====================================================================
   */

  /**
   * Get user statistics overview
   */
  async getUserStatsOverview(): Promise<UserStatsOverview> {
    try {
      // Fetch all required data in parallel
      const [users, members, coaches] = await Promise.all([
        this.getAllUsers(),
        this.getAllMembers(),
        this.getAllCoaches()
      ]);

      const now = new Date();
      const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Calculate statistics
      const totalUsers = users.length;
      const totalMembers = members.filter(m => m.role === 'NORMAL_MEMBER' || m.role === 'PREMIUM_MEMBER').length;
      const totalPremiumMembers = members.filter(m => m.role === 'PREMIUM_MEMBER').length;
      const totalCoaches = coaches.length;
      const activeUsers = users.filter(u => u.isActive).length;
      const inactiveUsers = totalUsers - activeUsers;

      // Calculate new users
      const newUsersLast24h = users.filter(u => new Date(u.createdAt) >= last24h).length;
      const newUsersLast7d = users.filter(u => new Date(u.createdAt) >= last7d).length;
      const newUsersLast30d = users.filter(u => new Date(u.createdAt) >= last30d).length;

      // Calculate subscription rate
      const membersWithSubscription = members.filter(m => m.subscriptionStatus === 'ACTIVE').length;
      const subscriptionRate = totalMembers > 0 ? (membersWithSubscription / totalMembers) * 100 : 0;

      // Calculate quit plan completion rate
      const membersWithCompletedPlans = members.filter(m => m.quitPlanStatus === 'COMPLETED').length;
      const quitPlanCompletionRate = totalMembers > 0 ? (membersWithCompletedPlans / totalMembers) * 100 : 0;

      return {
        totalUsers,
        totalMembers,
        totalPremiumMembers,
        totalCoaches,
        activeUsers,
        inactiveUsers,
        newUsersLast24h,
        newUsersLast7d,
        newUsersLast30d,
        subscriptionRate: Math.round(subscriptionRate * 100) / 100,
        quitPlanCompletionRate: Math.round(quitPlanCompletionRate * 100) / 100,
      };
    } catch (error: unknown) {
      this.handleError(error, 'Error getting user stats', 'Lỗi khi tải thống kê người dùng. Vui lòng thử lại.');
    }
  }

  /**
   * ====================================================================
   * USER ACTIONS METHODS
   * ====================================================================
   */

  /**
   * Toggle user active status
   */
  async toggleUserStatus(userId: string): Promise<UserProfile> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Bạn cần đăng nhập để thực hiện thao tác này');
      }

      console.log('🔄 [AdminService] Toggling user status for:', userId);

      const response = await axiosConfig.patch(`/superadmin/users/${userId}/toggle-status`);

      if (response.data && response.data.data) {
        console.log('✅ [AdminService] User status toggled successfully');
        return response.data.data;
      }

      throw new Error('Không nhận được dữ liệu phản hồi từ server');
    } catch (error: unknown) {
      this.handleError(error, 'Error toggling user status', 'Lỗi khi thay đổi trạng thái người dùng. Vui lòng thử lại.');
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, updateData: { username?: string; email?: string }): Promise<UserProfile> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Bạn cần đăng nhập để thực hiện thao tác này');
      }

      console.log('✏️ [AdminService] Updating user profile for:', userId);

      const response = await axiosConfig.patch(`/superadmin/users/${userId}`, updateData);

      if (response.data && response.data.data) {
        console.log('✅ [AdminService] User profile updated successfully');
        return response.data.data;
      }

      throw new Error('Không nhận được dữ liệu phản hồi từ server');
    } catch (error: unknown) {
      this.handleError(error, 'Error updating user profile', 'Lỗi khi cập nhật thông tin người dùng. Vui lòng thử lại.');
    }
  }

  /**
   * Get members with filters, sorting, and pagination
   */
  async getMembers(
    filters: UserTableFilters,
    sort: UserTableSort,
    pagination: UserTablePagination
  ): Promise<{
    members: MemberProfile[];
    total: number;
    totalPages: number;
  }> {
    try {
      // Get all members first
      const allMembers = await this.getAllMembers();

      // Apply filters
      const filteredMembers = allMembers.filter(member => {
        // Role filter
        if (filters.role !== 'ALL' && member.role !== filters.role) {
          return false;
        }

        // Status filter
        if (filters.status !== 'ALL') {
          const isActive = filters.status === 'ACTIVE';
          if (member.isActive !== isActive) {
            return false;
          }
        }

        // Subscription status filter
        if (filters.subscriptionStatus !== 'ALL' &&
          member.subscriptionStatus !== filters.subscriptionStatus) {
          return false;
        }

        // Quit plan status filter
        if (filters.quitPlanStatus !== 'ALL' &&
          member.quitPlanStatus !== filters.quitPlanStatus) {
          return false;
        }

        // Search term filter
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase();
          return member.username.toLowerCase().includes(searchLower) ||
            member.email.toLowerCase().includes(searchLower);
        }

        return true;
      });

      // Apply sorting
      filteredMembers.sort((a, b) => {
        const aVal = a[sort.field] as string | number | Date;
        const bVal = b[sort.field] as string | number | Date;

        let comparison = 0;
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          comparison = aVal.localeCompare(bVal);
        } else if (typeof aVal === 'number' && typeof bVal === 'number') {
          comparison = aVal - bVal;
        } else if (aVal instanceof Date && bVal instanceof Date) {
          comparison = aVal.getTime() - bVal.getTime();
        }

        return sort.direction === 'DESC' ? -comparison : comparison;
      });

      // Apply pagination
      const total = filteredMembers.length;
      const totalPages = Math.ceil(total / pagination.size);
      const start = (pagination.page - 1) * pagination.size;
      const end = start + pagination.size;
      const paginatedMembers = filteredMembers.slice(start, end);

      return {
        members: paginatedMembers,
        total,
        totalPages
      };
    } catch (error) {
      console.error('Error in getMembers:', error);
      throw error;
    }
  }

  /**
   * Search members with server-side filtering, sorting, and pagination
   */
  async searchMembers(
    filters: UserTableFilters,
    sort: UserTableSort,
    pagination: UserTablePagination
  ): Promise<{
    members: MemberProfile[];
    total: number;
    totalPages: number;
  }> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Bạn cần đăng nhập để truy cập dữ liệu này');
      }

      console.log('🔍 [AdminService] Searching members with filters:', filters);

      // Build query parameters
      const params = new URLSearchParams();

      if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
      if (filters.role !== 'ALL') params.append('role', filters.role);
      if (filters.status !== 'ALL') params.append('status', filters.status);
      if (filters.subscriptionStatus !== 'ALL') params.append('subscriptionStatus', filters.subscriptionStatus);
      if (filters.quitPlanStatus !== 'ALL') params.append('quitPlanStatus', filters.quitPlanStatus);

      params.append('sortField', sort.field);
      params.append('sortDirection', sort.direction);
      params.append('page', pagination.page.toString());
      params.append('size', pagination.size.toString());

      const response = await axiosConfig.get(`/superadmin/users/members/search?${params.toString()}`);

      if (response.data && response.data.data) {
        const result = response.data.data;

        console.log('✅ [AdminService] Members searched successfully:', result.members.length);

        // Transform data to include member-specific fields
        const transformedMembers = result.members.map((user: UserProfile & Record<string, unknown>) => {
          const memberProfile = {
            ...user,
            isActive: (user.active as boolean) ?? true,
            streak: (user.streak as number) || 0,
            moneySaved: (user.moneySaved as number) || 0,
            cigarettesAvoided: (user.cigarettesAvoided as number) || 0,
            currentPlan: (user.currentPlan as string) || 'Không có gói',
            quitPlanStatus: (user.quitPlanStatus as MemberProfile['quitPlanStatus']) || 'NONE',
            totalAchievements: (user.totalAchievements as number) || 0,
            subscriptionStatus: 'NONE' as const,
          } as MemberProfile;

          memberProfile.subscriptionStatus = this.determineSubscriptionStatus(memberProfile);

          // Override role based on subscription status for display purposes
          if (memberProfile.subscriptionStatus === 'NONE' && memberProfile.role === 'PREMIUM_MEMBER') {
            memberProfile.role = 'NORMAL_MEMBER';
          }

          return memberProfile;
        });

        return {
          members: transformedMembers,
          total: result.totalElements,
          totalPages: result.totalPages
        };
      }

      return {
        members: [],
        total: 0,
        totalPages: 0
      };
    } catch (error: unknown) {
      console.error('❌ [AdminService] Error searching members:', error);

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status: number } };
        if (axiosError.response?.status === 401) {
          throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else if (axiosError.response?.status === 403) {
          throw new Error('Bạn không có quyền truy cập dữ liệu thành viên.');
        }
      }

      throw new Error('Lỗi khi tìm kiếm thành viên. Vui lòng thử lại.');
    }
  }

  /**
   * Search all users (including coaches, admins, members) with server-side filtering, sorting, and pagination
   */
  async searchAllUsers(
    filters: UserTableFilters,
    sort: UserTableSort,
    pagination: UserTablePagination
  ): Promise<{
    members: MemberProfile[];
    total: number;
    totalPages: number;
  }> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Bạn cần đăng nhập để truy cập dữ liệu này');
      }

      console.log('🔍 [AdminService] Searching all users with filters:', filters);

      // Build query parameters
      const params = new URLSearchParams();

      if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
      if (filters.role !== 'ALL') params.append('role', filters.role);
      if (filters.status !== 'ALL') params.append('status', filters.status);
      if (filters.subscriptionStatus !== 'ALL') params.append('subscriptionStatus', filters.subscriptionStatus);
      if (filters.quitPlanStatus !== 'ALL') params.append('quitPlanStatus', filters.quitPlanStatus);

      params.append('sortField', sort.field);
      params.append('sortDirection', sort.direction);
      params.append('page', pagination.page.toString());
      params.append('size', pagination.size.toString());

      // Use the general users endpoint instead of members-only
      const response = await axiosConfig.get(`/superadmin/users/search?${params.toString()}`);

      if (response.data && response.data.data) {
        const result = response.data.data;

        console.log('✅ [AdminService] All users searched successfully:', result.users?.length || result.members?.length || 0);

        // Handle both possible response formats
        const users = result.users || result.members || [];

        // Transform data to include member-specific fields
        const transformedMembers = users.map((user: UserProfile & Record<string, unknown>) => {
          const memberProfile = {
            ...user,
            isActive: (user.active as boolean) ?? true,
            streak: (user.streak as number) || 0,
            moneySaved: (user.moneySaved as number) || 0,
            cigarettesAvoided: (user.cigarettesAvoided as number) || 0,
            currentPlan: (user.currentPlan as string) || 'Không có gói',
            quitPlanStatus: (user.quitPlanStatus as MemberProfile['quitPlanStatus']) || 'NONE',
            totalAchievements: (user.totalAchievements as number) || 0,
            subscriptionStatus: 'NONE' as const,
          } as MemberProfile;

          // Only determine subscription status for members, not for admins/coaches
          if (user.role === 'NORMAL_MEMBER' || user.role === 'PREMIUM_MEMBER') {
            memberProfile.subscriptionStatus = this.determineSubscriptionStatus(memberProfile);

            // Override role based on subscription status for display purposes
            if (memberProfile.subscriptionStatus === 'NONE' && memberProfile.role === 'PREMIUM_MEMBER') {
              memberProfile.role = 'NORMAL_MEMBER';
            }
          }

          return memberProfile;
        });

        return {
          members: transformedMembers,
          total: result.totalElements || result.total || users.length,
          totalPages: result.totalPages || Math.ceil((result.totalElements || result.total || users.length) / pagination.size)
        };
      }

      return {
        members: [],
        total: 0,
        totalPages: 0
      };
    } catch (error: unknown) {
      console.error('❌ [AdminService] Error searching all users:', error);

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status: number } };
        if (axiosError.response?.status === 401) {
          throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else if (axiosError.response?.status === 403) {
          throw new Error('Bạn không có quyền truy cập dữ liệu người dùng.');
        }
      }

      throw new Error('Lỗi khi tìm kiếm người dùng. Vui lòng thử lại.');
    }
  }

  /**
   * Search all users with client-side filtering (fallback method)
   */
  async searchAllUsersClientSide(
    filters: UserTableFilters,
    sort: UserTableSort,
    pagination: UserTablePagination
  ): Promise<{
    members: MemberProfile[];
    total: number;
    totalPages: number;
  }> {
    try {
      console.log('🔍 [AdminService] Searching all users client-side with filters:', filters);

      // Get all users first
      const allUsers = await this.getAllUsers();
      
      console.log('📊 [AdminService] All users roles distribution:', 
        allUsers.reduce((acc, user) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      );

      // Transform all users to MemberProfile format
      const transformedUsers = allUsers.map((user: UserProfile) => {
        const memberProfile = {
          ...user,
          isActive: user.isActive ?? true,
          streak: 0,
          moneySaved: 0,
          cigarettesAvoided: 0,
          currentPlan: 'Không có gói',
          quitPlanStatus: 'NONE' as const,
          totalAchievements: 0,
          subscriptionStatus: 'NONE' as const,
        } as MemberProfile;

        // Only determine subscription status for members, not for admins/coaches
        if (user.role === 'NORMAL_MEMBER' || user.role === 'PREMIUM_MEMBER') {
          memberProfile.subscriptionStatus = this.determineSubscriptionStatus(memberProfile);

          // Override role based on subscription status for display purposes
          if (memberProfile.subscriptionStatus === 'NONE' && memberProfile.role === 'PREMIUM_MEMBER') {
            memberProfile.role = 'NORMAL_MEMBER';
          }
        }

        return memberProfile;
      });

      // Apply filters
      const filteredUsers = transformedUsers.filter(user => {
        // Role filter
        if (filters.role !== 'ALL' && user.role !== filters.role) {
          return false;
        }

        // Status filter
        if (filters.status !== 'ALL') {
          const isActive = filters.status === 'ACTIVE';
          if (user.isActive !== isActive) {
            return false;
          }
        }

        // Subscription status filter (only for members)
        if (filters.subscriptionStatus !== 'ALL' && 
            (user.role === 'NORMAL_MEMBER' || user.role === 'PREMIUM_MEMBER') &&
            user.subscriptionStatus !== filters.subscriptionStatus) {
          return false;
        }

        // Quit plan status filter (only for members)
        if (filters.quitPlanStatus !== 'ALL' && 
            (user.role === 'NORMAL_MEMBER' || user.role === 'PREMIUM_MEMBER') &&
            user.quitPlanStatus !== filters.quitPlanStatus) {
          return false;
        }

        // Search term filter
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase();
          return user.username.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower);
        }

        return true;
      });

      // Apply sorting
      const sortedUsers = filteredUsers.sort((a, b) => {
        const aValue = a[sort.field as keyof MemberProfile];
        const bValue = b[sort.field as keyof MemberProfile];
        
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comparison = aValue.localeCompare(bValue);
          return sort.direction === 'ASC' ? comparison : -comparison;
        }
        
        if (aValue < bValue) return sort.direction === 'ASC' ? -1 : 1;
        if (aValue > bValue) return sort.direction === 'ASC' ? 1 : -1;
        return 0;
      });

      // Apply pagination
      const startIndex = (pagination.page - 1) * pagination.size;
      const endIndex = startIndex + pagination.size;
      const paginatedUsers = sortedUsers.slice(startIndex, endIndex);

      console.log('✅ [AdminService] All users filtered client-side:', paginatedUsers.length, 'of', sortedUsers.length);

      return {
        members: paginatedUsers,
        total: sortedUsers.length,
        totalPages: Math.ceil(sortedUsers.length / pagination.size)
      };
    } catch (error: unknown) {
      console.error('❌ [AdminService] Error searching all users client-side:', error);
      throw new Error('Lỗi khi tìm kiếm người dùng. Vui lòng thử lại.');
    }
  }

  /**
   * =============================================
   * SUBSCRIPTION MANAGEMENT METHODS
   * =============================================
   */

  /**
   * Get user subscriptions
   */
  async getUserSubscriptions(userId: string): Promise<SubscriptionInfo[]> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Bạn cần đăng nhập để truy cập dữ liệu này');
      }

      console.log('💳 [AdminService] Fetching user subscriptions for:', userId);

      const response = await axiosConfig.get(`/superadmin/users/${userId}/subscriptions`);

      if (response.data && response.data.data) {
        console.log('✅ [AdminService] User subscriptions fetched successfully');
        return response.data.data;
      }

      return [];
    } catch (error: unknown) {
      console.error('❌ [AdminService] Error fetching user subscriptions:', error);

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status: number } };
        if (axiosError.response?.status === 401) {
          throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else if (axiosError.response?.status === 403) {
          throw new Error('Bạn không có quyền truy cập dữ liệu subscription.');
        }
      }

      throw new Error('Lỗi khi tải dữ liệu subscription. Vui lòng thử lại.');
    }
  }

  /**
   * =============================================
   * QUIT PLAN MANAGEMENT METHODS
   * =============================================
   */

  /**
   * Get user quit plans (for admin)
   */
  async getUserQuitPlans(userId: string): Promise<QuitPlanInfo[]> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Bạn cần đăng nhập để truy cập dữ liệu này');
      }

      console.log('🎯 [AdminService] Fetching user quit plans for:', userId);

      const response = await axiosConfig.get(`/quit-plans/superadmin/member/${userId}`);

      if (response.data && response.data.data) {
        console.log('✅ [AdminService] User quit plans fetched successfully');
        return response.data.data;
      }

      return [];
    } catch (error: unknown) {
      this.handleError(error, 'Error fetching user quit plans', 'Lỗi khi tải dữ liệu quit plan. Vui lòng thử lại.');
    }
  }

  /**
   * Delete quit plan by ID (admin only)
   */
  async deleteQuitPlan(quitPlanId: number): Promise<void> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Bạn cần đăng nhập để thực hiện thao tác này');
      }

      console.log('🗑️ [AdminService] Deleting quit plan:', quitPlanId);

      await axiosConfig.delete(`/quit-plans/superadmin/${quitPlanId}`);

      console.log('✅ [AdminService] Quit plan deleted successfully');
    } catch (error: unknown) {
      this.handleError(error, 'Error deleting quit plan', 'Lỗi khi xóa quit plan. Vui lòng thử lại.');
    }
  }

  /**
   * ====================================================================
   * HELPER METHODS
   * ====================================================================
   */

  private determineSubscriptionStatus(user: MemberProfile): 'NONE' | 'ACTIVE' | 'EXPIRED' {
    // If user has no subscription data or empty subscription array
    if (!user.subscriptions || user.subscriptions.length === 0) {
      return 'NONE';
    }

    // Check if user has active subscriptions
    const hasActiveSubscription = user.subscriptions.some(sub => sub.status === 'ACTIVE');

    if (hasActiveSubscription) {
      return 'ACTIVE';
    }

    // If user has subscriptions but none are active, they are expired
    const hasExpiredSubscription = user.subscriptions.some(sub => sub.status === 'EXPIRED');
    if (hasExpiredSubscription) {
      return 'EXPIRED';
    }

    return 'NONE';
  }

  /**
   * Create a new user (admin only)
   */
  async createUser(userData: {
    username: string;
    email: string;
    password: string;
    role: 'NORMAL_MEMBER' | 'COACH' | 'CONTENT_ADMIN' | 'SUPER_ADMIN';
    fullName?: string;
    coachBio?: string;
    active?: boolean;
  }): Promise<UserProfile> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Bạn cần đăng nhập để thực hiện thao tác này');
      }

      console.log('➕ [AdminService] Creating new user:', userData.username);

      const response = await axiosConfig.post('/superadmin/users', userData);

      if (response.data && response.data.data) {
        console.log('✅ [AdminService] User created successfully');
        return response.data.data;
      }

      throw new Error('Không thể tạo người dùng');
    } catch (error: unknown) {
      this.handleError(error, 'Error creating user', 'Lỗi khi tạo người dùng. Vui lòng thử lại.');
    }
  }
}

/**
 * ====================================================================
 * EXPORTED SINGLETON INSTANCE
 * ====================================================================
 */
export const adminService = AdminService.getInstance();
