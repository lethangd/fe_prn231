import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "./Context/AuthContext";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { token } = useContext(AuthContext); // Lấy token từ context

  return (
    <Route
      {...rest}
      render={(props) =>
        token ? ( // Nếu đã đăng nhập, render component
          <Component {...props} />
        ) : (
          // Nếu chưa đăng nhập, chuyển hướng đến trang login
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default ProtectedRoute;
