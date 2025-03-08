// Login.tsx
import React, { useState } from "react";
import "./Login.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";

const Login: React.FC = () => {
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { setCurrentUser } = useUser();

  const loginRequest = async (url: string) => {
    return axios.post(url, { userEmail, password });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const urls = [
      "http://localhost:8080/user/login",
      "https://agribitsystembackend-production.up.railway.app/user/login",
    ];

    for (const url of urls) {
      try {
        const res = await loginRequest(url);
        const userData = res.data;

        setCurrentUser(userData);
        localStorage.setItem("currentUser", JSON.stringify(userData));

        const userRole = userData.role;
        switch (userRole) {
          case "Farmer":
            navigate("/add");
            break;
          case "Buyer":
            navigate("/gigs");
            break;
          case "Admin":
            navigate("/admin");
            break;
          default:
            throw new Error("Invalid user role. Please contact support.");
        }
        return;
      } catch (err: any) {
        if (err.response) {
          setError(err.response.data.message || "Invalid credentials.");
        } else if (err.request) {
          console.warn(`Failed to connect to ${url}. Trying next...`);
        } else {
          setError("An unexpected error occurred.");
          break;
        }
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>Sign In</h1>
        <label htmlFor="email">Email</label>
        <input
          name="userEmail"
          type="email"
          placeholder="Enter your email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          name="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default Login;



