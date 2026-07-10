import "./stylesheets/App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/User/Home.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import ProtectedRoute from "./pages/User/ProtectedRoute.js";
import AdminProtectedRoute from "./pages/Admin/AdminProtectedRoute.js";
import ProfileProtectedRoute from "./pages/Profile/ProfileProtectedRoute.js";
import AdminHome from "./pages/Admin/AdminHome.js";
import Profile from "./pages/Profile";

function App() {
  // Demo users database
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
            path="/profile"
            element={<ProfileProtectedRoute>
              <Profile />
            </ProfileProtectedRoute>}
          />
          <Route
            path="/admin"
            element={<AdminProtectedRoute>
              <AdminHome />
            </AdminProtectedRoute>}
          />
          <Route
            path="/login"
            element={<Login/>}
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