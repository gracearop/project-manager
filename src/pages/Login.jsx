// import React from "react";
// import { Button, TextInput, Label } from "flowbite-react";

// const Login = () => {
//   return (
//     <div className="flex justify-center items-center min-h-[80vh]">
//       <form className="bg-white p-8 rounded-2xl shadow-lg w-96">
//         <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
//           Login
//         </h2>
//         <div className="mb-4">
//           <Label htmlFor="email" value="Email" />
//           <TextInput id="email" type="email" placeholder="you@example.com" required />
//         </div>
//         <div className="mb-6">
//           <Label htmlFor="password" value="Password" />
//           <TextInput id="password" type="password" placeholder="••••••••" required />
//         </div>
//         <Button gradientDuoTone="purpleToBlue" fullSized pill>
//           Login
//         </Button>
//       </form>
//     </div>
//   );
// };

// export default Login;

// src/pages/Login.jsx
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button, Card, Label, TextInput } from "flowbite-react";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (login(email, password)) navigate("/");
    else setError("Invalid email or password");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-50">
      <Card className="w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
          Project Manager Login
        </h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="email" value="Email" />
            <TextInput
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="password" value="Password" />
            <TextInput
              id="password"
              type="password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" gradientDuoTone="cyanToBlue">
            Login
          </Button>
        </form>

        <p className="text-center text-sm mt-3">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 font-medium">
            Register
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Login;

