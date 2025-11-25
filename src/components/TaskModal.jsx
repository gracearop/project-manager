import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TaskModal = ({ task, onSave, onClose }) => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: task?.title || "",
    description: task?.description || "",
    dueDate: task?.dueDate || "",
    priority: task?.priority || "Medium",
    subtasks: task?.subtasks || [],
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addSubtask = () => {
    setForm({
      ...form,
      subtasks: [...form.subtasks, { id: Date.now(), title: "", done: false }],
    });
  };

  const updateSubtask = (id, value) => {
    setForm({
      ...form,
      subtasks: form.subtasks.map((s) =>
        s.id === id ? { ...s, title: value } : s
      ),
    });
  };

  const toggleSubtask = (id, done) => {
    setForm({
      ...form,
      subtasks: form.subtasks.map((s) =>
        s.id === id ? { ...s, done } : s
      ),
    });
  };

  const removeSubtask = (id) => {
    setForm({
      ...form,
      subtasks: form.subtasks.filter((s) => s.id !== id),
    });
  };

  const handleSubmit = async () => {
    setLoading(true);

    const data = {
      ...task,
      ...form,
      updatedAt: new Date().toISOString(),
    };

    await new Promise((res) => setTimeout(res, 600)); // smooth UX delay

    onSave(data);
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {task && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative z-10 w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl"
          >
            <h2 className="text-2xl font-semibold mb-4">Edit Task</h2>

            <div className="space-y-4">

              {/* Title */}
              <div>
                <label className="text-sm font-medium">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 rounded-lg border focus:ring-2 ring-blue-400 outline-none transition"
                  placeholder="Task title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full mt-1 px-3 py-2 rounded-lg border focus:ring-2 ring-blue-400 outline-none transition"
                  placeholder="Describe this task..."
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="text-sm font-medium">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 rounded-lg border focus:ring-2 ring-blue-400 outline-none transition"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="text-sm font-medium">Priority</label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 rounded-lg border focus:ring-2 ring-blue-400 outline-none transition"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
              </div>

              {/* Subtasks */}
              <div>
                <label className="text-sm font-medium">Subtasks</label>

                <div className="space-y-3 mt-2">
                  {form.subtasks.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center gap-3 bg-gray-100 p-2 rounded-lg"
                    >
                      <input
                        type="checkbox"
                        checked={s.done}
                        onChange={(e) => toggleSubtask(s.id, e.target.checked)}
                        className="accent-blue-600 w-4 h-4"
                      />

                      <input
                        type="text"
                        value={s.title}
                        onChange={(e) => updateSubtask(s.id, e.target.value)}
                        className="flex-1 px-3 py-1 rounded-md border focus:ring-2 ring-blue-300 outline-none transition"
                        placeholder="Subtask title"
                      />

                      <button
                        onClick={() => removeSubtask(s.id)}
                        className="text-red-500 text-sm hover:text-red-700 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={addSubtask}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                  >
                    + Add Subtask
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                disabled={loading}
                onClick={handleSubmit}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold 
                           hover:bg-blue-700 active:scale-95 transition flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskModal;
