import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getBuocNauByCongThuc,
  createBuocNau,
  updateBuocNau,
  deleteBuocNau,
  getCongThucById,
  getAllCongThuc,
} from "../../../services/CongThucService";

const QuanLyBuocNau = () => {
  const { id } = useParams(); // Lấy ID từ URL (nếu có)
  const navigate = useNavigate();

  // State quản lý món ăn đang chọn
  const [selectedCongThucId, setSelectedCongThucId] = useState(id || "");
  const [danhSachCongThuc, setDanhSachCongThuc] = useState([]); // List để chọn
  const [congThucInfo, setCongThucInfo] = useState(null); // Thông tin món đang chọn

  // State dữ liệu bước nấu
  const [buocNaus, setBuocNaus] = useState([]);
  const [loading, setLoading] = useState(false);

  // State cho Modal thêm/sửa
  const [showModal, setShowModal] = useState(false);
  const [editingStep, setEditingStep] = useState(null); // object bước đang sửa (có ma_buoc_nau)
  const [formData, setFormData] = useState({
    so_thu_tu: "",
    mo_ta: "",
    thoi_gian: "",
  });
  const [imageFile, setImageFile] = useState(null);

  // --- 1. KHI MỚI VÀO TRANG ---
  useEffect(() => {
    // Nếu KHÔNG có ID trên URL -> Tải danh sách công thức để người dùng chọn
    if (!id) {
      loadAllCongThuc();
    } else {
      // Nếu CÓ ID -> Set luôn ID đó để tải bước nấu
      setSelectedCongThucId(id);
    }
  }, [id]);

  // --- 2. KHI ID MÓN ĂN THAY ĐỔI (Do chọn dropdown hoặc do URL) ---
  useEffect(() => {
    if (selectedCongThucId) {
      loadDataBuocNau(selectedCongThucId);
      loadThongTinMonAn(selectedCongThucId);
    } else {
      setBuocNaus([]); // Nếu chưa chọn gì thì xóa bảng
      setCongThucInfo(null);
    }
  }, [selectedCongThucId]);

  // --- CÁC HÀM API ---
  const loadAllCongThuc = async () => {
    try {
      const data = await getAllCongThuc();
      setDanhSachCongThuc(data);
    } catch (error) {
      console.error("Lỗi tải danh sách món:", error);
    }
  };

  const loadThongTinMonAn = async (maCongThuc) => {
    try {
      const data = await getCongThucById(maCongThuc);
      setCongThucInfo(data);
    } catch (error) {
      console.error("Lỗi tải thông tin món:", error);
    }
  };

  const loadDataBuocNau = async (maCongThuc) => {
    setLoading(true);
    try {
      const data = await getBuocNauByCongThuc(maCongThuc);
      // Nếu API trả res.data.data thì sửa tương ứng; hiện giả định trả mảng
      setBuocNaus(Array.isArray(data) ? data : data.data ?? []);
    } catch (error) {
      console.error("Lỗi load bước nấu:", error);
      setBuocNaus([]);
    } finally {
      setLoading(false);
    }
  };

  // --- Modal helpers ---
  const openAddModal = () => {
    // gợi ý bước tiếp theo
    const maxStep = buocNaus.length
      ? Math.max(...buocNaus.map((b) => Number(b.so_thu_tu) || 0))
      : 0;
    setEditingStep(null);
    setFormData({
      so_thu_tu: String(maxStep + 1),
      mo_ta: "",
      thoi_gian: "",
    });
    setImageFile(null);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingStep(item);
    setFormData({
      so_thu_tu: String(item.so_thu_tu ?? item.so_thu_tu),
      mo_ta: item.noi_dung ?? item.mo_ta ?? "",
      thoi_gian: item.thoi_gian ?? "",
    });
    setImageFile(null);
    setShowModal(true);
  };

  // --- XỬ LÝ FORM ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCongThucId) {
      alert("Vui lòng chọn món ăn trước!");
      return;
    }

    // validation cơ bản
    if (!formData.so_thu_tu || !formData.mo_ta) {
      alert("Vui lòng nhập bước số và mô tả.");
      return;
    }

    const submitData = new FormData();
    submitData.append("ma_cong_thuc", selectedCongThucId);
    // Gửi theo tên cột DB / backend: so_thu_tu, noi_dung, thoi_gian
    submitData.append("so_thu_tu", formData.so_thu_tu);
    submitData.append("noi_dung", formData.mo_ta);
    submitData.append("thoi_gian", formData.thoi_gian);
    if (imageFile) submitData.append("hinh_anh", imageFile);

    try {
      if (editingStep && editingStep.ma_buoc_nau) {
        await updateBuocNau(editingStep.ma_buoc_nau, submitData);
        alert("Cập nhật thành công!");
      } else {
        await createBuocNau(submitData);
        alert("Thêm mới thành công!");
      }
      setShowModal(false);
      setFormData({ so_thu_tu: "", mo_ta: "", thoi_gian: "" });
      setImageFile(null);
      loadDataBuocNau(selectedCongThucId);
    } catch (error) {
      console.error("Lỗi lưu:", error.response?.data ?? error.message);
      alert(
        error.response?.data?.message ||
          "Có lỗi xảy ra khi lưu bước nấu (xem console để biết chi tiết)"
      );
    }
  };

  const handleDelete = async (ma_buoc_nau) => {
    if (!window.confirm("Xóa bước này?")) return;
    try {
      await deleteBuocNau(ma_buoc_nau);
      loadDataBuocNau(selectedCongThucId);
    } catch (error) {
      console.error("Lỗi xóa:", error.response?.data ?? error.message);
      alert("Lỗi khi xóa (xem console)");
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Quản lý bước nấu</h4>

          {/* Chỉ hiện nút Thêm khi ĐÃ CHỌN món ăn */}
          {selectedCongThucId && (
            <button
              className="btn btn-light text-primary fw-bold"
              onClick={() => openAddModal()}
            >
              <i className="bi bi-plus-circle me-1"></i> Thêm bước
            </button>
          )}
        </div>

        <div className="card-body">
          {/* --- PHẦN 1: Ô CHỌN MÓN ĂN (Chỉ hiện nếu không có ID trên URL hoặc user muốn đổi) --- */}
          {!id && (
            <div className="mb-4 p-3 bg-light rounded border">
              <label className="form-label fw-bold">
                Chọn món ăn để quản lý bước nấu:
              </label>
              <select
                className="form-select"
                value={selectedCongThucId}
                onChange={(e) => setSelectedCongThucId(e.target.value)}
              >
                <option value="">-- Vui lòng chọn món ăn --</option>
                {danhSachCongThuc.map((ct) => (
                  <option
                    key={ct.ma_cong_thuc ?? ct.id}
                    value={ct.ma_cong_thuc ?? ct.id}
                  >
                    {ct.ten_cong_thuc}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* --- HIỂN THỊ TÊN MÓN ĐANG CHỌN --- */}
          {congThucInfo && (
            <div className="alert alert-info">
              Đang xem bước nấu cho món: <strong>{congThucInfo.ten_cong_thuc}</strong>
              <button
                className="btn btn-sm btn-outline-secondary ms-3"
                onClick={() => navigate(`/user/quanlicongthuc`)}
              >
                Quay lại quản lý công thức
              </button>
            </div>
          )}

          {/* --- PHẦN 2: DANH SÁCH BƯỚC NẤU --- */}
          {!selectedCongThucId ? (
            <p className="text-center text-muted py-5">
              Vui lòng chọn món ăn để xem dữ liệu.
            </p>
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
                            src={`http://localhost:8000/storage/${item.hinh_anh}`}
                            alt=""
                            width="80"
                            className="rounded"
                          />
                        ) : (
                          "Không ảnh"
                        )}
                      </td>
                      <td>{item.noi_dung}</td>
                      <td className="text-center">{item.thoi_gian} phút</td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-info me-2"
                          onClick={() => openEditModal(item)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(item.ma_buoc_nau)}
                        >
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

      {/* --- MODAL POPUP --- */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingStep ? "Sửa bước nấu" : "Thêm bước nấu mới"}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Bước số</label>
                    <input
                      type="number"
                      className="form-control"
                      required
                      min={1}
                      value={formData.so_thu_tu}
                      onChange={(e) => setFormData({ ...formData, so_thu_tu: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Mô tả bước làm</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      required
                      value={formData.mo_ta}
                      onChange={(e) => setFormData({ ...formData, mo_ta: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Thời gian (phút)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.thoi_gian}
                      onChange={(e) => setFormData({ ...formData, thoi_gian: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Hình ảnh minh họa</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                    />
                  </div>

                  <div className="text-end">
                    <button type="button" className="btn btn-secondary me-2" onClick={() => setShowModal(false)}>
                      Hủy
                    </button>
                    <button type="submit" className="btn btn-primary">Lưu lại</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLyBuocNau;
