import React from "react";
import { Outlet } from "react-router-dom";
import EmpiLabSidebar from "../components/EmpiLabSidebar";

export default function EmpiLabFeatureLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <EmpiLabSidebar />

      <div style={{ flex: 1, background: "#F9FAFB" }}>
        <Outlet />
      </div>
    </div>
  );
}
