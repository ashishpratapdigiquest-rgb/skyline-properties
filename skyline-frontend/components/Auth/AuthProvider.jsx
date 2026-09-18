"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getToken, storeToken, clearToken, getMe,
  loginUser, registerUser, getFavorites, addFavorite, removeFavorite,
} from "@/lib/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [favoriteSlugs, setFavoriteSlugs] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshFavorites = useCallback(async (token) => {
    const favs = await getFavorites(token);
    setFavoriteSlugs(favs.map((f) => f.slug));
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    getMe(token).then((me) => {
      if (me) {
        setUser(me);
        refreshFavorites(token);
      } else {
        clearToken();
      }
      setLoading(false);
    });
  }, [refreshFavorites]);

  async function login(email, password) {
    const { token, user: u } = await loginUser(email, password);
    storeToken(token);
    setUser(u);
    await refreshFavorites(token);
  }

  async function register(name, email, password, website = "") {
    const { token, user: u } = await registerUser(name, email, password, website);
    storeToken(token);
    setUser(u);
    await refreshFavorites(token);
  }

  function logout() {
    clearToken();
    setUser(null);
    setFavoriteSlugs([]);
  }

  async function toggleFavorite(slug) {
    const token = getToken();
    if (!token) return false; // caller should redirect to /login
    if (favoriteSlugs.includes(slug)) {
      await removeFavorite(token, slug);
      setFavoriteSlugs((prev) => prev.filter((s) => s !== slug));
    } else {
      await addFavorite(token, slug);
      setFavoriteSlugs((prev) => [...prev, slug]);
    }
    return true;
  }

  return (
    <AuthContext.Provider value={{ user, loading, favoriteSlugs, login, register, logout, toggleFavorite, refreshFavorites }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
