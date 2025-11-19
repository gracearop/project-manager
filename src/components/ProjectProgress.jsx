// src/components/ProjectProgress.jsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const ProjectProgress = ({ boards, filters = {} }) => {
  // Compute progress including subtasks and filters
  const boardProgress = useMemo(() => {
    return boards.map(board => {
      let totalSubtasks = 0;
      let completedSubtasks = 0;

      board.tasks.forEach(task => {
        // Apply task filters
        if (filters.status && task.status !== filters.status) return;
        if (filters.priority && task.priority !== filters.priority) return;
        if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return;

        const subtasks = task.subtasks || [];
        totalSubtasks += subtasks.length + 1; // +1 for the main task
        completedSubtasks += (task.status === 'done' ? 1 : 0) + subtasks.filter(s => s.done).length;
      });

      const progress = totalSubtasks === 0 ? 0 : (completedSubtasks / totalSubtasks) * 100;

      return { id: board.id, title: board.title, progress };
    });
  }, [boards, filters]);

  return (
    <motion.div
      className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, boxShadow: "0px 15px 25px rgba(0,0,0,0.2)" }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Project Progress</h2>
      {boardProgress.map(bp => (
        <div key={bp.id} className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="font-medium text-gray-700 dark:text-gray-200">{bp.title}</span>
            <span className="text-sm text-gray-700 dark:text-gray-200">{Math.round(bp.progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <motion.div
              className="h-3 rounded-full bg-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${bp.progress}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default ProjectProgress;
