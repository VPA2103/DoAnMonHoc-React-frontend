import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function YeuThich() {
  const [yeuThich, setYeuThich] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data cho công thức yêu thích
  const mockYeuThich = [
    {
      ma_cong_thuc: 1,
      ten_cong_thuc: "Cơm tấm sườn bì",
      anh_cong_thuc: "https://via.placeholder.com/100x70",
      danh_muc: { ten_danh_muc: "Món chính" },
      do_kho: "Trung binh",
      trang_thai: 1,
      thoi_gian_nau: "45 phút",
      ngay_them: "2024-01-15"
    },
    {
      ma_cong_thuc: 2,
      ten_cong_thuc: "Phở bò",
      anh_cong_thuc: "https://via.placeholder.com/100x70",
      danh_muc: { ten_danh_muc: "Món nước" },
      do_kho: "Kho",
      trang_thai: 1,
      thoi_gian_nau: "120 phút",
      ngay_them: "2024-01-10"
    },
    {
      ma_cong_thuc: 3,
      ten_cong_thuc: "Gỏi cuốn",
      anh_cong_thuc: "https://via.placeholder.com/100x70",
      danh_muc: { ten_danh_muc: "Món nguội" },
      do_kho: "De",
      trang_thai: 1,
      thoi_gian_nau: "30 phút",
      ngay_them: "2024-01-08"
    }
  ];

  const loadData = async () => {
    try {
      // Giả lập API call
      setTimeout(() => {
        setYeuThich(mockYeuThich);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Lỗi tải danh sách yêu thích:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRemoveFavorite = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa công thức này khỏi danh sách yêu thích không?")) return;

    try {
      // Giả lập API call để xóa khỏi yêu thích
      setYeuThich(yeuThich.filter(item => item.ma_cong_thuc !== id));
      alert("Đã xóa khỏi danh sách yêu thích");
    } catch (error) {
      console.error("Lỗi xóa yêu thích:", error);
      alert("Không thể xóa khỏi danh sách yêu thích");
    }
  };

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">Công thức yêu thích</h3>
        <span className="badge bg-primary fs-6">{yeuThich.length} công thức</span>
      </div>

      {/* Nội dung */}
      <div className="card shadow-sm">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" />
              <p className="mt-2">Đang tải danh sách yêu thích...</p>
            </div>
          ) : yeuThich.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-heart fs-1 text-muted mb-3"></i>
              <h5 className="text-muted">Chưa có công thức yêu thích</h5>
              <p className="text-muted">Hãy khám phá và thêm công thức vào danh sách yêu thích của bạn!</p>
              <Link to="/recipes" className="btn btn-primary">
                <i className="bi bi-search me-2"></i>Khám phá công thức
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "5%" }}>STT</th>
                    <th style={{ width: "12%" }}>Ảnh</th>
                    <th>Tên công thức</th>
                    <th>Danh mục</th>
                    <th style={{ width: "10%" }}>Độ khó</th>
                    <th style={{ width: "15%" }}>Thời gian nấu</th>
                    <th style={{ width: "15%" }}>Ngày thêm</th>
                    <th style={{ width: "15%" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {yeuThich.map((ct, index) => (
                    <tr key={ct.ma_cong_thuc}>
                      <td className="text-center">{index + 1}</td>
                      <td>
                        {ct.anh_cong_thuc ? (
                          <img
                            src={ct.anh_cong_thuc}
                            alt={ct.ten_cong_thuc}
                            style={{
                              width: "100px",
                              height: "70px",
                              objectFit: "cover",
                              borderRadius: "6px"
                            }}
                          />
                        ) : (
                          <span className="text-muted">Không có ảnh</span>
                        )}
                      </td>
                      <td>
                        <Link
                          to={`/recipes/${ct.ma_cong_thuc}`}
                          className="text-decoration-none fw-bold text-primary"
                        >
                          {ct.ten_cong_thuc}
                        </Link>
                      </td>
                      <td>{ct.danh_muc?.ten_danh_muc}</td>
                      <td className="text-center">
                        <span
                          className={`badge
                            ${ct.do_kho === "De"
                              ? "bg-success"
                              : ct.do_kho === "Trung binh"
                                ? "bg-warning text-dark"
                                : ct.do_kho === "Kho"
                                  ? "bg-danger"
                                  : "bg-secondary"
                            }`}
                        >
                          {ct.do_kho === "De"
                            ? "Dễ"
                            : ct.do_kho === "Trung binh"
                              ? "Trung bình"
                              : ct.do_kho === "Kho"
                                ? "Khó"
                                : ""}
                        </span>
                      </td>
                      <td className="text-center">{ct.thoi_gian_nau}</td>
                      <td className="text-center">{ct.ngay_them}</td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <Link
                            to={`/recipes/${ct.ma_cong_thuc}`}
                            className="btn btn-sm btn-outline-primary"
                            title="Xem chi tiết"
                          >
                            <i className="bi bi-eye me-1"></i>
                            Xem
                          </Link>
                          <button
                            onClick={() => handleRemoveFavorite(ct.ma_cong_thuc)}
                            className="btn btn-sm btn-outline-danger"
                            title="Xóa khỏi yêu thích"
                          >
                            <i className="bi bi-heartbreak me-1"></i>
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default YeuThich;
//he