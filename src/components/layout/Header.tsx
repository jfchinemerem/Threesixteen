import React from "react";
import { Link } from "react-router-dom";
import { Bell, Search, ShoppingCart, User } from "lucide-react";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeaderProps {
  username?: string;
  notificationCount?: number;
  cartItemCount?: number;
  isLandingPage?: boolean;
}

const Header = ({
  username = "John Doe",
  notificationCount = 3,
  cartItemCount = 2,
  isLandingPage = false,
}: HeaderProps) => {
  return (
    <header className="w-full h-[72px] border-b bg-white flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link to="/dashboard">
          <Logo size="large" />
        </Link>

        {isLandingPage ? (
          <nav className="hidden md:flex items-center gap-6 ml-8">
            <Link
              to="/features"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              to="/about"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </Link>
          </nav>
        ) : (
          <>{/* Search removed as requested */}</>
        )}
      </div>

      <div className="flex items-center gap-4">
        {isLandingPage ? (
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="outline">Log in</Button>
            </Link>
            <Link to="/auth?tab=register">
              <Button>Sign up</Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Cart and notifications removed as requested */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    <User className="h-5 w-5" />
                  </div>
                  <span className="hidden md:inline-block">{username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/profile" className="w-full">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/wishlists" className="w-full">
                    My Wishlists
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/friends" className="w-full">
                    Friends
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/settings" className="w-full">
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/logout" className="w-full">
                    Logout
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
