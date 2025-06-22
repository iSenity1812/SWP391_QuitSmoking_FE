import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/types/auth";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";

interface PrivateRouteProps {
    // Chỉ định role được phép
    allowedRoles?: Role[]; // Có thể để trống nếu không cần kiểm tra role
    children?: React.ReactNode; // Có thể để trống nếu không cần render children
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
    const { isAuthenticated, user, isLoading } = useAuth();

    // Nếu đang trong quá trình tải (kiểm tra token từ localStorage)
    if (isLoading) {
        // Có thể render một loading spinner hoặc placeholder ở đây
        return <div>Loading authentication...</div>;
    }

    // Nếu người dùng chưa được xác thực
    if (!isAuthenticated) {
        toast.error("Bạn cần đăng nhập để truy cập trang này!"); // Thông báo cho người dùng
        return <Navigate to="/login" replace />; // Chuyển hướng về trang đăng nhập
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        toast.error("Bạn không có quyền truy cập trang này!"); // Thông báo cho người dùng
        return <Navigate to="/" replace />; // Chuyển hướng về trang chính hoặc trang khác
    }

    // Nếu người dùng đã được xác thực, cho phép truy cập route con
    return <Outlet />;
}