import React from "react";

export interface BrandBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: "gradient" | "glass" | "solid";
  size?: "sm" | "md";
}

/**
 * Standard iHelp Brand Badge.
 *
 * Used for course pills, tags, category indicators, and status badges.
 */
export function BrandBadge({
  children,
  variant = "gradient",
  size = "sm",
  className = "",
  ...props
}: BrandBadgeProps) {
  const base =
    "inline-flex items-center justify-center font-mono font-bold select-none transition-colors";
  const sizeStyles =
    size === "sm"
      ? "px-2 py-0.5 text-[11px] rounded-md tracking-tight"
      : "px-3 py-1 text-xs rounded-full";

  const variants = {
    gradient: "bg-ihelp-gradient text-white border border-white/15 shadow-2xs",
    glass: "border border-white/20 bg-white/12 text-white/90 backdrop-blur-xs",
    solid: "bg-white text-slate-900 shadow-xs",
  };

  return (
    <span
      className={`${base} ${sizeStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
