import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ThemSuaBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tieuDe, setTieuDe] = useState("");
  const [noiDung, setNoiDung] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // 🔥 preview ảnh

  /* ================= LOAD BLOG (KHI SỬA) ================= */
  useEffect(() => {
    if (!id) return;

    axios
      .get(`http://localhost:8000/api/blogs/${id}`)
      .then((res) => {
        setTieuDe(res.data.tieu_de);
        setNoiDung(res.data.noi_dung);

        // ✅ Ảnh cũ từ backend
        if (res.data.hinh_anh_url) {
          setImagePreview(res.data.hinh_anh_url);
        }
      })
      .catch(() => alert("Không tải được blog"));
  }, [id]);

  /* ================= CHỌN ẢNH ================= */
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImageFile(file);

    // ✅ Preview ảnh mới
    setImagePreview(URL.createObjectURL(file));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Chưa đăng nhập");
      return;
    }

    const formData = new FormData();
    formData.append("tieu_de", tieuDe);
    formData.append("noi_dung", noiDung);

    // ⚠️ CHỈ GỬI ẢNH KHI CÓ CHỌN
    if (imageFile) {
      formData.append("hinh_anh", imageFile);
    }

    try {
      if (id) {
        // UPDATE
        formData.append("_method", "PUT");

        await axios.post(
          `http://localhost:8000/api/blogs/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // CREATE
        await axios.post(
          "http://localhost:8000/api/blogs",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      alert("Lưu bài viết thành công");
      navigate("/user/blog");
    } catch (error) {
      console.error(error);
      alert("Lỗi khi lưu blog");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">{id ? "Sửa blog" : "Thêm blog"}</h3>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* TIÊU ĐỀ */}
        <input
          className="form-control mb-3"
          placeholder="Tiêu đề"
          value={tieuDe}
          onChange={(e) => setTieuDe(e.target.value)}
          required
        />

        {/* NỘI DUNG */}
        <textarea
          className="form-control mb-3"
          rows="6"
          placeholder="Nội dung"
          value={noiDung}
          onChange={(e) => setNoiDung(e.target.value)}
          required
        />

        {/* ẢNH */}
        <input
          type="file"
          className="form-control mb-3"
          accept="image/*"
          onChange={handleImageChange}
        />

        {/* PREVIEW ẢNH */}
        {imagePreview && (
          <div className="mb-3">
            <p className="mb-1 text-muted">Xem trước hình ảnh:</p>
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                width: "250px",
                height: "160px",
                objectFit: "cover",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        )}

        <button className="btn btn-primary">
          {id ? "Cập nhật" : "Đăng bài"}
        </button>
      </form>
    </div>
  );
};

export default ThemSuaBlog;
