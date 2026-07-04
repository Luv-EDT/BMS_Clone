import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../stylesheets/login.css";
import { registerUser } from "../apiCall/userApi";
import { message } from "antd"
import { getCurrentUser } from "../apiCall/userApi";
import { setUser } from "../store/userSlice";
import { useDispatch } from "react-redux";
import Navbar from "./Navbar";


function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // If already logged in, go to Home
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
      return;
    }
  }, [navigate]);

  const handleRegister = async () => {
    try {
      const payload = {
        userId: email,
        password: password,
        name:name
      };

      const registerResponse = await registerUser(payload);

      if (registerResponse.data.message === "User already exists") {
        message.warning("User already exists");
        navigate("/login");
        return;
      }

      if (registerResponse.data.message === "Invalid Email") {
        message.error("Invalid Email");
        setEmail("");
        setPassword("");
        return;
      }

      if (registerResponse.data.message === "Password must contain at least 6 characters and one number.") {
        message.error("Password must be at least 6 characters and contain one number.");
        setPassword("");
        return;
      }
              
        const tok =  registerResponse.data.token 

              
        
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
        setUser(currentUserResponse.data.userData,
        )
      );
                  setEmail("")
                  setPassword("")
                  setName("")
        if(currentUserResponse.data.userData.isAdmin){navigate('/admin'); return}

        navigate("/");
        message.success("Registered successfully!");
        return;
      }

     catch (error) {
      const serverMessage = error.response?.data?.message;
      message.error(serverMessage || "Registration failed. Please try again.");
      setEmail("");
      setPassword("");
      return
    }
  };

  return (
    <>
    <Navbar />
        <div className="login-container">
      <div className="login-card">
        <h2>Register</h2>

          <input
          type="text"
          placeholder="Enter Your Full Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleRegister}>
          Register
        </button>

        <p>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ cursor: "pointer", color: "blue" }}
          >
        Login
          </span>
        </p>

      </div>
    </div>
    
    </>

  );
}

export default Register;