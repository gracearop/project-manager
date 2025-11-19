// src/pages/BoardPage.jsx
import React, { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BoardContext } from "../context/BoardContext";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button, Card, TextInput, Select } from "flowbite-react";
import TaskModal from "../components/TaskModal";

const columns = ["To Do", "In Progress", "Done"];

const BoardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { boards, updateTasks, editTask, deleteTask } = useContext(BoardContext);
  const board = boards.find((b) => b.id === Number(id));

  const [selectedTask, setSelectedTask] = useState(null);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterColumn, setFilterColumn] = useState("All");

  const handleAddTask = (column) => {
    const title = prompt("Enter task title:");
    if (!title) return;
    const newTask = { id: Date.now(), title, column, priority: "Medium" };
    updateTasks(board.id, [...board.tasks, newTask]);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleSaveTask = (updatedTask) => {
    editTask(board.id, updatedTask);
    setSelectedTask(null);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(board.id, taskId);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const tasks = Array.from(board.tasks);
    const [moved] = tasks.splice(source.index, 1);
    moved.column = destination.droppableId;
    tasks.splice(destination.index, 0, moved);

    updateTasks(board.id, tasks);
  };

  if (!board) {
    return (
      <div className="p-6 text-center">
        <p>Board not found.</p>
        <Button onClick={() => navigate("/")}>Go Back</Button>
      </div>
    );
  }

  // Filter logic
  const filteredTasks = board.tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesPriority =
      filterPriority === "All" || t.priority === filterPriority;
    const matchesColumn =
      filterColumn === "All" || t.column === filterColumn;
    return matchesSearch && matchesPriority && matchesColumn;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
        <h1 className="text-3xl font-bold text-blue-700">{board.title}</h1>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/")}>Back to Dashboard</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <TextInput
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3"
        />
        <Select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="w-full md:w-1/4"
        >
          <option>All</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </Select>
        <Select
          value={filterColumn}
          onChange={(e) => setFilterColumn(e.target.value)}
          className="w-full md:w-1/4"
        >
          <option>All</option>
          {columns.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </Select>
      </div>

      {/* Task Columns */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map((col) => (
            <Droppable droppableId={col} key={col}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-white rounded-2xl shadow p-4 min-h-[60vh]"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold text-lg">{col}</h2>
                    <Button size="xs" onClick={() => handleAddTask(col)}>
                      + Task
                    </Button>
                  </div>

                  {filteredTasks
                    .filter((t) => t.column === col)
                    .map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => handleTaskClick(task)}
                            className={`mb-2 shadow-sm cursor-pointer hover:shadow-md ${
                              task.priority === "High"
                                ? "border-red-500 border"
                                : task.priority === "Medium"
                                ? "border-yellow-400 border"
                                : "border-gray-200"
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <p className="font-medium">{task.title}</p>
                              <Button
                                size="xs"
                                color="failure"
                                onClick={(e) => {
                                  e.stopPropagation(); // prevent opening modal
                                  handleDeleteTask(task.id);
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                            {task.dueDate && (
                              <p className="text-xs text-gray-500">
                                Due: {task.dueDate}
                              </p>
                            )}
                          </Card>
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

      {/* Modal for editing */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onSave={handleSaveTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
};

export default BoardPage;
