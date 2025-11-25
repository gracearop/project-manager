// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(true); // optional: handle restore state

  // Load user and theme from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedTheme = localStorage.getItem("theme");
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedTheme) setTheme(storedTheme);
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const found = storedUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (found) {
      localStorage.setItem("user", JSON.stringify(found));
      setUser(found);
      return true;
    }
    return false;
  };

  const register = (name, email, password) => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    if (storedUsers.some((u) => u.email === email)) return false;

    const newUser = { id: Date.now(), name, email, password };
    storedUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(storedUsers));
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
    return true;
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    // reset theme to light on logout
    setTheme("light");
    localStorage.setItem("theme", "light");
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, theme, toggleTheme, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
