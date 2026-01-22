import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BlogListPage = () => {
  const [danhSachBlog, setDanhSachBlog] = useState([]);
  const [dangTai, setDangTai] = useState(true);
  const [trangThaiTheoDoi, setTrangThaiTheoDoi] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    taiDanhSachBlog();
  }, []);

  // ===============================
  // LẤY DANH SÁCH BLOG
  // ===============================
  const taiDanhSachBlog = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/blogs");

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.blogs || [];

      setDanhSachBlog(data);

      if (token) {
        khoiTaoTrangThaiTheoDoi(data);
      }
    } catch (error) {
      console.error("Lỗi tải blog:", error);
    } finally {
      setDangTai(false);
    }
  };

  // ===============================
  // KIỂM TRA TRẠNG THÁI THEO DÕI
  // ===============================
  const khoiTaoTrangThaiTheoDoi = async (blogs) => {
    const ketQua = {};

    for (const blog of blogs) {
      const maTacGia = blog.ma_nguoi_dung;
      if (!maTacGia) continue;

      try {
        const res = await axios.get(
          `http://localhost:8000/api/theo-doi/check/${maTacGia}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        ketQua[maTacGia] = res.data.is_following;
      } catch {
        ketQua[maTacGia] = false;
      }
    }

    setTrangThaiTheoDoi(ketQua);
  };

  // ===============================
  // THEO DÕI / BỎ THEO DÕI
  // ===============================
  const xuLyTheoDoi = async (e, maTacGia) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      alert("Vui lòng đăng nhập để theo dõi");
      return;
    }

    try {
      if (trangThaiTheoDoi[maTacGia]) {
        // BỎ THEO DÕI
        await axios.delete(
          `http://localhost:8000/api/theo-doi/${maTacGia}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // THEO DÕI
        await axios.post(
          `http://localhost:8000/api/theo-doi/${maTacGia}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // cập nhật UI ngay
      setTrangThaiTheoDoi((prev) => ({
        ...prev,
        [maTacGia]: !prev[maTacGia],
      }));
    } catch (error) {
      console.error("Lỗi theo dõi:", error.response?.data || error);
    }
  };

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className="container py-5">
      <h4 className="fw-bold text-center mb-4">
        Blog Ẩm Thực & Chia Sẻ
      </h4>

      {dangTai ? (
        <div className="text-center">
          <div className="spinner-border text-danger" />
        </div>
      ) : (
        <div className="row g-4">
          {danhSachBlog.map((blog) => {
            const maBlog = blog.ma_blog;
            const maTacGia = blog.ma_nguoi_dung;

            return (
              <div key={maBlog} className="col-12 col-md-6 col-lg-3">
                <div className="card h-100 border-0 shadow-sm">
                  {/* ẢNH */}
                  {blog.hinh_anh_url && (
                    <img
                      src={blog.hinh_anh_url}
                      alt={blog.tieu_de}
                      className="card-img-top"
                      style={{ height: 180, objectFit: "cover" }}
                    />
                  )}

                  <div className="card-body d-flex flex-column">
                    {/* NGÀY + THEO DÕI */}
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <small className="text-muted">
                        {blog.created_at
                          ? new Date(blog.created_at).toLocaleDateString(
                              "vi-VN"
                            )
                          : ""}
                      </small>

                      {maTacGia && (
                        <button
                          onClick={(e) => xuLyTheoDoi(e, maTacGia)}
                          className="btn btn-link p-0 text-decoration-none d-flex align-items-center gap-1"
                          style={{
                            fontSize: "0.75rem",
                            color: trangThaiTheoDoi[maTacGia]
                              ? "#198754"
                              : "#0d6efd",
                          }}
                        >
                          <i
                            className={`bi ${
                              trangThaiTheoDoi[maTacGia]
                                ? "bi-check-circle-fill"
                                : "bi-plus-circle"
                            }`}
                          />
                          {trangThaiTheoDoi[maTacGia]
                            ? "Đã theo dõi"
                            : "Theo dõi"}
                        </button>
                      )}
                    </div>

                    {/* TIÊU ĐỀ */}
                    <h6 className="fw-semibold">
                      <Link
                        to={`/blog/${maBlog}`}
                        className="text-dark text-decoration-none"
                      >
                        {blog.tieu_de}
                      </Link>
                    </h6>

                    {/* MÔ TẢ */}
                    <p className="text-secondary small flex-grow-1">
                      {blog.noi_dung
                        ? blog.noi_dung.substring(0, 80) + "..."
                        : ""}
                    </p>

                    {/* CTA */}
                    <Link
                      to={`/blog/${maBlog}`}
                      className="btn btn-outline-dark btn-sm mt-auto"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BlogListPage;
