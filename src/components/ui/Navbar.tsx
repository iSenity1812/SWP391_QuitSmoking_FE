import { Calendar, ChartColumnIncreasing, Gem, Home, Menu, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Info } from "lucide-react";
import { BookOpen } from "lucide-react";
import { NavItem } from "@/components/ui/nav-item";
import { ThemeToggle } from "./ThemeToggle";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRoutes } from "@/hooks/useRoleAuth";
import UserDropdown from "@/pages/auth/components/UserDropdown";
import { NotificationIcon } from "./NotificationIcon";

// Define navigation links for different user states
const publicNavLinks = [
  { href: "/", label: "Trang chủ", icon: Home },
  { href: "/blog", label: "Blog", icon: BookOpen },
  { href: "/about", label: "Thông tin", icon: Info },
];

const baseMemberNavLinks = [
  { href: "/", label: "Trang chủ", icon: Home },
  { href: "/blog", label: "Blog", icon: BookOpen },
  { href: "/plan", label: "Tiến trình", icon: ChartColumnIncreasing },
  { href: "/about", label: "Thông tin", icon: Info },
  { href: "/subscription", label: "Gói trả phí", icon: Gem },
  { href: "/task", label: "Nhiệm vụ", icon: Wind },
];

const coachNavLinks = [
  { href: "/blog", label: "Blog", icon: BookOpen },
];

export function Navbar() {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { canAccessPlan, canAccessCoach, canAccessAdmin, canAccessContentAdmin } = useUserRoutes();

  const getNavLinks = () => {
    if (!isAuthenticated) return publicNavLinks;

    // Admin and Content Admin should only see dashboard (hoặc không thấy gì)
    if (canAccessAdmin || canAccessContentAdmin) {
      return []; // No public nav links for admins
    }

    // Coach can only see blog
    if (canAccessCoach) {
      return coachNavLinks;
    }

    // Đối với thành viên (normal/premium)
    if (canAccessPlan) {
      // Bắt đầu với một bản sao của baseMemberNavLinks
      const currentMemberNavLinks = [...baseMemberNavLinks];

      // Thêm Program link chỉ cho PREMIUM_MEMBER
      if (user?.role === "PREMIUM_MEMBER") {
        const programLink = { href: "/program", label: "Chương trình", icon: Gem };
        const planIndex = currentMemberNavLinks.findIndex((link) => link.href === "/plan");
        if (planIndex !== -1) { // Đảm bảo tìm thấy link "Plan" trước khi thêm
          currentMemberNavLinks.splice(planIndex + 1, 0, programLink);
        } else {
          // Fallback nếu không tìm thấy "Plan" (có thể thêm ở cuối hoặc ở vị trí mong muốn khác)
          currentMemberNavLinks.push(programLink);
        }
      }

      // Thêm booking page chỉ cho PREMIUM_MEMBER
      if (user?.role === "PREMIUM_MEMBER") {
        const bookingLink = { href: "/booking", label: "Đặt lịch", icon: Calendar };
        const taskIndex = currentMemberNavLinks.findIndex((link) => link.href === "/task");
        if (taskIndex !== -1) { // Đảm bảo tìm thấy link "Task" trước khi thêm
          currentMemberNavLinks.splice(taskIndex + 1, 0, bookingLink);
        } else {
          // Fallback nếu không tìm thấy "Task"
          currentMemberNavLinks.push(bookingLink);
        }
      }
      return currentMemberNavLinks;
    }

    // Default fallback (nếu không phải authenticated, admin, coach, hoặc canAccessPlan)
    return publicNavLinks;
  };


  const navLinks = getNavLinks();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 border-b-2 border-emerald-200 dark:border-slate-700 backdrop-blur-xl shadow-lg shadow-emerald-100/50 dark:shadow-slate-900/50">
      <div className="max-w-1xl mx-auto px-6 flex items-center justify-between h-18">
        <div className="flex items-center gap-3 text-2xl font-black text-slate-800 dark:text-white">
          <Wind className="h-8 w-8 text-emerald-500" />
          <Link to="/" className="text-xl font-bold">
            QuitTogether
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((item) => (
            <NavItem key={item.href} href={item.href} icon={item.icon} isActive={item.href === location.pathname}>
              {item.label}
            </NavItem>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {/* Authenticated User Menu */}
          {isAuthenticated && user ? (
            <>
              <NotificationIcon />
              <UserDropdown />
            </>
          ) : (
            /* Guest User Buttons */
            <>
              <Link
                to="/login"
                className="hidden md:flex items-center px-4 py-2.5 rounded-xl font-semibold text-sm border-2 border-emerald-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-slate-700 dark:to-slate-600 hover:border-emerald-300 dark:hover:border-emerald-500 hover:scale-105 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="hidden md:flex items-center px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 hover:scale-105 transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-emerald-200/50 dark:shadow-emerald-500/25"
              >
                Đăng ký
              </Link>
            </>
          )}          {/* Mobile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {navLinks.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link to={item.href}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              {!isAuthenticated && (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/login">Đăng nhập</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/register">Đăng ký</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
