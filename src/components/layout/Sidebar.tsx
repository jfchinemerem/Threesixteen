import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Gift,
  Users,
  Bell,
  User,
  Settings,
  LogOut,
  Heart,
  X,
  Menu,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
  className?: string;
  isMobile?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ className, isMobile, onClose }: SidebarProps = {}) => {
  const location = useLocation();

  const navItems = [
    {
      title: "Home",
      icon: <Home className="h-5 w-5 mr-3" />,
      href: "/dashboard",
    },
    {
      title: "My Wishlists",
      icon: <Heart className="h-5 w-5 mr-3" />,
      href: "/wishlists",
    },
    {
      title: "Notifications",
      icon: <Bell className="h-5 w-5 mr-3" />,
      href: "/notifications",
    },
    {
      title: "Profile",
      icon: <User className="h-5 w-5 mr-3" />,
      href: "/profile",
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-background border-r p-4",
        "fixed inset-y-0 left-0 z-50 w-[280px] shadow-lg transform transition-transform duration-200 ease-in-out",
        "-translate-x-full",
        className?.includes("translate-x-0") ? "translate-x-0" : "",
        className?.includes("md:translate-x-0") ? "md:translate-x-0" : "",
        className,
      )}
    >
      {isMobile && (
        <div className="flex justify-end mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}
      <Link
        to="/profile"
        className="flex items-center mb-6 px-2 hover:bg-accent/50 rounded-md py-2"
      >
        <Avatar className="h-10 w-10 mr-2">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123" />
          <AvatarFallback>JS</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">Jane Smith</span>
          <span className="text-xs text-muted-foreground">
            jane.smith@example.com
          </span>
        </div>
      </Link>

      <nav className="space-y-1 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
              location.pathname.startsWith(item.href)
                ? "bg-accent text-accent-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
            )}
          >
            {item.icon}
            {item.title}
          </Link>
        ))}
      </nav>

      <Separator className="my-4" />

      <div className="space-y-2">
        <Link to="/settings">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
          >
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
