import { useEffect, useState } from "react";
import { getCongThucById, updateCongThuc } from "../../../services/CongThucService";
import { useNavigate, useParams } from "react-router-dom";
import { getDanhMucs } from "../../../services/CongThucService";
//them import quan li buoc nau
// import RecipeEditMenu from '../../../components/RecipeEditMenu';
function CongThucEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [danhMucs, setDanhMucs] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);



  const [form, setForm] = useState({
    ma_danh_muc: "",
    ten_cong_thuc: "",
    mo_ta: "",
    do_kho: "",
    thoi_gian_nau: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ct, dms] = await Promise.all([
          getCongThucById(id),
          getDanhMucs(),
        ]);

        setDanhMucs(dms);

        setForm({
          ma_danh_muc: ct.ma_danh_muc,
          ten_cong_thuc: ct.ten_cong_thuc,
          mo_ta: ct.mo_ta || "",
          do_kho: ct.do_kho || "",
          thoi_gian_nau: ct.thoi_gian_nau || "",
        });
        setPreview(
          ct.anh_cong_thuc
            ? `http://localhost:8000/storage/${ct.anh_cong_thuc}`
            : null
        );
      } catch (err) {
        console.error("Lỗi load công thức:", err);
        alert("Không tải được công thức");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);



  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("ten_cong_thuc", form.ten_cong_thuc);
    formData.append("ma_danh_muc", form.ma_danh_muc);
    formData.append("mo_ta", form.mo_ta);
    formData.append("do_kho", form.do_kho);
    formData.append("thoi_gian_nau", form.thoi_gian_nau);

    if (image) {
      formData.append("anh_cong_thuc", image);
    }

    try {
      await updateCongThuc(id, formData);
      alert("Cập nhật thành công");
      navigate("/user/quanlicongthuc");
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại");
    }
  };


  if (loading) {
    return <div className="text-center mt-5">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="container mt-4">
      {/* them quan li buoc nau */}
     {/* <RecipeEditMenu id={id} /> */}
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">✏️ Sửa công thức</h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">Ảnh công thức</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setImage(file);
                  setPreview(URL.createObjectURL(file));
                }}
              />
            </div>

            {preview && (
              <img
                src={preview}
                alt="preview"
                className="img-thumbnail mb-3"
                style={{ maxWidth: "200px" }}
              />
            )}

            <div className="mb-3">
              <label className="form-label">Tên công thức</label>
              <input
                type="text"
                name="ten_cong_thuc"
                className="form-control"
                value={form.ten_cong_thuc}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Danh mục</label>
              <select
                name="ma_danh_muc"
                className="form-select"
                value={form.ma_danh_muc}
                onChange={handleChange}
                required
              >

                {danhMucs.map((dm) => (
                  <option key={dm.ma_danh_muc} value={dm.ma_danh_muc}>
                    {dm.ten_danh_muc}
                  </option>
                ))}
              </select>
            </div>


            <div className="mb-3">
              <label className="form-label">Mô tả</label>
              <textarea
                name="mo_ta"
                className="form-control"
                rows="4"
                value={form.mo_ta}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Độ khó</label>
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

            <div className="mb-3">
              <label className="form-label">Thời gian nấu (phút)</label>
              <input
                type="number"
                name="thoi_gian_nau"
                className="form-control"
                value={form.thoi_gian_nau}
                onChange={handleChange}
                min="1"
              />
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-success">
                💾 Lưu
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/user/quanlicongthuc")}
              >
                ⬅ Quay lại
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CongThucEdit;
