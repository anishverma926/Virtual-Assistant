import React, { useState, useContext } from 'react';
import bg from "../assets/authBg.png";
import "./SignUp.css";
import axios from "axios";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { userDataContext } from '../context/UserContext';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { setUserData } = useContext(userDataContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Use env variable (localhost in .env or Render on deployment)
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );

      setUserData(result.data);
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.error("SignIn Error:", error);
      setUserData(null);
      setLoading(false);

      const message =
        error?.response?.data?.message ||
        error?.message || // fallback to generic network error
        "Login failed. Please try again.";

      setErr(message);
    }
  };

  return (
    <div className="signup-container" style={{ backgroundImage: `url(${bg})` }}>
      <form className="signup-form" onSubmit={handleSignIn}>
        <h1 className="signup-title">
          Sign In to <span>Virtual Assistant</span>
        </h1>

        <input
          type="email"
          placeholder="Enter your Email"
          className="signup-input"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="password-input"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {!showPassword ? (
            <IoEye className="password-icon" onClick={() => setShowPassword(true)} />
          ) : (
            <IoEyeOff className="password-icon" onClick={() => setShowPassword(false)} />
          )}
        </div>

        {err?.length > 0 && <p className="error-text">* {err}</p>}

        <button className="signup-button" disabled={loading}>
          {loading ? "Loading..." : "Sign In"}
        </button>

        <p className="login-text">
          Create a new account?{" "}
          <span className="login-link" onClick={() => navigate("/signup")}>
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
