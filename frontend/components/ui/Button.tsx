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
  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-300 active:scale-[0.98] outline-none select-none disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary: "bg-primary-400 text-white hover:bg-primary-500 shadow-xl shadow-primary-400/20 hover:shadow-primary-400/30",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm",
    success: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-xl shadow-emerald-500/20",
    outline: "bg-transparent border-2 border-slate-200 text-slate-600 hover:border-primary-400 hover:text-primary-500 hover:bg-primary-50/50",
    danger: "bg-rose-500 text-white hover:bg-rose-600 shadow-xl shadow-rose-500/20",
    ghost: "bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700",
  };

  const sizes = {
    sm: "px-5 py-2.5 text-xs rounded-xl",
    md: "px-7 py-3.5 text-sm rounded-2xl",
    lg: "px-10 py-5 text-base rounded-3xl",
    xl: "px-14 py-7 text-lg rounded-[2.5rem] font-bold tracking-tight",
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
