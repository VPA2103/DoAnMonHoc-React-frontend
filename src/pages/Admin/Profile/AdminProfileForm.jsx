import React, {  useState } from "react";

export default function AdminProfileForm({ admin, onSubmit }) {

  const [formData, setFormData] = useState(() => ({
  ten_nguoi_dung: admin.ten_nguoi_dung,
  email: admin.email,
  anh_dai_dien: null,
}));

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="card shadow">
      <div className="card-body">
        <h5 className="mb-3">Cập nhật thông tin</h5>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Tên người dùng</label>
            <input
              type="text"
              name="ten_nguoi_dung"
              className="form-control"
              value={formData.ten_nguoi_dung}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Ảnh đại diện</label>
            <input
              type="file"
              name="anh_dai_dien"
              className="form-control"
              onChange={handleChange}
            />
          </div>

          <button className="btn btn-primary">
            <i className="bi bi-save"></i> Lưu thay đổi
          </button>
        </form>
      </div>
    </div>
  );
}
