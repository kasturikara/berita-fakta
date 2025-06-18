import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const MyArticlesPages = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalArticles, setTotalArticles] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchMyArticles = async () => {
      try {
        setLoading(true);

        // Get token for authorized request
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Build query parameters
        const queryParams = new URLSearchParams({
          page,
          limit,
        });

        if (filter) {
          queryParams.append("status", filter);
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/articles/author/${
            user.id
          }?${queryParams.toString()}`,
          config
        );

        if (response.data.success) {
          setArticles(response.data.data || []);
          setTotalArticles(response.data.meta.total);
          setTotalPages(response.data.meta.totalPages);
        } else {
          throw new Error("Failed to fetch articles");
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
        setError("Failed to load your articles. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchMyArticles();
    }
  }, [user, page, limit, filter]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const handleDeleteArticle = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/articles/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Remove the article from state
        setArticles(articles.filter((article) => article.id !== id));
        setTotalArticles(totalArticles - 1);
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Failed to delete article. Please try again.");
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "published":
        return "badge-success";
      case "draft":
        return "badge-warning";
      default:
        return "badge-ghost";
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1); // Reset to first page when changing filter
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Artikel Saya</h1>
        <Link to="/articles/new" className="btn btn-primary">
          Tulis Artikel Baru
        </Link>
      </div>

      {error && (
        <div className="alert alert-error mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="flex mb-4 gap-2">
        <button
          className={`btn btn-sm ${
            filter === "" ? "btn-primary" : "btn-outline"
          }`}
          onClick={() => handleFilterChange("")}
        >
          Semua
        </button>
        <button
          className={`btn btn-sm ${
            filter === "published" ? "btn-primary" : "btn-outline"
          }`}
          onClick={() => handleFilterChange("published")}
        >
          Dipublikasikan
        </button>
        <button
          className={`btn btn-sm ${
            filter === "draft" ? "btn-primary" : "btn-outline"
          }`}
          onClick={() => handleFilterChange("draft")}
        >
          Draft
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12 bg-base-200 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Belum ada artikel</h2>
          <p className="mb-6">
            {filter
              ? `Anda belum memiliki artikel dengan status "${filter}".`
              : "Anda belum menulis artikel apapun."}
          </p>
          <Link to="/articles/new" className="btn btn-primary">
            Tulis Artikel Sekarang
          </Link>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Judul</th>
                  <th>Kategori</th>
                  <th>Status</th>
                  <th>Tanggal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id}>
                    <td className="font-medium">{article.title}</td>
                    <td>{article.categories?.name || "Tidak ada kategori"}</td>
                    <td>
                      <span
                        className={`badge ${getStatusBadgeClass(
                          article.status
                        )}`}
                      >
                        {article.status === "published"
                          ? "Dipublikasikan"
                          : "Draft"}
                      </span>
                    </td>
                    <td>
                      {article.status === "published"
                        ? formatDate(article.published_at)
                        : formatDate(article.created_at) + " (Draft)"}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        {article.status === "published" && (
                          <Link
                            to={`/articles/${article.id}`}
                            className="btn btn-xs btn-ghost"
                          >
                            Lihat
                          </Link>
                        )}
                        <Link
                          to={`/articles/edit/${article.id}`}
                          className="btn btn-xs btn-info"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteArticle(article.id)}
                          className="btn btn-xs btn-error"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="join">
                <button
                  className="join-item btn"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                >
                  «
                </button>
                <button className="join-item btn">
                  Halaman {page} dari {totalPages}
                </button>
                <button
                  className="join-item btn"
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={page === totalPages}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyArticlesPages;
