// services/dailySummaryService.tsx

import axios from 'axios';
import axiosConfig from '@/config/axiosConfig'; // Đảm bảo đường dẫn đúng đến axiosConfig của bạn
import { useCallback, useEffect, useState } from 'react'; // Import các hook cần thiết

// --- General API Response Types ---
export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T; // Có thể là T hoặc null tùy thuộc vào phản hồi của BE
  errors?: { [key: string]: string };
}

export interface ApiError {
  status: number;
  message: string;
  errors?: string[];
}

// Utility function to handle API errors
const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const apiResponse = error.response.data as ApiResponse<unknown>;
      if (apiResponse && apiResponse.message) {
        return apiResponse.message;
      }
      return `API Error: ${error.response.status} - ${error.response.statusText || 'Unknown Error'}`;
    } else if (error.request) {
      return "Không nhận được phản hồi từ máy chủ. Vui lòng kiểm tra kết nối mạng.";
    } else {
      return `Lỗi yêu cầu: ${error.message}`;
    }
  } else if (error instanceof Error) {
    return error.message;
  }
  return 'Đã xảy ra lỗi không xác định';
};

// --- Enums (tương ứng với BE enums) ---
export type Mood = 'STRESSED' | 'BORED' | 'ANXIOUS' | 'ANGRY' | 'SAD' | 'HAPPY' |
  'RELAXED' | 'ANNOYED' | 'DEPRESSED' | 'DISSAPOINTED' | 'DISCOURAGED' |
  'DOWN' | 'FRUSTATED' | 'HUNGRY' | 'LONELY' | 'TIRED' |
  'UNCOMFORTABLE' | 'UNHAPPY' | 'UNSATISFIED' | 'UPSET' | 'EXCITED' |
  'WORRIED' | 'OTHER';

// --- DailySummary DTOs (tương ứng với BE DTOs) ---

export interface DailySummaryCreateRequest {
  trackDate: string; // LocalDate -> string (ISO 8601: YYYY-MM-DD)
  totalSmokedCount: number;
  totalCravingCount: number;
  mood?: Mood;
  note?: string;
}

export interface DailySummaryUpdateRequest {
  // trackDate: string;
  updateSmokedCount?: number; // Optional based on partial update
  updateCravingCount?: number; // Optional based on partial update
  mood?: Mood; // Optional based on partial update
  note?: string; // Optional based on partial update
}

export interface DailySummaryResponse {
  dailySummaryId: number;
  totalSmokedCount: number;
  totalCravingCount: number;
  trackDate: string; // LocalDate -> string (ISO 8601: YYYY-MM-DD)
  mood?: Mood;
  note?: string;
  moneySaved: number; // BigDecimal -> number
  isGoalAchievedToday: boolean;
}

class DailySummaryService {
  private static instance: DailySummaryService; // Singleton instance
  // Đã sửa API_BASE_URL thành '/diary' để khớp với @RequestMapping("/api/diary")
  // khi kết hợp với baseURL: 'http://localhost:8080/api' trong axiosConfig.
  private API_BASE_URL = '/diary';

  // Phương thức để lấy instance singleton
  public static getInstance(): DailySummaryService {
    if (!DailySummaryService.instance) {
      DailySummaryService.instance = new DailySummaryService();
    }
    return DailySummaryService.instance;
  }

  /**
   * Creates a new daily summary.
   * Tạo nhật ký hằng ngày mới.
   * POST /api/diary
   * @param data Daily summary creation request data.
   * @returns A Promise that resolves with the created DailySummaryResponse.
   */
  createDailySummary = async (data: DailySummaryCreateRequest): Promise<DailySummaryResponse> => {
    try {
      const response = await axiosConfig.post<ApiResponse<DailySummaryResponse>>(`${this.API_BASE_URL}`, data);
      if (response.status === 201 && response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to create daily summary.');
      }
    } catch (error: unknown) {
      console.error('Error creating daily summary:', error);
      throw new Error(handleApiError(error));
    }
  };

