import React from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter.jsx";
import Navbar from "./components/Navbar.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div className="pt-16 min-h-screen bg-gray-50">
          <AppRouter />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
