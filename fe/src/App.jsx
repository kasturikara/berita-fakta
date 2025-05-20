import React from "react";
import { AuthProvider } from "./context/AuthContext";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./route/ProtectedRoute";
import RoleBasedRoute from "./route/RoleBasedRoute";

// pages
const LoginPages = React.lazy(() => import("./pages/auth/login"));
const RegisterPages = React.lazy(() => import("./pages/auth/register"));
const UnauthorizedPages = React.lazy(() => import("./pages/unauthorized"));
const HomePages = React.lazy(() => import("./pages/home"));

// loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="loading loading-spinner loading-xl text-primary"></div>
  </div>
);

const App = () => {
  return (
    <AuthProvider>
      <React.Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* public */}
          <Route path="/login" element={<LoginPages />} />
          <Route path="/register" element={<RegisterPages />} />
          <Route path="/unauthorized" element={<UnauthorizedPages />} />

          {/* protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePages />} />
            <Route path="/profile" element={<div>Profile</div>} />
          </Route>

          {/* admin route */}
          <Route element={<RoleBasedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<div>Admin dashboard</div>} />
          </Route>

          {/* fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </React.Suspense>
    </AuthProvider>
  );
};

export default App;
