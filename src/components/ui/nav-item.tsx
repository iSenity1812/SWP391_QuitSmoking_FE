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
      className={`flex items-center gap-2 text-sm font-medium ${isActive
          ? "text-emerald-500"
          : "text-muted-foreground hover:text-foreground"
        }`}
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  );
}
