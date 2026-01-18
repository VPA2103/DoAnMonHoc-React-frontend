import { useState, useEffect } from "react";
import { createKeHoach } from "../../../services/KeHoachBuaAnService";
import { getAllCongThuc } from "../../../services/CongThucService";
import { Link, useNavigate } from "react-router-dom";

const ThemMoiKeHoachBuaAn = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    ngay: "",
    ghi_chu: "",
    chi_tiet: [{ bua_an: "Sang", ma_cong_thuc: "" }],
  });

  const [congThucs, setCongThucs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCongThuc = async () => {
      const data = await getAllCongThuc();
      setCongThucs(data);
      setLoading(false);
    };
    fetchCongThuc();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleChiTietChange = (index, field, value) => {
    const newChiTiet = [...form.chi_tiet];
    newChiTiet[index][field] = value;
    setForm({ ...form, chi_tiet: newChiTiet });
  };

  const addChiTiet = () => {
    setForm({
      ...form,
      chi_tiet: [...form.chi_tiet, { bua_an: "Sang", ma_cong_thuc: "" }],
    });
  };

  const removeChiTiet = (index) => {
    setForm({
      ...form,
      chi_tiet: form.chi_tiet.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.chi_tiet.some((ct) => !ct.ma_cong_thuc)) {
      alert("Vui lòng chọn đầy đủ công thức");
      return;
    }

    await createKeHoach(form);
    alert("Thêm kế hoạch thành công");
    navigate("/user/kehoachbuaan");
  };

  if (loading) {
    return <div className="text-center mt-5 spinner-border" />;
  }

  return (
    <div className="container mt-4">
      <h3 className="fw-bold mb-3">➕ Thêm kế hoạch bữa ăn</h3>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        {/* NGÀY */}
        <div className="mb-3">
          <label className="form-label fw-semibold">📅 Ngày</label>
          <input
            type="date"
            name="ngay"
            className="form-control"
            value={form.ngay}
            onChange={handleChange}
            required
          />
        </div>

        {/* GHI CHÚ */}
        <div className="mb-3">
          <label className="form-label fw-semibold">📝 Ghi chú</label>
          <textarea
            name="ghi_chu"
            className="form-control"
            rows="3"
            placeholder="Nhập ghi chú (nếu có)"
            value={form.ghi_chu}
            onChange={handleChange}
          />
        </div>

        {/* CHI TIẾT */}
        <div className="mb-3">
          <label className="form-label fw-bold d-block">🍲 Công thức theo bữa</label>

          {form.chi_tiet.map((ct, index) => (
            <div key={index} className="row align-items-end mb-2">
              <div className="col-4">
                <label className="form-label">Bữa ăn</label>
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
                <label className="form-label">Công thức</label>
                <select
                  className="form-select"
                  value={ct.ma_cong_thuc}
                  onChange={(e) =>
                    handleChiTietChange(index, "ma_cong_thuc", e.target.value)
                  }
                >
                  <option value="">-- Chọn công thức --</option>
                  {congThucs.map((ctf) => (
                    <option
                      key={ctf.ma_cong_thuc}
                      value={ctf.ma_cong_thuc}
                    >
                      {ctf.ten_cong_thuc}
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
                  ❌
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-outline-primary mt-2"
            onClick={addChiTiet}
          >
            ➕ Thêm món
          </button>
        </div>

        {/* BUTTON */}
        <div className="text-end">
          <Link to="/user/kehoachbuaan" className="btn btn-secondary me-2">
            Quay lại
          </Link>
          <button className="btn btn-success">Lưu</button>
        </div>
      </form>
    </div>
  );
};

export default ThemMoiKeHoachBuaAn;
