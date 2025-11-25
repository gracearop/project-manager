// src/components/PriorityChart.jsx
import React, { useMemo } from 'react';
import { BarChart, XAxis, YAxis, Tooltip, Bar, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

const CustomLegend = ({ colors }) => {
  return (
    <div className="flex gap-4 mt-4 justify-center flex-wrap">
      {Object.keys(colors).map(key => (
        <div key={key} className="flex items-center gap-2">
          <span
            className="inline-block w-4 h-4 rounded"
            style={{ backgroundColor: colors[key] }}
          ></span>
          <span className="text-sm text-gray-700 dark:text-gray-300">{key}</span>
        </div>
      ))}
    </div>
  );
};

const PriorityChart = ({ data, filters = {} }) => {
  const filteredData = useMemo(() => {
    return data.filter(task => {
      if (filters.status && task.status !== filters.status) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [data, filters]);

  const chartData = useMemo(() => {
    const priorities = { Low: 0, Medium: 0, High: 0, Urgent: 0 };

    filteredData.forEach(task => {
      const p = task.priority || "Medium";
      priorities[p]++;

      if (task.subtasks) {
        task.subtasks.forEach(sub => {
          const sp = sub.priority || "Medium";
          priorities[sp]++;
        });
      }
    });

    return Object.keys(priorities).map(key => ({ name: key, value: priorities[key] }));
  }, [filteredData]);

  const colors = {
    Low: '#34D399',
    Medium: '#FACC15',
    High: '#F97316',
    Urgent: '#EF4444'
  };

  return (
    <motion.div
      className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
        Task Priority Levels
      </h2>

      <div className="h-64">
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />

            <Bar dataKey="value">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[entry.name]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend */}
      <CustomLegend colors={colors} />
    </motion.div>
  );
};

export default PriorityChart;
