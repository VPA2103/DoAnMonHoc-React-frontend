import { useEffect, useState } from "react";
import { createCongThuc, getDanhMucs } from "../../../services/CongThucService";
import { useNavigate, Link } from "react-router-dom";

function CreateCongThuc() {
  const navigate = useNavigate();

  const [danhMucs, setDanhMucs] = useState([]);
  const [form, setForm] = useState({
    ten_cong_thuc: "",
    ma_danh_muc: "",
    do_kho: "De",
    thoi_gian_nau: "",
    mo_ta: "",
  });

  const [anh, setAnh] = useState(null); // 👉 ảnh

  // Load danh mục
  useEffect(() => {
    const fetchDanhMuc = async () => {
      try {
        const data = await getDanhMucs();
        setDanhMucs(data);
      } catch (err) {
        console.error("Lỗi load danh mục:", err);
      }
    };

    fetchDanhMuc();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setAnh(e.target.files[0]);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.ten_cong_thuc || !form.ma_danh_muc) {
    alert("Vui lòng nhập đầy đủ thông tin bắt buộc!");
    return;
  }

  const formData = new FormData();
  formData.append("ten_cong_thuc", form.ten_cong_thuc);
  formData.append("ma_danh_muc", Number(form.ma_danh_muc));
  formData.append("do_kho", form.do_kho);
  formData.append("mo_ta", form.mo_ta || "");

  if (form.thoi_gian_nau) {
    formData.append("thoi_gian_nau", Number(form.thoi_gian_nau));
  }

  if (anh) {
    formData.append("anh_cong_thuc", anh);
  }

  try {
    await createCongThuc(formData);
    alert("Thêm công thức thành công!");
    navigate("/user/quanlicongthuc");
  } catch (err) {
    console.error(err.response?.data || err);
    alert("Có lỗi xảy ra!");
  }
};


  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">➕ Thêm công thức mới</h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            {/* Tên công thức */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Tên công thức <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="ten_cong_thuc"
                className="form-control"
                value={form.ten_cong_thuc}
                onChange={handleChange}
              />
            </div>

            {/* Danh mục */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Danh mục <span className="text-danger">*</span>
              </label>
              <select
                name="ma_danh_muc"
                className="form-select"
                value={form.ma_danh_muc}
                onChange={handleChange}
              >
                <option value="">-- Chọn danh mục --</option>
                {danhMucs.map((dm) => (
                  <option key={dm.ma_danh_muc} value={dm.ma_danh_muc}>
                    {dm.ten_danh_muc}
                  </option>
                ))}
              </select>
            </div>

            {/* Độ khó */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Độ khó</label>
              <select
                name="do_kho"
                className="form-select"
                value={form.do_kho}
                onChange={handleChange}
              >
                <option value="De">Dễ</option>
                <option value="Trung binh">Trung bình</option>
                <option value="Kho">Khó</option>
              </select>
            </div>

            {/* Thời gian nấu */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Thời gian nấu (phút)
              </label>
              <input
                type="number"
                name="thoi_gian_nau"
                className="form-control"
                value={form.thoi_gian_nau}
                onChange={handleChange}
              />
            </div>

            {/* Ảnh công thức */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Ảnh công thức</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            {/* Mô tả */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Mô tả</label>
              <textarea
                name="mo_ta"
                className="form-control"
                rows="4"
                value={form.mo_ta}
                onChange={handleChange}
              />
            </div>

            {/* Buttons */}
            <div className="d-flex justify-content-end gap-2">
              <Link to="/user/quanlicongthuc" className="btn btn-secondary">
                ⬅ Quay lại
              </Link>
              <button type="submit" className="btn btn-success">
                💾 Lưu công thức
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateCongThuc;
