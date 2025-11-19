// BoardContext.jsx
// src/context/BoardContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { getFromStorage, saveToStorage } from "../utils/storage";

export const BoardContext = createContext();

export const BoardProvider = ({ children }) => {
  const [boards, setBoards] = useState([]);

  // Load boards from localStorage when app starts
  useEffect(() => {
    const storedBoards = getFromStorage("boards");
    if (storedBoards) setBoards(storedBoards);
  }, []);

  // Save boards whenever they change
  useEffect(() => {
    saveToStorage("boards", boards);
  }, [boards]);

  // Create new board
  const addBoard = (title) => {
    const newBoard = { id: Date.now(), title, tasks: [] };
    setBoards([...boards, newBoard]);
  };

  // Rename board
  const renameBoard = (id, newTitle) => {
    setBoards(
      boards.map((b) => (b.id === id ? { ...b, title: newTitle } : b))
    );
  };

  // Delete board
  const deleteBoard = (id) => {
    setBoards(boards.filter((b) => b.id !== id));
        };
        
        // Inside BoardProvider (after deleteBoard)
        const updateTasks = (id, tasks) => {
        setBoards(
            boards.map((b) => (b.id === id ? { ...b, tasks } : b))
        );
        };


        // Inside BoardProvider
    const editTask = (boardId, updatedTask) => {
      setBoards((prev) =>
        prev.map((board) =>
          board.id === boardId
            ? {
                ...board,
                tasks: board.tasks.map((t) =>
                  t.id === updatedTask.id ? updatedTask : t
                ),
              }
            : board
        )
      );
    };

    const deleteTask = (boardId, taskId) => {
      setBoards((prev) =>
        prev.map((board) =>
          board.id === boardId
            ? { ...board, tasks: board.tasks.filter((t) => t.id !== taskId) }
            : board
        )
      );
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
        deleteTask,
      }}
    >
      {children}
    </BoardContext.Provider>


  );
};

