/**
 * ====================================================================
 * USER MANAGEMENT TYPES - Type definitions cho User Management Dashboard
 * ====================================================================
 */

/**
 * Base User interface
 */
export interface BaseUser {
  userId: string;
  username: string;
  email: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt?: string;
  isActive: boolean;
  role: 'NORMAL_MEMBER' | 'PREMIUM_MEMBER' | 'COACH' | 'SUPER_ADMIN' | 'CONTENT_ADMIN';
}

/**
 * Member specific data interface
 */
export interface MemberData extends BaseUser {
  // Member progress fields
  streak: number;
  moneySaved: number;
  cigarettesAvoided: number;
  daysWithoutSmoking: number;

  // Subscription fields
  subscriptionStatus: 'NONE' | 'ACTIVE' | 'EXPIRED';
  currentPlan: string;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;

  // Quit plan fields
  quitPlanStatus: 'NONE' | 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  quitPlanStartDate?: string;
  quitPlanEndDate?: string;

  // Achievement fields
  totalAchievements: number;
  lastAchievementDate?: string;

  // Activity fields
  lastLoginDate?: string;
  totalSessions: number;
}

/**
 * Coach specific data interface
 */
export interface CoachData extends BaseUser {
  fullName: string;
  coachBio?: string;
  rating: number;
  specialties: string;

  // Performance metrics
  totalRevenue: number;
  totalAppointments: number;
  completedSessions: number;
  averageSessionRating: number;

  // Activity fields
  isAvailable: boolean;
  nextAvailableDate?: string;
  totalClients: number;
}

/**
 * User action interfaces
 */
export interface UserUpdateRequest {
  username?: string;
  email?: string;
}

export interface UserStatusToggleResponse {
  userId: string;
  isActive: boolean;
  message: string;
}

/**
 * Chart data interfaces
 */
export interface UserGrowthChartData {
  date: string;
  newUsers: number;
  totalUsers: number;
  newMembers: number;
  newCoaches: number;
}

export interface UserDistributionData {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

export interface SubscriptionDistributionData {
  planName: string;
  subscriberCount: number;
  revenue: number;
  percentage: number;
  color: string;
}

export interface QuitPlanProgressData {
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'NONE';
  count: number;
  percentage: number;
  averageDuration?: number;
}

/**
 * Filter and search interfaces
 */
export interface UserTableFilters {
  role: 'ALL' | 'NORMAL_MEMBER' | 'PREMIUM_MEMBER' | 'COACH' | 'CONTENT_ADMIN';
  status: 'ALL' | 'ACTIVE' | 'INACTIVE';
  subscriptionStatus: 'ALL' | 'ACTIVE' | 'EXPIRED';
  quitPlanStatus: 'ALL' | 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  dateRange: {
    startDate?: string;
    endDate?: string;
  };
  searchTerm: string;
}

export interface UserTableSort {
  field: 'username' | 'email' | 'createdAt' | 'streak' | 'moneySaved' | 'rating';
  direction: 'ASC' | 'DESC';
}

export interface UserTablePagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/**
 * API Response types
 */
export interface UserListResponse {
  content: (MemberData | CoachData)[];
  pagination: UserTablePagination;
}

export interface UserStatsResponse {
  totalUsers: number;
  totalMembers: number;
  totalPremiumMembers: number;
  totalCoaches: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsersLast24h: number;
  newUsersLast7d: number;
  newUsersLast30d: number;
  subscriptionRate: number;
  quitPlanCompletionRate: number;
  averageUserStreak: number;
  totalRevenue: number;
  monthlyGrowthRate: number;
}

/**
 * Table column definitions
 */
export interface UserTableColumn {
  key: string;
  label: string;
  sortable: boolean;
  width?: string;
  render?: (value: unknown, row: MemberData | CoachData) => React.ReactNode;
}

/**
 * Component prop types
 */
export interface UserManagementProps {
  initialFilters?: Partial<UserTableFilters>;
  onUserSelect?: (user: MemberData | CoachData) => void;
  showActions?: boolean;
}

export interface UserStatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

export interface UserTableProps {
  data: (MemberData | CoachData)[];
  loading: boolean;
  filters: UserTableFilters;
  sort: UserTableSort;
  pagination: UserTablePagination;
  onFiltersChange: (filters: UserTableFilters) => void;
  onSortChange: (sort: UserTableSort) => void;
  onPaginationChange: (pagination: Partial<UserTablePagination>) => void;
  onUserEdit: (user: MemberData | CoachData) => void;
  onUserStatusToggle: (userId: string) => void;
  onUserView: (user: MemberData | CoachData) => void;
}

/**
 * Error handling types
 */
export interface UserManagementError {
  code: string;
  message: string;
  field?: string;
}

export interface UserActionError extends UserManagementError {
  userId: string;
  action: 'UPDATE' | 'TOGGLE_STATUS' | 'DELETE';
}

/**
 * Loading state types
 */
export interface UserManagementLoadingState {
  users: boolean;
  stats: boolean;
  charts: boolean;
  userAction: string | null; // userId if action is in progress
}

/**
 * Form types
 */
export interface UserEditFormData {
  username: string;
  email: string;
}

export interface UserEditFormErrors {
  username?: string;
  email?: string;
  general?: string;
}

/**
 * Utility types
 */
export type UserRole = BaseUser['role'];
export type SubscriptionStatus = MemberData['subscriptionStatus'];
export type QuitPlanStatus = MemberData['quitPlanStatus'];

/**
 * Type guards
 */
export function isMemberData(user: BaseUser): user is MemberData {
  return user.role === 'NORMAL_MEMBER' || user.role === 'PREMIUM_MEMBER';
}

export function isCoachData(user: BaseUser): user is CoachData {
  return user.role === 'COACH';
}

export function isPremiumMember(user: BaseUser): boolean {
  return user.role === 'PREMIUM_MEMBER';
}

/**
 * Validation schemas (using simple validation functions)
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateUserEditForm(data: UserEditFormData): ValidationResult {
  const errors: Record<string, string> = {};

  // Username validation
  if (!data.username.trim()) {
    errors.username = 'Tên người dùng không được để trống';
  } else if (data.username.length < 3) {
    errors.username = 'Tên người dùng phải có ít nhất 3 ký tự';
  } else if (data.username.length > 50) {
    errors.username = 'Tên người dùng không được vượt quá 50 ký tự';
  } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
    errors.username = 'Tên người dùng chỉ được chứa chữ cái, số và dấu gạch dưới';
  }

  // Email validation
  if (!data.email.trim()) {
    errors.email = 'Email không được để trống';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Email không hợp lệ';
  } else if (data.email.length > 100) {
    errors.email = 'Email không được vượt quá 100 ký tự';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
