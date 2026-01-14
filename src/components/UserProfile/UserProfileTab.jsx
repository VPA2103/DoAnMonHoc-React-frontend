// UserProfileTab.js
import { NavLink } from "react-router-dom";

export default function UserProfileTab() {
  const activeStyle =
    "nav-link bg-transparent text-white border-0 border-bottom border-white border-2 fw-bold";
  const normalStyle = "nav-link bg-transparent text-secondary border-0";

  return (
    <ul className="nav nav-tabs border-secondary mb-3 border-bottom">
      <li className="nav-item">
        <NavLink
          to="/user/videos"
          className={({ isActive }) => (isActive ? activeStyle : normalStyle)}
        >
          Bài đăng
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink
          to="/user/reposts"
          className={({ isActive }) => (isActive ? activeStyle : normalStyle)}
        >
          Chia sẻ
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink
          to="/user/favorites"
          className={({ isActive }) => (isActive ? activeStyle : normalStyle)}
        >
          Yêu thích
        </NavLink>
      </li>
    </ul>
  );
}
