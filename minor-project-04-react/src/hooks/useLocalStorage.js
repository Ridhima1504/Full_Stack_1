import React, { useState, useEffect } from "react";

// useState that is saved to localStorage. Falls back safely if saved data is broken.
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      const parsed = saved ? JSON.parse(saved) : initialValue;
      return Array.isArray(initialValue) && !Array.isArray(parsed) ? initialValue : parsed;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or blocked - ignore */
    }
  }, [key, value]);

  return [value, setValue];
}