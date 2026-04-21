import React from "react";

export function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  variant = "primary",
  className = "",
}) {
  const base =
    "px-4 py-2 rounded-xl font-medium transition-all duration-200 focus:outline-none";

  const variants = {
    primary:
      "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90",
    secondary:
      "bg-white/10 text-white border border-white/20 hover:bg-white/20",
    ghost:
      "bg-transparent text-indigo-400 hover:bg-indigo-500/10",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
}
