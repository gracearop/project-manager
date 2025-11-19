// src/components/TaskModal.jsx
import React, { useState } from "react";
import { Modal, Button, Label, TextInput, Textarea, Select } from "flowbite-react";

const TaskModal = ({ task, onSave, onClose }) => {
  const [form, setForm] = useState({
    title: task.title,
    description: task.description || "",
    dueDate: task.dueDate || "",
    priority: task.priority || "Medium",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave({ ...task, ...form });
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
              rows={4}
              value={form.description}
              onChange={handleChange}
              placeholder="Describe this task"
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
            </Select>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={handleSubmit}>Save Changes</Button>
        <Button color="gray" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TaskModal;
