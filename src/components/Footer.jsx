import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-4 mt-5">
      <div className="container">
        <div className="row">

          {/* Logo */}
          <div className="col-md-3">
            <h5>Logo</h5>
          </div>

          {/* Danh mục */}
          <div className="col-md-3">
            <h5>Danh mục món ăn</h5>
            <ul className="list-unstyled">
              <li>Món xào</li>
              <li>Món nướng</li>
              <li>Món chiên</li>
              <li>Món hấp</li>
            </ul>
          </div>

          {/* Theo dõi */}
          <div className="col-md-3">
            <h5>Theo dõi chúng tôi</h5>
            <div className="d-flex gap-3 fs-4">
              <i className="bi bi-facebook"></i>
              <i className="bi bi-instagram"></i>
              <i className="bi bi-youtube"></i>
            </div>
          </div>

          {/* Liên hệ */}
          <div className="col-md-3">
            <h5>Liên hệ</h5>
            <p>
              <i className="bi bi-telephone"></i> +83123456789
            </p>
            <p>
              <i className="bi bi-envelope"></i> admin@gmail.com
            </p>
            <p>
              <i className="bi bi-geo-alt"></i> Địa chỉ
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
