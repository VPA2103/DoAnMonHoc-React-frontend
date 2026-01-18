import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminProfileView from "./AdminProfileView";
import AdminProfileForm from "./AdminProfileForm";

export default function AdminProfileContainer() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/admin/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAdmin(res.data.data);
    } catch (err) {
      console.error("Lỗi lấy profile:", err);
    } finally {
      setLoading(false);
    }
  };

  // POST update profile
  const updateProfile = async (formData) => {
    try {
      const data = new FormData();
      data.append("ten_nguoi_dung", formData.ten_nguoi_dung);
      data.append("email", formData.email);
      if (formData.anh_dai_dien) {
        data.append("anh_dai_dien", formData.anh_dai_dien);
      }

      const res = await axios.post(
        "http://127.0.0.1:8000/api/admin/profile",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setAdmin(res.data.data);
      alert("Cập nhật thành công!");
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
    }
  };

  useEffect(() => {
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
      <div className="row">
        <div className="col-md-4">
          <AdminProfileView admin={admin} />
        </div>

        <div className="col-md-8">
          <AdminProfileForm admin={admin} onSubmit={updateProfile} />
        </div>
      </div>
    </div>
  );
}
