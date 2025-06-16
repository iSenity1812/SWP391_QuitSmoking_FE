import React from "react";
import ClientLayout from "@/layouts/ClientLayout";
import { LandingPage } from "@/pages/landing/LandingPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import BlogPage from "@/pages/blog/BlogPage";
import AboutPage from "@/pages/about/AboutPage";
import PlanPage from "@/pages/plan/PlanPage";
import { PlanSelectionDirectPage } from "@/pages/plan-selection/PlanDirectPage";
import AdminPage from "@/pages/admin/AdminPage";
import type { Role } from "@/types/auth";
import { PublicRoute } from "@/pages/auth/PublicRoute";
import { PrivateRoute } from "@/pages/auth/PrivateRoute";

export interface AppRoute {
  path: string;
  element: React.ReactNode;
  isPrivate?: boolean;
  allowedRoles?: Role[];
  isPublic?: boolean;
  layout?: React.ComponentType<{ children: React.ReactNode }>;
  children?: AppRoute[];
}

export const appRoutes: AppRoute[] = [
  {
    path: '/',
    element: <LandingPage />,
    layout: ClientLayout,
  },
  // Nhóm các route công khai (chỉ khi chưa đăng nhập)
  {
    path: '/', // Path này là cha, không hiển thị gì cả, chỉ để bọc các route con
    element: <PublicRoute />, // PublicRoute sẽ render Outlet
    children: [
      { path: 'login', element: <LoginPage />, layout: ClientLayout }, // Áp dụng ClientLayout nếu cần
      { path: 'register', element: <RegisterPage />, layout: ClientLayout }, // Áp dụng ClientLayout nếu cần
      // ... thêm các route công khai khác
    ]
  },
  {
    path: '/blog',
    element: <BlogPage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  // Nhóm các route riêng tư
  {
    path: '/', // Path này là cha
    element: <PrivateRoute allowedRoles={['NORMAL_MEMBER', 'PREMIUM_MEMBER', 'SUPER_ADMIN', 'CONTENT_ADMIN']} />, // PrivateRoute sẽ render Outlet, bạn có thể truyền tất cả roles vào đây hoặc để mặc định trong PrivateRoute
    children: [
      { path: 'plan', element: <PlanPage />, allowedRoles: ['NORMAL_MEMBER', 'PREMIUM_MEMBER'] },
      { path: 'plan-selection', element: <PlanSelectionDirectPage />, allowedRoles: ['NORMAL_MEMBER', 'PREMIUM_MEMBER'] },
      // ... thêm các route riêng tư khác
    ]
  },
  // Route admin riêng biệt nếu logic quá khác biệt
  {
    path: '/admin', // Đường dẫn cho các route admin
    element: <PrivateRoute allowedRoles={['SUPER_ADMIN', 'CONTENT_ADMIN']} />,
    children: [
      { path: '*', element: <AdminPage /> }, // AdminPage sẽ xử lý các route con của /admin/*
    ]
  }
]