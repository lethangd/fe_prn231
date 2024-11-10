import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Client } from "../api-client"; // Import NSwag-generated Client

function Name() {
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("You need to log in to view your profile.");
        return;
      }

      try {
        const apiClient = new Client();

        // Call profileGET without headers
        const response = await apiClient.profileGET();

        // Set the user's profile data in state
        setUserProfile(response);
      } catch (error) {
        setError("Failed to fetch user profile.");
        console.error("Profile fetch error:", error);
      }
    };

    fetchUserProfile();
  }, []);

  if (error) {
    return (
      <li className="nav-item">
        <span className="nav-link text-danger">{error}</span>
      </li>
    );
  }

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
        {`${userProfile.firstName} ${userProfile.lastName}`}
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
