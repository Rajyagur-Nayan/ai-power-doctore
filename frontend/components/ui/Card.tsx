import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  accent?: "blue" | "green" | "red" | "none";
}

export function Card({
  children,
  className = "",
  hoverable = true,
  accent = "none",
  ...props
}: CardProps) {
  const accentStyles = {
    none: "",
    blue: "border-l-4 border-l-primary-500",
    green: "border-l-4 border-l-medical-green",
    red: "border-l-4 border-l-emergency",
  };

  return (
    <div
      className={cn(
        "bg-white border border-slate-100 rounded-[2rem] shadow-premium transition-all duration-500 ease-out overflow-hidden relative group",
        hoverable && "hover:shadow-premium-hover hover:-translate-y-2",
        accentStyles[accent],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("p-6 border-b border-medical-border", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-lg font-black text-primary-900 tracking-tight italic",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardContent({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
}
