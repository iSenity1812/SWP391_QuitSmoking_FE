import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export const PublicRoute: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div>Loading authentication...</div>; // Có thể render một loading spinner hoặc placeholder ở đây
  }

  // Nếu người dùng đã đăng nhập, chuyển hướng về trang chính hoặc trang khác
  if (isAuthenticated) {
    if (user?.role === 'SUPER_ADMIN' || user?.role === 'CONTENT_ADMIN') {
      return <Navigate to="/admin/dashboard" replace />; // Điều hướng admin về dashboard của họ
    }
    return <Navigate to="/" replace />; // Điều hướng người dùng bình thường về trang chính
  }
  return <Outlet />; // Nếu chưa đăng nhập, cho phép truy cập vào các route công khai
}