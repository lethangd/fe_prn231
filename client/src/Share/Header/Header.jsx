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
    const token = localStorage.getItem("accessToken");
    if (token) {
      dispatch(addSession(token)); // Lưu token vào Redux
    } else {
      // Nếu không có token, tạo token tạm thời và lưu vào localStorage và Redux
      const tempToken =
        "CfDJ8G4g0lugToNBrkRsP71wZsrAWdGuAQ4Iyeef4WiKXEXPoxF1vC8VTu90jb3Qek560qgUNyuuZB0_rMuB44CrxDTE_eBe6dd5BOu_KbQ-O7X4bArTtUb4AadoyAnHvO2oUe6jEx6XdCz5ba7YwRuqjicvw6g9Fj6_LkQj-AQMwIvvb8-JhAt92xJKGER7h5H9WEZmzmSp0oVlQ2cQbG1aL1XmFV4qzgX2f8wFk6uCsvQX81s_wn_50IZQwd2Ay-ifHoFOUvt5kW_8p6VjlrnJMxSYnKqFCPP_FLdQu-vSKfvOGaE51T0owFHxjVIbj3IZ5GY8fQxKaln-pIFysGgvYSsPevEIn8E3QPkb8340Bc_MFSBGbqpDyM-LW-OnL_6KXJjK2kv0UAO5RB6t0G-_JpCYyOe6Z35OdDIIFay-ekPBqIuUVImfbJOkCYEQ3I3ArMf4s_FsOjcnE8EU-idp3xC7EbnEOBuP9J9YoNJk1dtBrJICHgEbkh3LrUqbyE_xaNUE1kQ-eCWRYwkr9BaeVyIOnef9xSY5ctW_UvhsPJFJu-ZTmcA7ntY184YGAB7RaWFG5KGf9-AOM6Jg8IUd3VnMZq6MGRfFXX_xfwbrXoM7V1IZt_ohFFP_qYG6TNMD5kCAuOwhASiYnw8GYbRpJK3bQD1dCULO0Q4YTiPsywyKXrGT55LuFgCeWhqKuk_4NW8JF9xtmbMGtxrn43iqAtE";
      localStorage.setItem("accessToken", tempToken);
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
