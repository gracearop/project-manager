// src/App.js
import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import BoardPage from "./pages/BoardPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AuthProvider, { AuthContext } from "./context/AuthContext";
import { BoardProvider } from "./context/BoardContext";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // or a spinner while restoring user

  return user ? children : <Navigate to="/login" replace />;
};

const AppLayout = ({ children }) => {
  const { theme } = useContext(AuthContext);

  useEffect(() => {
    // Apply theme class to <html> for global styling
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BoardProvider>
        <Router>
          <Routes>
            {/* LOGIN & REGISTER SHOULD NOT SHOW SIDEBAR/NAVBAR */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* AUTHENTICATED ROUTES */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </PrivateRoute>
              }
            />

            <Route
              path="/board/:id"
              element={
                <PrivateRoute>
                  <AppLayout>
                    <BoardPage />
                  </AppLayout>
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </BoardProvider>
    </AuthProvider>
  );
};

export default App;
