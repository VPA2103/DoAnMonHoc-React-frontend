import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div
      className="bg-dark text-white p-3"
      style={{ width: "250px", minHeight: "100vh" }}
    >
      <h5 className="text-center mb-4">ADMIN</h5>

      <ul className="nav nav-pills flex-column gap-1">
        <li className="nav-item">
          <NavLink
            to=""
            end
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? "active bg-primary" : ""}`
            }
          >
            Dashboard
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="users"
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? "active bg-primary" : ""}`
            }
          >
            Users
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="recipes"
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? "active bg-primary" : ""}`
            }
          >
            Recipes
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="categories"
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? "active bg-primary" : ""}`
            }
          >
            Categories
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
