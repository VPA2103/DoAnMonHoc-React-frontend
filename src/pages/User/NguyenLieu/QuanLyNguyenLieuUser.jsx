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

  /* ================= LOAD DỮ LIỆU ================= */

  // Load công thức của user
  useEffect(() => {
    axios
      .get(`${API}/user/cong-thuc`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCongThucList(res.data.data || []);
      })
      .catch(() => {
        toast.error("Không tải được danh sách công thức");
      });
  }, []);

  // Load nguyên liệu (admin tạo)
  useEffect(() => {
    axios
      .get(`${API}/user/nguyen-lieu`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setNguyenLieuList(res.data.data || []);
      })
      .catch(() => {
        toast.error("Không tải được danh sách nguyên liệu");
      });
  }, []);

  // 🔥 Load nguyên liệu theo công thức
  const loadNguyenLieuCongThuc = async () => {
    if (!congThucId) {
      setNguyenLieuDaThem([]);
      return;
    }

    try {
      const res = await axios.get(
        `${API}/user/cong-thuc/${congThucId}/nguyen-lieu`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNguyenLieuDaThem(res.data.data || []);
    } catch (err) {
      toast.error("Không tải được nguyên liệu của công thức");
    }
  };

  // Khi đổi công thức → load lại nguyên liệu
  useEffect(() => {
    loadNguyenLieuCongThuc();
  }, [congThucId]);

  /* ================= THÊM NGUYÊN LIỆU ================= */

  const handleThem = async () => {
    if (!congThucId) {
      toast.warning("Vui lòng chọn công thức");
      return;
    }

    if (!nguyenLieuId || !soLuong) {
      toast.warning("Vui lòng chọn nguyên liệu và nhập số lượng");
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
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      toast.success("Thêm nguyên liệu thành công");

      // 🔥 LOAD LẠI NGAY
      loadNguyenLieuCongThuc();

      setNguyenLieuId("");
      setSoLuong("");
    } catch (err) {
      console.error("LỖI:", err.response?.data);
      toast.error("Thêm nguyên liệu thất bại");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="card p-3">
      <h5 className="mb-3">Quản lý nguyên liệu theo công thức</h5>

      {/* CHỌN CÔNG THỨC */}
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

      {/* CHỌN NGUYÊN LIỆU */}
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

      {/* NHẬP SỐ LƯỢNG */}
      <input
        type="number"
        className="form-control mb-3"
        placeholder="Số lượng"
        value={soLuong}
        onChange={(e) => setSoLuong(e.target.value)}
        disabled={!congThucId}
        min="0"
        step="0.01"
      />

      <button
        className="btn btn-success w-100 mb-3"
        onClick={handleThem}
        disabled={!congThucId}
      >
        Thêm nguyên liệu
      </button>

      {/* ===== DANH SÁCH ĐÃ THÊM ===== */}
      <h6>Nguyên liệu đã thêm</h6>

      <table className="table table-sm">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Số lượng</th>
            <th>Đơn vị</th>
          </tr>
        </thead>
        <tbody>
          {nguyenLieuDaThem.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center">
                Chưa có nguyên liệu
              </td>
            </tr>
          )}

          {nguyenLieuDaThem.map((nl) => (
            <tr key={nl.ma_nguyen_lieu}>
              <td>{nl.ten_nguyen_lieu}</td>
              <td>{nl.pivot.so_luong}</td>
              <td>{nl.don_vi_tinh}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
