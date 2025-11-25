// src/context/BoardContext.jsx
import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "./AuthContext";

export const BoardContext = createContext();

export const BoardProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [boards, setBoards] = useState([]);

  // Get the correct storage key for the current user
const getKey = useCallback(() => {
  return `${user?.id}-boards`;
}, [user?.id]);

useEffect(() => {
    if (!user) return; // Avoid errors when logged out
  const savedBoards = JSON.parse(localStorage.getItem(getKey())) || [];
  setBoards(savedBoards);
}, [getKey, user]);

useEffect(() => {
  if (!user) return;
  localStorage.setItem(getKey(), JSON.stringify(boards));
}, [boards, user, getKey]);


  /* ------- BOARD CRUD ------- */

  const addBoard = (title) => {
    const newBoard = { id: Date.now(), title, tasks: [] };
    setBoards([...boards, newBoard]);
  };

  const renameBoard = (id, newTitle) => {
    setBoards(boards.map(b => b.id === id ? { ...b, title: newTitle } : b));
  };

  // const deleteBoard = (id) => {
  //   setBoards(boards.filter(b => b.id !== id));
  // };

  /* ------- TASK CRUD ------- */

  const updateTasks = (id, tasks) => {
    setBoards(
      boards.map(b => (b.id === id ? { ...b, tasks } : b))
    );
  };

  const editTask = (boardId, updatedTask) => {
    setBoards(prev =>
      prev.map(board =>
        board.id === boardId
          ? {
              ...board,
              tasks: board.tasks.map(t =>
                t.id === updatedTask.id ? updatedTask : t
              )
            }
          : board
      )
    );
  };

  const deleteTask = (boardId, taskId) => {
    setBoards(prev =>
      prev.map(board =>
        board.id === boardId
          ? {
              ...board,
              tasks: board.tasks.filter(t => t.id !== taskId)
            }
          : board
      )
    );
  };

  // inside your BoardContext provider
const deleteBoard = (boardId) => {
  setBoards(prev => prev.filter(b => b.id !== boardId));
  // Optional: persist in localStorage if you store boards there
  localStorage.setItem("boards", JSON.stringify(boards.filter(b => b.id !== boardId)));
};


  return (
    <BoardContext.Provider
      value={{
        boards,
        addBoard,
        renameBoard,
        deleteBoard,
        updateTasks,
        editTask,
        deleteTask
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};
