import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-base-100 flex">
      {/* Sidebar */}
      <aside
        className={`bg-neutral text-neutral-content ${
          isSidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between">
          {isSidebarOpen ? (
            <span className="font-bold text-xl">Admin Panel</span>
          ) : (
            <span className="font-bold text-xl">AP</span>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="btn btn-ghost btn-sm btn-circle"
          >
            {isSidebarOpen ? "←" : "→"}
          </button>
        </div>

        <nav className="flex-grow py-4">
          <ul className="menu">
            <li>
              <Link to="/admin" className="flex items-center p-3">
                <span className="material-icons">dashboard</span>
                {isSidebarOpen && <span className="ml-2">Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link to="/admin/users" className="flex items-center p-3">
                <span className="material-icons">people</span>
                {isSidebarOpen && <span className="ml-2">Users</span>}
              </Link>
            </li>
            <li>
              <Link to="/admin/articles" className="flex items-center p-3">
                <span className="material-icons">article</span>
                {isSidebarOpen && <span className="ml-2">Articles</span>}
              </Link>
            </li>
            <li>
              <Link to="/admin/categories" className="flex items-center p-3">
                <span className="material-icons">category</span>
                {isSidebarOpen && <span className="ml-2">Categories</span>}
              </Link>
            </li>
            <li>
              <Link to="/admin/tags" className="flex items-center p-3">
                <span className="material-icons">label</span>
                {isSidebarOpen && <span className="ml-2">Tags</span>}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-neutral-content border-opacity-10">
          <div className="flex items-center">
            <div className="avatar">
              <div className="w-8 rounded-full">
                <img
                  src={
                    user?.avatar_url ||
                    `https://ui-avatars.com/api/?name=${user?.full_name}`
                  }
                  alt="Profile"
                />
              </div>
            </div>
            {isSidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.full_name}</p>
                <button onClick={handleLogout} className="text-xs link">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-grow flex flex-col">
        <header className="bg-base-100 shadow-md p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            <div className="flex items-center">
              <span className="mr-2">{user?.full_name}</span>
              <div className="avatar">
                <div className="w-8 rounded-full">
                  <img
                    src={
                      user?.avatar_url ||
                      `https://ui-avatars.com/api/?name=${user?.full_name}`
                    }
                    alt="Profile"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
