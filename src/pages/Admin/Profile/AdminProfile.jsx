import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function AdminProfile() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // token đăng nhập

        const res = await axios.get(
          "http://127.0.0.1:8000/api/admin/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAdmin(res.data.data);
      } catch (error) {
        console.error("Lỗi lấy profile admin:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  if (!admin) {
    return <p className="text-danger text-center">Không tải được dữ liệu</p>;
  }

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-body">
          <div className="d-flex align-items-center mb-4">
            <img
              src={
                admin.anh_dai_dien
                  ? admin.anh_dai_dien
                  : "https://via.placeholder.com/100"
              }
              alt="Avatar"
              className="rounded-circle me-3"
              width="100"
              height="100"
            />
            <div>
              <h4 className="mb-0">{admin.ten_nguoi_dung}</h4>
              <span className="badge bg-danger">
                <i className="bi bi-shield-lock"></i> {admin.vai_tro}
              </span>
            </div>
          </div>

          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <strong>ID:</strong> {admin.ma_nguoi_dung}
            </li>
            <li className="list-group-item">
              <strong>Email:</strong> {admin.email}
            </li>
            <li className="list-group-item">
              <strong>Trạng thái:</strong>{" "}
              {admin.trang_thai === 1 ? (
                <span className="text-success">Hoạt động</span>
              ) : (
                <span className="text-danger">Bị khóa</span>
              )}
            </li>
            <li className="list-group-item">
              <strong>Ngày tạo:</strong> {admin.ngay_tao}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
