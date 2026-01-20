import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ThemSuaBlog = () => {
  const { id } = useParams(); // Nếu có id là Sửa, không có id là Thêm mới
  const navigate = useNavigate();

  // State
  const [tieuDe, setTieuDe] = useState("");
  const [noiDung, setNoiDung] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(""); 

  // 1. Load dữ liệu cũ (Chỉ chạy khi đang Sửa)
  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:8000/api/blogs/${id}`)
        .then((res) => {
          setTieuDe(res.data.tieu_de);
          setNoiDung(res.data.noi_dung);
          setPreviewImage(res.data.hinh_anh);
        })
        .catch(err => console.error(err));
    }
  }, [id]);

  // 2. Xử lý chọn file ảnh
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // 3. Gửi dữ liệu (QUAN TRỌNG: Đã sửa logic Token và URL)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- LẤY TOKEN TỪ LOCAL STORAGE ---
    // Kiểm tra tab Application xem bạn lưu là 'token' hay 'ACCESS_TOKEN'
    const token = localStorage.getItem("token"); 

    if (!token) {
      alert("Bạn chưa đăng nhập!");
      return;
    }

    const formData = new FormData();
    formData.append("tieu_de", tieuDe);
    formData.append("noi_dung", noiDung);
    
    if (imageFile) {
      formData.append("hinh_anh", imageFile);
    }

    // --- XỬ LÝ URL VÀ METHOD ---
    let url = "http://localhost:8000/api/blogs"; // Mặc định là Thêm mới

    if (id) {
      // Nếu là Sửa (Update)
      url = `http://localhost:8000/api/blogs/${id}`;
      formData.append("_method", "PUT"); // Laravel cần cái này khi update có file
    }

    try {
      await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}` // <--- DÒNG NÀY GIÚP HẾT LỖI 401
        },
      });

      alert(id ? "Cập nhật thành công!" : "Thêm bài viết mới thành công!");
      navigate("/user/blog");
    } catch (error) {
      console.error("Lỗi:", error);
      if (error.response && error.response.status === 401) {
          alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.");
      } else {
          alert("Có lỗi xảy ra, vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="container py-5">
       <h2 className="text-white mb-4">
         {id ? "Cập nhật bài viết" : "Thêm bài viết mới"}
       </h2>
       
       <div className="card p-4">
         <form onSubmit={handleSubmit}>
            {/* Tiêu đề */}
            <div className="mb-3">
              <label className="form-label fw-bold">Tiêu đề bài viết</label>
              <input 
                type="text" 
                className="form-control" 
                value={tieuDe} 
                onChange={(e) => setTieuDe(e.target.value)} 
                required
              />
            </div>

            {/* Chọn ảnh */}
            <div className="mb-3">
              <label className="form-label fw-bold">Hình ảnh đại diện</label>
              <input 
                type="file" 
                className="form-control" 
                accept="image/*"
                onChange={handleFileChange} 
              />
              {/* Preview ảnh */}
              {previewImage && (
                <div className="mt-3">
                  <p className="mb-1">Ảnh hiện tại:</p>
                  <img src={previewImage} alt="Preview" style={{ height: "150px", borderRadius: "5px", objectFit: "cover" }} />
                </div>
              )}
            </div>

            {/* Nội dung */}
            <div className="mb-3">
              <label className="form-label fw-bold">Nội dung chi tiết</label>
              <textarea 
                className="form-control" 
                rows="5"
                value={noiDung}
                onChange={(e) => setNoiDung(e.target.value)}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary">
              {id ? "Lưu thay đổi" : "Đăng bài"}
            </button>
            <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate(-1)}>Hủy</button>
         </form>
       </div>
    </div>
  );
};

export default ThemSuaBlog;