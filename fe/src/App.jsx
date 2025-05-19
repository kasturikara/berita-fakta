import React from "react";
import { AuthProvider } from "./context/AuthContext";
import { Navigate, Route, Routes } from "react-router-dom";

// pages
import LoginPages from "./pages/auth/login";
import RegisterPages from "./pages/auth/register";
import ProtectedRoute from "./route/ProtectedRoute";
import HomePages from "./pages/home";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* public */}
        <Route path="/login" element={<LoginPages />} />
        <Route path="/register" element={<RegisterPages />} />

        {/* protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePages />} />
        </Route>

        {/* fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
