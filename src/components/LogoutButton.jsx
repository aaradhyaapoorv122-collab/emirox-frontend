import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function LogoutButton() {
  const { logout } = useContext(AuthContext);

  return (
    <button
      onClick={logout}
      style={{
        padding: "8px 16px",
        cursor: "pointer",
        borderRadius: "6px",
      }}
    >
      Logout
    </button>
  );
}
