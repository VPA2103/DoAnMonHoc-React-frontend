import React from "react";
import "./Register.css";

export default function Register() {
  return (
    <div className="register-page">
      <form className="register-form">
        <h2>Đăng ký</h2>

        <input type="text" placeholder="Họ và tên" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Mật khẩu" />
        <input type="password" placeholder="Nhập lại mật khẩu" />

        <button type="button">Đăng ký</button>

        <p className="login-link">
          Đã có tài khoản? <a href="/login">Đăng nhập</a>
        </p>
      </form>
    </div>
  );
}
