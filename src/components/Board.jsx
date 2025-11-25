// src/components/Board.jsx
import React, { useState, useContext, useMemo } from "react";
import { BoardContext } from "../context/BoardContext";
import TaskModal from "./TaskModal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { motion } from "framer-motion";

const Board = ({ board, searchFilter = "", statusFilter = "", priorityFilter = "" }) => {
  const { updateTasks, editTask, deleteTask, deleteBoard } = useContext(BoardContext);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const statuses = ["To Do", "In Progress", "Done"];

  const filteredTasks = useMemo(() => {
    return board.tasks.filter((t) => {
      const matchesSearch =
        t.title?.toLowerCase().includes(searchFilter.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchFilter.toLowerCase());
      const matchesStatus = !statusFilter || t.status === statusFilter;
      const matchesPriority = !priorityFilter || t.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [board.tasks, searchFilter, statusFilter, priorityFilter]);

  const handleAddTask = (status) => {
    const newTask = {
      id: Date.now(),
      title: "Task",
      description: "",
      status: status,
      dueDate: "",
      priority: "Medium",
      subtasks: [],
      completed: false,
      statusNormalized: status.toLowerCase()
    };
    updateTasks(board.id, [...board.tasks, newTask]);
  };

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination) return;
    const task = board.tasks.find((t) => t.id.toString() === draggableId);
    if (!task) return;
    const updatedTask = {
      ...task,
      status: statuses[destination.droppableId],
      statusNormalized: statuses[destination.droppableId].toLowerCase(),
      completed: statuses[destination.droppableId].toLowerCase() === "done"
    };
    editTask(board.id, updatedTask);
  };

  const priorityColors = {
    Low: "bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-100",
    Medium: "bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100",
    High: "bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-100",
    Urgent: "bg-red-300 text-red-900 dark:bg-red-800 dark:text-red-100"
  };

  const toggleTaskCompletion = (e, task) => {
    e.stopPropagation();
    const isNowDone = !task.completed;
    const newStatus = isNowDone ? "Done" : "To Do";
    const updatedTask = {
      ...task,
      status: newStatus,
      statusNormalized: newStatus.toLowerCase(),
      completed: isNowDone
    };
    editTask(board.id, updatedTask);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      {/* Header + Delete Board */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{board.title}</h2>
        <button
          onClick={() => {
            if (window.confirm(`Are you sure you want to delete "${board.title}"?`)) {
              deleteBoard(board.id);
            }
          }}
          className="text-red-500 text-sm hover:text-red-700 transition px-2 py-1 rounded border border-red-500 hover:bg-red-100"
        >
          Delete Board
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
          {statuses.map((status, index) => (
            <Droppable droppableId={index.toString()} key={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-100 dark:bg-gray-700 p-4 rounded min-h-[250px] flex flex-col"
                >
                  <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                    <h3 className="font-semibold text-lg">{status}</h3>
                    <button
                      onClick={() => handleAddTask(status)}
                      className="
                        text-sm sm:text-base
                        px-3 sm:px-4 py-1.5 sm:py-2
                        bg-blue-600 text-white rounded
                        hover:bg-blue-700 transition
                        active:scale-95
                      "
                    >
                      + Task
                    </button>
                  </div>

                  <div className="flex flex-col gap-6">
                    {filteredTasks
                      .filter((t) => t.status === status)
                      .map((task, i) => (
                        <Draggable key={task.id} draggableId={task.id.toString()} index={i}>
                          {(provided) => (
                            <motion.div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                              onClick={() => {
                                setSelectedTask(task);
                                setShowModal(true);
                              }}
                              className={`
                                cursor-pointer
                                bg-white dark:bg-gray-800
                                rounded-lg shadow-sm dark:shadow-md
                                p-3 flex flex-col justify-between gap-2
                                hover:bg-gray-100 dark:hover:bg-gray-700
                                transition duration-200
                              `}
                            >
                              <div className="flex flex-wrap justify-between items-start gap-2">
                                <div className="flex flex-wrap items-center gap-2">

                                  {/* Completion Tick */}
                                  <div className="flex items-center text-wrap">
                                    <button
                                      onClick={(e) => toggleTaskCompletion(e, task)}
                                      aria-label={task.completed ? "Undo completion" : "Mark as completed"}
                                      className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                    >
                                      {task.completed ? (
                                        <span className="text-gray-400 dark:text-gray-300 text-lg">↩️</span>
                                      ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                      )}
                                    </button>
                                    <p
                                      className={`text-base font-medium text-gray-700 dark:text-gray-200 break-words max-w-full ${task.completed ? "line-through opacity-60" : ""}`}
                                    >
                                      {task.title || "Task"}
                                    </p>
                                  </div>

                                  <div className="flex flex-wrap gap-1">
                                    {task.priority && (
                                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>
                                        {task.priority}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteTask(board.id, task.id);
                                  }}
                                  className="text-red-500 text-sm hover:text-red-700 transition"
                                >
                                  ✕
                                </button>
                              </div>

                              {task.subtasks?.length > 0 && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {task.subtasks.filter((s) => s.done).length}/{task.subtasks.length} subtasks done
                                </p>
                              )}
                            </motion.div>
                          )}
                        </Draggable>
                      ))}
                  </div>

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {showModal && selectedTask && (
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
