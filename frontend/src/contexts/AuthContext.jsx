import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";
import { getCurrentUserId, isAuthenticated } from "../utils/authUtils";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize from localStorage
    const initAuth = () => {
      const storedToken = localStorage.getItem("token");
      const storedUserId = localStorage.getItem("userId");
      if (storedToken && storedUserId) {
        setToken(storedToken);
        setUserId(storedUserId);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      setToken(data.token);
      setUserId(data.userId);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUserId(null);
  };

  const value = {
    userId,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    register,
    logout,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
