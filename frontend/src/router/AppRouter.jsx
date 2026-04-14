import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import SearchBus from "../pages/SearchBus.jsx";
import BookingHistory from "../pages/BookingHistory.jsx";
import SeatSelection from "../pages/SeatSelection.jsx";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Navigate to="/search" replace />} />
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <SearchBus />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seat-selection/:busId"
        element={
          <ProtectedRoute>
            <SeatSelection />
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking-history"
        element={
          <ProtectedRoute>
            <BookingHistory />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/search" replace />} />
    </Routes>
  );
};

export default AppRouter;
