import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const UserLayout = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full md:w-64 bg-base-200 rounded-box p-4">
            <div className="flex items-center space-x-3 mb-6">
              <div className="avatar">
                <div className="w-12 rounded-full">
                  <img
                    src={
                      user?.avatar_url ||
                      `https://ui-avatars.com/api/?name=${user?.full_name}`
                    }
                    alt={user?.full_name}
                  />
                </div>
              </div>
              <div>
                <h3 className="font-bold">{user?.full_name}</h3>
                <p className="text-sm opacity-70">@{user?.username}</p>
              </div>
            </div>

            <ul className="menu">
              <li>
                <Link to="/">Beranda</Link>
              </li>
              <li>
                <Link to="/articles/me">Artikel Saya</Link>
              </li>
              <li>
                <Link to="/articles/new">Tulis Artikel Baru</Link>
              </li>
              <li>
                <Link to="/profile">Profil</Link>
              </li>
            </ul>
          </aside>

          {/* Main content */}
          <main className="flex-grow">{children}</main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserLayout;
