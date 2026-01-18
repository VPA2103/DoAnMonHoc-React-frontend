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
            Quản lí người dùng
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
        <li className="nav-item">
          <NavLink
            to="quanlidanhmuc"
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? "active bg-primary" : ""}`
            }
          >
            Quản lí danh mục
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="quanlinguyenlieu"
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? "active bg-primary" : ""}`
            }
          >
            Quản lí nguyên liệu
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="kehoachbuaan"
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? "active bg-primary" : ""}`
            }
          >
            Kế hoạch bữa ăn
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="quanlicongthuc"
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? "active bg-primary" : ""}`
            }
          >
            Quản lí công thức
          </NavLink>
        </li>
        
      </ul>
    </div>
  );
};

export default AdminSidebar;
