// src/components/BurndownChart.jsx
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

const BurndownChart = ({ boards }) => {
  const data = useMemo(() => {
    const allTasks = boards.flatMap(b => b.tasks);
    const dateCounts = {};

    allTasks.forEach(task => {
      if (!task.dueDate) return;
      const day = task.dueDate;
      dateCounts[day] = (dateCounts[day] || 0) + 1;
    });

    // Sort by date
    const sortedDates = Object.keys(dateCounts).sort((a,b) => new Date(a) - new Date(b));

    // Calculate remaining tasks per day
    const remaining = sortedDates.map((date, index) => {
      const doneTasks = allTasks.filter(t => t.status === 'done' && new Date(t.dueDate) <= new Date(date)).length;
      const totalTasks = allTasks.length;
      const remainingTasks = totalTasks - doneTasks;
      return { date, remaining: remainingTasks };
    });

    return remaining;
  }, [boards]);

  return (
    <motion.div
      className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, boxShadow: "0px 15px 25px rgba(0,0,0,0.2)" }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Burn-down Chart</h2>
      {data.length === 0 ? (
        <div className="text-gray-600 dark:text-gray-400 text-sm">No tasks with due dates</div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="remaining" stroke="#f87171" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

export default BurndownChart;