  /**
   * Retrieves a daily summary by its ID.
   * Lấy nhật ký hằng ngày theo ID.
   * GET /api/diary/{id}
   * @param id The ID of the daily summary.
   * @returns A Promise that resolves with the DailySummaryResponse.
   */
  getDailySummaryById = async (id: number): Promise<DailySummaryResponse> => {
    try {
      const response = await axiosConfig.get<ApiResponse<DailySummaryResponse>>(`${this.API_BASE_URL}/${id}`);
      if (response.status === 200 && response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || `Failed to fetch daily summary with ID: ${id}`);
      }
    } catch (error: unknown) {
      console.error(`Error fetching daily summary with ID ${id}:`, error);
      throw new Error(handleApiError(error));
    }
  };

  /**
   * Retrieves a daily summary for a specific date for the authenticated member.
   * Lấy nhật ký hằng ngày cho một ngày cụ thể của thành viên đã xác thực.
   * GET /api/diary/by-date?date={date}
   * @param date The date (YYYY-MM-DD) for which to retrieve the summary.
   * @returns A Promise that resolves with the DailySummaryResponse or null if not found.
   */
  getDailySummaryByDate = async (date: string): Promise<DailySummaryResponse | null> => {
    try {
      const response = await axiosConfig.get<ApiResponse<DailySummaryResponse>>(`${this.API_BASE_URL}/by-date`, {
        params: { date }
      });
      // Backend trả về 200 OK với data: null nếu không tìm thấy bản ghi
      if (response.status === 200) {
        return response.data.data || null; // Trả về data hoặc null nếu data là null
      } else {
        // Các trạng thái 2xx khác nhưng không mong muốn hoặc lỗi khác
        throw new Error(response.data?.message || `Failed to fetch daily summary for date ${date} with status ${response.status}`);
      }
    } catch (error: unknown) {
      console.error(`Error fetching daily summary for date ${date}:`, error);
      // Backend sẽ không ném 404 cho trường hợp này nữa, nhưng vẫn giữ xử lý lỗi chung
      throw new Error(handleApiError(error));
    }
  };


  /**
   * Updates an existing daily summary by its ID.
   * Cập nhật nhật ký hằng ngày hiện có theo ID.
   * PATCH /api/diary/{id}
   * @param id The ID of the daily summary to update.
   * @param data Daily summary update request data.
   * @returns A Promise that resolves with the updated DailySummaryResponse or null if deleted (204).
   */
  updateDailySummary = async (id: number, data: DailySummaryUpdateRequest): Promise<DailySummaryResponse | null> => {
    try {
      const response = await axiosConfig.patch<ApiResponse<DailySummaryResponse>>(`${this.API_BASE_URL}/${id}`, data);
      if (response.status === 200 && response.data && response.data.data) {
        return response.data.data;
      } else if (response.status === 204) {
        return null; // Trả về null nếu BE trả về 204 (đã xóa bản ghi)
      } else {
        throw new Error(response.data.message || `Failed to update daily summary with ID: ${id}`);
      }
    } catch (error: unknown) {
      console.error(`Error updating daily summary with ID ${id}:`, error);
      // Xử lý lỗi 204 No Content từ backend (khi cập nhật giá trị về 0 và bản ghi bị xóa)
      if (axios.isAxiosError(error) && error.response?.status === 204) {
        return null; // Trả về null để chỉ ra rằng bản ghi đã bị xóa
      }
      throw new Error(handleApiError(error));
    }
  };

  /**
   * Deletes a daily summary by its ID.
   * Xóa nhật ký hằng ngày theo ID.
   * DELETE /api/diary/{id}
   * @param id The ID of the daily summary to delete.
   * @returns A Promise that resolves when the deletion is successful.
   */
  deleteDailySummary = async (id: number): Promise<void> => {
    try {
      const response = await axiosConfig.delete<ApiResponse<void>>(`${this.API_BASE_URL}/${id}`);
      if (response.status === 204) { // HTTP 204 No Content for successful deletion
        return;
      } else {
        throw new Error(response.data?.message || `Failed to delete daily summary with ID: ${id}`);
      }
    } catch (error: unknown) {
      console.error(`Error deleting daily summary with ID ${id}:`, error);
      throw new Error(handleApiError(error));
    }
  };
}

// Tạo và export instance singleton
export const dailySummaryService = DailySummaryService.getInstance();

// --- Hook State Types (tương tự useQuitPlan) ---
interface UseDailySummaryState {
  dailySummary: DailySummaryResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage the daily summary for a specific date for the authenticated member.
 * This hook is useful for components that need to display or update
 * the daily summary for the given date.
 * @param date The date (YYYY-MM-DD) for which to fetch the daily summary.
 */
export function useDailySummary(date: string): UseDailySummaryState {
  const [dailySummary, setDailySummary] = useState<DailySummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDailySummary = useCallback(async () => {
    if (!date) { // Chỉ fetch nếu có ngày
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      // Gọi service để lấy bản tóm tắt cho ngày cụ thể
      // Không truyền memberId vì BE tự động lấy từ AuthenticationPrincipal
      const summary = await dailySummaryService.getDailySummaryByDate(date);
      setDailySummary(summary);
    } catch (err) {
      // Nếu getDailySummaryByDate trả về null, nó sẽ không ném lỗi ở đây.
      // Nếu có lỗi khác, nó sẽ được bắt ở đây.
      console.error(`Error fetching daily summary:`, err);
      setDailySummary(null);
    } finally {
      setIsLoading(false);
    }
  }, [date]); // Dependency là date để re-fetch khi ngày thay đổi

  useEffect(() => {
    fetchDailySummary();
  }, [fetchDailySummary]);

  return {
    dailySummary,
    isLoading,
    error,
    refetch: fetchDailySummary,
  };
}

