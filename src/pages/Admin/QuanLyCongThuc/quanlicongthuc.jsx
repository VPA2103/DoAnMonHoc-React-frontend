import { useEffect, useState } from "react";
import axios from "axios";

export default function QuanLyCongThuc() {
  const [congThuc, setCongThuc] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // ❌ CHỈ LẤY DATA – KHÔNG ĐỘNG GÌ TRẠNG THÁI
  const fetchCongThuc = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://127.0.0.1:8000/api/admin/cong-thuc",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCongThuc(res.data.data);
    } catch (err) {
      alert("Lỗi tải công thức: ", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ CHỈ DUYỆT KHI ADMIN BẤM NÚT
  const xacNhanCongThuc = async (id) => {
    const ok = window.confirm("Bạn chắc chắn muốn xác nhận công thức này?");
    if (!ok) return;

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/admin/cong-thuc/${id}`,
        { trang_thai: 2 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // cập nhật UI SAU KHI bấm nút
      setCongThuc((prev) =>
        prev.map((item) =>
          item.ma_cong_thuc === id
            ? { ...item, trang_thai: 2 }
            : item
        )
      );
    } catch (err) {
      alert("Xác nhận thất bại: ",err);
    }
  };

  useEffect(() => {
    fetchCongThuc();
  }, []);

  return (
    <div className="container mt-4">
      <h3>Quản lý công thức</h3>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table className="table table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Tên công thức</th>
              <th>Danh mục</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {congThuc.map((item) => (
              <tr key={item.ma_cong_thuc}>
                <td>{item.ma_cong_thuc}</td>
                <td>{item.ten_cong_thuc}</td>
                <td>{item.danh_muc?.ten_danh_muc}</td>
                <td>
                  <span
                    className={`badge ${
                      item.trang_thai === 1
                        ? "bg-warning"
                        : "bg-success"
                    }`}
                  >
                    {item.trang_thai === 1
                      ? "Chờ duyệt"
                      : "Đã xác nhận"}
                  </span>
                </td>
                <td>
                  {item.trang_thai === 1 ? (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() =>
                        xacNhanCongThuc(item.ma_cong_thuc)
                      }
                    >
                      Xác nhận
                    </button>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
