import React, { useEffect, useState } from "react";
import { Container, Card, Spinner } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const ChiTietBlog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/blogs/${id}`);
      setBlog(res.data);
    } catch (error) {
      console.error("Lỗi tải chi tiết blog:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="light" />
        <p className="mt-3 text-muted">Đang tải bài viết...</p>
      </Container>
    );
  }

  /* ---------- NOT FOUND ---------- */
  if (!blog) {
    return (
      <Container className="mt-5 text-center text-white">
        <h3>Không tìm thấy bài viết</h3>
        <Link to="/blog" className="btn btn-secondary mt-3">
          Quay lại
        </Link>
      </Container>
    );
  }

  return (
    <Container className="mt-4 text-white">
      <h2 className="mb-4">Chi tiết bài viết</h2>

      <Card className="bg-dark text-white border-secondary shadow">

        {/* ---------- HÌNH ẢNH ---------- */}
        {blog.hinh_anh_url && (
          <div
            style={{
              maxHeight: "420px",
              overflow: "hidden",
              borderBottom: "1px solid #444",
            }}
          >
            <Card.Img
              variant="top"
              src={blog.hinh_anh_url}
              alt={blog.tieu_de}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
              onError={(e) =>
                (e.target.parentElement.style.display = "none")
              }
            />
          </div>
        )}

        <Card.Body className="p-4">

          {/* ---------- TIÊU ĐỀ ---------- */}
          <Card.Title className="fs-2 fw-bold text-warning mb-3">
            {blog.tieu_de}
          </Card.Title>

          {/* ---------- THÔNG TIN ---------- */}
          <Card.Subtitle className="mb-4 text-muted border-bottom border-secondary pb-3">
            <i className="bi bi-calendar3 me-1"></i>
            Ngày đăng:{" "}
            {blog.created_at
              ? new Date(blog.created_at).toLocaleDateString("vi-VN")
              : "Không rõ"}

            <span className="mx-2">|</span>

            <i className="bi bi-person me-1"></i>
            Tác giả: {blog.nguoi_dung?.ten_nguoi_dung || "Admin"}
          </Card.Subtitle>

          {/* ---------- NỘI DUNG ---------- */}
          <Card.Text
            style={{
              whiteSpace: "pre-wrap",
              lineHeight: "1.8",
              fontSize: "1.1rem",
              textAlign: "justify",
            }}
          >
            {blog.noi_dung}
          </Card.Text>

          {/* ---------- QUAY LẠI ---------- */}
          <div className="mt-5">
            <Link to="/blog" className="btn btn-outline-light">
              ← Quay lại danh sách
            </Link>
          </div>

        </Card.Body>
      </Card>
    </Container>
  );
};

export default ChiTietBlog;
