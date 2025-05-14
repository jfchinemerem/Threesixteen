import React from "react";
import { Link } from "react-router-dom";

interface LogoProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

const Logo = ({ size = "medium", className = "" }: LogoProps) => {
  const sizeClasses = {
    small: "h-8 w-8",
    medium: "h-10 w-10",
    large: "h-14 w-14",
  };

  return (
    <Link to="/" className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <span className="font-extrabold text-2xl text-primary tracking-tight">
          threesixteen
        </span>
      </div>
    </Link>
  );
};

export default Logo;
