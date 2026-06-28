import { useState } from "react";
import { Link } from "react-router-dom";
import "../stylesheets/login.css";

function Login({ users }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [userExists, setUserExists] = useState(true);

  const handleLogin = () => {
    // Check if email exists
    const user = users.find(
      (user) => user.email === email
    );

    if (!user) {
      setMessage("User does not exist.");
      setUserExists(false);
      return;
    }

    // Check password
    if (user.password !== password) {
      setMessage("Incorrect password.");
      setUserExists(true);
      return;
    }

    setMessage("Login Successful!");
    setUserExists(true);
  };

  return (
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

        <p>{message}</p>

        {!userExists && (
          <p>
            User not found?{" "}
            <Link to="/register">
              Register Here
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;