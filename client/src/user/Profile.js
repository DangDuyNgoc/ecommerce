import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/auth";

import Layout from "./../components/Layout/Layout";
import UserMenu from "../components/Layout/UserMenu";
import toast from "react-hot-toast";

const Profile = () => {
  const [auth, setAuth] = useAuth();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // form handle
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        "/api/v1/auth/profile",
        { name, email, password, phone }
      );
      if(data?.error) {
        toast.error(data?.error);
      } else {
        setAuth({ ...auth, user: data?.updateUser });
        let local = localStorage.getItem('auth');
        local = JSON.parse(local);
        local.user = data.updateUser;
        localStorage.setItem('auth', JSON.stringify(local));
        toast.success('Update Profile SuccessFully');
      }
    } catch (error) {
      console.log(error);
      toast.error("NGU! Something went wrong!");
    }
  };

  // get user data 
  useEffect(() => {
    const { email, name, phone } = auth?.user;
    setName(name);
    setEmail(email);
    setPhone(phone);
  }, [auth?.user]);

  return (
    <Layout title={'Your Profile'}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
          <div className="form-container" style={{ minHeight: "90vh" }}>
          <form onSubmit={handleSubmit}>
            <h4 className="title">Update Profile</h4>
            <div className="mb-3">
              <input
                type="text"
                value={name}
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
                value={email}
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
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="text"
                className="form-control"
                placeholder="Enter Your Phone"
                required
              />
            </div>
            <div className="mb-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Enter Your Password"
            />
          </div>
            <button type="submit" className="btn btn-primary">
              Update
            </button>
          </form>
        </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
