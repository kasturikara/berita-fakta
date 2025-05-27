import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="bg-base-100 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="navbar">
          <div className="navbar-start">
            <Link to="/" className="text-2xl font-bold">
              Berita Fakta
            </Link>
          </div>

          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
              <li>
                <Link to="/">Beranda</Link>
              </li>
              <li>
                <Link to="/articles">Artikel</Link>
              </li>
              <li>
                <Link to="/categories">Kategori</Link>
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
                        "https://ui-avatars.com/api/?name=" + user.full_name
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
                    <Link to="/home">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/profile">Profil</Link>
                  </li>
                  {user.role === "admin" && (
                    <li>
                      <Link to="/admin">Admin Panel</Link>
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
