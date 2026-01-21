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
      const res = await axios.get(`${API_URL}/admin/nguyen-lieu`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNguyenLieuList(res.data.data || []);
    } catch {
      toast.error("Không tải được nguyên liệu");
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
        await axios.put(
          `${API_URL}/admin/nguyen-lieu/${editingId}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Cập nhật thành công");
      } else {
        await axios.post(`${API_URL}/admin/nguyen-lieu`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Thêm mới thành công");
      }
      setForm({ ten_nguyen_lieu: "", don_vi_tinh: "" });
      setEditingId(null);
      loadNguyenLieu();
    } catch {
      toast.error("Thao tác thất bại");
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
      await axios.delete(`${API_URL}/admin/nguyen-lieu/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Đã xóa");
      loadNguyenLieu();
    } catch {
      toast.error("Xóa thất bại");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Kho Nguyên Liệu (Admin)</h3>
      
      {/* FORM NHẬP LIỆU */}
      <form onSubmit={handleSubmit} className="row g-2 mb-4 bg-light p-3 rounded">
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
          <button className="btn btn-primary w-100">
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
            <th style={{width: '150px'}}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {nguyenLieuList.map((nl) => (
            <tr key={nl.ma_nguyen_lieu}>
              <td>{nl.ma_nguyen_lieu}</td>
              <td>{nl.ten_nguyen_lieu}</td>
              <td>{nl.don_vi_tinh}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(nl)}>Sửa</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(nl.ma_nguyen_lieu)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuanLyNguyenLieu;