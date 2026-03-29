import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost" | "success";
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all active:scale-[0.98] outline-none select-none disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary: "bg-primary-500 text-white hover:bg-primary-600 shadow-md shadow-primary-500/10",
    secondary: "bg-primary-50 text-primary-600 hover:bg-primary-100",
    success: "bg-medical-green text-white hover:opacity-95 shadow-md shadow-medical-green/10",
    outline: "bg-transparent border border-medical-border text-medical-textPrimary hover:bg-medical-bg hover:border-primary-500 hover:text-primary-600",
    danger: "bg-emergency text-white hover:opacity-95 shadow-md shadow-emergency/10",
    ghost: "bg-transparent text-medical-textSecondary hover:bg-primary-50 hover:text-primary-600",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs rounded-lg",
    md: "px-6 py-3 text-sm rounded-xl",
    lg: "px-10 py-5 text-base rounded-2xl",
    xl: "px-12 py-6 text-lg rounded-3xl font-black italic tracking-tight",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
