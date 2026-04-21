import React from "react";

export function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
}
