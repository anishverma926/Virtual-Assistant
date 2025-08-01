import React, { use, useState } from 'react';
import bg from "../assets/authBg.png";
import "./SignUp.css";
import axios from "axios"
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom"
import { useContext } from 'react';
import { userDataContext } from '../context/UserContext';


const SignUp = () => {

  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl, userData, setUserData } = useContext(userDataContext)
  const navigate = useNavigate()
  const [name, setName] = useState("");
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e) => {
    e.preventDefault()
    setErr("")
    setLoading(true)
    try {
      let result = await axios.post(`${serverUrl}/api/auth/signup`, {
        name, email, password
      }, { withCredentials: true })
      setUserData(result.data)
      setLoading(false)
      navigate("/customize")
    }
    catch (error) {
      console.log(error);
      setUserData(null)
      setLoading(false)
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed. Please try again.";

      setErr(message);

    }
  }

  return (
    <div
      className="signup-container"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form className="signup-form" onSubmit={handleSignUp}>
        <h1 className="signup-title">
          Register to <span>Virtual Assistant</span>
        </h1>
        <input
          type="text"
          placeholder="Enter your Name"
          className="signup-input"
          required
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
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
          {!showPassword && <IoEye className="password-icon"
            onClick={() => setShowPassword(true)} />}

          {showPassword && <IoEyeOff className="password-icon"
            onClick={() => setShowPassword(false)} />}
        </div>

        {err?.length > 0 && (
          <p className="error-text">
            * {err}
          </p>
        )}

        <button className="signup-button"
          disabled={loading}>
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <p className="login-text">
          Already have an account?{" "}
          <span className="login-link" onClick={() => navigate("/signin")}>
            Sign In
          </span>
        </p>


      </form>
    </div>
  );
};

export default SignUp;
