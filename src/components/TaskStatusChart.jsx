// src/components/TaskStatusChart.jsx
import React, { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { motion } from "framer-motion";

ChartJS.register(ArcElement, Tooltip, Legend);

const TaskStatusChart = ({ data, filters = {} }) => {
  // Apply filters
  const filteredData = useMemo(() => {
    return data.filter(task => {
      if (filters.status && task.status !== filters.status) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [data, filters]);

  // Count statuses including subtasks
  const statusCounts = useMemo(() => {
    const counts = { "To Do": 0, "In Progress": 0, "Done": 0 };
    filteredData.forEach(task => {
      // Count main task
      counts[task.status] = (counts[task.status] || 0) + 1;
      // Count subtasks if present
      if (task.subtasks) {
        task.subtasks.forEach(sub => {
          const subStatus = sub.status || "To Do";
          counts[subStatus] = (counts[subStatus] || 0) + 1;
        });
      }
    });
    return counts;
  }, [filteredData]);

  const chartData = {
    labels: ["To Do", "In Progress", "Done"],
    datasets: [
      {
        label: "# of Tasks",
        data: [statusCounts["To Do"], statusCounts["In Progress"], statusCounts["Done"]],
        backgroundColor: ["#3B82F6", "#FACC15", "#10B981"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">
        Task Status Overview
      </h3>
      <Pie data={chartData} />
    </motion.div>
  );
};

export default TaskStatusChart;
