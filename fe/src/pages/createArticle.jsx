import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateArticlePages = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category_id: "",
    cover_image_url: "",
    status: "draft",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch categories for dropdown
  useEffect(() => {
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
        setError("Failed to load categories. Please try again.");
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");

      // Set authorization header
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Submit to API
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/articles`,
        formData,
        config
      );

      if (response.data.success) {
        setSuccessMessage("Article created successfully!");

        // If published, redirect to article page
        if (formData.status === "published") {
          navigate(`/articles/${response.data.id}`);
        } else {
          // If draft, redirect to user's articles
          setTimeout(() => {
            navigate("/articles/me");
          }, 1500);
        }
      }
    } catch (error) {
      console.error("Error creating article:", error);
      setError(
        error.response?.data?.message ||
          "Failed to create article. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Buat Artikel Baru</h1>

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

      {successMessage && (
        <div className="alert alert-success mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Judul Artikel</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Masukkan judul artikel"
            required
          />
        </div>

        {/* Category */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Kategori</span>
          </label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
          >
            <option value="" disabled>
              Pilih kategori
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Cover Image URL */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">URL Gambar Cover</span>
          </label>
          <input
            type="url"
            name="cover_image_url"
            value={formData.cover_image_url}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="https://example.com/image.jpg"
          />
          <label className="label">
            <span className="label-text-alt">
              Masukkan URL gambar untuk dijadikan cover artikel
            </span>
          </label>
        </div>

        {/* Content */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Konten Artikel</span>
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="textarea textarea-bordered min-h-[300px]"
            placeholder="Tulis artikel Anda di sini..."
            required
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            onClick={() => {
              setFormData({ ...formData, status: "published" });
              document
                .getElementById("article-form")
                .dispatchEvent(
                  new Event("submit", { cancelable: true, bubbles: true })
                );
            }}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Menyimpan...
              </>
            ) : (
              "Publikasikan"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateArticlePages;
