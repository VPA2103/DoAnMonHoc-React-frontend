import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const API_URL = "http://127.0.0.1:8000/api";

const TaoCongThuc = () => {
  const token = localStorage.getItem("token");

  const [khoNguyenLieu, setKhoNguyenLieu] = useState([]);
  const [danhMucs, setDanhMucs] = useState([]);

  const [tenMon, setTenMon] = useState("");
  const [moTa, setMoTa] = useState("");
  const [maDanhMuc, setMaDanhMuc] = useState("");

  const [doKho, setDoKho] = useState("De"); // default
  const [thoiGianNau, setThoiGianNau] = useState(""); // keep as string to avoid browser auto-correct jumps

  const [anhCongThuc, setAnhCongThuc] = useState(null);

  const [nguyenLieuChon, setNguyenLieuChon] = useState([
    { ma_nguyen_lieu: "", so_luong: "" }
  ]);

  useEffect(() => {
    // Load nguyên liệu (public)
    axios.get(`${API_URL}/nguyen-lieu`)
      .then(res => setKhoNguyenLieu(res.data.data || []))
      .catch(err => {
        console.error("Lỗi tải nguyên liệu:", err.response?.data || err.message);
        toast.error("Không tải được nguyên liệu");
        setKhoNguyenLieu([]);
      });

    // Load danh mục (user route requires token)
    if (token) {
      axios.get(`${API_URL}/user/danh-muc`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
      })
        .then(res => setDanhMucs(res.data.data || []))
        .catch(err => {
          console.error("Lỗi tải danh mục:", err.response?.data || err.message);
          toast.error("Không tải được danh mục (cần đăng nhập)");
          setDanhMucs([]);
        });
    } else {
      setDanhMucs([]);
    }
  }, [token]);

  const themDongNguyenLieu = () => {
    setNguyenLieuChon(prev => [...prev, { ma_nguyen_lieu: "", so_luong: "" }]);
  };

  const xoaDong = (index) => {
    setNguyenLieuChon(prev => prev.filter((_, i) => i !== index));
  };

  const handleChangeNguyenLieu = (index, field, value) => {
    setNguyenLieuChon(prev => {
      const list = [...prev];
      list[index] = { ...list[index], [field]: value };
      return list;
    });
  };

  // Prevent "jumping" for number inputs: keep as string, coerce on blur or submit
  const handleThoiGianChange = (value) => {
    // allow empty string or digits
    if (value === "") {
      setThoiGianNau("");
      return;
    }
    // allow only numeric and decimal characters
    const cleaned = value.replace(/[^\d]/g, "");
    setThoiGianNau(cleaned);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Vui lòng đăng nhập để tạo công thức.");
      return;
    }
    if (!tenMon.trim()) {
      toast.error("Vui lòng nhập tên công thức.");
      return;
    }
    if (!maDanhMuc) {
      toast.error("Vui lòng chọn danh mục.");
      return;
    }

    // Filter and prepare ingredient list
    const danhSachNguyenLieu = nguyenLieuChon
      .filter(nl => nl.ma_nguyen_lieu && nl.so_luong !== "" && !isNaN(Number(nl.so_luong)) && Number(nl.so_luong) > 0)
      .map(nl => ({
        ma_nguyen_lieu: Number(nl.ma_nguyen_lieu),
        so_luong: Number(nl.so_luong)
      }));

    if (danhSachNguyenLieu.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 nguyên liệu hợp lệ với số lượng > 0.");
      return;
    }

    // Build FormData because we may upload file
    const formData = new FormData();
    formData.append("ten_cong_thuc", tenMon.trim());
    formData.append("ma_danh_muc", String(maDanhMuc));
    formData.append("mo_ta", moTa || "");
    formData.append("do_kho", doKho || "");
    if (thoiGianNau !== "") {
      // ensure integer >=1 if provided
      const tg = parseInt(thoiGianNau, 10);
      if (!isNaN(tg) && tg > 0) {
        formData.append("thoi_gian_nau", String(tg));
      }
    }

    if (anhCongThuc) {
      formData.append("anh_cong_thuc", anhCongThuc);
    }

    // Append nested array nguyen_lieu as nguyen_lieu[0][ma_nguyen_lieu], nguyen_lieu[0][so_luong], ...
    danhSachNguyenLieu.forEach((item, idx) => {
      formData.append(`nguyen_lieu[${idx}][ma_nguyen_lieu]`, String(item.ma_nguyen_lieu));
      formData.append(`nguyen_lieu[${idx}][so_luong]`, String(item.so_luong));
    });

    try {
      const res = await axios.post(`${API_URL}/user/cong-thuc`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
          // DO NOT set Content-Type explicitly; browser/axios will set multipart/form-data with boundary
        }
      });

      console.log("Tạo công thức thành công:", res.data);
      toast.success("Tạo công thức thành công!");

      // reset
      setTenMon("");
      setMoTa("");
      setMaDanhMuc("");
      setDoKho("De");
      setThoiGianNau("");
      setAnhCongThuc(null);
      setNguyenLieuChon([{ ma_nguyen_lieu: "", so_luong: "" }]);
    } catch (err) {
      console.error("Lỗi khi tạo công thức:", err.response?.data || err.message);
      const status = err.response?.status;
      if (status === 422) {
        const errors = err.response.data.errors || {};
        const errMsgs = Object.values(errors).flat();
        toast.error(errMsgs.join(" | ") || "Dữ liệu không hợp lệ");
      } else if (status === 403) {
        toast.error("Bạn không có quyền thực hiện hành động này (403).");
      } else {
        toast.error(err.response?.data?.message || "Lỗi server.");
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Đóng góp công thức mới</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Tên công thức */}
        <div className="mb-3">
          <label className="form-label">Tên công thức</label>
          <input
            type="text"
            className="form-control"
            value={tenMon}
            onChange={e => setTenMon(e.target.value)}
            required
          />
        </div>

        {/* Danh mục */}
        <div className="mb-3">
          <label className="form-label">Danh mục</label>
          <select
            className="form-select"
            value={maDanhMuc}
            onChange={e => setMaDanhMuc(e.target.value)}
            required
          >
            <option value="">-- Chọn danh mục --</option>
            {danhMucs.map(dm => (
              <option key={dm.ma_danh_muc} value={dm.ma_danh_muc}>
                {dm.ten_danh_muc}
              </option>
            ))}
          </select>
        </div>

        {/* Mô tả */}
        <div className="mb-3">
          <label className="form-label">Mô tả</label>
          <textarea
            className="form-control"
            rows="3"
            value={moTa}
            onChange={e => setMoTa(e.target.value)}
          />
        </div>

        {/* Độ khó và thời gian */}
        <div className="row mb-3">
          <div className="col-6">
            <label className="form-label">Độ khó</label>
            <select className="form-select" value={doKho} onChange={e => setDoKho(e.target.value)}>
              <option value="De">Dễ</option>
              <option value="Trung binh">Trung bình</option>
              <option value="Kho">Khó</option>
            </select>
          </div>
          <div className="col-6">
            <label className="form-label">Thời gian nấu (phút)</label>
            <input
              type="number"
              className="form-control"
              min={1}
              value={thoiGianNau}
              onChange={e => handleThoiGianChange(e.target.value)}
              onBlur={() => {
                // ensure at least 1 if user typed 0 or left blank
                if (thoiGianNau !== "") {
                  const n = parseInt(thoiGianNau, 10);
                  if (isNaN(n) || n < 1) setThoiGianNau("1");
                }
              }}
            />
          </div>
        </div>

        {/* Ảnh công thức */}
        <div className="mb-3">
          <label className="form-label">Ảnh công thức (tùy chọn)</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={e => setAnhCongThuc(e.target.files?.[0] || null)}
          />
        </div>

        {/* Nguyên liệu */}
        <label className="form-label">Thành phần nguyên liệu</label>
        {nguyenLieuChon.map((item, index) => (
          <div key={index} className="d-flex gap-2 mb-2 align-items-center">
            <select
              className="form-select flex-grow-1"
              value={item.ma_nguyen_lieu}
              onChange={e => handleChangeNguyenLieu(index, "ma_nguyen_lieu", e.target.value)}
              required
            >
              <option value="">-- Chọn nguyên liệu --</option>
              {khoNguyenLieu.map(nl => (
                <option key={nl.ma_nguyen_lieu} value={nl.ma_nguyen_lieu}>
                  {nl.ten_nguyen_lieu} ({nl.don_vi_tinh})
                </option>
              ))}
            </select>

            <input
              type="number"
              className="form-control"
              style={{ width: "150px" }}
              placeholder="Số lượng"
              min="0.01"
              step="0.01"
              value={String(item.so_luong)}
              onChange={e => handleChangeNguyenLieu(index, "so_luong", e.target.value)}
              onBlur={() => {
                const val = item.so_luong;
                if (val === "" || isNaN(Number(val)) || Number(val) <= 0) {
                  // keep as empty to force user correction
                  handleChangeNguyenLieu(index, "so_luong", "");
                } else {
                  // normalize
                  handleChangeNguyenLieu(index, "so_luong", String(Number(val)));
                }
              }}
              required
            />

            {nguyenLieuChon.length > 1 && (
              <button type="button" className="btn btn-danger" onClick={() => xoaDong(index)}>
                X
              </button>
            )}
          </div>
        ))}

        <div className="mb-3">
          <button type="button" className="btn btn-secondary" onClick={themDongNguyenLieu}>
            + Thêm nguyên liệu
          </button>
        </div>

        <div>
          <button type="submit" className="btn btn-success btn-lg">Hoàn tất công thức</button>
        </div>
      </form>
    </div>
  );
};

export default TaoCongThuc;
