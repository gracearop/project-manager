// import './App.css';
// import { BoardProvider } from "./context/BoardContext";
// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Dashboard from "./pages/Dashboard";
// import Login from "./pages/Login";
// import BoardPage from "./pages/BoardPage";

// function App() {
//   return (
//       <BoardProvider>
//           <Router>
//       <div className="flex min-h-screen bg-gray-50">
//         <Sidebar />
//         <div className="flex-1 flex flex-col">
//           <Navbar />
//           <main className="p-6 flex-1 overflow-y-auto">
//             <Routes>
//               <Route path="/" element={<Navigate to="/dashboard" replace />} />
//               <Route path="/dashboard" element={<Dashboard />} />
//               <Route path="/board/:id" element={<BoardPage />} />
//               <Route path="/login" element={<Login />} />
//             </Routes>
//           </main>
//         </div>
//       </div>
//     </Router>
//     </BoardProvider>

//   );
// }

// export default App;


// src/App.jsx
import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import BoardPage from "./pages/BoardPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AuthProvider, { AuthContext } from "./context/AuthContext";
import { BoardProvider } from "./context/BoardContext";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

/* PrivateRoute uses AuthContext at runtime — this is fine because it will be used
   inside the AuthProvider tree. */
const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <AuthProvider>
      <BoardProvider>
        <Router>
          <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Navbar />
              <main className="p-6 flex-1 overflow-y-auto">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/board/:id"
                    element={
                      <PrivateRoute>
                        <BoardPage />
                      </PrivateRoute>
                    }
                  />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      </BoardProvider>
    </AuthProvider>
  );
};

export default App;
