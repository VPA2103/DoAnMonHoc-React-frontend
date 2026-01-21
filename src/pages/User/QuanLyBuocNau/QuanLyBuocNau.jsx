import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getBuocNauByCongThuc,
  createBuocNau,
  updateBuocNau,
  deleteBuocNau,
  getCongThucById,
  getAllCongThuc,
} from "../../../services/CongThucService";

const API_STORAGE_BASE = "http://localhost:8000/storage/"; // sửa nếu cần

const QuanLyBuocNau = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ===== STATE CHUNG =====
  const [selectedCongThucId, setSelectedCongThucId] = useState(id || "");
  const [danhSachCongThuc, setDanhSachCongThuc] = useState([]);
  const [congThucInfo, setCongThucInfo] = useState(null);

  const [buocNaus, setBuocNaus] = useState([]);
  const [loading, setLoading] = useState(false);

  // ===== MODAL & FORM =====
  const [showModal, setShowModal] = useState(false);
  const [editingStep, setEditingStep] = useState(null);

  const [formData, setFormData] = useState({
    so_thu_tu: "",
    mo_ta: "",
    thoi_gian: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // preview (blob or server URL)
  const prevBlobRef = useRef(null); // để revoke blob URLs
  const [formErrors, setFormErrors] = useState({});

  // ===== INIT =====
  useEffect(() => {
    if (!id) loadAllCongThuc();
    else setSelectedCongThucId(id);
    // cleanup on unmount
    return () => {
      if (prevBlobRef.current) URL.revokeObjectURL(prevBlobRef.current);
    };
  }, [id]);

  useEffect(() => {
    if (selectedCongThucId) {
      loadDataBuocNau(selectedCongThucId);
      loadThongTinMonAn(selectedCongThucId);
    } else {
      setBuocNaus([]);
      setCongThucInfo(null);
    }
  }, [selectedCongThucId]);

  // ===== API =====
  const loadAllCongThuc = async () => {
    try {
      const data = await getAllCongThuc();
      setDanhSachCongThuc(data);
    } catch (e) {
      console.error("Lỗi tải công thức", e);
    }
  };

  const loadThongTinMonAn = async (id) => {
    try {
      const data = await getCongThucById(id);
      setCongThucInfo(data);
    } catch (e) {
      console.error("Lỗi tải thông tin món", e);
    }
  };

  const loadDataBuocNau = async (id) => {
    setLoading(true);
    try {
      const data = await getBuocNauByCongThuc(id);
      setBuocNaus(Array.isArray(data) ? data : data.data ?? []);
    } catch (e) {
      console.error("Lỗi load bước nấu", e);
      setBuocNaus([]);
    } finally {
      setLoading(false);
    }
  };

  // ===== MODAL =====
  const clearPreviewBlob = () => {
    if (prevBlobRef.current) {
      try {
        URL.revokeObjectURL(prevBlobRef.current);
      } catch {}
      prevBlobRef.current = null;
    }
  };

  const openAddModal = () => {
    const maxStep = buocNaus.length
      ? Math.max(...buocNaus.map((b) => Number(b.so_thu_tu) || 0))
      : 0;

    setEditingStep(null);
    setFormErrors({});
    setFormData({
      so_thu_tu: String(maxStep + 1),
      mo_ta: "",
      thoi_gian: "",
    });
    setImageFile(null);
    clearPreviewBlob();
    setPreviewUrl(null);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingStep(item);
    setFormErrors({});
    setFormData({
      so_thu_tu: String(item.so_thu_tu ?? ""),
      mo_ta: item.noi_dung ?? "",
      thoi_gian: item.thoi_gian ?? "",
    });
    setImageFile(null);
    // show server image as preview if exists
    clearPreviewBlob();
    setPreviewUrl(item.hinh_anh ? API_STORAGE_BASE + item.hinh_anh : null);
    setShowModal(true);
  };

  // handle file select and preview
  const handleFileChange = (file) => {
    if (!file) {
      setImageFile(null);
      clearPreviewBlob();
      setPreviewUrl(null);
      return;
    }
    setImageFile(file);
    // create blob url for preview
    clearPreviewBlob();
    const blob = URL.createObjectURL(file);
    prevBlobRef.current = blob;
    setPreviewUrl(blob);
  };

  // ===== SUBMIT =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    if (!selectedCongThucId) {
      alert("Vui lòng chọn món ăn trước!");
      return;
    }

    if (formData.thoi_gian !== "" && Number(formData.thoi_gian) < 0) {
      setFormErrors({ thoi_gian: ["Thời gian phải ≥ 0"] });
      return;
    }

    const fd = new FormData();
    fd.append("ma_cong_thuc", selectedCongThucId);
    fd.append("so_thu_tu", formData.so_thu_tu);
    fd.append("noi_dung", formData.mo_ta);
    if (formData.thoi_gian !== "") fd.append("thoi_gian", Number(formData.thoi_gian));
    if (imageFile) fd.append("hinh_anh", imageFile);

    try {
      if (editingStep?.ma_buoc_nau) {
        await updateBuocNau(editingStep.ma_buoc_nau, fd);
        alert("Cập nhật thành công");
      } else {
        await createBuocNau(fd);
        alert("Thêm mới thành công");
      }

      setShowModal(false);
      // reset preview blob if any
      clearPreviewBlob();
      setPreviewUrl(null);
      setImageFile(null);
      setFormData({ so_thu_tu: "", mo_ta: "", thoi_gian: "" });
      setFormErrors({});
      loadDataBuocNau(selectedCongThucId);
    } catch (err) {
      console.error("Lỗi lưu:", err);
      if (err.response?.data?.errors) {
        setFormErrors(err.response.data.errors);
      } else {
        alert("Lỗi server hoặc kết nối (xem console).");
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa bước này?")) return;
    try {
      await deleteBuocNau(id);
      loadDataBuocNau(selectedCongThucId);
    } catch (err) {
      console.error("Lỗi xóa:", err);
      alert("Lỗi xóa (xem console).");
    }
  };

  // ===== UI =====
  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Quản lý bước nấu</h4>
          {selectedCongThucId && (
            <button className="btn btn-light text-primary fw-bold" onClick={openAddModal}>
              <i className="bi bi-plus-circle me-1"></i> Thêm bước
            </button>
          )}
        </div>

        <div className="card-body">
          {!id && (
            <div className="mb-4 p-3 bg-light rounded border">
              <label className="form-label fw-bold">Chọn món ăn để quản lý bước nấu:</label>
              <select
                className="form-select"
                value={selectedCongThucId}
                onChange={(e) => setSelectedCongThucId(e.target.value)}
              >
                <option value="">-- Vui lòng chọn món ăn --</option>
                {danhSachCongThuc.map((ct) => (
                  <option key={ct.ma_cong_thuc} value={ct.ma_cong_thuc}>
                    {ct.ten_cong_thuc}
                  </option>
                ))}
              </select>
            </div>
          )}

          {congThucInfo && (
            <div className="alert alert-info d-flex justify-content-between align-items-center">
              <div>
                Đang xem bước nấu cho món: <strong>{congThucInfo.ten_cong_thuc}</strong>
              </div>
              <div>
                <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => navigate(`/user/quanlicongthuc`)}>
                  Quay lại quản lý công thức
                </button>
              </div>
            </div>
          )}

          {!selectedCongThucId ? (
            <p className="text-center text-muted py-5">Vui lòng chọn món ăn để xem dữ liệu.</p>
          ) : loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" />
            </div>
          ) : buocNaus.length === 0 ? (
            <p className="text-center text-muted py-4">Chưa có bước nấu nào. Hãy thêm mới!</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-secondary text-center">
                  <tr>
                    <th>Bước số</th>
                    <th>Hình ảnh</th>
                    <th>Mô tả</th>
                    <th>Thời gian</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {buocNaus.map((item) => (
                    <tr key={item.ma_buoc_nau}>
                      <td className="text-center fw-bold">{item.so_thu_tu}</td>
                      <td className="text-center">
                        {item.hinh_anh ? (
                          <img
                            src={`${API_STORAGE_BASE}${item.hinh_anh}`}
                            alt={`b${item.so_thu_tu}`}
                            width="80"
                            className="rounded"
                          />
                        ) : (
                          "Không ảnh"
                        )}
                      </td>
                      <td>{item.noi_dung}</td>
                      <td className="text-center">{item.thoi_gian ?? 0} phút</td>
                      <td className="text-center">
                        <button className="btn btn-sm btn-outline-info me-2" onClick={() => openEditModal(item)}>
                          Sửa
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item.ma_buoc_nau)}>
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <form className="modal-content" onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">{editingStep ? "Sửa bước nấu" : "Thêm bước nấu mới"}</h5>
                <button type="button" className="btn-close" onClick={() => { setShowModal(false); clearPreviewBlob(); setPreviewUrl(null); }} />
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Bước số</label>
                  <input
                    type="number"
                    className={`form-control ${formErrors.so_thu_tu ? "is-invalid" : ""}`}
                    min={1}
                    value={formData.so_thu_tu}
                    onChange={(e) => setFormData({ ...formData, so_thu_tu: e.target.value })}
                  />
                  {formErrors.so_thu_tu && <div className="invalid-feedback">{formErrors.so_thu_tu.join(", ")}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Mô tả bước làm</label>
                  <textarea
                    className={`form-control ${formErrors.noi_dung ? "is-invalid" : ""}`}
                    rows="3"
                    value={formData.mo_ta}
                    onChange={(e) => setFormData({ ...formData, mo_ta: e.target.value })}
                  />
                  {formErrors.noi_dung && <div className="invalid-feedback">{formErrors.noi_dung.join(", ")}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Thời gian (phút)</label>
                  <input
                    type="number"
                    min={0}
                    className={`form-control ${formErrors.thoi_gian ? "is-invalid" : ""}`}
                    value={formData.thoi_gian}
                    onChange={(e) => setFormData({ ...formData, thoi_gian: e.target.value })}
                  />
                  {formErrors.thoi_gian && <div className="invalid-feedback">{formErrors.thoi_gian.join(", ")}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Hình ảnh minh họa</label>
                  <input
                    type="file"
                    className={`form-control ${formErrors.hinh_anh ? "is-invalid" : ""}`}
                    accept="image/*"
                    onChange={(e) => handleFileChange(e.target.files[0])}
                  />
                  {formErrors.hinh_anh && <div className="invalid-feedback">{formErrors.hinh_anh.join(", ")}</div>}
                </div>

                {/* Preview */}
                {previewUrl && (
                  <div className="mb-3 text-center">
                    <label className="form-label">Xem trước</label>
                    <div>
                      <img src={previewUrl} alt="preview" style={{ maxWidth: "200px", maxHeight: "160px" }} className="rounded" />
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); clearPreviewBlob(); setPreviewUrl(null); }}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">Lưu lại</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLyBuocNau;
