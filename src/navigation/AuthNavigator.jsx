// src/navigation/AuthNavigator.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";

export default function AuthNavigator() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/signup" element={<SignupScreen />} />
      {/* Redirect any other route to login */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
