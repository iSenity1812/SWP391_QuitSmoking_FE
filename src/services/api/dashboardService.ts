import axiosConfig from "@/config/axiosConfig";
import { isAxiosError } from "axios";
import { authService } from "../authService";
import type { ApiResponse, RevenueByPeriodDTO, TransactionExportRequest, ExportResponseDTO } from "@/types/dashboard";

/**
 * ====================================================================
 * DASHBOARD SERVICE - Dịch vụ quản lý dữ liệu dashboard
 * ====================================================================
 * 
 * Chức năng chính:
 * - Lấy dữ liệu doanh thu theo các khoảng thời gian khác nhau (ngày/tuần/tháng/năm)
 * - Quản lý transactions với advanced filtering và pagination
 * - Xử lý authentication và authorization
 * - Handle các lỗi API một cách thống nhất
 * 
 * Design Pattern: Singleton
 * - Đảm bảo chỉ có 1 instance duy nhất của service
 * - Tránh việc tạo nhiều connection không cần thiết
 */

/**
 * Interface định nghĩa parameters cho API call lấy doanh thu
 */
export interface GetRevenueByPeriodParams {
  groupBy: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';  // Nhóm dữ liệu theo thời gian
  startDate: string; // Format: 'YYYY-MM-DD' - Ngày bắt đầu
  endDate: string;   // Format: 'YYYY-MM-DD' - Ngày kết thúc
}

/**
 * ====================================================================
 * TRANSACTIONS API INTERFACES
 * ====================================================================
 */

/**
 * Transaction status enum - sync với backend
 */
export type TransactionStatus = 'SUCCESS' | 'PENDING' | 'FAILED' | 'CANCELED';

/**
 * User role enum - sync với backend
 */
export type UserRole = 'PREMIUM_MEMBER' | 'REGULAR_MEMBER' | 'SUPER_ADMIN';

/**
 * Transaction detail DTO - sync với backend TransactionDetailDTO
 */
export interface TransactionDetailDTO {
  transactionId: string;
  externalTransactionId: string;
  amount: number;
  transactionDate: string;
  status: TransactionStatus;
  paymentMethod: string;

  // User info
  userId: string;
  username: string;
  userEmail: string;
  userRole: UserRole;
  userProfilePicture?: string;

  // Plan info
  planId: number;
  planName: string;
  planDisplayName: string;
  planPrice: number;

  // Subscription info
  subscriptionId?: number;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  isSubscriptionActive?: boolean;

  createdAt: string;
  updatedAt: string;
}

/**
 * Paginated response structure
 */
export interface PagedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  empty: boolean;
}

/**
 * Parameters cho API call lấy transactions
 */
export interface GetTransactionsParams {
  // Time filtering
  period?: string; // 'LAST_30_DAYS', 'LAST_7_DAYS', 'THIS_MONTH', 'CUSTOM', etc.
  startDate?: string; // Format: 'YYYY-MM-DD' - chỉ dùng khi period='CUSTOM'
  endDate?: string;   // Format: 'YYYY-MM-DD' - chỉ dùng khi period='CUSTOM'

  // Advanced filtering
  planIds?: number[];          // Filter theo plan IDs
  userIds?: string[];          // Filter theo user IDs  
  paymentMethod?: string;      // Filter theo payment method
  includeAllStatuses?: boolean; // true = all statuses, false = chỉ SUCCESS

  // Pagination & sorting
  page?: number;              // Page number (0-indexed)
  size?: number;              // Page size
  sortBy?: string;            // Sort field
  sortDirection?: 'ASC' | 'DESC'; // Sort direction
}

/**
 * Transaction filters for advanced filtering UI
 */
export interface TransactionFilters {
  dateRange: {
    startDate: string;
    endDate: string;
    preset?: string; // 'today', 'yesterday', 'last7days', etc.
  };

  plans: {
    selectedPlanIds: number[];
    planOptions: { id: number; name: string; displayName: string }[];
  };

