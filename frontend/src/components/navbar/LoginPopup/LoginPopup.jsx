import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../../assets/assets";
import { StoreContext } from "../../../Context/StoreContext";
import axios from "axios";

const LoginPopup = ({ setShowLogin }) => {
  const [currstate, setcurrstate] = useState("signup");
  const [data, setdata] = useState({ name: "", email: "", password: "" });
  const { serverURL, setToken } = useContext(StoreContext);

  const onchangehandler = (e) => {
    const { name, value } = e.target;
    setdata((prev) => ({ ...prev, [name]: value }));
  };

  const onlogin = async (e) => {
    e.preventDefault();
    let newUrl =
      serverURL +
      (currstate === "login" ? "/api/user/login" : "/api/user/register");
    try {
      const response = await axios.post(newUrl, data);
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setShowLogin(false);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="login-popup">
      <form className="login-popup-container" onSubmit={onlogin}>
        <div className="login-popup-title">
          <h2>{currstate}</h2>
          <img
            src={assets.cross_icon}
            onClick={() => setShowLogin(false)}
            alt="Close"
          />
        </div>
        <div className="login-popup-inputs">
          {currstate === "signup" && (
            <input
              type="text"
              placeholder="Enter Your Name"
              required
              name="name"
              onChange={onchangehandler}
              value={data.name}
            />
          )}
          <input
            type="email"
            placeholder="Enter Your Email"
            required
            name="email"
            onChange={onchangehandler}
            value={data.email}
          />
          <input
            type="password"
            placeholder="Enter Password"
            required
            name="password"
            onChange={onchangehandler}
            value={data.password}
          />
        </div>
        <button type="submit">
          {currstate === "signup" ? "Create Account" : "Login"}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>Agree to Terms & Conditions!!</p>
        </div>
        {currstate === "login" ? (
          <p>
            Create a new Account?{" "}
            <span onClick={() => setcurrstate("signup")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an Account?{" "}
            <span onClick={() => setcurrstate("login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
