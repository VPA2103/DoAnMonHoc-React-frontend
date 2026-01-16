import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div
      className="bg-dark text-white p-3"
      style={{ width: "250px", minHeight: "100vh" }}
    >
      <h5 className="text-center mb-4">BẾP VIỆT 4.0</h5>

      <ul className="nav nav-pills flex-column gap-1">
        <li className="nav-item">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? "active bg-primary" : ""}`
            }
          >
            <i className="bi bi-speedometer2 me-2"></i>
            Dashboard
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? "active bg-primary" : ""}`
            }
          >
            <i className="bi bi-people me-2"></i>
            Người dùng
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/admin/recipes"
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? "active bg-primary" : ""}`
            }
          >
            <i className="bi bi-journal-text me-2"></i>
            Công thức
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/admin/categories"
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? "active bg-primary" : ""}`
            }
          >
            <i className="bi bi-tags me-2"></i>
            Danh mục
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
