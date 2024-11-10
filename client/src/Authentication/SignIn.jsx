import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { addSession } from "../Redux/Action/ActionSession";
import "./Auth.css";
import { Client } from "../api-client";

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorUsername, setErrorUsername] = useState(false);
  const [usernameRegex, setUsernameRegex] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const apiClient = useRef(new Client()).current;

  const onChangeUsername = (e) => setUsername(e.target.value);
  const onChangePassword = (e) => setPassword(e.target.value);

  const onSubmit = useCallback(async () => {
    setLoginError("");

    // Validate fields
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

    if (username.length === 0) {
      setUsernameRegex(true);
      return;
    } else {
      setUsernameRegex(false);
    }

    try {
      setLoading(true);

      // Login request body
      const loginRequest = {
        email: username,
        password: password,
        twoFactorCode: "",
        twoFactorRecoveryCode: "",
      };

      // API call to login
      const response = await apiClient.login(
        undefined,
        undefined,
        loginRequest
      );

      if (response.accessToken) {
        localStorage.setItem("tokenType", response.tokenType);
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);

        dispatch(addSession(response.accessToken));
        setRedirect(true);
      } else {
        setLoginError("Invalid login credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(
        error.response?.data?.message || "Invalid username or password."
      );
    } finally {
      setLoading(false);
    }
  }, [username, password, apiClient, dispatch]);

  useEffect(() => {
    if (redirect) {
      // Any additional side-effects when redirecting
    }
  }, [redirect]);

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
            {redirect && <Redirect to="/" />}
            <button
              className="login100-form-btn"
              onClick={onSubmit}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
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
