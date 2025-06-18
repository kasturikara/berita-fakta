import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    full_name: "",

    avatar_url: "",
    bio: "",
  });

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        full_name: user.full_name || "",

        avatar_url: user.avatar_url || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

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
    setSuccess("");

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");

      // Set authorization header
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/profile`,
        formData,
        config
      );

      if (response.data.success) {
        setSuccess("Profile updated successfully!");
        setEditMode(false);

        // Update user context with new data
        if (setUser) {
          setUser(response.data.data);
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(
        error.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const oldPassword = e.target.elements.oldPassword.value;
    const newPassword = e.target.elements.newPassword.value;
    const confirmPassword = e.target.elements.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");

      // Set authorization header
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/change-password`,
        { oldPassword, newPassword },
        config
      );

      if (response.data.success) {
        setSuccess("Password changed successfully!");
        e.target.reset();
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setError(
        error.response?.data?.message ||
          "Failed to change password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center py-12">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Profil Pengguna</h1>

      {error && (
        <div className="alert alert-error mb-6">
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
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {success && (
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
          <span>{success}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Profile Information */}
        <div className="lg:w-2/3 bg-base-100 rounded-lg shadow-md">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Informasi Profil</h2>

              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="btn btn-sm btn-primary"
                >
                  Edit Profil
                </button>
              ) : (
                <button
                  onClick={() => {
                    setEditMode(false);
                    // Reset form data to current user data
                    setFormData({
                      username: user.username || "",
                      full_name: user.full_name || "",

                      avatar_url: user.avatar_url || "",
                      bio: user.bio || "",
                    });
                  }}
                  className="btn btn-sm btn-ghost"
                >
                  Batal
                </button>
              )}
            </div>

            {!editMode ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-8">
                  <div className="avatar">
                    <div className="w-24 rounded-full">
                      <img
                        src={
                          user.avatar_url ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.full_name
                          )}&size=200`
                        }
                        alt={user.full_name}
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{user.full_name}</h3>
                    <p className="text-sm opacity-70">@{user.username}</p>
                    <p className="badge badge-outline mt-2">{user.role}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p>@{user.username}</p>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Bio</p>
                    <p>{user.bio || "No bio provided"}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-gray-500">Member sejak</p>
                  <p>
                    {new Date(user.created_at).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Foto Profil URL</span>
                  </label>
                  <input
                    type="url"
                    name="avatar_url"
                    value={formData.avatar_url}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="https://example.com/avatar.jpg"
                  />

                  {formData.avatar_url && (
                    <div className="mt-2">
                      <div className="avatar">
                        <div className="w-16 rounded-full">
                          <img src={formData.avatar_url} alt="Preview" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Nama Lengkap</span>
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Nama lengkap Anda"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Username</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Username"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Bio</span>
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio || ""}
                    onChange={handleChange}
                    className="textarea textarea-bordered w-full h-24"
                    placeholder="Ceritakan sedikit tentang diri Anda"
                  ></textarea>
                </div>

                <div className="form-control mt-6">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Menyimpan...
                      </>
                    ) : (
                      "Simpan Perubahan"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Change Password */}
        <div className="lg:w-1/3 bg-base-100 rounded-lg shadow-md h-fit">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Ubah Password</h2>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password Lama</span>
                </label>
                <input
                  type="password"
                  name="oldPassword"
                  className="input input-bordered w-full"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password Baru</span>
                </label>
                <input
                  type="password"
                  name="newPassword"
                  className="input input-bordered w-full"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Konfirmasi Password Baru</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="input input-bordered w-full"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="form-control mt-6">
                <button
                  type="submit"
                  className="btn btn-outline btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Memproses...
                    </>
                  ) : (
                    "Ubah Password"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
