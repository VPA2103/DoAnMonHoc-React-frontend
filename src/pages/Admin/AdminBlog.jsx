import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminBlog() {
  const [blogs, setBlogs] = useState([]);
  const token = localStorage.getItem("token");

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/admin/blogs",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setBlogs(res.data.data);
    } catch (err) {
      console.error("Lỗi load blog:", err);
    }
  };

  const duyetBlog = async (id, trang_thai) => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/admin/blogs/${id}/duyet`,
        { trang_thai },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setBlogs(prev =>
        prev.map(b =>
          b.ma_blog === id ? { ...b, trang_thai } : b
        )
      );
    } catch (err) {
      console.error("Lỗi duyệt blog:", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const hienTrangThai = (tt) => {
    if (tt === 0) return <span className="badge bg-warning">Chờ duyệt</span>;
    if (tt === 1) return <span className="badge bg-success">Đã duyệt</span>;
    return <span className="badge bg-danger">Từ chối</span>;
  };

  return (
    <div className="container mt-4">
      <h3>Quản lý Blog</h3>

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Tiêu đề</th>
            <th>Email</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {blogs.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center">
                Không có dữ liệu
              </td>
            </tr>
          )}

          {blogs.map(b => (
            <tr key={b.ma_blog}>
              <td>{b.ma_blog}</td>
              <td>{b.tieu_de}</td>
              <td>{b.nguoi_dung?.email || "—"}</td>
              <td>{hienTrangThai(b.trang_thai)}</td>
              <td>
                {b.trang_thai === 0 && (
                  <>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => duyetBlog(b.ma_blog, 1)}
                    >
                      Duyệt
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => duyetBlog(b.ma_blog, 2)}
                    >
                      Từ chối
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
