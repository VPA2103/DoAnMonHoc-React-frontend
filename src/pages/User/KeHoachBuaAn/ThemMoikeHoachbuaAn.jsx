import { useState } from "react";
import { createKeHoachBuaAn } from "../../../services/KeHoachBuaAnService";

function KeHoachBuaAn() {
  const [form, setForm] = useState({
    ma_nguoi_dung: 1,
    ngay: "",
    ten_bua_an: "",
    ghi_chu: "",
    chi_tiet: [],
  });

  const [chiTiet, setChiTiet] = useState({
    ma_cong_thuc: "",
    ngay_an: "",
    bua_an: "Sang",
  });

  const handleAddChiTiet = () => {
    setForm({
      ...form,
      chi_tiet: [...form.chi_tiet, chiTiet],
    });

    setChiTiet({
      ma_cong_thuc: "",
      ngay_an: "",
      bua_an: "Sang",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createKeHoachBuaAn(form);
      alert(res.data.message);
      console.log(res.data);
    } catch (err) {
      console.error(err.response?.data);
      alert("Có lỗi xảy ra");
    }
  };

  return (
    <div>
      <h2>Thêm kế hoạch bữa ăn</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="date"
          value={form.ngay}
          onChange={(e) => setForm({ ...form, ngay: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Tên kế hoạch"
          value={form.ten_bua_an}
          onChange={(e) => setForm({ ...form, ten_bua_an: e.target.value })}
          required
        />

        <textarea
          placeholder="Ghi chú"
          value={form.ghi_chu}
          onChange={(e) => setForm({ ...form, ghi_chu: e.target.value })}
        />

        <hr />

        <h4>Thêm món ăn</h4>

        <input
          type="number"
          placeholder="Mã công thức"
          value={chiTiet.ma_cong_thuc}
          onChange={(e) =>
            setChiTiet({ ...chiTiet, ma_cong_thuc: e.target.value })
          }
        />

        <input
          type="date"
          value={chiTiet.ngay_an}
          onChange={(e) =>
            setChiTiet({ ...chiTiet, ngay_an: e.target.value })
          }
        />

        <select
          value={chiTiet.bua_an}
          onChange={(e) =>
            setChiTiet({ ...chiTiet, bua_an: e.target.value })
          }
        >
          <option value="Sang">Sáng</option>
          <option value="Trua">Trưa</option>
          <option value="Toi">Tối</option>
          <option value="Phu">Phụ</option>
        </select>

        <button type="button" onClick={handleAddChiTiet}>
          Thêm món
        </button>

        <hr />

        <button type="submit">Lưu kế hoạch</button>
      </form>
    </div>
  );
}

export default KeHoachBuaAn;
