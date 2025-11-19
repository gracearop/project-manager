// import React from "react";

// const Board = () => {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//       {["To Do", "In Progress", "Done"].map((title) => (
//         <div
//           key={title}
//           className="bg-white rounded-2xl shadow p-4 border-t-4 border-blue-500"
//         >
//           <h3 className="text-lg font-semibold mb-3 text-gray-700">{title}</h3>
//           <div className="min-h-[150px] text-gray-400 text-center p-4 border border-dashed rounded-lg">
//             No tasks yet
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Board;
// src/components/Board.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "flowbite-react";

const Board = ({ board }) => {
  const navigate = useNavigate();
  return (
    <Card
      onClick={() => navigate(`/board/${board.id}`)}
      className="cursor-pointer hover:shadow-lg transition"
    >
      <h2 className="text-xl font-semibold">{board.title}</h2>
      <p className="text-gray-500">{board.tasks.length} tasks</p>
    </Card>
  );
};

export default Board;
