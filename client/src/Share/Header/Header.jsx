import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addSession } from "../../Redux/Action/ActionSession";

import { Link } from "react-router-dom";
import LoginLink from "../../Authentication/LoginLink";
import LogoutLink from "../../Authentication/LogoutLink";
import Name from "../../Authentication/Name";

function Header(props) {
  const [active, setActive] = useState("Home");
  const dispatch = useDispatch();

  // Kiểm tra token trong localStorage, nếu có thì dispatch vào Redux
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(addSession(token)); // Lưu token vào Redux
    } else {
      // Nếu không có token, tạo token tạm thời và lưu vào localStorage và Redux
      const tempToken = "abc999";
      localStorage.setItem("token", tempToken);
      dispatch(addSession(tempToken)); // Lưu token tạm vào Redux
    }
  }, [dispatch]);

  // Lấy token từ Redux store
  const token = useSelector((state) => state.Session.token);

  const [loginUser, setLoginUser] = useState(false);
  const [nameUser, setNameUser] = useState(false);

  // Cập nhật trạng thái login khi token thay đổi
  useEffect(() => {
    if (!token) {
      setLoginUser(false);
      setNameUser(false);
    } else {
      setLoginUser(true);
      setNameUser(true);
    }
  }, [token]);

  const handlerActive = (value) => {
    setActive(value);
    console.log(value);
  };

  return (
    <div className="container px-0 px-lg-3">
      <nav className="navbar navbar-expand-lg navbar-light py-3 px-lg-0">
        <Link className="navbar-brand" to={`/`}>
          <span className="font-weight-bold text-uppercase text-dark">
            Boutique
          </span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item" onClick={() => handlerActive("Home")}>
              <Link
                className="nav-link"
                to={`/`}
                style={
                  active === "Home" ? { color: "#dcb14a" } : { color: "black" }
                }
              >
                Home
              </Link>
            </li>
            <li className="nav-item" onClick={() => handlerActive("Shop")}>
              <Link
                className="nav-link"
                to={`/shop`}
                style={
                  active === "Shop" ? { color: "#dcb14a" } : { color: "black" }
                }
              >
                Shop
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link" to={`/cart`}>
                <i className="fas fa-dolly-flatbed mr-1 text-gray"></i>
                Cart
              </Link>
            </li>
            {nameUser ? <Name /> : ""}
            {loginUser ? <LoginLink /> : <LogoutLink />}
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Header;
