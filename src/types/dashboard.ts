// Dashboard API Response Types

/**
 * Standard API Response wrapper
 */
export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
  error: null | string;
  errorCode: null | string;
  timestamp: string;
}

/**
 * Revenue by period data from backend
 */
export interface RevenueByPeriodDTO {
  period: string;           // "2025-07"
  periodStart: string;      // "2025-07-01T00:00:00"
  periodEnd: string;        // "2025-08-01T00:00:00"
  revenue: number;          // 708000
  transactionCount: number; // 2
  successCount: number;     // 2
  failedCount: number;      // 0
  successRate: number;      // 100
}

/**
 * Chart data point for frontend charts
 */
export interface ChartDataPoint {
  month: string;    // "T7" (formatted for display)
  revenue: number;  // 708000 (in VND)
}

/**
 * Dashboard overview stats
 */
export interface DashboardOverviewDTO {
  totalRevenue: number;
  totalRevenueSuccess: number;
  totalTransactions: number;
  successTransactions: number;
  pendingTransactions: number;
  failedTransactions: number;
  canceledTransactions: number;
  averageOrderValue: number;
  successRate: number;
  activeSubscriptions: number;
  totalUsers: number;
  revenueGrowthRate: number;
}

/**
 * Dashboard filter options
 */
export interface DashboardFilter {
  period?: string;
  startDate?: string;
  endDate?: string;
  statuses?: string[];
  planIds?: number[];
  userIds?: string[];
  paymentMethod?: string;
}

/**
 * Revenue chart state
 */
export interface RevenueChartState {
  data: ChartDataPoint[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

/**
 * Date range for API calls
 */
export interface DateRange {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

/**
 * Period types for chart grouping
 */
export type PeriodType = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

/**
 * Transaction Status Types
 */
export type TransactionStatus = 'SUCCESS' | 'FAILED' | 'PENDING' | 'CANCELLED';

/**
 * Transaction Detail DTO
 */
export interface TransactionDetailDTO {
  transactionId: string;
  userId: string;
  userName: string;
  userEmail: string;
  planId: number;
  planName: string;
  planDescription: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  paymentMethod: string;
  paymentDetails?: string;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
  failureReason?: string;
  refundAmount?: number;
  refundDate?: string;
}

/**
 * Paginated Response wrapper
 */
export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  sort?: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
}

/**
 * Transaction Filter Options
 */
export interface TransactionFilterOptions {
  statuses: TransactionStatus[];
  paymentMethods: string[];
  planOptions: { id: number; name: string; displayName: string }[];
  dateRangePresets: string[];
}

/**
 * Transaction Export Options
 */
export interface TransactionExportOptions {
  format: 'CSV' | 'EXCEL' | 'PDF';
  includeDetails: boolean;
  dateRange: DateRange;
  filters: {
    status?: TransactionStatus;
    paymentMethod?: string;
    planIds?: number[];
    userIds?: string[];
  };
}

/**
 * Export Request DTO - matches backend ExportRequestDTO
 */
export interface TransactionExportRequest {
  format: 'CSV' | 'EXCEL';
  exportType: 'TRANSACTIONS';
  period?: string;
  startDate?: string;
  endDate?: string;
  statuses?: string[];
  planIds?: number[];
  userIds?: string[];
  paymentMethod?: string;
  includeDetails?: boolean;
  sortBy?: string;
  sortDirection?: string;
  maxRecords?: number;
}

/**
 * Export Response DTO - matches backend ExportResponseDTO
 */
export interface ExportResponseDTO {
  exportId: string;
  fileName: string;
  fileSize?: number;
  recordCount: number;
  downloadUrl?: string;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  completedAt: string;
  errorMessage?: string;
}

/**
 * Export State for UI
 */
export interface ExportState {
  isExporting: boolean;
  progress?: number;
  error?: string;
  lastExport?: ExportResponseDTO;
}
