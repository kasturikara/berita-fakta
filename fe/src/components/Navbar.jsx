import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Function to check if a path is active
  const isActive = (path) => {
    if (path === "/") {
      // For home path, only return true if exactly at root
      return location.pathname === "/";
    }
    // For other paths, check if current path starts with the given path
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="bg-base-100 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="navbar">
          <div className="navbar-start">
            <div className="dropdown lg:hidden">
              <label tabIndex={0} className="btn btn-ghost btn-circle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link
                    to="/"
                    className={isActive("/") ? "active font-bold" : ""}
                  >
                    Beranda
                  </Link>
                </li>
                <li>
                  <Link
                    to="/articles"
                    className={isActive("/articles") ? "active font-bold" : ""}
                  >
                    Artikel
                  </Link>
                </li>
                <li>
                  <Link
                    to="/categories"
                    className={
                      isActive("/categories") ? "active font-bold" : ""
                    }
                  >
                    Kategori
                  </Link>
                </li>
              </ul>
            </div>
            <Link to="/" className="text-2xl font-bold">
              Berita Fakta
            </Link>
          </div>

          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
              <li>
                <Link
                  to="/"
                  className={
                    isActive("/") ? "bg-base-200 text-primary font-medium" : ""
                  }
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  to="/articles"
                  className={
                    isActive("/articles")
                      ? "bg-base-200 text-primary font-medium"
                      : ""
                  }
                >
                  Artikel
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className={
                    isActive("/categories")
                      ? "bg-base-200 text-primary font-medium"
                      : ""
                  }
                >
                  Kategori
                </Link>
              </li>
            </ul>
          </div>

          <div className="navbar-end">
            {user ? (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img
                      src={
                        user.avatar_url ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.full_name
                        )}`
                      }
                      alt={user.full_name}
                    />
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                >
                  <li className="font-bold p-2">{user.full_name}</li>
                  <li>
                    <Link
                      to="/home"
                      className={isActive("/home") ? "active font-bold" : ""}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      className={isActive("/profile") ? "active font-bold" : ""}
                    >
                      Profil
                    </Link>
                  </li>
                  {user.role === "admin" && (
                    <li>
                      <Link
                        to="/admin"
                        className={isActive("/admin") ? "active font-bold" : ""}
                      >
                        Admin Panel
                      </Link>
                    </li>
                  )}
                  <li>
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="btn btn-ghost">
                  Masuk
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
