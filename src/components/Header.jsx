import React from "react";

const Header = () => {
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
            <i className="bi bi-person"></i>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="bg-light border-bottom">
        <div className="container">
          <ul className="nav">
            <li className="nav-item">
              <a className="nav-link text-dark" href="#">
                Trang chủ
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle text-dark"
                data-bs-toggle="dropdown"
                href="#"
              >
                Blog
              </a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#">Bài viết</a></li>
                <li><a className="dropdown-item" href="#">Chia sẻ</a></li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark" href="#">
                Trang liên hệ
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark" href="#">
                Danh sách công thức
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Header;
