import React from "react";
import "./Contact.css";

const Contact = () => {
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
        ></iframe>

      {/* Form */}
      <div className="contact-form">
        <h3>LIÊN HỆ</h3>

        <div className="row">
          <input placeholder="Họ và tên*" />
          <input placeholder="Email*" />
          <input placeholder="Số điện thoại*" />
        </div>
        
        <textarea placeholder="Nội dung*"></textarea>

        <button>Gửi</button>
      </div>
    </div>
  );
};

export default Contact;
