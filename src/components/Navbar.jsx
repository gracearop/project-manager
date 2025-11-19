// import React from "react";
// import { Button } from "flowbite-react";
// import { AuthContext } from "./context/AuthContext";

// const Navbar = () => {
//     const { logout } = useContext(AuthContext);
//   return (
//     <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
//       <h1 className="text-2xl font-bold text-blue-600">Project Manager</h1>
//       <Button gradientDuoTone="purpleToBlue" pill>
//         New Project
//       </Button>
//     <Button onClick={logout} color="failure">
//     Logout
//   </Button>
//     </nav>
//   );
// };

// export default Navbar;


import React, { useContext } from "react";
import { Button } from "flowbite-react";
import { AuthContext } from "../context/AuthContext"; // correct relative path

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-600">Project Manager</h1>

      <div className="flex items-center gap-3">
        <Button gradientDuoTone="purpleToBlue" pill>
          New Project
        </Button>

        {/* show logout only when user is present */}
        {user ? (
          <Button onClick={logout} color="failure">
            Logout
          </Button>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;
