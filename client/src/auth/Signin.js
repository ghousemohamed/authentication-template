import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import Layout from "../core/Layout";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { authenticate, isAuth } from "./helpers";


const Signin = () => {
  const [values, setValues] = useState({
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
      const signin = await axios.post(`/signin`, values, config);

      // Save the response (user, token) localstorage/cookie
      authenticate(signin, () => {
        setValues({
          ...values,
          email: "",
          password: "",
          buttonText: "Submitted"
        });
        toast.success(`Hey ${signin.data.user.name}, Welcome Back!`);
      });
    } catch (err) {
      setValues({ ...values, buttonText: "Submit" });
      toast.error(err.response.data.error);
    }
  };
  const { email, password, buttonText } = values;
  const signinForm = () => (
    <form>
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
        <h1 className="p-5 text-center">Sign In</h1>
        {signinForm()}
      </div>
    </Layout>
  );
};

export default Signin;
