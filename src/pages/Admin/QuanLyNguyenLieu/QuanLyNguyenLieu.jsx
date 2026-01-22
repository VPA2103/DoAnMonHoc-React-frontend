// QuanLyNguyenLieu.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const API_URL = "http://127.0.0.1:8000/api";

const QuanLyNguyenLieu = () => {
  const token = localStorage.getItem("token");
  const [nguyenLieuList, setNguyenLieuList] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    ten_nguyen_lieu: "",
    don_vi_tinh: "",
  });

  // Load danh sách nguyên liệu
  const loadNguyenLieu = async () => {
    try {
      // <-- GỌI ĐÚNG ENDPOINT: /api/nguyen-lieu (không có /admin)
      const res = await axios.get(`${API_URL}/nguyen-lieu`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setNguyenLieuList(res.data.data || []);
    } catch (err) {
      console.error("loadNguyenLieu error:", err);
      // Nếu server trả lỗi kèm message, hiển thị nó
      const msg = err?.response?.data?.message || "Không tải được nguyên liệu";
      toast.error(msg);
    }
  };

  useEffect(() => {
    loadNguyenLieu();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // PUT vào /api/nguyen-lieu/{id}
        await axios.put(`${API_URL}/nguyen-lieu/${editingId}`, form, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        toast.success("Cập nhật thành công");
      } else {
        // POST vào /api/nguyen-lieu
        await axios.post(`${API_URL}/nguyen-lieu`, form, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        toast.success("Thêm mới thành công");
      }
      setForm({ ten_nguyen_lieu: "", don_vi_tinh: "" });
      setEditingId(null);
      loadNguyenLieu();
    } catch (err) {
      console.error("handleSubmit error:", err);
      const msg =
        err?.response?.data?.message ||
        (editingId ? "Cập nhật thất bại" : "Thêm thất bại");
      toast.error(msg);
    }
  };

  const handleEdit = (nl) => {
    setEditingId(nl.ma_nguyen_lieu);
    setForm({
      ten_nguyen_lieu: nl.ten_nguyen_lieu,
      don_vi_tinh: nl.don_vi_tinh,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa nguyên liệu này?")) return;
    try {
      // DELETE /api/nguyen-lieu/{id}
      await axios.delete(`${API_URL}/nguyen-lieu/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      toast.success("Đã xóa");
      loadNguyenLieu();
    } catch (err) {
      console.error("handleDelete error:", err);
      const msg = err?.response?.data?.message || "Xóa thất bại";
      toast.error(msg);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Kho Nguyên Liệu (Admin)</h3>

      {/* FORM NHẬP LIỆU */}
      <form
        onSubmit={handleSubmit}
        className="row g-2 mb-4 bg-light p-3 rounded"
      >
        <div className="col-md-5">
          <input
            type="text"
            name="ten_nguyen_lieu"
            className="form-control"
            placeholder="Tên nguyên liệu (Ví dụ: Thịt bò, Đường...)"
            value={form.ten_nguyen_lieu}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            name="don_vi_tinh"
            className="form-control"
            placeholder="Đơn vị (kg, gam, muỗng...)"
            value={form.don_vi_tinh}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <button className="btn btn-primary w-100" type="submit">
            {editingId ? "Cập nhật Nguyên Liệu" : "+ Thêm vào kho"}
          </button>
        </div>
      </form>

      {/* DANH SÁCH */}
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Tên Nguyên Liệu</th>
            <th>Đơn vị tính</th>
            <th style={{ width: "150px" }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {nguyenLieuList.map((nl) => (
            <tr key={nl.ma_nguyen_lieu}>
              <td>{nl.ma_nguyen_lieu}</td>
              <td>{nl.ten_nguyen_lieu}</td>
              <td>{nl.don_vi_tinh}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(nl)}
                >
                  Sửa
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(nl.ma_nguyen_lieu)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuanLyNguyenLieu;
