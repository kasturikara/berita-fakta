import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";

const HomePages = () => {
  const { user } = useAuth();
  const [latestArticles, setLatestArticles] = useState([]);
  const [myArticles, setMyArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch latest articles
        const articlesResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/articles?limit=4`
        );

        if (articlesResponse.data.success) {
          setLatestArticles(articlesResponse.data.data);
        }

        // Fetch user's articles if user is not admin
        if (user && user.role !== "admin") {
          const myArticlesResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/articles/author/${
              user.id
            }?limit=3`
          );

          if (myArticlesResponse.data.success) {
            setMyArticles(myArticlesResponse.data.data);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  return (
    <div className="space-y-8">
      {/* Greeting section */}
      <div className="bg-base-200 p-6 rounded-lg">
        <h1 className="text-3xl font-bold">Selamat Datang di Berita Fakta</h1>
        <p className="text-xl mt-2">Hello, {user.full_name}!</p>
      </div>

      {/* Latest articles section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Artikel Terbaru</h2>
          <Link to="/articles" className="btn btn-sm btn-outline">
            Lihat Semua
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="loading loading-spinner loading-md text-primary"></div>
          </div>
        ) : latestArticles.length === 0 ? (
          <div className="text-center py-4 bg-base-200 rounded-lg">
            <p>Belum ada artikel tersedia</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {latestArticles.map((article) => (
              <div
                key={article.id}
                className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow"
              >
                <figure className="h-40">
                  <img
                    src={
                      article.cover_image_url ||
                      "https://placehold.co/600x400?text=Tidak+Ada+Gambar"
                    }
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </figure>
                <div className="card-body p-4">
                  <div className="flex gap-2 items-center mb-1">
                    <div className="badge badge-sm badge-primary">
                      {article.categories?.name || "Tidak Ada Kategori"}
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(article.published_at)}
                    </span>
                  </div>
                  <h3 className="card-title text-base line-clamp-2">
                    {article.title}
                  </h3>
                  <div className="card-actions mt-2">
                    <Link
                      to={`/articles/${article.id}`}
                      className="btn btn-xs btn-outline btn-primary"
                    >
                      Baca
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User's articles section (if not admin) */}
      {user.role !== "admin" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Artikel Saya</h2>
            <Link to="/articles/me" className="btn btn-sm btn-outline">
              Kelola Artikel
            </Link>
          </div>

          {loading ? (
            <div className="py-4"></div> // Just spacing during loading since we already have a loader above
          ) : myArticles.length === 0 ? (
            <div className="bg-base-200 p-6 rounded-lg text-center">
              <p className="mb-4">Anda belum menulis artikel</p>
              <Link to="/articles/new" className="btn btn-primary">
                Tulis Artikel Baru
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {myArticles.map((article) => (
                <div key={article.id} className="card bg-base-100 shadow-md">
                  <div className="card-body p-4">
                    <h3 className="card-title text-base line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {formatDate(article.published_at)}
                    </p>
                    <div className="card-actions justify-end mt-2">
                      <Link
                        to={`/articles/${article.id}`}
                        className="btn btn-xs btn-ghost"
                      >
                        Lihat
                      </Link>
                      <Link
                        to={`/articles/edit/${article.id}`}
                        className="btn btn-xs btn-outline"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card bg-primary text-primary-content">
          <div className="card-body">
            <h3 className="card-title">Tulis Artikel Baru</h3>
            <p>Bagikan berita atau informasi penting kepada komunitas</p>
            <div className="card-actions justify-end mt-2">
              <Link to="/articles/new" className="btn btn-sm">
                Buat Artikel
              </Link>
            </div>
          </div>
        </div>
        <div className="card bg-base-200">
          <div className="card-body">
            <h3 className="card-title">Jelajahi Kategori</h3>
            <p>Temukan artikel berdasarkan kategori yang Anda minati</p>
            <div className="card-actions justify-end mt-2">
              <Link to="/categories" className="btn btn-sm btn-outline">
                Lihat Kategori
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePages;
