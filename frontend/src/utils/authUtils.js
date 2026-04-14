// Utility functions for authentication state
export const getCurrentUserId = () => {
  return localStorage.getItem("userId");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};
