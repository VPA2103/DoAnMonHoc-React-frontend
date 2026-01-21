import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const API = "http://127.0.0.1:8000/api";

export default function QuanLyNguyenLieuUser() {
  const token = localStorage.getItem("token");

  const [congThucList, setCongThucList] = useState([]);
  const [nguyenLieuList, setNguyenLieuList] = useState([]);
  const [nguyenLieuDaThem, setNguyenLieuDaThem] = useState([]);

  const [congThucId, setCongThucId] = useState("");
  const [nguyenLieuId, setNguyenLieuId] = useState("");
  const [soLuong, setSoLuong] = useState("");

  // 🔥 STATE SỬA
  const [editingId, setEditingId] = useState(null);
  const [editingSoLuong, setEditingSoLuong] = useState("");

  /* ================= LOAD DỮ LIỆU ================= */

  // Load công thức
  useEffect(() => {
    axios
      .get(`${API}/user/cong-thuc`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCongThucList(res.data.data || []))
      .catch(() => toast.error("Không tải được công thức"));
  }, []);

  // Load nguyên liệu
  useEffect(() => {
    axios
      .get(`${API}/user/nguyen-lieu`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setNguyenLieuList(res.data.data || []))
      .catch(() => toast.error("Không tải được nguyên liệu"));
  }, []);

  // Load nguyên liệu theo công thức
  const loadNguyenLieuCongThuc = async () => {
    if (!congThucId) {
      setNguyenLieuDaThem([]);
      return;
    }

    try {
      const res = await axios.get(
        `${API}/user/cong-thuc/${congThucId}/nguyen-lieu`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNguyenLieuDaThem(res.data.data || []);
    } catch {
      toast.error("Không tải được nguyên liệu của công thức");
    }
  };

  useEffect(() => {
    loadNguyenLieuCongThuc();
  }, [congThucId]);

  /* ================= THÊM ================= */

  const handleThem = async () => {
    if (!congThucId || !nguyenLieuId || !soLuong) {
      toast.warning("Vui lòng nhập đầy đủ");
      return;
    }

    try {
      await axios.post(
        `${API}/user/cong-thuc-nguyen-lieu`,
        {
          ma_cong_thuc: Number(congThucId),
          ma_nguyen_lieu: Number(nguyenLieuId),
          so_luong: Number(soLuong),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Thêm thành công");
      setNguyenLieuId("");
      setSoLuong("");
      loadNguyenLieuCongThuc();
    } catch {
      toast.error("Thêm thất bại");
    }
  };

  /* ================= SỬA ================= */

  const handleSua = async (maNguyenLieu) => {
    try {
      await axios.put(
        `${API}/user/cong-thuc-nguyen-lieu`,
        {
          ma_cong_thuc: Number(congThucId),
          ma_nguyen_lieu: Number(maNguyenLieu),
          so_luong: Number(editingSoLuong),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Cập nhật thành công");
      setEditingId(null);
      setEditingSoLuong("");
      loadNguyenLieuCongThuc();
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  /* ================= XÓA ================= */

  const handleXoa = async (maNguyenLieu) => {
    if (!window.confirm("Xóa nguyên liệu này?")) return;

    try {
      await axios.delete(`${API}/user/cong-thuc-nguyen-lieu`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          ma_cong_thuc: Number(congThucId),
          ma_nguyen_lieu: Number(maNguyenLieu),
        },
      });

      toast.success("Đã xóa");
      loadNguyenLieuCongThuc();
    } catch {
      toast.error("Xóa thất bại");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="card p-3">
      <h5>Quản lý nguyên liệu theo công thức</h5>

      <select
        className="form-select mb-2"
        value={congThucId}
        onChange={(e) => setCongThucId(e.target.value)}
      >
        <option value="">-- Chọn công thức --</option>
        {congThucList.map((ct) => (
          <option key={ct.ma_cong_thuc} value={ct.ma_cong_thuc}>
            {ct.ten_cong_thuc}
          </option>
        ))}
      </select>

      <select
        className="form-select mb-2"
        value={nguyenLieuId}
        onChange={(e) => setNguyenLieuId(e.target.value)}
        disabled={!congThucId}
      >
        <option value="">-- Chọn nguyên liệu --</option>
        {nguyenLieuList.map((nl) => (
          <option key={nl.ma_nguyen_lieu} value={nl.ma_nguyen_lieu}>
            {nl.ten_nguyen_lieu}
          </option>
        ))}
      </select>

      <input
        type="number"
        className="form-control mb-2"
        placeholder="Số lượng"
        value={soLuong}
        onChange={(e) => setSoLuong(e.target.value)}
        min="0"
        step="0.01"
        disabled={!congThucId}
      />

      <button
        className="btn btn-success w-100 mb-3"
        onClick={handleThem}
        disabled={!congThucId}
      >
        Thêm nguyên liệu
      </button>

      <h6>Nguyên liệu đã thêm</h6>

      <table className="table table-sm">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Số lượng</th>
            <th>Đơn vị</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {nguyenLieuDaThem.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">
                Chưa có nguyên liệu
              </td>
            </tr>
          )}

          {nguyenLieuDaThem.map((nl) => (
            <tr key={nl.ma_nguyen_lieu}>
              <td>{nl.ten_nguyen_lieu}</td>

              <td>
                {editingId === nl.ma_nguyen_lieu ? (
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={editingSoLuong}
                    onChange={(e) => setEditingSoLuong(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                ) : (
                  nl.pivot.so_luong
                )}
              </td>

              <td>{nl.don_vi_tinh}</td>

              <td>
                {editingId === nl.ma_nguyen_lieu ? (
                  <>
                    <button
                      className="btn btn-sm btn-success me-1"
                      onClick={() => handleSua(nl.ma_nguyen_lieu)}
                    >
                      Lưu
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => setEditingId(null)}
                    >
                      Hủy
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-sm btn-warning me-1"
                      onClick={() => {
                        setEditingId(nl.ma_nguyen_lieu);
                        setEditingSoLuong(nl.pivot.so_luong);
                      }}
                    >
                      Sửa
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleXoa(nl.ma_nguyen_lieu)}
                    >
                      Xóa
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
