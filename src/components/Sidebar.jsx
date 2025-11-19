import React from "react";
import { useNavigate } from "react-router-dom";
import { HiHome, HiOutlineLogout } from "react-icons/hi";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-blue-700 text-white flex flex-col p-5">
      <h2 className="text-lg font-semibold mb-6">Menu</h2>
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-600 transition"
      >
        <HiHome /> Dashboard
      </button>

      <div className="mt-auto pt-6 border-t border-blue-600">
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-600 transition"
        >
          <HiOutlineLogout /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
