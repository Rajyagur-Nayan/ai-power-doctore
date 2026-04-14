import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="text-xs font-semibold text-slate-500 mb-2 block pl-1">
          {label}
        </label>
      )}
      <input
        className={`
          w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4
          text-sm font-medium text-slate-700 
          placeholder:text-slate-400 
          focus:bg-white focus:ring-4 focus:ring-primary-400/10 focus:border-primary-400 
          outline-none transition-all duration-300
          ${error ? "border-rose-400 focus:ring-rose-400/10 focus:border-rose-400" : ""}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-[10px] font-black text-emergency uppercase tracking-wider pl-1">
          {error}
        </p>
      )}
    </div>
  );
};
