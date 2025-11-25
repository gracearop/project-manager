// src/components/BoardComparison.jsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const BoardComparison = ({ boards }) => {
  const boardStats = useMemo(() => {
    return boards.map(board => {
      const total = board.tasks.length;
      const done = board.tasks.filter(
        t => t.completed || t.statusNormalized === 'done'
      ).length; // robust completion check
      const percent = total === 0 ? 0 : Math.round((done / total) * 100);
      return { id: board.id, title: board.title, total, done, percent };
    });
  }, [boards]);

  return (
    <motion.div
      className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow overflow-x-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, boxShadow: "0px 15px 25px rgba(0,0,0,0.15)" }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Board Comparison</h2>
      {boardStats.length === 0 ? (
        <div className="text-gray-600 dark:text-gray-400 text-sm">No boards available</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {boardStats.map(board => (
            <div key={board.id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
              <h3 className="font-medium mb-2 text-gray-800 dark:text-gray-200">{board.title}</h3>
              <div className="flex justify-between mb-1 text-sm text-gray-700 dark:text-gray-300">
                <span>Completed</span>
                <span>{board.done}/{board.total}</span>
              </div>
              <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-3 mb-2">
                <div
                  className={`h-3 rounded-full bg-green-500 transition-all duration-500`}
                  style={{ width: `${board.percent}%` }}
                />
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">{board.percent}% completed</div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default BoardComparison;
