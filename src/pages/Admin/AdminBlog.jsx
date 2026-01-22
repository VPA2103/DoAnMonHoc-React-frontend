import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AdminBlog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null); // id đang được duyệt/từ chối
  const token = localStorage.getItem("token");

  const fetchBlogs = async () => {
    if (!token) {
      toast.error("Bạn chưa đăng nhập. Vui lòng đăng nhập bằng tài khoản admin.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/admin/blogs", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBlogs(res.data.data || []);
    } catch (err) {
      console.error("Lỗi load blog:", err);
      const msg = err?.response?.data?.message || "Không tải được danh sách blog";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const duyetBlog = async (id, trang_thai) => {
    if (!token) {
      toast.error("Bạn chưa đăng nhập. Vui lòng đăng nhập bằng tài khoản admin.");
      return;
    }

    // optional: confirm when rejecting
    if (trang_thai === 2 && !window.confirm("Bạn chắc chắn muốn từ chối bài viết này?")) {
      return;
    }

    setUpdatingId(id);
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/admin/blogs/${id}/duyet`,
        { trang_thai },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBlogs((prev) => prev.map((b) => (b.ma_blog === id ? { ...b, trang_thai } : b)));
      toast.success(trang_thai === 1 ? "Đã duyệt bài" : "Đã từ chối bài");
    } catch (err) {
      console.error("Lỗi duyệt blog:", err);
      const msg = err?.response?.data?.message || "Duyệt/từ chối thất bại";
      toast.error(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hienTrangThai = (tt) => {
    if (tt === 0) return <span className="badge bg-warning text-dark">Chờ duyệt</span>;
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
          {loading && (
            <tr>
              <td colSpan="5" className="text-center">
                Đang tải...
              </td>
            </tr>
          )}

          {!loading && (!blogs || blogs.length === 0) && (
            <tr>
              <td colSpan="5" className="text-center">
                Không có dữ liệu
              </td>
            </tr>
          )}

          {!loading &&
            blogs.map((b) => (
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
                        disabled={updatingId === b.ma_blog}
                      >
                        {updatingId === b.ma_blog && "Đang..."}
                        {updatingId !== b.ma_blog && "Duyệt"}
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => duyetBlog(b.ma_blog, 2)}
                        disabled={updatingId === b.ma_blog}
                      >
                        {updatingId === b.ma_blog && "Đang..."}
                        {updatingId !== b.ma_blog && "Từ chối"}
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
