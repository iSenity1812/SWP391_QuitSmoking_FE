// src/api/axiosConfig.ts
import axios from 'axios';

// Đặt base URL của API backend của bạn
// Khuyến nghị sử dụng biến môi trường cho việc này
const API_BASE_URL = 'http://localhost:8080/api';

// Tạo một instance Axios tùy chỉnh
const axiosConfig = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // Thời gian chờ (10 giây)
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

axiosConfig.interceptors.request.use(
    (config) => {
        console.log(`Making request to: ${config.baseURL}${config.url}`)

        const publicEndpoints = [
            "/blogs", // GET blogs - public
            "/auth/login",
            "/auth/register",
            "/comments"
        ]

        // Kiểm tra xem có phải endpoint public không
        const isPublicEndpoint = publicEndpoints.some((endpoint) => config.url?.includes(endpoint))
        const isGetRequest = config.method?.toLowerCase() === "get"

        // Chỉ thêm token cho các endpoint private hoặc non-GET requests
        if (!isPublicEndpoint || !isGetRequest) {
            const token = localStorage.getItem("jwtToken")
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
        }

        return config
    },
    (error) => {
        console.error("Request interceptor error:", error)
        return Promise.reject(error)
    },
)

// Thêm Request Interceptor: Thêm JWT token vào header cho mỗi request
axiosConfig.interceptors.request.use(
    (config) => {
        const isAuthEndpoint = config.url?.includes('/auth/login') || config.url?.includes('/auth/register');
        if (!isAuthEndpoint) {
            const token = localStorage.getItem('jwtToken'); // Lấy token từ localStorage
            if (token) {
                config.headers.Authorization = `Bearer ${token}`; // Thêm token vào header Authorization
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Thêm Response Interceptor: Xử lý lỗi chung (ví dụ: 401 Unauthorized, 403 Forbidden)
axiosConfig.interceptors.response.use(
    (response) => {
        // Nếu phản hồi thành công, trả về dữ liệu
        return response;
    },
    (error) => {
        // Xử lý lỗi HTTP
        if (axios.isAxiosError(error) && error.response) {
            // if (status === 401) {
            //   // Lỗi Unauthorized: Token hết hạn hoặc không hợp lệ
            //   // Đăng xuất người dùng hoặc chuyển hướng đến trang đăng nhập
            //   console.error('Unauthorized: Token expired or invalid. Redirecting to login...');
            //   localStorage.removeItem('jwtToken'); // Xóa token cũ
            //   localStorage.removeItem('userInfo');
            //   // Điều hướng người dùng về trang đăng nhập
            //   window.location.href = '/login'; // Hoặc sử dụng history.push nếu dùng React Router
            // } else if (status === 403) {
            //   // Lỗi Forbidden: Người dùng không có quyền truy cập
            //   console.error('Forbidden: You do not have permission to access this resource.');
            //   // Có thể điều hướng đến trang "Access Denied"
            //   window.location.href = '/unauthorized';
            // }
            // Các lỗi khác có thể xử lý ở đây (ví dụ: 500 Internal Server Error)
            //Trả về lỗi để các component gọi API có thể bắt và xử lý cụ thể
            return Promise.reject(error.response.data); // Trả về data của lỗi từ backend (ApiResponse)
        }
        // Nếu không phải lỗi Axios hoặc không có response, trả về lỗi nguyên bản
        return Promise.reject(error);
    }
);
export default axiosConfig;