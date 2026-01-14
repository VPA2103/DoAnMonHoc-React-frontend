import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Header = () => {

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleUserClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.vai_tro === "admin") {
      navigate("/admin");
    } else {
      navigate("/user/videos");
    }
  };
  return (
    <>
      {/* Top header */}
      <div className="bg-dark py-2">
        <div className="container d-flex align-items-center justify-content-between">
          <div className="text-white fw-bold">logo</div>

          <div className="w-50">
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm..."
            />
          </div>

          <div className="text-white d-flex gap-3 fs-5">
            <i className="bi bi-heart"></i>
            <i className="bi bi-chat"></i>
            <i className="bi bi-bell"></i>
            <i
              className="bi bi-person cursor-pointer"
              style={{ cursor: "pointer" }}
              onClick={handleUserClick}
            ></i>

            {user && (
              <button className="btn btn-danger btn-sm" onClick={logout}>
                Đăng xuất
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="bg-light border-bottom">
        <div className="container">
          <ul className="nav">
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/">
                Trang chủ
              </Link>
            </li>
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle text-dark"
                data-bs-toggle="dropdown"
                to="#"
              >
                Blog
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="#">
                    Bài viết
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="#">
                    Chia sẻ
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/contact">
                Trang liên hệ
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark" to="#">
                Danh sách công thức
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Header;
