import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [auth, setAuth] = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/api/v1/auth/login", { email, password });

        if (res && res.data.success) {
            console.log(res.data);
            toast.success(res.data && res.data.message);
            setAuth({
                ...auth,
                user: res.data.user,
                token: res.data.token
            });
            console.log(res.data.user.email);
            localStorage.setItem("auth", JSON.stringify(res.data));
            navigate( location.state ||"/");
        } else {
            toast.error(res.data.message);
        }
        
        if(res && res.data.user.email === undefined) {
            toast.error("Invalid Email");
        }

        } catch (error) {
            console.log(error);
            toast.error("NGU! Something went wrong!");
        }
    };

  return (
    <Layout title={"Login Page"}>
      <div className="form-container" style={{ minHeight: "90vh" }}>
            <form onSubmit={handleSubmit}>
                <h4 className="title">kREGISTER FORM</h4>
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

                <button type="submit" className="btn btn-primary">
                    Login
                </button>

                <button type="submit" className="btn btn-primary"
                    onClick={() => { navigate('/forgot-password') }}
                >
                Forgot Password
            </button>
            </form>
        </div>
    </Layout>
  );
};

export default Login;
