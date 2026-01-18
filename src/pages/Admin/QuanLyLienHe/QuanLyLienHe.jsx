import React, { useEffect, useState } from "react";
import axios from "axios";
import "./QuanLyLienHe.css";

const QuanLyLienHe = () => {
  const [dsLienHe, setDsLienHe] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:8000/api";

  // Header auth
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };
  };

  // Load danh sách liên hệ
  const loadLienHe = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("TOKEN:", token);

      if (!token) {
        setError("Bạn chưa đăng nhập admin");
        setDsLienHe([]);
        return;
      }

      const res = await axios.get(`${API_URL}/lien-he`, getAuthHeader());

      // paginate trả về { data: [] }
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];

      setDsLienHe(data);
      setError("");
    } catch (err) {
      console.error("Lỗi load liên hệ:", err.response?.data || err);

      if (err.response?.status === 401) {
        setError("Không có quyền admin hoặc token hết hạn");
      } else {
        setError("Lỗi server");
      }

      setDsLienHe([]);
    } finally {
      setLoading(false);
    }
  };

  // Xóa liên hệ
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa liên hệ này?")) return;

    try {
      await axios.delete(`${API_URL}/lien-he/${id}`, getAuthHeader());

      setDsLienHe((prev) =>
        prev.filter((lh) => lh.ma_lien_he !== id)
      );

      alert("Xóa liên hệ thành công");
    } catch (err) {
      console.error("Lỗi xóa liên hệ:", err.response?.data || err);
      alert(err.response?.data?.message || "Xóa thất bại");
    }
  };

  useEffect(() => {
    loadLienHe();
  }, []);

  if (loading) {
    return <p className="loading">Đang tải dữ liệu...</p>;
  }

  return (
    <div className="quan-ly-lien-he">
      <h2>Quản lý liên hệ</h2>

      {error && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Tiêu đề</th>
            <th>Nội dung</th>
            <th>Ngày gửi</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {dsLienHe.length > 0 ? (
            dsLienHe.map((lh, index) => (
              <tr key={lh.ma_lien_he}>
                <td>{index + 1}</td>
                <td>{lh.ho_ten}</td>
                <td>{lh.email}</td>
                <td>{lh.tieu_de}</td>
                <td className="noi-dung">{lh.noi_dung}</td>
                <td>{lh.ngay_gui}</td>
                <td>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(lh.ma_lien_he)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="empty">
                Không có liên hệ
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default QuanLyLienHe;
