import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import authService from "../services/authService.js";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Placeholder components for other pages (to be implemented by Frontend 2)
const Home = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Bus Booking App</h1>
      <p className="text-xl text-gray-600">
        Welcome! Search for buses to get started.
      </p>
      <button
        onClick={authService.logout}
        className="mt-4 bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  </div>
);

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
