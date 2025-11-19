// src/components/TaskModal.jsx
import React, { useState } from "react";
import { Modal, Button, Label, TextInput, Textarea, Select } from "flowbite-react";

const TaskModal = ({ task, onSave, onClose }) => {
  const [form, setForm] = useState({
    title: task.title,
    description: task.description || "",
    dueDate: task.dueDate || "",
    priority: task.priority || "Medium",
    subtasks: task.subtasks || []
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubtaskChange = (id, done) => {
    const updated = form.subtasks.map(s => s.id === id ? { ...s, done } : s);
    setForm({ ...form, subtasks: updated });
  };

  const addSubtask = () => {
    const newSubtask = { id: Date.now(), title: "New Subtask", done: false };
    setForm({ ...form, subtasks: [...form.subtasks, newSubtask] });
  };

  const removeSubtask = (id) => {
    setForm({ ...form, subtasks: form.subtasks.filter(s => s.id !== id) });
  };

  const handleSubmit = () => {
    onSave({ ...task, ...form, updatedAt: new Date().toISOString() });
  };

  return (
    <Modal show={!!task} onClose={onClose}>
      <Modal.Header>Edit Task</Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          <div>
            <Label value="Title" />
            <TextInput
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Task title"
              required
            />
          </div>

          <div>
            <Label value="Description" />
            <Textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label value="Due Date" />
            <TextInput
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label value="Priority" />
            <Select name="priority" value={form.priority} onChange={handleChange}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Urgent</option>
            </Select>
          </div>

          <div>
            <Label value="Subtasks" />
            {form.subtasks.map((s) => (
              <div key={s.id} className="flex items-center gap-2 mb-1">
                <input
                  type="checkbox"
                  checked={s.done}
                  onChange={(e) => handleSubtaskChange(s.id, e.target.checked)}
                />
                <TextInput
                  value={s.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      subtasks: form.subtasks.map(st =>
                        st.id === s.id ? { ...st, title: e.target.value } : st
                      )
                    })
                  }
                  placeholder="Subtask title"
                />
                <Button color="red" onClick={() => removeSubtask(s.id)}>X</Button>
              </div>
            ))}
            <Button size="sm" onClick={addSubtask}>+ Add Subtask</Button>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit}>Save Changes</Button>
        <Button color="gray" onClick={onClose}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TaskModal;
