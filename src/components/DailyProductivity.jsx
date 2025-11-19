// src/components/DailyProductivity.jsx
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

const DailyProductivity = ({ tasks, filters = {} }) => {
  // Compute completed tasks per day
  const data = useMemo(() => {
    const counts = {};
    tasks.forEach(task => {
      // Apply filters
      if (filters.status && task.status !== filters.status) return;
      if (filters.priority && task.priority !== filters.priority) return;
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return;

      if (task.status === 'done' && task.dueDate) {
        const day = task.dueDate;
        counts[day] = (counts[day] || 0) + 1;
      }

      if (task.subtasks) {
        task.subtasks.forEach(sub => {
          if (filters.status && sub.status !== filters.status) return;
          if (filters.priority && sub.priority !== filters.priority) return;
          if (filters.search && !sub.title.toLowerCase().includes(filters.search.toLowerCase())) return;

          if (sub.status === 'done' && sub.dueDate) {
            const day = sub.dueDate;
            counts[day] = (counts[day] || 0) + 1;
          }
        });
      }
    });

    // Convert to array sorted by date
    return Object.keys(counts)
      .sort((a,b) => new Date(a) - new Date(b))
      .map(day => ({ day, completed: counts[day] }));
  }, [tasks, filters]);

  return (
    <motion.div
      className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, boxShadow: "0px 15px 25px rgba(0,0,0,0.2)" }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Daily Productivity</h2>
      {data.length === 0 ? (
        <div className="text-gray-600 dark:text-gray-400 text-sm">No completed tasks yet</div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="completed" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

export default DailyProductivity;
