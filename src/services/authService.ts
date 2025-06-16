import axiosConfig from "@/config/axiosConfig";
import type { AccountResponse, ApiResponse, LoginRequest, RegisterRequest } from "@/types/auth";

const AUTH_ENDPOINT_PREFIX = '/auth';

const authService = {
  // đăng ký, set token vào localStorage
  register: async (registerData: RegisterRequest): Promise<ApiResponse<AccountResponse>> => {
    const response = await axiosConfig.post<ApiResponse<AccountResponse>>(`${AUTH_ENDPOINT_PREFIX}/register`, registerData);
    if (response.data && response.data.data) {
      // Lưu token vào localStorage
      localStorage.setItem('jwtToken', response.data.data.token);
      // Lưu thông tin người dùng vào localStorage
      localStorage.setItem('userInfo', JSON.stringify(response.data.data));
    }
    return response.data;
  },


  // đăng nhập
  login: async (loginData: LoginRequest): Promise<ApiResponse<AccountResponse>> => {
    const response = await axiosConfig.post<ApiResponse<AccountResponse>>(`${AUTH_ENDPOINT_PREFIX}/login`, loginData);
    if (response.data && response.data.data) {
      // Lưu token vào localStorage
      localStorage.setItem('jwtToken', response.data.data.token);
      // Lưu thông tin người dùng vào localStorage
      localStorage.setItem('userInfo', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  // đăng xuất, xóa token khỏi localStorage
  logout: async (): Promise<void> => {
    try {
      await axiosConfig.post(`${AUTH_ENDPOINT_PREFIX}/logout`);
    } catch (e) {
      console.error("Error while calling API backend:", e);
    } finally {
      localStorage.removeItem('jwtToken'); // Xóa token khỏi localStorage
      localStorage.removeItem('userInfo'); // Xóa thông tin người dùng khỏi localStorage
      // Có thể gọi API để thông báo đăng xuất nếu cần
      delete axiosConfig.defaults.headers.common['Authorization']; // Xóa header Authorization
    }
  },

  // lấy token từ localStorage
  getToken: (): string | null => {
    return localStorage.getItem('jwtToken');
  }
}

export default authService;