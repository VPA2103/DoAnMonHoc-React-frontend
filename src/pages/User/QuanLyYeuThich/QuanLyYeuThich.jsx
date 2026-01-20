import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API = "http://localhost:8000/api";

function QuanLyYeuThich() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const loadData = async () => {
    try {
      const res = await axios.get(`${API}/user/yeu-thich`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setFavorites(res.data.data || []);
    } catch (error) {
      console.error("Lỗi load yêu thích:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ❌ BỎ YÊU THÍCH
  const handleRemoveFavorite = async (id) => {
    if (!window.confirm("Bỏ công thức này khỏi yêu thích?")) return;

    try {
      await axios.post(
        `${API}/yeu-thich/toggle`,
        { ma_cong_thuc: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // cập nhật UI ngay
      setFavorites((prev) =>
        prev.filter((item) => item.ma_cong_thuc !== id)
      );
    } catch (error) {
      console.error("Lỗi bỏ yêu thích:", error);
      alert("Không thể bỏ yêu thích");
    }
  };

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">❤️ Công thức yêu thích</h3>
      </div>

      {/* Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" />
            </div>
          ) : favorites.length === 0 ? (
            <p className="text-center text-muted">
              Chưa có công thức yêu thích nào
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-dark text-center">
                  <tr>
                    <th style={{ width: "5%" }}>ID</th>
                    <th style={{ width: "12%" }}>Ảnh</th>
                    <th>Tên công thức</th>
                    <th>Danh mục</th>
                    <th style={{ width: "10%" }}>Độ khó</th>
                    <th style={{ width: "15%" }}>Thời gian</th>
                    <th style={{ width: "20%" }}>Thao tác</th>
                  </tr>
                </thead>

                <tbody className="text-center">
                  {favorites.map((ct) => (
                    <tr key={ct.ma_cong_thuc}>
                      <td>{ct.ma_cong_thuc}</td>

                      <td>
                        {ct.anh_cong_thuc ? (
                          <img
                            src={`http://localhost:8000/storage/${ct.anh_cong_thuc}`}
                            alt={ct.ten_cong_thuc}
                            style={{
                              width: "100px",
                              height: "70px",
                              objectFit: "cover",
                              borderRadius: "6px",
                            }}
                          />
                        ) : (
                          <span className="text-muted">Không có ảnh</span>
                        )}
                      </td>

                      <td className="fw-semibold">
                        {ct.ten_cong_thuc}
                      </td>

                      <td>{ct.danh_muc?.ten_danh_muc}</td>

                      <td>
                        <span
                          className={`badge 
                            ${
                              ct.do_kho === "De"
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

                      <td>{ct.thoi_gian_nau} phút</td>

                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <Link
                            to={`/recipes/${ct.ma_cong_thuc}`}
                            className="btn btn-sm btn-outline-primary"
                          >
                            Chi tiết
                          </Link>

                          <button
                            onClick={() =>
                              handleRemoveFavorite(ct.ma_cong_thuc)
                            }
                            className="btn btn-sm btn-outline-danger"
                          >
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

export default QuanLyYeuThich;
