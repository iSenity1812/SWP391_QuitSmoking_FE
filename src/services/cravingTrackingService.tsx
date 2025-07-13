// services/cravingTrackingService.tsx

import axios from 'axios';
import axiosConfig from '@/config/axiosConfig'; // Đảm bảo đường dẫn đúng đến axiosConfig của bạn
import { useCallback, useEffect, useState } from 'react';

// --- General API Response Types ---
export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
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
  return 'Đã xảy ra lỗi không xác định.';
};

// --- Enums (tương ứng với BE enums) ---
export type Situation =
  | "AFTER_SEX" | "AT_BAR" | "AT_PARTY" | "AT_EVENT" | "WORKING" | "BBQ" | "DRIVING" | "WATCHING_TV"
  | "ON_PHONE" | "ON_COMPUTER" | "CANT_SLEEP" | "CHATITNG" | "CLEANING" | "COOKING" | "DRINKING"
  | "SITTING_ON_CAR" | "GAMING" | "THINKING" | "GOING_TO_BED" | "HAIVNG_A_BREAK" | "JUST_EATEN"
  | "READING" | "SHOPPING" | "RELAXING" | "WALKING" | "WAITING" | "SOCIALIZING" | "WAKING_UP"
  | "WORK_BREAK" | "OTHER";

export type WithWhom = 'ALONE' | 'CLOSE_FRIEND' | 'FAMILY_MEMBER' | 'PARTNER' | 'COLLEAGUE' | 'STRANGER' | 'OTHER';


// --- CravingTracking DTOs (tương ứng với BE DTOs) ---

export interface CravingTrackingCreateRequest {
  // trackTime: string; // LocalDateTime -> string (ISO 8601)
  smokedCount: number;
  cravingsCount: number;
  situation?: Situation; // Single enum value
  withWhom?: WithWhom;   // Single enum value
}

export interface CravingTrackingUpdateRequest {
  smokedCount?: number;
  cravingsCount?: number;
  situations?: Situation[]; // BE dùng Set<Situation>, FE dùng mảng string
  withWhoms?: WithWhom[];   // BE dùng Set<WithWhom>, FE dùng mảng string
}

export interface CravingTrackingResponse {
  cravingTrackingId: number;
  trackTime: string; // LocalDateTime -> string (ISO 8601)
  smokedCount: number;
  cravingsCount: number;
  situations: Situation[]; // BE dùng Set<Situation>, FE dùng mảng string
  withWhoms: WithWhom[];   // BE dùng Set<WithWhom>, FE dùng mảng string
}

export class CravingTrackingService {
  private static instance: CravingTrackingService;
  // API_BASE_URL khớp với @RequestMapping("/api/tracking") trong CravingTrackingController
  private readonly API_BASE_URL = '/tracking';

  public static getInstance(): CravingTrackingService {
    if (!CravingTrackingService.instance) {
      CravingTrackingService.instance = new CravingTrackingService();
    }
    return CravingTrackingService.instance;
  }

  /**
   * Ghi nhận dữ liệu theo dõi cơn thèm thuốc (tạo hoặc cập nhật theo giờ).
   * POST /api/tracking/checkin
   * @param requestData Dữ liệu ghi nhận cơn thèm thuốc.
   * @returns Promise chứa CravingTrackingResponse của bản ghi đã được tạo/cập nhật.
   */
  checkInCraving = async (requestData: CravingTrackingCreateRequest): Promise<CravingTrackingResponse> => {
    try {
      const response = await axiosConfig.post<ApiResponse<CravingTrackingResponse>>(`${this.API_BASE_URL}/checkin`, requestData);
      if (response.status === 201 && response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to check in craving data');
      }
    } catch (error: unknown) {
      console.error('Error checking in craving data:', error);
      throw new Error(handleApiError(error));
    }
  };

