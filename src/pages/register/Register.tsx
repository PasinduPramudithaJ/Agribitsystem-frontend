import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.scss"; // Add styling in a separate CSS/SCSS file.

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    userEmail: "",
    password: "",
    phoneNumber: "",
    userRole: "", // This should match the name attribute of the select input
    location: "",
  });

  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { 
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/user/register", user);
      navigate("/login");
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <h1>Register</h1>
        <label>Full Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter your full name"
          value={user.name}
          onChange={handleChange}
          required
        />
        <label>Email</label>
        <input
          type="email"
          name="userEmail"
          placeholder="Enter your email"
          value={user.userEmail}
          onChange={handleChange}
          required
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={user.password}
          onChange={handleChange}
          required
        />
        <label>Phone Number</label>
        <input
          type="text"
          name="phoneNumber"
          placeholder="Enter your phone number"
          value={user.phoneNumber}
          onChange={handleChange}
        />
        <label>Role</label>
        <select
          name="userRole" // This matches the state key `userRole`
          value={user.userRole}
          onChange={handleChange}
          required
        >
          <option value="">Select Role</option>
          <option value="Farmer">Farmer</option>
          <option value="Buyer">Buyer</option>
          <option value="Admin">Admin</option>
        </select>
        <label>Location</label>
        <input
          type="text"
          name="location"
          placeholder="Enter your location"
          value={user.location}
          onChange={handleChange}
        />
        <button type="submit">Register</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default Register;



