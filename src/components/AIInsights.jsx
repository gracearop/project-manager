// src/components/AIInsights.jsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const AIInsights = ({ boards }) => {
  const insights = useMemo(() => {
    const messages = [];

    const allTasks = boards.flatMap(b => b.tasks);
    const totalTasks = allTasks.length;
    const doneTasks = allTasks.filter(t => t.status === 'done').length;
    const remainingTasks = totalTasks - doneTasks;

    // Project progress warning
    boards.forEach(board => {
      const boardTotal = board.tasks.length;
      const boardDone = board.tasks.filter(t => t.status === 'done').length;
      if (boardTotal > 0 && boardDone / boardTotal < 0.3) {
        messages.push(`⚠️ Project "${board.title}" is falling behind (${boardDone}/${boardTotal} tasks done).`);
      }
    });

    // High-priority warnings
    const highPriorityRemaining = allTasks.filter(t => t.priority === 'high' && t.status !== 'done').length;
    if (highPriorityRemaining > 0) {
      messages.push(`🔥 ${highPriorityRemaining} high-priority tasks are still pending!`);
    }

    // Productivity insight
    const today = new Date().toISOString().slice(0,10);
    const todayDone = allTasks.filter(t => t.status === 'done' && t.dueDate === today).length;
    if (todayDone === 0 && remainingTasks > 0) {
      messages.push(`💡 No tasks completed today. Consider focusing on pending tasks.`);
    }

    if (messages.length === 0) {
      messages.push("✅ All projects are on track. Keep up the good work!");
    }

    return messages;
  }, [boards]);

  return (
    <motion.div
      className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow space-y-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">AI Insights</h2>
      <ul className="list-disc list-inside text-gray-700 dark:text-gray-200 text-sm">
        {insights.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </motion.div>
  );
};

export default AIInsights;