  /**
   * Lấy thông tin một bản ghi theo dõi cơn thèm thuốc theo ID.
   * GET /api/tracking/{id}
   * @param id ID của bản ghi theo dõi cơn thèm thuốc.
   * @returns Promise chứa CravingTrackingResponse.
   */
  getCravingTrackingById = async (id: number): Promise<CravingTrackingResponse> => {
    try {
      const response = await axiosConfig.get<ApiResponse<CravingTrackingResponse>>(`${this.API_BASE_URL}/${id}`);
      if (response.status === 200 && response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || `Failed to fetch craving tracking with ID: ${id}`);
      }
    } catch (error: unknown) {
      console.error(`Error fetching craving tracking with ID ${id}:`, error);
      throw new Error(handleApiError(error));
    }
  };

  /**
   * Lấy tất cả bản ghi theo dõi cơn thèm thuốc cho một DailySummary cụ thể.
   * GET /api/tracking/diary/{dailySummaryId}
   * @param dailySummaryId ID của DailySummary.
   * @returns Promise chứa danh sách CravingTrackingResponse.
   */
  getCravingTrackingsByDailySummaryId = async (dailySummaryId: number): Promise<CravingTrackingResponse[]> => {
    try {
      const response = await axiosConfig.get<ApiResponse<CravingTrackingResponse[]>>(`${this.API_BASE_URL}/diary/${dailySummaryId}`);
      if (response.status === 200 && response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || `Failed to fetch craving trackings for daily summary ID: ${dailySummaryId}`);
      }
    } catch (error: unknown) {
      console.error(`Error fetching craving trackings for daily summary ID ${dailySummaryId}:`, error);
      throw new Error(handleApiError(error));
    }
  };

  /**
   * Cập nhật thông tin một bản ghi theo dõi cơn thèm thuốc.
   * PATCH /api/tracking/{id}
   * @param id ID của bản ghi theo dõi cơn thèm thuốc cần cập nhật.
   * @param requestData Dữ liệu cập nhật.
   * @returns Promise chứa CravingTrackingResponse của bản ghi đã cập nhật.
   */
  updateCravingTracking = async (id: number, requestData: CravingTrackingUpdateRequest): Promise<CravingTrackingResponse> => {
    try {
      const response = await axiosConfig.patch<ApiResponse<CravingTrackingResponse>>(`${this.API_BASE_URL}/${id}`, requestData);
      if (response.status === 200 && response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || `Failed to update craving tracking with ID: ${id}`);
      }
    } catch (error: unknown) {
      console.error(`Error updating craving tracking with ID ${id}:`, error);
      throw new Error(handleApiError(error));
    }
  };

  /**
   * Xóa bản ghi theo dõi cơn thèm thuốc theo ID.
   * DELETE /api/tracking/{id}
   * @param id ID của bản ghi theo dõi cơn thèm thuốc cần xóa.
   * @returns Promise rỗng khi xóa thành công.
   */
  deleteCravingTracking = async (id: number): Promise<void> => {
    try {
      const response = await axiosConfig.delete<ApiResponse<void>>(`${this.API_BASE_URL}/${id}`);
      if (response.status === 204) { // HTTP 204 No Content for successful deletion
        return;
      } else {
        throw new Error(response.data?.message || `Failed to delete craving tracking with ID: ${id}`);
      }
    } catch (error: unknown) {
      console.error(`Error deleting craving tracking with ID ${id}:`, error);
      throw new Error(handleApiError(error));
    }
  };
}

// Tạo và export instance singleton
export const cravingTrackingService = CravingTrackingService.getInstance();


// --- Custom Hooks để sử dụng trong React Components ---

interface UseCravingTrackingState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseCravingTrackingsListState<T> {
  data: T[] | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook để lấy thông tin một bản ghi theo dõi cơn thèm thuốc theo ID.
 * @param id ID của bản ghi theo dõi cơn thèm thuốc.
 */
export function useCravingTracking(id: number | null): UseCravingTrackingState<CravingTrackingResponse> {
  const [data, setData] = useState<CravingTrackingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (id === null) {
      setIsLoading(false);
      setData(null);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const result = await cravingTrackingService.getCravingTrackingById(id);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch craving tracking");
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

/**
 * Custom hook để lấy tất cả bản ghi theo dõi cơn thèm thuốc cho một DailySummary cụ thể.
 * @param dailySummaryId ID của DailySummary.
 */
export function useCravingTrackingsByDailySummary(dailySummaryId: number | null): UseCravingTrackingsListState<CravingTrackingResponse> {
  const [data, setData] = useState<CravingTrackingResponse[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (dailySummaryId === null) {
      setIsLoading(false);
      setData(null);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const result = await cravingTrackingService.getCravingTrackingsByDailySummaryId(dailySummaryId);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch craving trackings by daily summary ID");
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [dailySummaryId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
