import React from "react";
import { Link } from "react-router-dom";

const LandingPages = () => {
  return (
    <div className="min-h-screen bg-base-100">
      {/* hero */}
      <section className="container px-4 py-16 mx-auto">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-5xl font-bold">Berita Fakta</h1>
          <p className="py-6 text-xl max-w-2xl">
            Portal berita yang mengutamakan keaslian berita. Dapatkan informasi
            terkini yang akurat dan terpercaya.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Bergabung Sekarang
          </Link>
        </div>
      </section>

      {/* feat */}
      <section className="container px-4 py-16 mx-auto">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="p-6 text-center card bg-base-200">
            <h2 className="text-xl font-bold">Berita Terpercaya</h2>
            <p className="mt-4">
              Konten yang disajikan telah melewati proses verifikasi yang ketat.
            </p>
          </div>
          <div className="p-6 text-center card bg-base-200">
            <h2 className="text-xl font-bold">Update Terkini</h2>
            <p className="mt-4">
              Dapatkan informasi terbaru setiap saat dari berbagai kategori.
            </p>
          </div>
          <div className="p-6 text-center card bg-base-200">
            <h2 className="text-xl font-bold">Komunitas Aktif</h2>
            <p className="mt-4">
              Bergabunglah dengan diskusi dan berbagi pendapat dengan komunitas
              kami.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPages;
