import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import UserAPI from "../API/UserAPI";
import { addSession } from "../Redux/Action/ActionSession";
import "./Auth.css";
import queryString from "query-string";
import CartAPI from "../API/CartAPI";

function SignIn(props) {
  const listCart = useSelector((state) => state.Cart.listCart);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorUsername, setErrorUsername] = useState(false);
  const [usernameRegex, setUsernameRegex] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [checkPush, setCheckPush] = useState(false);
  const [loginError, setLoginError] = useState("");

  const dispatch = useDispatch();

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const onSubmit = async () => {
    // Clear any previous login errors
    setLoginError("");

    if (!username) {
      setErrorUsername(true);
      return;
    } else {
      setErrorUsername(false);
    }

    if (!password) {
      setErrorPassword(true);
      return;
    } else {
      setErrorPassword(false);
    }

    // Assuming username validation is just required to check empty string
    if (username.length === 0) {
      setUsernameRegex(true);
      return;
    } else {
      setUsernameRegex(false);
    }

    try {
      // Sending login request to the API
      const response = await UserAPI.postLogin({ username, password });

      if (response.token) {
        // Successful login, store the token and role in localStorage
        localStorage.setItem("token", response.token);
        localStorage.setItem("role", response.role);

        // Optionally, store user-related data
        // Example: localStorage.setItem('user', JSON.stringify(response.user));

        // Dispatch to redux if you need to store the session
        dispatch(addSession(response.token));

        // Now proceed with the cart actions
        setCheckPush(true);
      }
    } catch (error) {
      setLoginError("Invalid username or password");
    }
  };

  // This effect handles pushing cart items to the server once login is successful
  useEffect(() => {
    if (checkPush) {
      const fetchData = async () => {
        const token = localStorage.getItem("token");
        if (token) {
          setRedirect(true);
        }
      };

      fetchData();
    }
  }, [checkPush, listCart]);

  return (
    <div className="limiter">
      <div className="container-login100">
        <div className="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-50">
          <span className="login100-form-title p-b-33">Sign In</span>

          <div className="d-flex justify-content-center pb-5">
            {usernameRegex && (
              <span className="text-danger">* Incorrect Username Format</span>
            )}
            {errorUsername && (
              <span className="text-danger">* Please Check Your Username</span>
            )}
            {errorPassword && (
              <span className="text-danger">* Please Check Your Password</span>
            )}
            {loginError && <span className="text-danger">* {loginError}</span>}
          </div>

          <div className="wrap-input100 validate-input">
            <input
              className="input100"
              type="text"
              placeholder="Username"
              value={username}
              onChange={onChangeUsername}
            />
          </div>

          <div className="wrap-input100 rs1 validate-input">
            <input
              className="input100"
              type="password"
              placeholder="Password"
              value={password}
              onChange={onChangePassword}
            />
          </div>

          <div className="container-login100-form-btn m-t-20">
            {redirect && <Redirect to={`/`} />}
            <button className="login100-form-btn" onClick={onSubmit}>
              Sign in
            </button>
          </div>

          <div className="text-center p-t-45 p-b-4">
            <span className="txt1">Create an account?</span>
            &nbsp;
            <Link to="/signup" className="txt2 hov1">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
