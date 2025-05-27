import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral text-neutral-content">
      <div className="container mx-auto">
        <div className="footer p-10">
          <div>
            <p className="font-bold text-xl">Berita Fakta</p>
            <p>Portal berita terpercaya sejak 2025.</p>
          </div>

          <div>
            <span className="footer-title">Links</span>
            <Link to="/" className="link link-hover">
              Beranda
            </Link>
            <Link to="/articles" className="link link-hover">
              Artikel
            </Link>
            <Link to="/categories" className="link link-hover">
              Kategori
            </Link>
          </div>

          <div>
            <span className="footer-title">Info Akun</span>
            <Link to="/login" className="link link-hover">
              Masuk
            </Link>
            <Link to="/register" className="link link-hover">
              Daftar
            </Link>
          </div>

          <div>
            <span className="footer-title">Legal</span>
            <Link to="/privacy-policy" className="link link-hover">
              Kebijakan Privasi
            </Link>
            <Link to="/terms" className="link link-hover">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>

        <div className="footer footer-center p-4 border-t border-neutral-content border-opacity-10">
          <div>
            <p>Copyright © {currentYear} - Berita Fakta</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