  users: {
    selectedUserIds: string[];
    userSearchTerm: string;
  };

  status: {
    selectedStatuses: TransactionStatus[];
    includeAllStatuses: boolean;
  };

  payment: {
    selectedMethods: string[];
    methodOptions: string[];
  };

  amount: {
    minAmount?: number;
    maxAmount?: number;
  };
}

/**
 * DashboardService Class
 * Quản lý tất cả API calls liên quan đến dashboard
 */
class DashboardService {
  private static instance: DashboardService;

  /**
   * Đảm bảo chỉ có 1 instance của DashboardService trong toàn ứng dụng
   * 
   * Lợi ích:
   * - Tiết kiệm memory
   * - Consistency trong configuration
   * - Dễ dàng quản lý state nếu cần
   */
  public static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService();
    }
    return DashboardService.instance;
  }
  /**
   * Lấy doanh thu theo khoảng thời gian
   * 
   * Flow hoạt động:
   * 1. AUTHENTICATION CHECK - Kiểm tra token đăng nhập
   * 2. API CALL - Gọi backend API với parameters
   * 3. RESPONSE VALIDATION - Validate response từ server
   * 4. ERROR HANDLING - Xử lý các loại lỗi khác nhau
   * 
   * @param params - Parameters cho API call
   * @returns Promise<RevenueByPeriodDTO[]> - Mảng dữ liệu doanh thu
   * @throws Error với message phù hợp cho từng loại lỗi
   */
  async getRevenueByPeriod(params: GetRevenueByPeriodParams): Promise<RevenueByPeriodDTO[]> {
    try {
      // STEP 1: AUTHENTICATION CHECK
      const token = authService.getToken();
      if (!token) {
        throw new Error('Bạn cần đăng nhập để truy cập dữ liệu dashboard');
      }

      // Debug logging - để team có thể trace API calls
      console.log('📊 [DashboardService] Fetching revenue data with params:', params);

      // ================================================================
      // STEP 2: API CALL TO BACKEND
      // Gọi API endpoint: GET /dashboard/revenue/by-period
      // Headers: Authorization được tự động thêm bởi axiosConfig
      const response = await axiosConfig.get<ApiResponse<RevenueByPeriodDTO[]>>(
        '/dashboard/revenue/by-period',
        {
          params: {
            groupBy: params.groupBy,    // Nhóm theo: DAY/WEEK/MONTH/YEAR
            startDate: params.startDate, // Ngày bắt đầu: YYYY-MM-DD
            endDate: params.endDate     // Ngày kết thúc: YYYY-MM-DD
          }
        }
      );

      // Debug logging - để team có thể xem response structure
      console.log('📈 [DashboardService] Revenue API response:', response.data);

      // ================================================================
      // STEP 3: RESPONSE VALIDATION
      // Backend trả về format: { status, message, data, error, timestamp }
      if (response.data.status === 200 && response.data.data) {
        return response.data.data; // Trả về mảng RevenueByPeriodDTO[]
      } else {
        // Response có status khác 200 hoặc không có data
        throw new Error(response.data.message || 'Không thể lấy dữ liệu doanh thu');
      }

    } catch (error: unknown) {
      // ================================================================
      // STEP 4: COMPREHENSIVE ERROR HANDLING
      console.error('❌ [DashboardService] Lỗi khi lấy dữ liệu doanh thu:', error);

      // Kiểm tra nếu là lỗi từ Axios (HTTP errors)
      if (isAxiosError(error)) {
        // Xử lý các HTTP status codes cụ thể
        switch (error.response?.status) {
          case 401:
            throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          case 403:
            throw new Error('Bạn không có quyền truy cập dữ liệu dashboard');
          case 400:
            throw new Error('Tham số không hợp lệ. Vui lòng kiểm tra lại khoảng thời gian');
          case 500:
            throw new Error('Lỗi hệ thống. Vui lòng thử lại sau');
          default:
            // Các status codes khác, ưu tiên message từ server
            if (error.response?.data?.message) {
              throw new Error(error.response.data.message);
            } else {
              throw new Error('Không thể kết nối đến server');
            }
        }
      }

      // Xử lý các loại lỗi khác (network, timeout, etc.)
      if (error instanceof Error) {
        throw new Error(`Lỗi không xác định: ${error.message}`);
      }

      // Fallback cho các trường hợp không xác định
      throw new Error('Lỗi không xác định khi lấy dữ liệu doanh thu');
    }
  }

  /**
   * ====================================================================
   * TRANSACTIONS MANAGEMENT METHODS
   * ====================================================================
   */

  /**
   * Lấy danh sách transactions với advanced filtering và pagination
   * 
   * @param params - Parameters cho filtering, sorting và pagination
   * @returns Promise<PagedResponse<TransactionDetailDTO>> - Dữ liệu transactions có phân trang
   * @throws Error với message phù hợp cho từng loại lỗi
   */
  async getTransactions(params: GetTransactionsParams = {}): Promise<PagedResponse<TransactionDetailDTO>> {
    try {
      // ================================================================
      // STEP 1: AUTHENTICATION CHECK
      // ================================================================
      const token = authService.getToken();
      if (!token) {
        throw new Error('Bạn cần đăng nhập để truy cập dữ liệu giao dịch');
      }

      // Debug logging
      console.log('💳 [DashboardService] Fetching transactions with params:', params);

      // ================================================================
      // STEP 2: PREPARE QUERY PARAMETERS
      // ================================================================
      const queryParams: Record<string, string | number | boolean | string[] | number[]> = {
        // Default values
        page: params.page ?? 0,
        size: params.size ?? 20,
        sortBy: params.sortBy ?? 'transactionDate',
        sortDirection: params.sortDirection ?? 'DESC',
        includeAllStatuses: params.includeAllStatuses ?? false,
      };

      // Add optional parameters
      if (params.period) {
        queryParams.period = params.period;
      }
      if (params.startDate) {
        queryParams.startDate = params.startDate;
      }
      if (params.endDate) {
        queryParams.endDate = params.endDate;
      }
      if (params.planIds && params.planIds.length > 0) {
        queryParams.planIds = params.planIds;
      }
      if (params.userIds && params.userIds.length > 0) {
        queryParams.userIds = params.userIds;
      }
      if (params.paymentMethod) {
        queryParams.paymentMethod = params.paymentMethod;
      }

      // ================================================================
      // STEP 3: API CALL TO BACKEND
      // ================================================================
      const response = await axiosConfig.get<ApiResponse<PagedResponse<TransactionDetailDTO>>>(
        '/dashboard/transactions',
        { params: queryParams }
      );

      // Debug logging
      console.log('💳 [DashboardService] Transactions API response:', {
        status: response.data.status,
        totalElements: response.data.data?.totalElements,
        totalPages: response.data.data?.totalPages,
        currentPage: response.data.data?.number
      });

      // ================================================================
      // STEP 4: RESPONSE VALIDATION
      // ================================================================
      if (response.data.status === 200 && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Không thể lấy dữ liệu giao dịch');
      }

    } catch (error: unknown) {
      console.error('❌ [DashboardService] Lỗi khi lấy dữ liệu giao dịch:', error);

      if (isAxiosError(error)) {
        switch (error.response?.status) {
          case 401:
            throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          case 403:
            throw new Error('Bạn không có quyền truy cập dữ liệu giao dịch');
          case 400:
            throw new Error('Tham số không hợp lệ. Vui lòng kiểm tra lại bộ lọc');
          case 500:
            throw new Error('Lỗi hệ thống. Vui lòng thử lại sau');
          default:
            if (error.response?.data?.message) {
              throw new Error(error.response.data.message);
            } else {
              throw new Error('Không thể kết nối đến server');
            }
        }
      }

      if (error instanceof Error) {
        throw new Error(`Lỗi không xác định: ${error.message}`);
      }

      throw new Error('Lỗi không xác định khi lấy dữ liệu giao dịch');
    }
  }

  /**
   * Lấy chi tiết một transaction cụ thể
   * 
   * @param transactionId - ID của transaction cần lấy
   * @returns Promise<TransactionDetailDTO> - Chi tiết transaction
   */
  async getTransactionById(transactionId: string): Promise<TransactionDetailDTO> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Bạn cần đăng nhập để truy cập dữ liệu giao dịch');
      }

      console.log('💳 [DashboardService] Fetching transaction detail for ID:', transactionId);

      const response = await axiosConfig.get<ApiResponse<TransactionDetailDTO>>(
        `/dashboard/transactions/${transactionId}`
      );

      if (response.data.status === 200 && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Không thể lấy chi tiết giao dịch');
      }

    } catch (error: unknown) {
      console.error('❌ [DashboardService] Lỗi khi lấy chi tiết giao dịch:', error);

      if (isAxiosError(error)) {
        switch (error.response?.status) {
          case 404:
            throw new Error('Không tìm thấy giao dịch');
          case 401:
            throw new Error('Phiên đăng nhập đã hết hạn');
          case 403:
            throw new Error('Bạn không có quyền truy cập giao dịch này');
          default:
            throw new Error('Lỗi khi lấy chi tiết giao dịch');
        }
      }

      throw new Error('Lỗi không xác định khi lấy chi tiết giao dịch');
    }
  }

  /**
   * ====================================================================
   * TRANSACTION EXPORT METHODS
   * ====================================================================
   */

  /**
   * Export transactions to CSV/Excel format
   * 
   * @param exportRequest - Export parameters
   * @returns Promise<Blob> - File blob for download
   */
  async exportTransactions(exportRequest: TransactionExportRequest): Promise<Blob> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Bạn cần đăng nhập để xuất dữ liệu');
      }

      console.log('📊 [DashboardService] Exporting transactions:', exportRequest);

      const response = await axiosConfig.post('/dashboard/export/transactions', exportRequest, {
        responseType: 'blob', // Important for file download
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('📈 [DashboardService] Export completed, file size:', response.data.size);

      return response.data;

    } catch (error: unknown) {
      console.error('❌ [DashboardService] Error exporting transactions:', error);

      if (isAxiosError(error)) {
        switch (error.response?.status) {
          case 401:
            throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          case 403:
            throw new Error('Bạn không có quyền xuất dữ liệu');
          case 400:
            throw new Error('Tham số xuất dữ liệu không hợp lệ');
          case 500:
            throw new Error('Lỗi hệ thống khi xuất dữ liệu');
          default:
            if (error.response?.data?.message) {
              throw new Error(error.response.data.message);
            } else {
              throw new Error('Không thể xuất dữ liệu');
            }
        }
      }

      if (error instanceof Error) {
        throw new Error(`Lỗi không xác định: ${error.message}`);
      }

      throw new Error('Lỗi không xác định khi xuất dữ liệu');
    }
  }

  /**
   * Get export information before downloading
   * 
   * @param format - Export format (CSV/EXCEL)
   * @param recordCount - Number of records to export
   * @returns Promise<ExportResponseDTO> - Export metadata
   */
  async getExportInfo(format: string, recordCount: number = 0): Promise<ExportResponseDTO> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Bạn cần đăng nhập để lấy thông tin xuất dữ liệu');
      }

      console.log('📊 [DashboardService] Getting export info:', { format, recordCount });

      const response = await axiosConfig.get<ApiResponse<ExportResponseDTO>>(
        '/dashboard/export/info',
        {
          params: { format, recordCount }
        }
      );

      if (response.data.status === 200 && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Không thể lấy thông tin xuất dữ liệu');
      }

    } catch (error: unknown) {
      console.error('❌ [DashboardService] Error getting export info:', error);

      if (isAxiosError(error)) {
        switch (error.response?.status) {
          case 401:
            throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          case 403:
            throw new Error('Bạn không có quyền truy cập thông tin xuất dữ liệu');
          case 400:
            throw new Error('Tham số không hợp lệ');
          case 500:
            throw new Error('Lỗi hệ thống');
          default:
            if (error.response?.data?.message) {
              throw new Error(error.response.data.message);
            } else {
              throw new Error('Không thể kết nối đến server');
            }
        }
      }

      if (error instanceof Error) {
        throw new Error(`Lỗi không xác định: ${error.message}`);
      }

      throw new Error('Lỗi không xác định khi lấy thông tin xuất dữ liệu');
    }
  }

  /**
   * ====================================================================
   * UTILITY METHODS FOR EXPORT
   * ====================================================================
   */

  /**
   * Download file from blob
   * 
   * @param blob - File blob
   * @param fileName - File name
   */
  downloadFile(blob: Blob, fileName: string): void {
    try {
      // Create download URL
      const url = window.URL.createObjectURL(blob);

      // Create temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log('📥 [DashboardService] File downloaded successfully:', fileName);
    } catch (error) {
      console.error('❌ [DashboardService] Error downloading file:', error);
      throw new Error('Không thể tải file xuống');
    }
  }

  /**
   * Generate file name for export
   * 
   * @param format - Export format
   * @param prefix - File name prefix
   * @returns Generated file name
   */
  generateExportFileName(format: string, prefix: string = 'transactions_export'): string {
    const timestamp = new Date().toISOString()
      .replace(/:/g, '-')
      .replace(/\..+/, '');

    const extension = format.toLowerCase() === 'csv' ? 'csv' : 'xlsx';
    return `${prefix}_${timestamp}.${extension}`;
  }
}

