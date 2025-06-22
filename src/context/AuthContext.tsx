import React, { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import authService from "@/services/authService";
import type { AccountResponse, ApiResponse, LoginRequest, RegisterRequest } from "@/types/auth";
import { useNavigate } from "react-router-dom";


interface AuthContextType {
    isAuthenticated: boolean;
    user: AccountResponse | null; // Thông tin người dùng khi đã đăng nhập
    token: string | null; // JWT token
    login: (credentials: LoginRequest) => Promise<ApiResponse<AccountResponse>>;
    register: (data: RegisterRequest) => Promise<ApiResponse<AccountResponse>>;
    logout: () => void;
    isLoading: boolean; // Trạng thái đang tải
}

// Tạo context với giá trị mặc định
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props cho AuthProvider
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<AccountResponse | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    // Useeffect để kiểm tra token khi khởi tạo trong localStorage
    useEffect(() => {
        const storedToken = authService.getToken();
        const storedUser = localStorage.getItem('userInfo');

        if (storedToken && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser) as AccountResponse;
                setToken(storedToken);
                setUser(parsedUser);
                setIsAuthenticated(true);
            } catch (e) {
                console.error("Error parsing user info from localStorage", e);
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('userInfo');
                setToken(null);
                setUser(null);
                setIsAuthenticated(false);
            }
        }
        setIsLoading(false);
    }, []);

    // useEffect(() => {
    //   // Điều hướng sau khi login
    //   if (isAuthenticated) {
    //     navigate('/'); // Điều hướng về trang chủ hoặc trang mặc định sau khi đăng nhập thành công
    //   } else {
    //     navigate('/login'); // Điều hướng về trang đăng nhập nếu không xác thực
    //   }
    // }, [isAuthenticated, navigate]);


    const login = useCallback(async (credentials: LoginRequest): Promise<ApiResponse<AccountResponse>> => {
        // setIsLoading(true); // Bắt đầu tải
        try {
            const response = await authService.login(credentials);
            if (response.status === 200 && response.data) {
                const { token, ...userData } = response.data;
                // authService đã lưu vào localStorage, chỉ cập nhật state
                setToken(token || null);
                setUser(userData as AccountResponse);
                setIsAuthenticated(true);

                if (userData.role === 'SUPER_ADMIN' || userData.role === 'CONTENT_ADMIN') {
                    navigate('/admin/dashboard'); // Điều hướng đến trang admin nếu là Super Admin hoặc Admin
                } else {
                    navigate('/'); // Điều hướng về trang chính nếu là người dùng bình thường
                }
            }
            return response;
        } catch (error) {
            console.error("Login failed:", error);
            setIsAuthenticated(false); // Đảm bảo trạng thái xác thực là false nếu login thất bại
            throw error; // Ném lỗi để component gọi có thể bắt và hiển thị thông báo
        } finally {
            // setIsLoading(false); // Kết thúc tải
        }
    }, []);

    const register = useCallback(async (data: RegisterRequest): Promise<ApiResponse<AccountResponse>> => {
        setIsLoading(true); // Bắt đầu tải
        try {
            const response = await authService.register(data);
            if (response.status === 200 && response.data) {
                // Tùy chọn: tự động đăng nhập sau khi đăng ký thành công
                // Nếu backend tự động trả về token và user info sau đăng ký
                const { token, ...userData } = response.data;
                setToken(token || null);
                setUser(userData as AccountResponse);
                setIsAuthenticated(true);
            }
            return response;
        } catch (error) {
            console.error("Register failed:", error);
            setIsAuthenticated(false); // Đảm bảo trạng thái xác thực là false nếu register thất bại
            throw error; // Ném lỗi để component gọi có thể bắt
        } finally {
            setIsLoading(false); // Kết thúc tải
        }
    }, []);

    const logout = useCallback(async () => { // Đặt là async
        setIsLoading(true); // Bắt đầu tải
        try {
            await authService.logout(); // Gọi hàm logout từ authService để tương tác với backend và xóa localStorage
            // Cập nhật state cục bộ sau khi đã xóa localStorage
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
            navigate('/'); // Điều hướng về trang chủ sau khi đăng xuất
        } catch (error) {
            console.error("Logout failed:", error);
            // Xử lý lỗi (ví dụ: hiển thị toast message) nếu API logout backend gặp vấn đề
        } finally {
            setIsLoading(false); // Kết thúc tải
        }
    }, [navigate]);

    // Giá trị sẽ được cung cấp cho các component con
    const authContextValue = {
        isAuthenticated,
        user,
        token,
        login,
        register,
        logout,
        isLoading,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook để sử dụng AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}