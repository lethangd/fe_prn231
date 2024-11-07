import React, { useState, useEffect, useContext } from "react";
import UserAPI from "../API/UserAPI";
import { AuthContext } from "../Context/AuthContext";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState(""); // Thay email bằng username
  const [password, setPassword] = useState("");
  const { loading, error, dispatch } = useContext(AuthContext);

  const handleSubmit = async () => {
    try {
      // Gửi yêu cầu login với username và password
      const response = await UserAPI.postLogin({ username, password });

      if (response.token) {
        // Kiểm tra nếu login thành công, lưu token vào localStorage
        localStorage.setItem("tokena", response.token);

        // Dispatch action với token
        dispatch({ type: "LOGIN_SUCCESS", payload: response.token });
      } else {
        alert("Username or password is incorrect!");
      }
    } catch (error) {
      console.log("Invalid username or password");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-breadcrumb">
        <div className="row">
          <div className="login">
            <div className="heading">
              <h2>Sign in</h2>
              <form action="#">
                <div className="input-group input-group-lg">
                  <span className="input-group-addon">
                    <i className="fa fa-user"></i>
                  </span>
                  {/* Thay đổi từ email thành username */}
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Username"
                    value={username} // Bind với username
                    onChange={(e) => setUsername(e.target.value)} // Cập nhật giá trị username
                  />
                </div>

                <div className="input-group input-group-lg">
                  <span className="input-group-addon">
                    <i className="fa fa-lock"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button type="button" className="float" onClick={handleSubmit}>
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
