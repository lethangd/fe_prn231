import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Icons from "react-icons/tb";
import { useDispatch } from "react-redux";
import Logo from "../../images/common/logo-dark.svg";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import CheckBox from "../../components/common/CheckBox.jsx";
import { login } from "../../store/slices/authenticationSlice";
import { Client, LoginRequest } from "../api-client";

const Login = () => {
  const dispatch = useDispatch();
  const apiClient = new Client();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isRemember, setIsRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const handleInputChange = (fieldName, newValue) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: newValue,
    }));
  };

  const handleRememberChange = (check) => {
    setIsRemember(check);
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Create login request payload
    const loginRequest = new LoginRequest({
      email: formData.email,
      password: formData.password,
    });

    try {
      // Make API call to the NSwag login endpoint
      const response = await apiClient.login(
        undefined,
        undefined,
        loginRequest
      );

      // Store the token as `tokenAdmin` in localStorage
      if (response.accessToken) {
        localStorage.setItem("tokenAdmin", response.accessToken);

        // Fetch user roles
        const roles = await apiClient.role(); // Giả sử bạn có hàm role() để lấy vai trò

        // Determine and store user role
        let userRole = null;
        if (roles.includes("Admin")) {
          userRole = "admin";
        } else if (roles.includes("Sale")) {
          userRole = "sale";
        }

        if (userRole) {
          localStorage.setItem("userRole", userRole);

          // Dispatch login action to update Redux
          dispatch(
            login({ accessToken: response.accessToken, role: userRole })
          );

          // Redirect to Dashboard if role is "sale"
          if (userRole === "sale") {
            navigate("/"); // Chuyển hướng đến trang Dashboard
          }
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(true);
      setTimeout(() => setLoginError(false), 5000); // Clear error after 5 seconds
    }
  };

  return (
    <div className="login">
      <div className="login_sidebar">
        <figure className="login_image">
          <img
            src="https://images.unsplash.com/photo-1694537745985-34eacdf76139?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
            alt=""
          />
        </figure>
      </div>
      <div className="login_form">
        <div className="login_content">
          <div className="logo">
            <img src={Logo} alt="logo" />
          </div>
          <h2 className="page_heading">Admin Login</h2>
        </div>
        <form className="form" onSubmit={handleLogin}>
          <div className="form_control">
            <Input
              type="text"
              value={formData.email}
              onChange={(value) => handleInputChange("email", value)}
              placeholder="Email or Phone Number"
              icon={<Icons.TbMail />}
              label="Email or Number"
            />
          </div>
          <div className="form_control">
            <Input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(value) => handleInputChange("password", value)}
              placeholder="Password"
              label="Password"
              onClick={handleShowPassword}
              icon={<Icons.TbEye />}
            />
          </div>
          <div className="form_control">
            <CheckBox
              id="rememberCheckbox"
              label="Remember me"
              checked={isRemember}
              onChange={handleRememberChange}
            />
          </div>
          {loginError && (
            <small className="incorrect">
              Incorrect email or password. Please try again.
            </small>
          )}
          <div className="form_control">
            <Button label="Login" type="submit" />
          </div>
        </form>
        <p className="signup_link">
          {`Don't have an account yet? `}
          <Link to="/signup">Join Metronic</Link>
        </p>
        <button className="google_signin">
          <figure>
            <img
              src="https://img.icons8.com/color/1000/google-logo.png"
              alt=""
            />
          </figure>
          <h2>Sign in with Google</h2>
        </button>
      </div>
    </div>
  );
};

export default Login;
