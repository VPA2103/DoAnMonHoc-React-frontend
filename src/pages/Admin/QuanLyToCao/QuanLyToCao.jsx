import React, { useEffect, useState } from "react";
import axios from "axios";

const QuanLyToCao = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  /* ===== LOAD DANH SÁCH TỐ CÁO ===== */
  const loadToCao = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:8000/api/to-cao",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setList(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert("❌ Không tải được danh sách tố cáo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadToCao();
  }, []);

  /* ===== DUYỆT / XỬ LÝ ===== */
  const handleUpdateStatus = async (ma_to_cao, trang_thai) => {
    try {
      setUpdatingId(ma_to_cao);
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:8000/api/to-cao/${ma_to_cao}`,
        { trang_thai },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Cập nhật thành công");
      loadToCao();
    } catch (err) {
      console.error(err);
      alert("❌ Cập nhật thất bại");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-danger">🚩 Quản lý tố cáo</h3>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : list.length === 0 ? (
        <p>Không có tố cáo nào</p>
      ) : (
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Người gửi</th>
              <th>Danh mục</th>
              <th>Nội dung</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr key={item.ma_to_cao}>
                <td>{index + 1}</td>
                <td>{item.nguoi_dung?.ten_nguoi_dung || "Ẩn danh"}</td>
                <td>
                  <span className="badge bg-secondary">
                    {item.danh_muc_to_cao}
                  </span>
                </td>
                <td style={{ maxWidth: 300, whiteSpace: "pre-wrap" }}>
                  {item.noi_dung}
                </td>
                <td>
                  {item.trang_thai === "ChoDuyet" ? (
                    <span className="badge bg-warning text-dark">
                      Chờ duyệt
                    </span>
                  ) : (
                    <span className="badge bg-success">
                      Đã xử lý
                    </span>
                  )}
                </td>
                <td>
                  {item.trang_thai === "ChoDuyet" && (
                    <button
                      className="btn btn-sm btn-success"
                      disabled={updatingId === item.ma_to_cao}
                      onClick={() =>
                        handleUpdateStatus(item.ma_to_cao, "DaXuLy")
                      }
                    >
                      {updatingId === item.ma_to_cao
                        ? "Đang xử lý..."
                        : "Đánh dấu đã xử lý"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default QuanLyToCao;
