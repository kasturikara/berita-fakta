import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";

const ArticlesPages = () => {
  const [articles, setArticles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [categories, setCategories] = React.useState([]);

  // fetch articles with pagination & search
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page,
        limit: 9,
      });

      if (searchQuery) queryParams.append("search", searchQuery);
      if (category) queryParams.append("category", category);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/articles?${queryParams.toString()}`
      );

      if (response.data.success) {
        setArticles(response.data.data);
        setTotalPages(response.data.meta.totalPages);
      }
    } catch (error) {
      setError("Failed to fetch articles. Please try again later.");
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  // fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/categories`
      );
      if (response.data.success) setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  React.useEffect(() => {
    fetchCategories();
  }, []);

  React.useEffect(() => {
    fetchArticles();
  }, [page, searchQuery, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // reset to first page on search
    fetchArticles();
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) setPage(newPage);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-8 text-3xl font-bold">Daftar Artikel</h1>

      {/* search & filter */}
      <div className="p-4 mb-8 rounded-lg bg-base-200">
        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-4 md:flex-row"
        >
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Cari artikel..."
              className="w-full input input-bordered"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="md:w-1/4">
            <select
              className="w-full select select-bordered"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1); // reset to first page on category change
              }}
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

      {/* articles grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="loading loading-bars loading-lg text-primary"></div>
        </div>
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : articles.length === 0 ? (
        <div className="py-12 text-center">
          <h2 className="text-xl">Tidak ada artikel.</h2>
          <p className="mt-2 text-gray-500">Coba </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((item) => (
              <div
                key={item.id}
                className="transition-shadow shadow-lg card bg-base-100 hover:shadow-xl"
              >
                <figure className="h-48 overflow-hidden">
                  <img
                    src={
                      articles.cover_image_url ||
                      "https://placehold.co/600x400?text=Tidak+Ada+Gambar"
                    }
                    alt={item.title}
                    className="object-cover w-full h-full"
                  />
                </figure>
                <div className="card-body">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="badge badge-primary">
                      {item.categories?.name}
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
                            `https://ui-avatars.com/api/?name=${item.profiles?.full_name}`
                          }
                          alt={item.profiles?.full_name}
                        />
                      </div>
                    </div>
                    <span className="text-sm">{item.profiles?.full_name}</span>
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

          {/* pagination */}
          {totalPages > 0 && (
            <div className="flex justify-center mt-10">
              <div className="join">
                <button
                  className="btn join-item"
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
