import React, { useEffect, useState, Fragment } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../layout/Loader";

import MetaData from "../layout/MetaData";
import { login, clearErrors } from "../../actions/userActions";

const Login = () => {
  let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const { isAuthenticated, error, loading } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }

    if (error) {
      window.alert("wrong password");
      dispatch(clearErrors());
    }
  }, [dispatch, isAuthenticated, error]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form className="shadow-lg" onSubmit={submitHandler}>
          <h1 className="mb-3">Login</h1>
          <div className="form-group">
            <label htmlFor="email_field">Email</label>
            <input
              type="email"
              id="email_field"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password_field">Password</label>
            <input
              type="password"
              id="password_field"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Link to="/password/forgot" className="float-right mb-4">
            Forgot Password?
          </Link>

          <button
            id="btn_login_main"
            type="submit"
            className="btn btn-primary btn-block py-2"
          >
            LOGIN
          </button>

          <Link to="/register" className="float-right mt-3">
            New User?
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
