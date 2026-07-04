import "./stylesheets/App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/User/Home.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import ProtectedRoute from "./pages/User/ProtectedRoute.js";
import AdminProtectedRoute from "./pages/Admin/AdminProtectedRoute.js";
import AdminHome from "./pages/Admin/AdminHome.js";

function App() {
  // Demo users database
  const users = [
    {
      id: 1,
      email: "john@gmail.com",
      password: "john123",
    },
    {
      id: 2,
      email: "jane@gmail.com",
      password: "jane123",
    },
  ];

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<ProtectedRoute>
              <Home />
            </ProtectedRoute>}
          />
          <Route
            path="/admin"
            element={<AdminProtectedRoute>
              <AdminHome />
            </AdminProtectedRoute>}
          />
          <Route
            path="/login"
            element={<Login users={users} />}
          />

          <Route
            path="/register"
            element={<Register />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;