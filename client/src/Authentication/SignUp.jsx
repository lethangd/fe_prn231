import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { Client } from "../api-client"; // Import your NSwag-generated Client
import "./Auth.css";
import queryString from "query-string";
import MessengerAPI from "../API/MessengerAPI";

SignUp.propTypes = {};

function SignUp(props) {
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [errorEmail, setEmailError] = useState(false);
  const [emailRegex, setEmailRegex] = useState(false);
  const [errorPassword, setPasswordError] = useState(false);
  const [errorFullname, setFullnameError] = useState(false);
  const [errorPhone, setPhoneError] = useState(false);

  const [success, setSuccess] = useState(false);

  const onChangeName = (e) => {
    setFullName(e.target.value);
  };

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const onChangePhone = (e) => {
    setPhone(e.target.value);
  };

  const handlerSignUp = async (e) => {
    e.preventDefault();

    // Validation
    if (!fullname) {
      setFullnameError(true);
      return;
    } else {
      setFullnameError(false);
    }

    if (!email) {
      setEmailError(true);
      return;
    } else {
      setEmailError(false);
    }

    if (!validateEmail(email)) {
      setEmailRegex(true);
      return;
    } else {
      setEmailRegex(false);
    }

    if (!password) {
      setPasswordError(true);
      return;
    } else {
      setPasswordError(false);
    }

    if (!phone) {
      setPhoneError(true);
      return;
    } else {
      setPhoneError(false);
    }

    try {
      // Create the RegisterCommand object
      const registerCommand = {
        firstName: fullname.split(" ")[0], // Split fullname into first and last name
        lastName: fullname.split(" ")[1], // Assuming last name is after space
        email: email,
        password: password,
        rePassword: password, // You can change this logic as per your requirements
        phoneNumber: phone,
      };

      const apiClient = new Client(); // Initialize NSwag client
      await apiClient.register(registerCommand); // Call the register method

      setSuccess(true); // Set success to true after successful registration
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  // Email validation regex
  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  return (
    <div className="limiter">
      <div className="container-login100">
        <div className="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-50">
          <span className="login100-form-title p-b-33">Sign Up</span>
          <div className="d-flex justify-content-center pb-5">
            {errorFullname && (
              <span className="text-danger">
                * Please Check Your Full Name!
              </span>
            )}
            {errorEmail && (
              <span className="text-danger">* Please Check Your Email!</span>
            )}
            {emailRegex && (
              <span className="text-danger">* Incorrect Email Format</span>
            )}
            {errorPassword && (
              <span className="text-danger">* Please Check Your Password!</span>
            )}
            {errorPhone && (
              <span className="text-danger">
                * Please Check Your Phone Number!
              </span>
            )}
          </div>
          <div className="wrap-input100 validate-input">
            <input
              className="input100"
              value={fullname}
              onChange={onChangeName}
              type="text"
              placeholder="Full Name"
            />
          </div>

          <div className="wrap-input100 rs1 validate-input">
            <input
              className="input100"
              value={email}
              onChange={onChangeEmail}
              type="text"
              placeholder="Email"
            />
          </div>

          <div className="wrap-input100 rs1 validate-input">
            <input
              className="input100"
              value={password}
              onChange={onChangePassword}
              type="password"
              placeholder="Password"
            />
          </div>

          <div className="wrap-input100 rs1 validate-input">
            <input
              className="input100"
              value={phone}
              onChange={onChangePhone}
              type="text"
              placeholder="Phone"
            />
          </div>

          <div className="container-login100-form-btn m-t-20">
            {success && <Redirect to={"/signin"} />}
            <button className="login100-form-btn" onClick={handlerSignUp}>
              Sign Up
            </button>
          </div>

          <div className="text-center p-t-45 p-b-4">
            <span className="txt1">Login?</span>
            &nbsp;
            <Link to="/signin" className="txt2 hov1">
              Click
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
