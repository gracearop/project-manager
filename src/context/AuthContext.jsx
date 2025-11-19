// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
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
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
