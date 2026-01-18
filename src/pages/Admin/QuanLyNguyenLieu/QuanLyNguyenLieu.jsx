import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const API_URL = "http://127.0.0.1:8000/api";

const QuanLyNguyenLieu = () => {
  const token = localStorage.getItem("token");

  const [congThucList, setCongThucList] = useState([]);
  const [nguyenLieuList, setNguyenLieuList] = useState([]);
  const [selectedCongThuc, setSelectedCongThuc] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    ma_cong_thuc: "",
    ten_nguyen_lieu: "",
    don_vi_tinh: "",
    so_luong: "",
  });

  /* ================= LOAD CÔNG THỨC ================= */
  const loadCongThuc = async () => {
    try {
      const res = await axios.get(`${API_URL}/cong-thuc`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCongThucList(res.data.data || []);
    } catch {
      toast.error("Không tải được công thức");
    }
  };

  /* ================= LOAD NGUYÊN LIỆU ================= */
  const loadNguyenLieu = async (maCongThuc) => {
    if (!maCongThuc) {
      setNguyenLieuList([]);
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/nguyen-lieu`, {
        params: { ma_cong_thuc: maCongThuc },
        headers: { Authorization: `Bearer ${token}` },
      });

      setNguyenLieuList(res.data.data || []);
    } catch {
      toast.error("Không tải được nguyên liệu");
    }
  };

  /* ================= ĐỔI CÔNG THỨC ================= */
  useEffect(() => {
    loadNguyenLieu(selectedCongThuc);
    setForm((prev) => ({
      ...prev,
      ma_cong_thuc: selectedCongThuc,
    }));
    setEditingId(null);
  }, [selectedCongThuc]);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= CHỌN CÔNG THỨC ================= */
  const handleSelectCongThuc = (e) => {
    setSelectedCongThuc(e.target.value);
  };

  /* ================= THÊM / SỬA ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.ma_cong_thuc) {
      toast.warning("Vui lòng chọn công thức");
      return;
    }

    try {
      if (editingId) {
        await axios.put(
          `${API_URL}/nguyen-lieu/${editingId}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Cập nhật nguyên liệu thành công");
      } else {
        await axios.post(`${API_URL}/nguyen-lieu`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Thêm nguyên liệu thành công");
      }

      setForm({
        ma_cong_thuc: selectedCongThuc,
        ten_nguyen_lieu: "",
        don_vi_tinh: "",
        so_luong: "",
      });
      setEditingId(null);

      loadNguyenLieu(selectedCongThuc);
    } catch {
      toast.error("Thao tác thất bại");
    }
  };

  /* ================= SỬA ================= */
  const handleEdit = (nl) => {
    setEditingId(nl.ma_nguyen_lieu);
    setForm({
      ma_cong_thuc: selectedCongThuc,
      ten_nguyen_lieu: nl.ten_nguyen_lieu,
      don_vi_tinh: nl.don_vi_tinh,
      so_luong: nl.so_luong,
    });
  };

  /* ================= XÓA ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa nguyên liệu này?")) return;

    try {
      await axios.delete(`${API_URL}/nguyen-lieu/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Xóa nguyên liệu thành công");
      loadNguyenLieu(selectedCongThuc);
    } catch {
      toast.error("Xóa thất bại");
    }
  };

  /* ================= INIT ================= */
  useEffect(() => {
    loadCongThuc();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Quản lý nguyên liệu theo công thức</h3>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="row g-2 mb-4">
        <div className="col-md-3">
          <select
            className="form-select"
            value={selectedCongThuc}
            onChange={handleSelectCongThuc}
          >
            <option value="">-- Chọn công thức --</option>
            {congThucList.map((ct) => (
              <option key={ct.ma_cong_thuc} value={ct.ma_cong_thuc}>
                {ct.ten_cong_thuc}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <input
            type="text"
            name="ten_nguyen_lieu"
            className="form-control"
            placeholder="Tên nguyên liệu"
            value={form.ten_nguyen_lieu}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-2">
          <input
            type="text"
            name="don_vi_tinh"
            className="form-control"
            placeholder="Đơn vị"
            value={form.don_vi_tinh}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-2">
          <input
            type="number"
            name="so_luong"
            className="form-control"
            placeholder="Số lượng"
            value={form.so_luong}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-2">
          <button className="btn btn-primary w-100">
            {editingId ? "Cập nhật" : "Lưu"}
          </button>
        </div>
      </form>

      {/* TABLE */}
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Nguyên liệu</th>
            <th>Số lượng</th>
            <th>Đơn vị</th>
            <th>Tạo lúc</th>
            <th>Cập nhật</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {nguyenLieuList.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">
                Chưa có nguyên liệu
              </td>
            </tr>
          ) : (
            nguyenLieuList.map((nl) => (
              <tr key={nl.ma_nguyen_lieu}>
                <td>{nl.ma_nguyen_lieu}</td>
                <td>{nl.ten_nguyen_lieu}</td>
                <td>{nl.so_luong}</td>
                <td>{nl.don_vi_tinh}</td>
                <td>{new Date(nl.created_at).toLocaleString("vi-VN")}</td>
                <td>{new Date(nl.updated_at).toLocaleString("vi-VN")}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(nl)}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(nl.ma_nguyen_lieu)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default QuanLyNguyenLieu;
