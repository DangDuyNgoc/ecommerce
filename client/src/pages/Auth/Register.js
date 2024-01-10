import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Layout from "../../components/Layout/Layout";

const Register = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  // form handle
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "/api/v1/auth/register",
        { name, email, password, phone }
      );
      
      if(res && res.data.success) {
        console.log(res.data);
        toast.success(res.data.message);
        navigate('/login');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("NGU! Something went wrong!");
    }
  };

  return (
    <Layout title={"Register Page"}>
      <div className="form-container" style={{ minHeight: "90vh" }}>
        <form onSubmit={handleSubmit}>
          <h4 className="title">Register Form</h4>
          <div className="mb-3">
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              name="name"
              className="form-control"
              placeholder="Enter Your Name"
              required
              autoFocus
            />
          </div>
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
              name="phone"
              onChange={(e) => setPhone(e.target.value)}
              type="text"
              className="form-control"
              placeholder="Enter Your Phone"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            REGISTER
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Register;
