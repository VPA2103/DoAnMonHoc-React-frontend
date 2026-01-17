import { useEffect, useState } from "react";
import {
  getDanhMucs,
  addDanhMuc,
  updateDanhMuc,
  deleteDanhMuc
} from "../../services/adminDanhMucService";

function QuanLiDanhMuc() {
  const [danhMucs, setDanhMucs] = useState([]);
  const [tenDanhMuc, setTenDanhMuc] = useState("");
  const [loaiDanhMuc, setLoaiDanhMuc] = useState("MON_AN"); // ✅
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ================= LOAD DATA =================
  const loadData = async () => {
  try {
    setLoading(true);
    const data = await getDanhMucs(); // ✅ data là mảng
    setDanhMucs(data);                // ✅ set trực tiếp
  } catch (err) {
    console.error("Lỗi load danh mục:", err);
    alert("Không tải được danh mục");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadData();
  }, []);

  // ================= THÊM / SỬA =================
  const submit = async () => {
    if (!tenDanhMuc.trim()) {
      alert("Tên danh mục không được để trống");
      return;
    }

    try {
      const payload = {
        ten_danh_muc: tenDanhMuc,
        loai: loaiDanhMuc
      };

      if (editId !== null) {
        await updateDanhMuc(editId, payload);
      } else {
        await addDanhMuc(payload);
      }

      setTenDanhMuc("");
      setLoaiDanhMuc("MON_AN");
      setEditId(null);
      loadData();
    } catch (err) {
      console.error("Submit lỗi:", err);
      alert(
        err?.response?.data?.message ||
        err?.message ||
        "Có lỗi xảy ra"
      );
    }
  };

  // ================= SỬA =================
  const edit = (dm) => {
    setEditId(dm.ma_danh_muc);
    setTenDanhMuc(dm.ten_danh_muc);
    setLoaiDanhMuc(dm.loai); // ✅
  };

  // ================= XÓA =================
  const remove = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa danh mục này?")) return;

    try {
      await deleteDanhMuc(id);
      loadData();
    } catch (err) {
      console.error("Xóa lỗi:", err);
      alert(
        err?.response?.data?.message ||
        "Không thể xóa"
      );
    }
  };

  // ================= RENDER =================
  return (
    <div className="container mt-4">
      <h3>ADMIN – Quản lý Danh Mục</h3>

      {/* FORM */}
      <div className="row g-2 mb-3">
        <div className="col-md-5">
          <input
            className="form-control"
            placeholder="Tên danh mục"
            value={tenDanhMuc}
            onChange={(e) => setTenDanhMuc(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            value={loaiDanhMuc}
            onChange={(e) => setLoaiDanhMuc(e.target.value)}
          >
            <option value="MON_AN">Món ăn</option>
            <option value="DIP_LE">Dịp lễ</option>
            <option value="CHE_DO">Chế độ</option>
          </select>
        </div>

        <div className="col-md-3">
          <button className="btn btn-success w-100" onClick={submit}>
            {editId !== null ? "Cập nhật" : "Thêm"}
          </button>
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Tên danh mục</th>
              <th>Loại</th>
              <th width="200">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {danhMucs.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  Chưa có danh mục
                </td>
              </tr>
            ) : (
              danhMucs.map((dm) => (
                <tr key={dm.ma_danh_muc}>
                  <td>{dm.ma_danh_muc}</td>
                  <td>{dm.ten_danh_muc}</td>
                  <td>
                    {dm.loai === "MON_AN" && "Món ăn"}
                    {dm.loai === "DIP_LE" && "Dịp lễ"}
                    {dm.loai === "CHE_DO" && "Chế độ"}
                  </td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => edit(dm)}
                    >
                      Sửa
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => remove(dm.ma_danh_muc)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default QuanLiDanhMuc;
