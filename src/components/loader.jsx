import React from "react";

export default function LoadingSpinner({ size = 24, color = "#18e09b" }) {
  const style = {
    width: size,
    height: size,
    borderRadius: "50%",
    border: `3px solid rgba(24, 224, 155, 0.2)`,       // neon glow with transparency
    borderTop: `3px solid ${color}`,                    // colored top border for spinner effect
    animation: "spin 1s linear infinite",
    boxShadow: `0 0 8px ${color}, 0 0 20px ${color}77`, // neon glow effect
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={style} />
    </>
  );
}
