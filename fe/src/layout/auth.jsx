import React from "react";
import { Link } from "react-router-dom";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <header className="py-4 px-6">
        <Link to="/" className="text-2xl font-bold">
          Berita Fakta
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center">
        {children}
      </main>

      <footer className="text-center p-4">
        <p>© {new Date().getFullYear()} Berita Fakta</p>
      </footer>
    </div>
  );
};

export default AuthLayout;
