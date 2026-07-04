import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../stylesheets/login.css";

import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/userSlice";
import Navbar from "./Navbar";

import {
  loginUser,
  getCurrentUser,
} from "../apiCall/userApi";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  // If already logged in, go to Home
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");  
      return
    }
    

  }, [navigate]);

  const handleLogin = async () => {
    try {
      const payload = {
        userId: email,
        password: password,
      };

      // Login
      const loginResponse = await loginUser(payload);

      
      if (loginResponse.data.message === "User not found") {
        alert("User not found")
        navigate("/register")
        return
      }

      if (loginResponse.data.message == "Incorrect Password") {
        alert("Incorrect Password")
        setPassword("")
        return;
      }


      const tok =     loginResponse.data.token

      // Save JWT
      localStorage.setItem(
        "token",
        tok
      );

      // Fetch current user
      const currentUserResponse =
        await getCurrentUser();

      // Save user in Redux
      dispatch(
        setUser(
          currentUserResponse.data.userData,
      )
      );
                  setEmail("")
                  setPassword("")
      
      if(currentUserResponse.data.userData.isAdmin){navigate('/admin'); return}

      navigate("/");
    } 
    catch (error) {
      localStorage.removeItem("token")
      setPassword("")
      setEmail("")
      return
    }
  };

  return (
    <>
    <Navbar />
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button onClick={handleLogin}>
          Login
        </button>

      </div>
    </div>
    </>
  );
}

export default Login;