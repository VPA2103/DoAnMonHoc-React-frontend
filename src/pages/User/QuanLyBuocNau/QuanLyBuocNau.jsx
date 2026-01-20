import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const QuanLyBuocNau = () => {
  const { id } = useParams(); // ma_cong_thuc từ URL
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);

  // State form chung (thêm/sửa)
  const [soThuTu, setSoThuTu] = useState("");
  const [noiDung, setNoiDung] = useState("");
  const [hinhAnh, setHinhAnh] = useState(null); // File ảnh mới chọn
  const [previewAnh, setPreviewAnh] = useState(""); // URL preview (mới hoặc cũ)
  const [editingId, setEditingId] = useState(null); // null = thêm mới

  const fileInputRef = useRef(null); // Để reset input file khi cancel

  const token = localStorage.getItem("token");
  const API_URL = "http://localhost:8000/api/user/buoc-nau"; // Có thể đổi thành /api nếu proxy

  // Lấy danh sách bước nấu
  const fetchSteps = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/cong-thuc/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSteps(response.data);
    } catch (error) {
      console.error("Lỗi tải bước nấu:", error);
      alert("Không thể tải danh sách bước nấu. Vui lòng kiểm tra kết nối!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchSteps();
  }, [id]);

  // Preview ảnh khi chọn file mới
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHinhAnh(file);
      setPreviewAnh(URL.createObjectURL(file));
    }
  };

  // Submit form (thêm hoặc sửa)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!soThuTu || !noiDung) return alert("Vui lòng nhập đủ số thứ tự và mô tả!");

    const formData = new FormData();
    formData.append("so_thu_tu", soThuTu);
    formData.append("noi_dung", noiDung);
    if (hinhAnh) formData.append("hinh_anh", hinhAnh);

    if (editingId) {
      formData.append("_method", "PUT"); // Spoof PUT cho Laravel
    } else {
      formData.append("ma_cong_thuc", id);
    }

    try {
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;

      await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert(editingId ? "Cập nhật bước nấu thành công!" : "Thêm bước nấu thành công!");

      // Reset form
      setSoThuTu("");
      setNoiDung("");
      setHinhAnh(null);
      setPreviewAnh("");
      setEditingId(null);
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input file
      fetchSteps();
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      if (error.response?.status === 422) {
        // Hiển thị lỗi validation từ Laravel
        const errors = error.response.data.errors;
        alert("Dữ liệu không hợp lệ:\n" + Object.values(errors).flat().join("\n"));
      } else {
        alert("Không thể lưu bước nấu. Vui lòng thử lại!");
      }
    }
  };

  // Click sửa → điền form + preview ảnh cũ (qua proxy /storage)
  const handleEdit = (step) => {
    setSoThuTu(step.so_thu_tu);
    setNoiDung(step.noi_dung);
    setPreviewAnh(step.hinh_anh ? `/storage/${step.hinh_anh}` : "");
    setHinhAnh(null);
    setEditingId(step.ma_buoc_nau);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Hủy sửa
  const handleCancel = () => {
    setSoThuTu("");
    setNoiDung("");
    setHinhAnh(null);
    setPreviewAnh("");
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Xóa bước
  const handleDelete = async (stepId) => {
    if (!window.confirm("Bạn có chắc chắn xóa bước nấu này?")) return;
    try {
      await axios.delete(`${API_URL}/${stepId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Xóa thành công!");
      fetchSteps();
    } catch (error) {
      console.error("Lỗi xóa:", error);
      alert("Không thể xóa bước nấu!");
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="text-primary fw-bold mb-4 text-center">Quản Lý Bước Nấu Công Thức</h2>

      <div className="row g-4">
        {/* Form thêm/sửa - bên trái */}
        <div className="col-lg-5">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-gradient bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-pencil-square me-2"></i>
                {editingId ? "Sửa Bước Nấu" : "Thêm Bước Nấu Mới"}
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Bước số:</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    value={soThuTu}
                    onChange={(e) => setSoThuTu(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Mô tả thực hiện:</label>
                  <textarea
                    className="form-control"
                    rows="5"
                    value={noiDung}
                    onChange={(e) => setNoiDung(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Ảnh minh họa (tùy chọn):</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="form-control"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {previewAnh && (
                    <div className="mt-3 text-center">
                      <img
                        src={previewAnh}
                        alt="Preview ảnh bước nấu"
                        className="img-fluid rounded shadow"
                        style={{ maxHeight: "350px" }}
                      />
                    </div>
                  )}
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button type="submit" className="btn btn-primary btn-lg me-md-2">
                    <i className="bi bi-save me-2"></i>
                    {editingId ? "Cập Nhật" : "Lưu Bước"}
                  </button>
                  {editingId && (
                    <button type="button" className="btn btn-secondary btn-lg" onClick={handleCancel}>
                      <i className="bi bi-x-circle me-2"></i>Hủy
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Danh sách bước - bên phải */}
        <div className="col-lg-7">
          <h4 className="fw-bold text-secondary mb-3">Danh Sách Các Bước Hiện Có</h4>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" style={{ width: "4rem", height: "4rem" }}></div>
              <p className="mt-3 text-muted">Đang tải bước nấu...</p>
            </div>
          ) : steps.length === 0 ? (
            <div className="alert alert-info text-center py-5">
              <i className="bi bi-info-circle display-4"></i>
              <h5 className="mt-3">Chưa có bước nấu nào</h5>
              <p>Hãy thêm bước đầu tiên để hoàn thiện công thức!</p>
            </div>
          ) : (
            <div className="list-group gap-3">
              {steps.map((step) => (
                <div
                  key={step.ma_buoc_nau}
                  className="list-group-item shadow-sm rounded p-4 border"
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1 me-3">
                      <h5 className="text-primary fw-bold">
                        <i className="bi bi-1-circle me-2"></i>Bước {step.so_thu_tu}
                      </h5>
                      <p className="mb-3" style={{ whiteSpace: "pre-line", fontSize: "1.1rem" }}>
                        {step.noi_dung}
                      </p>
                      {step.hinh_anh && (
                        <img
                          src={`/storage/${step.hinh_anh}`}
                          alt={`Ảnh bước ${step.so_thu_tu}`}
                          className="img-fluid rounded shadow"
                          style={{ maxHeight: "450px" }}
                        />
                      )}
                    </div>

                    <div className="d-flex flex-column gap-2">
                      <button
                        className="btn btn-outline-warning btn-sm"
                        onClick={() => handleEdit(step)}
                      >
                        <i className="bi bi-pencil"></i> Sửa
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(step.ma_buoc_nau)}
                      >
                        <i className="bi bi-trash"></i> Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuanLyBuocNau;