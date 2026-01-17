import React, { useState } from "react";
import "./Contact.css";
import axios from "axios";

const Contact = () => {
  const [form, setForm] = useState({
    ho_ten: "",
    email: "",
    tieu_de: "",
    noi_dung: "",
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:8000/api/lien-he",
        form,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      setSuccess(true);
      setMessage("Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm.");

      setForm({
        ho_ten: "",
        email: "",
        tieu_de: "",
        noi_dung: "",
      });

      // tự ẩn thông báo sau 3 giây
      setTimeout(() => {
        setMessage("");
      }, 3000);

    } catch (err) {
      console.error(err.response?.data);

      setSuccess(false);
      setMessage("Gửi liên hệ thất bại. Vui lòng thử lại!");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  return (
    <div className="contact-page">
      {/* Info */}
      <div className="contact-info">
        <div>📍 Caothang</div>
        <div>📞 1234567789</div>
        <div>✉️ ABCDEZ.vn@gmail.com</div>
      </div>

      {/* Map */}
      <iframe
        className="contact-map"
        src="https://www.google.com/maps?q=Truong%20Cao%20Thang%20Ho%20Chi%20Minh&output=embed"
        loading="lazy"
        title="map"
      ></iframe>

      {/* Form */}
      <form className="contact-form" onSubmit={handleSubmit}>
        <h3>LIÊN HỆ</h3>

        {/* THÔNG BÁO */}
        {message && (
          <div className={success ? "msg-success" : "msg-error"}>
            {message}
          </div>
        )}

        <div className="row">
          <input
            name="ho_ten"
            placeholder="Họ và tên*"
            value={form.ho_ten}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            placeholder="Email*"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            name="tieu_de"
            placeholder="Tiêu đề*"
            value={form.tieu_de}
            onChange={handleChange}
            required
          />
        </div>

        <textarea
          name="noi_dung"
          placeholder="Nội dung*"
          value={form.noi_dung}
          onChange={handleChange}
          required
        ></textarea>

        <button type="submit">Gửi</button>
      </form>
    </div>
  );
};

export default Contact;
