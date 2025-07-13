import { Link } from "react-router-dom";
import { type LucideIcon } from "lucide-react";

export function NavItem({
  href,
  icon: Icon,
  children,
  isActive,
}: {
  href: string;
  icon: LucideIcon;
  children: React.ReactNode;
  isActive?: boolean;
}) {
  return (
    <Link
      to={href}
      // Inside src/components/ui/nav-item.tsx, within the NavItem component's return statement:
      className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg transition-all duration-300 ease-in-out hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-emerald-100 dark:hover:from-emerald-900/20 dark:hover:to-emerald-800/20 hover:shadow-md hover:scale-[1.02] hover:-translate-y-0.5 ${isActive
        ? "text-slate-600 dark:text-emerald-400 bg-gradient-to-r from-emerald-100 to-emerald-200/50 dark:bg-gradient-to-r dark:from-emerald-900/20 dark:to-emerald-800/20 shadow-lg shadow-emerald-400/20" // Lớp khi active: text slate (sáng) và emerald (tối)
        : "text-slate-600 dark:text-slate-300" // Lớp khi không active: text slate (sáng) và slate (tối)
    }`}
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  );
}
