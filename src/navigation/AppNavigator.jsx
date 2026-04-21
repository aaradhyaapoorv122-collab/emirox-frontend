import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthNavigator from "./AuthNavigator"; // You can convert your auth screens here
import TabNavigator from "./TabNavigator"; // You can convert tab navigation here
import { useAuth } from "../context/AuthContext";

export default function AppNavigator() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {user ? (
          // If user is logged in, show protected routes (like tabs)
          <Route path="/*" element={<TabNavigator />} />
        ) : (
          // If not logged in, show auth routes
          <Route path="/*" element={<AuthNavigator />} />
        )}
        {/* Redirect any unknown routes */}
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
}
