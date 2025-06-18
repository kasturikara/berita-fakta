import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // check if user is logged in
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // configure axios with token
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // fetch current user data
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/auth/me`
          );
          if (response.data.success) {
            setUser(response.data.user);
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  // login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          email,
          password,
        }
      );

      if (response.data.success) {
        const { user, token } = response.data;
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(user);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  // register function
  const register = async (userData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        userData
      );
      if (response.data.success) {
        const { user, token } = response.data;
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(user);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  // logout function
  const logout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
    }
  };

  // Update user function (for profile updates)
  const updateUser = (updatedUserData) => {
    setUser((prev) => ({
      ...prev,
      ...updatedUserData,
    }));
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, setUser: updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
