import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import "../style/Login.css" // Import the CSS file for styling


export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post(
        "/admin/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem(
        "adminUser",
        JSON.stringify(res.data.user)
      );
      console.log(res.data);


      navigate("/dashboard");
      

    } catch (err) {
      alert(

        err.response?.data?.message ||
        "Login failed",
        
      
      );
    }
    
  };
  

  return (
  <div className="login-container">
    <div className="login-card">
      <h1 className="login-title">Admin Login</h1>

      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          placeholder="Admin Email"
          className="login-input"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="login-input"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  </div>
);
  
}