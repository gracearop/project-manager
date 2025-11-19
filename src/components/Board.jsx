// src/components/Board.jsx
import React, { useState, useContext, useMemo } from "react";
import { BoardContext } from "../context/BoardContext";
import TaskModal from "./TaskModal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { motion } from "framer-motion";

const priorityColors = {
  Low: "bg-green-400",
  Medium: "bg-yellow-400",
  High: "bg-orange-400",
  Urgent: "bg-red-500"
};

const Board = ({ board, searchFilter = "", statusFilter = "", priorityFilter = "" }) => {
  const { updateTasks, editTask } = useContext(BoardContext);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const statuses = ["To Do", "In Progress", "Done"];

  const filteredTasks = useMemo(() => {
    return board.tasks.filter((t) => {
      const matchesSearch = t.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
                            t.description?.toLowerCase().includes(searchFilter.toLowerCase());
      const matchesStatus = !statusFilter || t.status === statusFilter;
      const matchesPriority = !priorityFilter || t.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [board.tasks, searchFilter, statusFilter, priorityFilter]);

  const handleAddTask = (status) => {
    const newTask = {
      id: Date.now(),
      title: "New Task",
      description: "",
      status: status,
      dueDate: "",
      priority: "Medium",
      subtasks: []
    };
    updateTasks(board.id, [...board.tasks, newTask]);
  };

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    const task = board.tasks.find((t) => t.id.toString() === draggableId);
    if (!task) return;
    const updatedTask = { ...task, status: statuses[destination.droppableId] };
    editTask(board.id, updatedTask);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-2">{board.title}</h2>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-3 gap-3">
          {statuses.map((status, index) => (
            <Droppable droppableId={index.toString()} key={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-100 dark:bg-gray-700 p-2 rounded min-h-[200px]"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{status}</h3>
                    <button
                      onClick={() => handleAddTask(status)}
                      className="text-sm px-2 py-1 bg-blue-600 text-white rounded"
                    >
                      + Task
                    </button>
                  </div>

                  {filteredTasks
                    .filter((t) => t.status === status)
                    .map((task, i) => (
                      <Draggable key={task.id} draggableId={task.id.toString()} index={i}>
                        {(provided) => (
                          <motion.div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 mb-2 rounded shadow cursor-pointer ${priorityColors[task.priority]}`}
                            onClick={() => {
                              setSelectedTask(task);
                              setShowModal(true);
                            }}
                            whileHover={{ scale: 1.03 }}
                          >
                            <p className="font-medium">{task.title}</p>
                            <p className="text-sm opacity-70">{task.priority}</p>
                            {task.subtasks?.length > 0 && (
                              <p className="text-xs mt-1">
                                {task.subtasks.filter(s => s.done).length}/{task.subtasks.length} subtasks completed
                              </p>
                            )}
                          </motion.div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {showModal && (
        <TaskModal
          task={selectedTask}
          onSave={(updated) => {
            editTask(board.id, updated);
            setShowModal(false);
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Board;
