import { Gem, Home, Menu, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Info } from "lucide-react";
import { BookOpen } from "lucide-react";
import { NavItem } from "@/components/ui/nav-item";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Wind className="h-8 w-8 text-emerald-500" />
          <span className="text-xl font-bold">QuitTogether</span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <NavItem href="/" icon={Home} isActive>
            Home
          </NavItem>
          <NavItem href="/blog" icon={BookOpen}>
            Blog
          </NavItem>
          <NavItem href="/pricing" icon={Gem}>
            Pricing
          </NavItem>
          <NavItem href="/about" icon={Info}>
            About
          </NavItem>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="outline" className="hidden md:flex">
            Log In
          </Button>
          <Button className="hidden md:flex bg-emerald-500 hover:bg-emerald-600">
            Sign Up
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Home</DropdownMenuItem>
              <DropdownMenuItem>Progress</DropdownMenuItem>
              <DropdownMenuItem>Blog</DropdownMenuItem>
              <DropdownMenuItem>Shop</DropdownMenuItem>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Log In</DropdownMenuItem>
              <DropdownMenuItem>Sign Up</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
