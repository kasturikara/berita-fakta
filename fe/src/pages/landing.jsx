import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const LandingPages = () => {
  const [latestArticles, setLatestArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestArticles();
  }, []);

  // fetch latest articles
  const fetchLatestArticles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/articles?limit=3`
      );

      if (response.data.success) {
        setLatestArticles(response.data.data);
      } else {
        throw new Error("Failed to fetch articles");
      }
    } catch (err) {
      console.error("Error fetching latest articles:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* hero */}
      <section className="container px-4 py-16 mx-auto">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-5xl font-bold">Berita Fakta</h1>
          <p className="max-w-2xl py-6 text-xl">
            Portal berita yang mengutamakan keaslian berita. Dapatkan informasi
            terkini yang akurat dan terpercaya.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Bergabung Sekarang
          </Link>
        </div>
      </section>

      {/* latest articles */}
      <section className="container px-4 py-12 mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold">Artikel Terbaru</h2>
          <p className="mt-2">
            Temukan informasi terkini dari sumber terpercaya
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="loading loading-spinner loading-lg text-primary"></div>
          </div>
        ) : latestArticles.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-lg">Belum ada artikel tersedia</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden transition-all shadow-lg card bg-base-100 hover:shadow-xl"
              >
                <figure>
                  <img
                    src={
                      item.cover_image_url ||
                      "https://placehold.co/600x400?text=Tidak+Ada+Gambar"
                    }
                    alt={item.title}
                    className="object-cover w-full h-52"
                  />
                </figure>
                <div className="card-body">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="badge badge-primary">
                      {item.categories?.name || "Tanpa Kategori"}
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(item.published_at)}
                    </span>
                  </div>
                  <h3 className="text-xl card-title line-clamp-2">
                    {item.title}
                  </h3>

                  {/* Author info */}
                  <div className="flex items-center gap-2 mt-3">
                    <div className="avatar">
                      <div className="rounded-full w-7">
                        <img
                          src={
                            item.profiles?.avatar_url ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              item.profiles?.full_name || "User"
                            )}`
                          }
                          alt="Author"
                        />
                      </div>
                    </div>
                    <span className="text-sm">
                      {item.profiles?.full_name || "Anonymous"}
                    </span>
                  </div>

                  <div className="justify-between mt-4 card-actions">
                    <Link
                      to={`/articles/${item.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      Baca Selengkapnya
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-8">
          <Link to="/articles" className="btn btn-outline btn-primary">
            Lihat Semua Artikel
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
