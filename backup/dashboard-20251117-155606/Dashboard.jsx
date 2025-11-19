// src/pages/Dashboard.jsx
import React, { useContext, useState } from "react";
import { BoardContext } from "../context/BoardContext";
import { Button, TextInput } from "flowbite-react";
import Board from "../components/Board";
// import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { boards, addBoard, renameBoard, deleteBoard } = useContext(BoardContext);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [editingBoard, setEditingBoard] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");


  const handleAddBoard = () => {
    if (!newBoardTitle.trim()) return;
    addBoard(newBoardTitle);
    setNewBoardTitle("");
  };

  const handleRename = (id) => {
    renameBoard(id, editedTitle);
    setEditingBoard(null);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Project Boards
      </h1>

      <div className="flex justify-center mb-6 gap-2">
        <TextInput
          type="text"
          placeholder="Enter new board name"
          value={newBoardTitle}
          onChange={(e) => setNewBoardTitle(e.target.value)}
        />
        <Button onClick={handleAddBoard} gradientDuoTone="purpleToBlue">
          Add Board
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

        {boards.map((board) => (
            <Board key={board.id} board={board} />
          ))}
      </div>
    </div>
  );
};

export default Dashboard;


        {/* {boards.map((board) => (
          <Card key={board.id} className="relative">
            {editingBoard === board.id ? (
              <div className="flex gap-2">
                <TextInput
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
                <Button size="sm" onClick={() => handleRename(board.id)}>
                  Save
                </Button>
              </div>
            ) : (
              <h2 className="text-xl font-semibold">{board.title}</h2>
            )}

            <div className="flex justify-between mt-4">
              {editingBoard === board.id ? null : (
                <>
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingBoard(board.id);
                      setEditedTitle(board.title);
                    }}
                  >
                    Rename
                  </Button>
                  <Button
                    size="sm"
                    color="failure"
                    onClick={() => deleteBoard(board.id)}
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          </Card>
        ))} */}