/**
 * ====================================================================
 * EXPORTED SINGLETON INSTANCE
 * ====================================================================
 * 
 * Export instance duy nhất của DashboardService
 * Toàn bộ ứng dụng sẽ sử dụng instance này
 * 
 * Usage trong components:
 * import { dashboardService } from '@/services/api/dashboardService'
 * const data = await dashboardService.getRevenueByPeriod(params)
 */
export const dashboardService = DashboardService.getInstance();

/**
 * ====================================================================
 * DOCUMENTATION FOR TEAM
 * ====================================================================
 * 
 * 🎯 MỤC ĐÍCH:
 * - Tạo layer abstraction giữa UI components và API backend
 * - Xử lý authentication và error handling tập trung
 * - Cung cấp interface thống nhất cho việc fetch dữ liệu dashboard
 * 
 * 🔄 FLOW HOẠT ĐỘNG:
 * 1. Component gọi dashboardService.getRevenueByPeriod()
 * 2. Service check authentication token
 * 3. Gọi API với axios, kèm parameters
 * 4. Validate response từ backend
 * 5. Transform data hoặc throw error
 * 6. Component nhận data hoặc handle error
 * 
 * 📊 DATA FLOW:
 * Component → Service → API → Backend → Database
 *     ↓         ↓      ↓       ↓         ↓
 * UI Update ← Transform ← Response ← Query ← Data
 * 
 * 🛡️ ERROR HANDLING:
 * - 401: Token expired → Redirect to login
 * - 403: No permission → Show permission error
 * - 400: Bad params → Show validation error
 * - 500: Server error → Show retry option
 * - Network: Connection issue → Show offline message
 * 
 * 🚀 PERFORMANCE:
 * - Singleton pattern: Tái sử dụng instance
 * - Axios interceptors: Auto handle headers
 * - Error boundaries: Catch và display errors
 * 
 * 📝 FUTURE ENHANCEMENTS:
 * - Thêm caching layer (React Query đã implement)
 * - Request debouncing cho search
 * - Background sync cho realtime updates
 * - Offline support với service workers
 */
