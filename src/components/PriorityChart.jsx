// src/components/PriorityChart.jsx
import React, { useMemo } from 'react';
import { BarChart, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const PriorityChart = ({ data, filters = {} }) => {
  // Apply filters
  const filteredData = useMemo(() => {
    return data.filter(task => {
      if (filters.status && task.status !== filters.status) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [data, filters]);

  // Count tasks per priority including subtasks
  const chartData = useMemo(() => {
    const priorities = { Low: 0, Medium: 0, High: 0, Urgent: 0 };
    filteredData.forEach(task => {
      const p = task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1) || 'Medium';
      priorities[p] = (priorities[p] || 0) + 1;

      if (task.subtasks) {
        task.subtasks.forEach(sub => {
          const sp = sub.priority?.charAt(0).toUpperCase() + sub.priority?.slice(1) || 'Medium';
          priorities[sp] = (priorities[sp] || 0) + 1;
        });
      }
    });

    return Object.keys(priorities).map(key => ({ name: key, value: priorities[key] }));
  }, [filteredData]);

  const colors = { Low: '#34D399', Medium: '#FACC15', High: '#F97316', Urgent: '#EF4444' };

  return (
    <motion.div
      className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, boxShadow: "0px 15px 25px rgba(0,0,0,0.2)" }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Task Priority Levels</h2>
      <div className="h-64">
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {chartData.map(item => (
              <Bar key={item.name} dataKey="value" fill={colors[item.name] || '#3B82F6'} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default PriorityChart;
