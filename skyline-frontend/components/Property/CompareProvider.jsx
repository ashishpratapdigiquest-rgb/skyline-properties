"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const CompareContext = createContext(null);
const STORAGE_KEY = "compare_slugs";
const MAX_COMPARE = 3;

export function CompareProvider({ children }) {
  const [slugs, setSlugs] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(stored)) setSlugs(stored);
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  }, [slugs, hydrated]);

  const addToCompare = useCallback((slug) => {
    setSlugs((prev) => {
      if (prev.includes(slug)) return prev;
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, slug];
    });
  }, []);

  const removeFromCompare = useCallback((slug) => {
    setSlugs((prev) => prev.filter((s) => s !== slug));
  }, []);

  const isInCompare = useCallback((slug) => slugs.includes(slug), [slugs]);

  const clearCompare = useCallback(() => setSlugs([]), []);

  return (
    <CompareContext.Provider value={{ slugs, addToCompare, removeFromCompare, isInCompare, clearCompare, maxCompare: MAX_COMPARE }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
