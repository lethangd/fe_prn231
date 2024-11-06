import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserAPI from "../API/UserAPI";

function Name(props) {
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Gọi API để lấy thông tin profile của người dùng
        const response = await UserAPI.getProfileData();

        // Lưu thông tin người dùng vào state
        setUserProfile(response);
      } catch (error) {
        setError("Failed to fetch user profile");
        console.error(error);
      }
    };

    fetchUserProfile();
  }, []);

  // Nếu có lỗi hoặc chưa lấy được dữ liệu
  if (error) {
    return (
      <li className="nav-item">
        <span className="nav-link text-danger">{error}</span>
      </li>
    );
  }

  // Nếu chưa có dữ liệu userProfile
  if (!userProfile) {
    return (
      <li className="nav-item">
        <span className="nav-link">Loading...</span>
      </li>
    );
  }

  return (
    <li className="nav-item dropdown">
      <a
        className="nav-link dropdown-toggle"
        style={{ cursor: "pointer" }}
        id="pagesDropdown"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <i className="fas fa-user-alt mr-1 text-gray"></i>
        {userProfile.name} {/* Hiển thị tên người dùng */}
      </a>
      <div className="dropdown-menu mt-3" aria-labelledby="pagesDropdown">
        <Link
          className="dropdown-item border-0 transition-link"
          to={"/history"}
        >
          History
        </Link>
      </div>
    </li>
  );
}

export default Name;
