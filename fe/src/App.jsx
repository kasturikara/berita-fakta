import React, { Suspense, lazy } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./route/ProtectedRoute";
import RoleBasedRoute from "./route/RoleBasedRoute";

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="loading loading-spinner loading-xl text-primary"></div>
  </div>
);

// Lazy loaded layouts
const MainLayout = lazy(() => import("./layout/main"));
const AuthLayout = lazy(() => import("./layout/auth"));
const AdminLayout = lazy(() => import("./layout/admin"));
const UserLayout = lazy(() => import("./layout/user"));

// Lazy loaded pages
const LoginPages = lazy(() => import("./pages/auth/login"));
const RegisterPages = lazy(() => import("./pages/auth/register"));
const UnauthorizedPages = lazy(() => import("./pages/unauthorized"));
const HomePages = lazy(() => import("./pages/home"));
const LandingPages = lazy(() => import("./pages/landing"));
const ArticlePages = lazy(() => import("./pages/articles"));
const CategoriesPages = lazy(() => import("./pages/categories"));
const CreateArticlesPages = lazy(() => import("./pages/createArticle"));
const MyArticlesPages = lazy(() => import("./pages/myArticles"));
const ProfilePages = lazy(() => import("./pages/profile"));

const RootRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  if (user) {
    return (
      <UserLayout>
        <HomePages />
      </UserLayout>
    );
  }

  return (
    <MainLayout>
      <LandingPages />
    </MainLayout>
  );
};

// Route configuration objects
const publicRoutes = [
  {
    path: "/unauthorized",
    layout: MainLayout,
    component: UnauthorizedPages,
  },
  {
    path: "/articles",
    layout: MainLayout,
    component: ArticlePages,
  },
  {
    path: "/categories",
    layout: MainLayout,
    component: CategoriesPages,
  },
];

// auth routes
const authRoutes = [
  {
    path: "/login",
    layout: AuthLayout,
    component: LoginPages,
  },
  {
    path: "/register",
    layout: AuthLayout,
    component: RegisterPages,
  },
];

const protectedRoutes = [
  {
    path: "/profile",
    layout: UserLayout,
    component: ProfilePages,
  },
  {
    path: "/articles/new",
    layout: UserLayout,
    component: CreateArticlesPages,
  },
  {
    path: "/articles/me",
    layout: UserLayout,
    component: MyArticlesPages,
  },
];

const adminRoutes = [
  {
    path: "/admin",
    layout: AdminLayout,
    component: () => <div>Admin Dashboard</div>,
  },
];

// redirect if authenticated
const RedirectIfAuthenticated = ({ redirectTo = "/" }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  return user ? <Navigate to={redirectTo} replace /> : <Outlet />;
};

const App = () => {
  const renderRoute = (route, key, Layout, Component) => (
    <Route
      key={key}
      path={route.path}
      element={
        <Layout>
          <Component />
        </Layout>
      }
    />
  );

  return (
    <AuthProvider>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* ROOT */}
          <Route path="/" element={<RootRoute />} />

          {/* Public routes */}
          {publicRoutes.map((route, index) =>
            renderRoute(route, `public-${index}`, route.layout, route.component)
          )}

          {/* auth routes */}
          <Route element={<RedirectIfAuthenticated />}>
            {authRoutes.map((route, index) =>
              renderRoute(route, `auth-${index}`, route.layout, route.component)
            )}
          </Route>

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            {protectedRoutes.map((route, index) =>
              renderRoute(
                route,
                `protected-${index}`,
                route.layout,
                route.component
              )
            )}
          </Route>

          {/* Admin routes */}
          <Route element={<RoleBasedRoute allowedRoles={["admin"]} />}>
            {adminRoutes.map((route, index) =>
              renderRoute(
                route,
                `admin-${index}`,
                route.layout,
                route.component
              )
            )}
          </Route>

          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
};

export default App;
