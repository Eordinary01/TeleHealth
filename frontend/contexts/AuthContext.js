"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();

  const checkTokenExpiration = (token) => {
    if (!token) return false;
    try {
      const decodedToken = jwt.decode(token);
      const currentTime = Date.now() / 1000;
      console.log("Decoded Token:", decodedToken);
      console.log("Current Time:", currentTime, "Token Expiry Time:", decodedToken?.exp);
      return decodedToken && decodedToken.exp > currentTime;
    } catch (error) {
      console.error("Error decoding token:", error);
      return false;
    }
  };

  const handleTokenValidation = () => {
    console.log("Starting token validation...");
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    console.log("Stored Token:", storedToken);
    console.log("Stored User:", storedUser);

    if (storedToken && checkTokenExpiration(storedToken) && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("Parsed User:", parsedUser);

        setToken(storedToken);
        setUser(parsedUser);
        setIsLoggedIn(true);
        console.log("User is authenticated.");
      } catch (error) {
        console.error("Error parsing stored user:", error);
        logout();
      }
    } else {
      console.warn("Token validation failed or user not found. Logging out...");
      logout();
    }

    setLoading(false);
  };

  useEffect(() => {
    console.log("AuthProvider mounted. Validating token...");
    handleTokenValidation();
  }, []);


  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      console.log("Registration successful. Redirecting to login...");
      router.push("/login");
    } catch (err) {
      console.error("Registration Error:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      console.log("Login Credentials:", credentials);
      setError(null);
      setLoading(true);

      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await response.json();
      console.log("Login Response:", data);

      if (!response.ok) {
        console.error("Login Error:", data.message);
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);

      const decodedToken = jwt.decode(data.token);
      console.log("Decoded Token:", decodedToken);

      const userToStore = {
        id: decodedToken.userId,
        name: decodedToken.name,
        email: credentials.email,
        role: decodedToken.role,
      };

      localStorage.setItem("user", JSON.stringify(userToStore));

      setToken(data.token);
      setUser(userToStore);
      setIsLoggedIn(true);
      console.log("Login successful. Redirecting to home...");
      router.push("/");
    } catch (err) {
      console.error("Login Catch Error:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log("Logging out...");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    router.push("/login");
  };

  

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    token,
    loading,
    error,
    isLoggedIn,
    login,
    logout,
    register,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
