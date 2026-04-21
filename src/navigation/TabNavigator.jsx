// src/navigation/TabNavigator.jsx
import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import TrashScreen from "../screens/TrashScreen";

export default function TabNavigator() {
  return (
    <>
      {/* Simple tab navigation links */}
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/settings">Settings</Link> |{" "}
        <Link to="/trash">Trash</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="/trash" element={<TrashScreen />} />
        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}
