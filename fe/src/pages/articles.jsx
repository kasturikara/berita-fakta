import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";

const ArticlesPages = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  // get params from URL or use defaults
  const page = parseInt(searchParams.get("page") || "1");
  const searchQuery = searchParams.get("search") || "";
  const categoryId = searchParams.get("category") || "";

  // fetch articles with pagination, search, and category filter
  const fetchArticles = async () => {
    try {
      setLoading(true);
      let url;
      let queryParams = new URLSearchParams();
      queryParams.append("page", page);
      queryParams.append("limit", 9);

      // if category is selected, use the category-specific endpoint
      if (categoryId) {
        url = `${
          import.meta.env.VITE_API_URL
        }/api/categories/${categoryId}/articles`;
      } else {
        url = `${import.meta.env.VITE_API_URL}/api/articles`;
        // only add search param to general articles endpoint
        if (searchQuery) {
          queryParams.append("search", searchQuery);
        }
      }

      const response = await axios.get(`${url}?${queryParams.toString()}`);

      if (response.data.success) {
        setArticles(response.data.data || []);
        // get total pages from API response
        setTotalPages(response.data.meta?.totalPages || 1);
      } else {
        throw new Error(response.data.message || "Failed to fetch articles");
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      setError("Failed to fetch articles. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // fetch categories for filter dropdown
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/categories`
      );
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // initial load - fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch articles when page, search or category changes
  useEffect(() => {
    fetchArticles();
  }, [page, searchQuery, categoryId]);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchValue = formData.get("searchQuery");
    const categoryValue = formData.get("category");

    // Reset to page 1 when searching or changing category
    setSearchParams({
      ...(searchValue ? { search: searchValue } : {}),
      ...(categoryValue ? { category: categoryValue } : {}),
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setSearchParams({
        ...(newPage > 1 ? { page: newPage } : {}),
        ...(searchQuery ? { search: searchQuery } : {}),
        ...(categoryId ? { category: categoryId } : {}),
      });
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-8 text-3xl font-bold">Daftar Artikel</h1>

      {/* Search & filter form */}
      <div className="p-4 mb-8 rounded-lg bg-base-200">
        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-4 md:flex-row"
        >
          <div className="flex-grow">
            <input
              type="text"
              name="searchQuery"
              placeholder="Cari artikel..."
              className="w-full input input-bordered"
              defaultValue={searchQuery}
            />
          </div>
          <div className="md:w-1/4">
            <select
              name="category"
              className="w-full select select-bordered"
              defaultValue={categoryId}
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button type="submit" className="w-full btn btn-primary md:w-auto">
              Cari
            </button>
          </div>
        </form>
      </div>

      {/* Articles grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : articles.length === 0 ? (
        <div className="py-12 text-center">
          <h2 className="text-xl">Tidak ada artikel ditemukan</h2>
          <p className="mt-2 text-gray-500">
            Coba ubah kata kunci pencarian atau pilih kategori lain
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((item) => (
              <div
                key={item.id}
                className="transition-shadow shadow-lg card bg-base-100 hover:shadow-xl hover:shadow-primary"
              >
                <figure className="h-48 overflow-hidden">
                  <img
                    src={
                      item.cover_image_url ||
                      "https://placehold.co/600x400?text=Tidak+Ada+Gambar"
                    }
                    alt={item.title}
                    className="object-cover w-full h-full"
                  />
                </figure>
                <div className="card-body">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="badge badge-primary">
                      {item.categories?.name || "-"}
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(item.published_at)}
                    </span>
                  </div>
                  <h2 className="text-lg card-title line-clamp-2">
                    {item.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="avatar">
                      <div className="w-6 rounded-full">
                        <img
                          src={
                            item.profiles?.avatar_url ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              item.profiles?.full_name || "User"
                            )}`
                          }
                          alt={item.profiles?.full_name || "User"}
                        />
                      </div>
                    </div>
                    <span className="text-sm">
                      {item.profiles?.full_name || "Anonymous"}
                    </span>
                  </div>
                  <div className="mt-4 card-actions">
                    <Link
                      to={`/articles/${item.id}`}
                      className="btn btn-outline btn-primary btn-sm"
                    >
                      Baca Artikel
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10">
              <div className="join">
                <button
                  className="join-item btn"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  «
                </button>
                <button className="join-item btn">
                  Halaman {page} dari {totalPages}
                </button>
                <button
                  className="join-item btn"
                  onClick={() => handlePageChange(page + 1)}
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

export default ArticlesPages;
