import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function AdminProfileView({ admin }) {
  return (
    <div className="card shadow">
      <div className="card-body text-center">
        <img
          src={
            admin.anh_dai_dien
              ? admin.anh_dai_dien
              : "https://via.placeholder.com/120"
          }
          alt="Avatar"
          className="rounded-circle mb-3"
          width="120"
          height="120"
        />

        <h5>{admin.ten_nguoi_dung}</h5>
        <span className="badge bg-danger mb-3">
          <i className="bi bi-shield-lock"></i> {admin.vai_tro}
        </span>

        <ul className="list-group list-group-flush text-start mt-3">
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
          
        </ul>
      </div>
    </div>
  );
}
