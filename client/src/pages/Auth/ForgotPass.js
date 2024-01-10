import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Layout from "../../components/Layout/Layout";

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/auth/forgot-password", {
        email,
        password,
        newPassword,
      });

      if (res && res.data.success) {
        console.log(res.data);
        toast.success(res.data && res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("NGU! Something went wrong!");
    }
  };

  return (
    <Layout title={"Forgot Password"}>
      <div className="form-container" style={{ minHeight: "90vh" }}>
        <form onSubmit={handleSubmit}>
          <h4 className="title">Forgot Password</h4>
          <div className="mb-3">
            <input
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              className="form-control"
              placeholder="Enter Your Email "
              required
            />
          </div>
          <div className="mb-3">
            <input
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              className="form-control"
              id="password"
              autoComplete="on"
              placeholder="Enter Your Password"
              required
            />
            <button type="button" className="btn" onClick={togglePassword}>
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>

          <div className="mb-3">
            <input
              name="newPassword"
              onChange={(e) => setNewPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              className="form-control"
              id="newPassword"
              autoComplete="on"
              placeholder="Enter Your Password"
              required
            />
            <button type="button" className="btn" onClick={togglePassword}>
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>

          <button type="submit" className="btn btn-primary">
            Reset
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ForgotPass;
