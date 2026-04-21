import React from "react";
import { Outlet } from "react-router-dom";
import EmpicraftSidebar from "../components/EmpicraftSidebar";

export default function EmpiCraftFeatureLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <EmpicraftSidebar />

      {/* FEATURE RENDER AREA */}
      <div style={{ flex: 1, background: "#fff" }}>
        <Outlet />
      </div>
    </div>
  );
}
