"use client"

import { Gem, Home, Menu, Wind, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Info, Calendar } from "lucide-react"
import { BookOpen } from "lucide-react"
import { NavItem } from "@/components/ui/nav-item"
// import { useTheme } from "@/context/ThemeContext";
import { ThemeToggle } from "./ThemeToggle"
import { Link, useLocation } from "react-router-dom"

const navLinks = [
  { href: "/", label: "Trang chủ", icon: Home, isActive: true },
  { href: "/blog", label: "Bài viết", icon: BookOpen },
  { href: "/booking", label: "Đặt lịch", icon: Calendar },
  { href: "/subscription", label: "Cao cấp", icon: Crown },
  { href: "plan/", label: "Kiểm tra", icon: Gem },
  { href: "/about", label: "Giới thiệu", icon: Info },
]

export function Navbar() {
  const location = useLocation()
  // const { theme } = useTheme();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 border-b-2 border-emerald-200 dark:border-slate-700 backdrop-blur-xl shadow-lg shadow-emerald-100/50 dark:shadow-slate-900/50">
      <div className="max-w-1xl mx-auto px-6 flex items-center justify-between h-18">
        <div className="flex items-center gap-3 text-2xl font-black text-slate-800 dark:text-white">
          <Wind className="h-8 w-8 text-emerald-500" />
          <a href="/" className="text-xl font-bold">
            QuitTogether
          </a>
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
          <Link
            to="/login"
            className="hidden md:flex items-center px-4 py-2.5 rounded-xl font-semibold text-sm border-2 border-emerald-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-slate-700 dark:to-slate-600 hover:border-emerald-300 dark:hover:border-emerald-500 hover:scale-105 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            Đăng nhập
          </Link>
          <Link
            to={"/register"}
            className="hidden md:flex items-center px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 hover:scale-105 transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-emerald-200/50 dark:shadow-emerald-500/25"
          >
            Đăng ký
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Trang chủ</DropdownMenuItem>
              <DropdownMenuItem>Bài viết</DropdownMenuItem>
              <DropdownMenuItem>Đặt lịch</DropdownMenuItem>
              <DropdownMenuItem>Cao cấp</DropdownMenuItem>
              <DropdownMenuItem>Kiểm tra</DropdownMenuItem>
              <DropdownMenuItem>Giới thiệu</DropdownMenuItem>
              <DropdownMenuItem>Đăng nhập</DropdownMenuItem>
              <DropdownMenuItem>Đăng ký</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
