import { Outlet, NavLink } from "react-router-dom";

const UserLayout = () => {
  return (
    <div className="container py-4">
      <nav className="mb-3">
        <NavLink to="/user/videos" className="me-3">
          Videos
        </NavLink>
        <NavLink to="/user/reposts" className="me-3">
          Reposts
        </NavLink>
        <NavLink to="/user/favorites">Favorites</NavLink>
      </nav>
      <Outlet />
    </div>
  );
};

export default UserLayout;
