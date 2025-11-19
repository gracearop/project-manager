// src/pages/Dashboard.jsx
import React, { useContext, useState, useEffect } from "react";
import { BoardContext } from "../context/BoardContext";
import { motion } from "framer-motion";

// Analytics components
import TaskStatusChart from "../components/TaskStatusChart";
import PriorityChart from "../components/PriorityChart";
import ProjectProgress from "../components/ProjectProgress";
import CalendarView from "../components/CalendarView";
import DailyProductivity from "../components/DailyProductivity";
import WeeklyActivityHeatmap from "../components/WeeklyActivityHeatmap";
import BurnDownChart from "../components/BurndownChart";
import BoardComparison from "../components/BoardComparison";
import AIInsights from "../components/AIInsights";

import Board from "../components/Board";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Dashboard = () => {
  const { boards, addBoard } = useContext(BoardContext);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [filters, setFilters] = useState({ status: "", priority: "", search: "" });

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleAddBoard = () => {
    if (!newBoardTitle.trim()) return;
    addBoard(newBoardTitle);
    setNewBoardTitle("");
  };

  const allTasks = boards.flatMap((b) => b.tasks);

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500">

      {/* THEME & FILTERS */}
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md"
        >
          Toggle Theme
        </button>
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search tasks"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="px-3 py-2 rounded border"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 rounded border"
          >
            <option value="">All Statuses</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="px-3 py-2 rounded border"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* PAGE TITLE */}
      <motion.h1
        className="text-3xl font-bold mb-6 text-center text-blue-700 dark:text-blue-300"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Dashboard Overview
      </motion.h1>

      {/* ADD BOARD INPUT */}
      <motion.div
        className="flex justify-center mb-6 gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <input
          type="text"
          placeholder="Enter new board name"
          value={newBoardTitle}
          onChange={(e) => setNewBoardTitle(e.target.value)}
          className="px-3 py-2 rounded border"
        />
        <button
          onClick={handleAddBoard}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Board
        </button>
      </motion.div>

      {/* ANALYTICS SECTION */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={childVariants}>
          <TaskStatusChart data={allTasks} filters={filters} />
        </motion.div>
        <motion.div variants={childVariants}>
          <PriorityChart data={allTasks} filters={filters} />
        </motion.div>
        <motion.div variants={childVariants}>
          <ProjectProgress boards={boards} filters={filters} />
        </motion.div>
        <motion.div variants={childVariants}>
          <CalendarView tasks={allTasks} filters={filters} />
        </motion.div>
        <motion.div variants={childVariants}>
          <DailyProductivity tasks={allTasks} filters={filters} />
        </motion.div>
        <motion.div variants={childVariants}>
          <WeeklyActivityHeatmap tasks={allTasks} filters={filters} />
        </motion.div>
        <motion.div variants={childVariants}>
          <BurnDownChart tasks={allTasks} boards={boards} filters={filters} />
        </motion.div>
        <motion.div variants={childVariants}>
          <BoardComparison boards={boards} filters={filters} />
        </motion.div>
        <motion.div variants={childVariants}>
          <AIInsights tasks={allTasks} boards={boards} filters={filters} />
        </motion.div>
      </motion.div>

      {/* PROJECT BOARDS SECTION */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {boards.map((board) => (
          <motion.div key={board.id} variants={childVariants}>
            <Board board={board} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Dashboard;
