import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import Layout from "../core/Layout";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { isAuth } from "./helpers";

const Signup = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    buttonText: "Submit"
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const clickSubmit = async event => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    try {
      const signup = await axios.post(`/signup`, values, config);
      setValues({
        ...values,
        name: "",
        email: "",
        password: "",
        buttonText: "Submitted"
      });
      toast.success(signup.data.msg);
    } catch (err) {
        setValues({...values, buttonText: 'Submit'});
        toast.error(err.response.data.error);
    }
  };
  const { name, email, password, buttonText } = values;
  const signupForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange("name")}
          value={name}
          type="text"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          onChange={handleChange("email")}
          value={email}
          type="email"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          onChange={handleChange("password")}
          value={password}
          type="password"
          className="form-control"
        />
      </div>

      <div>
        <button className="btn btn-primary" onClick={clickSubmit}>
          {buttonText}
        </button>
      </div>
    </form>
  );
  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <ToastContainer />
        {isAuth() ? <Redirect to='/'/> : null}
        <h1 className="p-5 text-center">Sign Up</h1>
        {signupForm()}
      </div>
    </Layout>
  );
};

export default Signup;
