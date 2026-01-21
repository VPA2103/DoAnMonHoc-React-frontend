import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BlogListPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/blogs");

      // Backend có thể trả mảng hoặc object
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.blogs || [];

      setBlogs(data);
    } catch (error) {
      console.error("Lỗi tải blog:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      {/* ---------- TIÊU ĐỀ ---------- */}
      <div className="text-center mb-5">
        <h2 className="fw-bold text-uppercase">Blog Ẩm Thực & Chia Sẻ</h2>
        <div
          style={{
            width: "70px",
            height: "3px",
            backgroundColor: "#dc3545",
            margin: "10px auto",
          }}
        ></div>
      </div>

      {/* ---------- LOADING ---------- */}
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-danger" role="status" />
        </div>
      ) : (
        <div className="row g-4">
          {blogs.length > 0 ? (
            blogs.map((blog) => {
              const blogId = blog.ma_blog || blog.id;

              return (
                <div key={blogId} className="col-12 col-md-6 col-lg-3">
                  <div className="card h-100 shadow-sm border-0">

                    {/* ---------- ẢNH BLOG ---------- */}
                    {blog.hinh_anh_url && (
                      <div
                        style={{
                          height: "200px",
                          overflow: "hidden",
                          backgroundColor: "#f8f9fa",
                        }}
                      >
                        <img
                          src={blog.hinh_anh_url}
                          alt={blog.tieu_de}
                          className="w-100 h-100"
                          style={{ objectFit: "cover" }}
                          onError={(e) =>
                            (e.target.parentElement.style.display = "none")
                          }
                        />
                      </div>
                    )}

                    {/* ---------- NỘI DUNG ---------- */}
                    <div className="card-body d-flex flex-column">
                      <div className="text-muted small mb-2">
                        <i className="bi bi-calendar3 me-1"></i>
                        {blog.created_at
                          ? new Date(blog.created_at).toLocaleDateString("vi-VN")
                          : "Mới đăng"}
                      </div>

                      <h5 className="card-title fw-bold">
                        <Link
                          to={`/blog/${blogId}`}
                          className="text-decoration-none text-dark"
                        >
                          {blog.tieu_de}
                        </Link>
                      </h5>

                      <p
                        className="card-text text-secondary flex-grow-1"
                        style={{ fontSize: "0.9rem" }}
                      >
                        {blog.noi_dung
                          ? blog.noi_dung.length > 100
                            ? blog.noi_dung.substring(0, 100) + "..."
                            : blog.noi_dung
                          : ""}
                      </p>

                      <Link
                        to={`/blog/${blogId}`}
                        className="btn btn-outline-dark btn-sm mt-3 align-self-start"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center w-100 py-5">
              <p className="text-muted fs-5">Chưa có bài viết nào.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogListPage;
