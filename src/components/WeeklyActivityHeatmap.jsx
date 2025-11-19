// src/components/WeeklyActivityHeatmap.jsx
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

const daysOfWeek = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const getColor = (value, max) => {
  const intensity = Math.round((value / max) * 255);
  return `rgb(${255-intensity}, ${255-intensity}, 255)`; // lighter = fewer tasks, darker = more tasks
};

const WeeklyActivityHeatmap = ({ tasks, filters = {} }) => {
  const data = useMemo(() => {
    const counts = { Sun:0, Mon:0, Tue:0, Wed:0, Thu:0, Fri:0, Sat:0 };

    tasks.forEach(task => {
      if (filters.status && task.status !== filters.status) return;
      if (filters.priority && task.priority !== filters.priority) return;
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return;

      if (task.status === 'done' && task.dueDate) {
        const dayIndex = new Date(task.dueDate).getDay();
        counts[daysOfWeek[dayIndex]] += 1;
      }

      if (task.subtasks) {
        task.subtasks.forEach(sub => {
          if (filters.status && sub.status !== filters.status) return;
          if (filters.priority && sub.priority !== filters.priority) return;
          if (filters.search && !sub.title.toLowerCase().includes(filters.search.toLowerCase())) return;

          if (sub.status === 'done' && sub.dueDate) {
            const dayIndex = new Date(sub.dueDate).getDay();
            counts[daysOfWeek[dayIndex]] += 1;
          }
        });
      }
    });

    return daysOfWeek.map(day => ({ day, completed: counts[day] }));
  }, [tasks, filters]);

  const maxCompleted = Math.max(...data.map(d => d.completed), 1);

  return (
    <motion.div
      className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, boxShadow: "0px 15px 25px rgba(0,0,0,0.2)" }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Weekly Activity Heatmap</h2>
      {data.length === 0 ? (
        <div className="text-gray-600 dark:text-gray-400 text-sm">No completed tasks yet</div>
      ) : (
        <div className="h-48">
          <ResponsiveContainer>
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="day" />
              <Tooltip />
              <Bar dataKey="completed">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.completed, maxCompleted)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

export default WeeklyActivityHeatmap;
