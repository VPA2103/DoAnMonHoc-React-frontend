import React from "react";
import { NavLink } from "react-router-dom";

export default function UserProfileTab() {
  // Style khi Tab được chọn (Active)
  // border-bottom: 2px solid white, chữ trắng
  const activeStyle =
    "nav-link bg-transparent text-white border-0 border-bottom border-2 border-white fw-semibold px-4 rounded-0";

  // Style khi Tab không được chọn (Inactive)
  // chữ xám mờ (text-white-50), không viền
  const normalStyle =
    "nav-link bg-transparent text-white-50 border-0 px-4 fw-semibold hover-text-white";

  return (
    <ul
      className="nav nav-fill mb-3 border-bottom"
      style={{ borderColor: "#2F2F2F" }} // Màu đường kẻ ngang mờ bên dưới tab
    >
      <li className="nav-item">
        <NavLink
          to="/user/profile"
          className={({ isActive }) => (isActive ? activeStyle : normalStyle)}
        >
          Videos
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink
          to="/user/reposts"
          className={({ isActive }) => (isActive ? activeStyle : normalStyle)}
        >
          Reposts
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink
          to="/user/favorites"
          className={({ isActive }) => (isActive ? activeStyle : normalStyle)}
        >
          Favorites
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink
          to="/user/following"
          className={({ isActive }) => (isActive ? activeStyle : normalStyle)}
        >
          Theo Dõi
        </NavLink>
      </li>
    </ul>
  );
}
