import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  getKeHoachById,
  updateKeHoach,
} from "../../../services/KeHoachBuaAnService";
import { getAllCongThuc } from "../../../services/CongThucService";

const SuaKeHoachBuaAn = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [ngay, setNgay] = useState("");
  const [ghiChu, setGhiChu] = useState("");

  const [chiTiet, setChiTiet] = useState([]);
  const [congThucs, setCongThucs] = useState([]);

  // 🔹 LOAD DATA
  useEffect(() => {
    const loadData = async () => {
      try {
        const [keHoach, congThucData] = await Promise.all([
          getKeHoachById(id),
          getAllCongThuc(),
        ]);

        console.log("KE HOACH:", keHoach); // debug

        setNgay(keHoach.ngay);
        setGhiChu(keHoach.ghi_chu || "");
        setChiTiet(
          keHoach.chi_tiet.map((ct) => ({
            bua_an: ct.bua_an,
            ma_cong_thuc: ct.ma_cong_thuc,
          }))
        );

        setCongThucs(congThucData);
      } catch (err) {
        console.error(err);
        alert("Không tải được kế hoạch");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // 🔹 CHANGE CHI TIẾT
  const handleChiTietChange = (index, field, value) => {
    const newData = [...chiTiet];
    newData[index][field] = value;
    setChiTiet(newData);
  };

  const addChiTiet = () => {
    setChiTiet([...chiTiet, { bua_an: "Sang", ma_cong_thuc: "" }]);
  };

  const removeChiTiet = (index) => {
    setChiTiet(chiTiet.filter((_, i) => i !== index));
  };

  // 🔹 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (chiTiet.some((ct) => !ct.ma_cong_thuc)) {
      alert("Vui lòng chọn đầy đủ công thức");
      return;
    }

    const payload = {
      ghi_chu: ghiChu,
      chi_tiet: chiTiet,
    };

    try {
      setSaving(true);
      await updateKeHoach(id, payload);
      alert("✅ Cập nhật thành công");
      navigate("/user/kehoachbuaan");
    } catch (err) {
      console.error(err);
      alert("❌ Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-5 spinner-border" />;
  }

  return (
    <div className="container mt-4">
      <h3 className="fw-bold mb-3">✏️ Sửa kế hoạch bữa ăn</h3>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        {/* NGÀY */}
        <div className="mb-3">
          <label className="form-label">Ngày</label>
          <input type="date" className="form-control" value={ngay} disabled />
        </div>

        {/* GHI CHÚ */}
        <div className="mb-3">
          <label className="form-label">Ghi chú</label>
          <textarea
            className="form-control"
            rows={3}
            value={ghiChu}
            onChange={(e) => setGhiChu(e.target.value)}
          />
        </div>

        {/* CHI TIẾT */}
        {chiTiet.map((ct, index) => (
          <div className="row mb-2" key={index}>
            <div className="col-4">
              <select
                className="form-select"
                value={ct.bua_an}
                onChange={(e) =>
                  handleChiTietChange(index, "bua_an", e.target.value)
                }
              >
                <option value="Sang">Sáng</option>
                <option value="Trua">Trưa</option>
                <option value="Toi">Tối</option>
                <option value="Phu">Phụ</option>
              </select>
            </div>

            <div className="col-6">
              <select
                className="form-select"
                value={ct.ma_cong_thuc}
                onChange={(e) =>
                  handleChiTietChange(
                    index,
                    "ma_cong_thuc",
                    e.target.value
                  )
                }
              >
                {congThucs.map((c) => (
                  <option
                    key={c.ma_cong_thuc}
                    value={c.ma_cong_thuc}
                  >
                    {c.ten_cong_thuc}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-2">
              <button
                type="button"
                className="btn btn-danger w-100"
                onClick={() => removeChiTiet(index)}
              >
                Xóa
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-outline-primary mt-2"
          onClick={addChiTiet}
        >
          Thêm món
        </button>

        <div className="text-end mt-3">
          <Link to="/user/kehoachbuaan" className="btn btn-secondary me-2">
            Quay lại
          </Link>
          <button className="btn btn-success" disabled={saving}>
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SuaKeHoachBuaAn;
