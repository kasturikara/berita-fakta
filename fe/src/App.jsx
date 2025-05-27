import React from "react";
import { AuthProvider } from "./context/AuthContext";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./route/ProtectedRoute";
import RoleBasedRoute from "./route/RoleBasedRoute";

// layout
const MainLayout = React.lazy(() => import("./layout/main"));
const AuthLayout = React.lazy(() => import("./layout/auth"));
const AdminLayout = React.lazy(() => import("./layout/admin"));
const UserLayout = React.lazy(() => import("./layout/user"));

// pages
const LoginPages = React.lazy(() => import("./pages/auth/login"));
const RegisterPages = React.lazy(() => import("./pages/auth/register"));
const UnauthorizedPages = React.lazy(() => import("./pages/unauthorized"));
const HomePages = React.lazy(() => import("./pages/home"));
const LandingPages = React.lazy(() => import("./pages/landing"));

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
          <Route
            path="/"
            element={
              <MainLayout>
                <LandingPages />
              </MainLayout>
            }
          />
          <Route
            path="/login"
            element={
              <AuthLayout>
                <LoginPages />
              </AuthLayout>
            }
          />
          <Route
            path="/register"
            element={
              <AuthLayout>
                <RegisterPages />
              </AuthLayout>
            }
          />
          <Route
            path="/unauthorized"
            element={
              <MainLayout>
                <UnauthorizedPages />
              </MainLayout>
            }
          />

          {/* protected */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/home"
              element={
                <UserLayout>
                  <HomePages />
                </UserLayout>
              }
            />
            <Route
              path="/profile"
              element={
                <UserLayout>
                  <div>Profile</div>
                </UserLayout>
              }
            />
          </Route>

          {/* admin route */}
          <Route element={<RoleBasedRoute allowedRoles={["admin"]} />}>
            <Route
              path="/admin"
              element={
                <AdminLayout>
                  <div>Admin Dashboard</div>
                </AdminLayout>
              }
            />
          </Route>

          {/* fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </React.Suspense>
    </AuthProvider>
  );
};

export default App;
