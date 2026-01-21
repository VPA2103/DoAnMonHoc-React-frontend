import React, { useEffect, useState } from "react";
import { Table, Button, Container, Badge, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

const DanhSachBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Chưa đăng nhập");
        return;
      }

      const res = await axios.get(
        "http://127.0.0.1:8000/api/user/blogs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBlogs(res.data);
    } catch (error) {
      console.error("Lỗi tải blog:", error);
      alert("Không tải được danh sách blog");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa bài viết này?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://127.0.0.1:8000/api/blogs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchBlogs();
    } catch (error) {
      console.error("Lỗi xóa blog:", error);
      alert("Không thể xóa bài viết!");
    }
  };

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="light" />
        <p className="mt-3 text-muted">Đang tải blog...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4 text-white">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Blog của tôi</h2>
        <Link to="/user/blog/them" className="btn btn-primary">
          + Thêm bài viết
        </Link>
      </div>

      <Table striped bordered hover variant="dark" responsive>
        <thead>
          <tr className="text-center">
            <th>ID</th>
            <th>Hình ảnh</th>
            <th>Tiêu đề</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <tr key={blog.ma_blog}>
                <td className="text-center">{blog.ma_blog}</td>

                {/* ---------- ẢNH ---------- */}
                <td className="text-center">
                  {blog.hinh_anh_url ? (
                    <img
                      src={blog.hinh_anh_url}
                      alt={blog.tieu_de}
                      style={{
                        width: "90px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                      onError={(e) =>
                        (e.target.style.display = "none")
                      }
                    />
                  ) : (
                    <span className="text-muted">Không có ảnh</span>
                  )}
                </td>

                {/* ---------- TIÊU ĐỀ ---------- */}
                <td>{blog.tieu_de}</td>

                {/* ---------- TRẠNG THÁI ---------- */}
                <td className="text-center">
                  <Badge
                    bg={
                      blog.trang_thai === 1
                        ? "success"
                        : blog.trang_thai === 2
                        ? "danger"
                        : "warning"
                    }
                  >
                    {blog.trang_thai === 1
                      ? "Đã duyệt"
                      : blog.trang_thai === 2
                      ? "Từ chối"
                      : "Chờ duyệt"}
                  </Badge>
                </td>

                {/* ---------- NGÀY ---------- */}
                <td className="text-center">
                  {blog.created_at
                    ? new Date(blog.created_at).toLocaleDateString("vi-VN")
                    : "—"}
                </td>

                {/* ---------- HÀNH ĐỘNG ---------- */}
                <td className="text-center">
                  <Link
                    to={`/user/blog/xem/${blog.ma_blog}`}
                    className="btn btn-info btn-sm me-2"
                  >
                    Xem
                  </Link>

                  <Link
                    to={`/user/blog/sua/${blog.ma_blog}`}
                    className="btn btn-warning btn-sm me-2"
                  >
                    Sửa
                  </Link>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(blog.ma_blog)}
                  >
                    Xóa
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center text-muted">
                Bạn chưa có bài viết nào
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default DanhSachBlog;
