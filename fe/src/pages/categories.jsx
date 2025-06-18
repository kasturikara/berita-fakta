import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CategoriesPages = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [categoryArticles, setCategoryArticles] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/categories`
      );
      if (response.data.success) {
        setCategories(response.data.data);
      } else {
        throw new Error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchArticlesByCategory = async (categoryID) => {
    if (categoryID === selectedCategory?.id) {
      setSelectedCategory("");
      setCategoryArticles([]);
      return;
    }

    try {
      setArticlesLoading(true);
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/categories/${categoryID}/articles?limit=6`
      );

      if (response.data.success) {
        const selectedCat = categories.find((cat) => cat.id === categoryID);
        setSelectedCategory(selectedCat);
        setCategoryArticles(response.data.data || []);
      } else {
        throw new Error(`Failed to fetch articles for category ${categoryID}`);
      }
    } catch (error) {
      console.error("Error fetching articles by category:", error);
      setCategoryArticles([]);
    } finally {
      setArticlesLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-8 text-3xl font-bold">Kategori Artikel</h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      ) : categories.length === 0 ? (
        <div className="py-12 text-center">
          <h2 className="text-xl">Tidak ada kategori tersedia</h2>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-10 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => fetchArticlesByCategory(category.id)}
                className={`btn ${
                  selectedCategory?.id === category.id
                    ? "btn-primary"
                    : "btn-outline"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {selectedCategory && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">
                  Artikel dalam kategori "{selectedCategory.name}"
                </h2>
                <Link
                  to={`/articles?category=${selectedCategory.id}`}
                  className="btn btn-sm btn-outline"
                >
                  Lihat Semua
                </Link>
              </div>

              {articlesLoading ? (
                <div className="flex justify-center py-8">
                  <div className="loading loading-spinner loading-md"></div>
                </div>
              ) : categoryArticles.length === 0 ? (
                <div className="py-6 text-center">
                  <p>Tidak ada artikel dalam kategori ini</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {categoryArticles.map((article) => (
                    <div
                      key={article.id}
                      className="transition-shadow shadow-md card bg-base-100 hover:shadow-lg"
                    >
                      <figure className="h-40">
                        <img
                          src={
                            article.cover_image_url ||
                            "https://placehold.co/600x400?text=Tidak+Ada+Gambar"
                          }
                          alt={article.title}
                          className="object-cover w-full h-full"
                        />
                      </figure>
                      <div className="card-body p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray-500">
                            {formatDate(article.published_at)}
                          </span>
                        </div>
                        <h3 className="text-base card-title line-clamp-2">
                          {article.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="avatar">
                            <div className="w-6 rounded-full">
                              <img
                                src={
                                  article.profiles?.avatar_url ||
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    article.profiles?.full_name || "User"
                                  )}`
                                }
                                alt={article.profiles?.full_name || "User"}
                              />
                            </div>
                          </div>
                          <span className="text-xs">
                            {article.profiles?.full_name || "Anonymous"}
                          </span>
                        </div>
                        <div className="justify-end mt-3 card-actions">
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
          )}
        </>
      )}
    </div>
  );
};

export default CategoriesPages;
