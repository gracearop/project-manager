// src/components/CalendarView.jsx
import React, { useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { motion } from 'framer-motion';

const CalendarView = ({ tasks, filters = {} }) => {
  // Filter tasks including subtasks
  const upcomingTasks = useMemo(() => {
    let allTasks = [];

    tasks.forEach(task => {
      // Apply filters
      if (filters.status && task.status !== filters.status) return;
      if (filters.priority && task.priority !== filters.priority) return;
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return;

      allTasks.push(task);

      if (task.subtasks) {
        task.subtasks.forEach(sub => {
          if (filters.status && sub.status !== filters.status) return;
          if (filters.priority && sub.priority !== filters.priority) return;
          if (filters.search && !sub.title.toLowerCase().includes(filters.search.toLowerCase())) return;

          // mark subtask as separate
          allTasks.push({ ...sub, title: `${task.title} → ${sub.title}` });
        });
      }
    });

    // Sort by dueDate
    allTasks.sort((a, b) => new Date(a.dueDate || Infinity) - new Date(b.dueDate || Infinity));

    return allTasks.slice(0, 5); // show top 5 upcoming
  }, [tasks, filters]);

  return (
    <motion.div
      className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, boxShadow: "0px 15px 25px rgba(0,0,0,0.2)" }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Calendar View</h2>

      <Calendar className="bg-white dark:bg-gray-800 rounded-lg p-2 mb-4" />

      <div className="mt-4">
        <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Upcoming Tasks</h3>
        {upcomingTasks.length === 0 ? (
          <div className="text-sm text-gray-600 dark:text-gray-400">No upcoming tasks</div>
        ) : (
          upcomingTasks.map((t, idx) => (
            <motion.div
              key={idx}
              className='text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded mb-1 text-gray-800 dark:text-gray-200'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              {t.title} {t.dueDate ? `• Due: ${t.dueDate}` : ''}
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default CalendarView;
