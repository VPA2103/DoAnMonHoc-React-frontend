import React, { useState } from "react";
import axios from "axios";
import "./Register.css";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    ten_nguoi_dung: "",
    email: "",
    mat_khau: "",
    mat_khau_confirmation: "",
  });
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value, // ✅ ĐÚNG
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.mat_khau !== formData.mat_khau_confirmation) {
      toast.error("Mật khẩu nhập lại không khớp");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("ten_nguoi_dung", formData.ten_nguoi_dung);
      data.append("email", formData.email);
      data.append("mat_khau", formData.mat_khau);
      data.append("mat_khau_confirmation", formData.mat_khau_confirmation);

      await axios.post("http://127.0.0.1:8000/api/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Đăng ký thành công!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="register-page">
      <ToastContainer position="top-right" autoClose={2000} />
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Đăng ký</h2>

        <input
          type="text"
          name="ten_nguoi_dung"
          placeholder="Họ và tên"
          value={formData.ten_nguoi_dung}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="mat_khau"
          placeholder="Mật khẩu"
          value={formData.mat_khau}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="mat_khau_confirmation"
          placeholder="Nhập lại mật khẩu"
          value={formData.mat_khau_confirmation}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>

        <p className="login-link">
          Đã có tài khoản? <a href="/login">Đăng nhập</a>
        </p>
      </form>
    </div>
  );
}
