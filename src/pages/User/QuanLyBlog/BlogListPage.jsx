import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; 

const BlogListPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/blogs");
        const data = Array.isArray(res.data) ? res.data : (res.data.blogs || []);
        setBlogs(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-uppercase" style={{ color: "#333" }}>
          Blog Ẩm Thực & Chia Sẻ
        </h2>
        <div style={{ width: "60px", height: "3px", backgroundColor: "#dc3545", margin: "10px auto" }}></div>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <div className="row g-4">
          {blogs.length > 0 ? (
            blogs.map((blog, index) => {
                // Tìm ID (ưu tiên ma_blog hoặc id)
                const safeId = blog.ma_blog || blog.id || blog._id || index;

                return (
                  <div key={safeId} className="col-12 col-md-6 col-lg-3">
                    <div className="card h-100 shadow-sm border-0">
                      
                      {/* --- PHẦN XỬ LÝ ẢNH --- */}
                      {/* Chỉ hiển thị khung ảnh nếu database có tên ảnh */}
                      {blog.hinh_anh ? (
                          <div style={{ height: "200px", overflow: "hidden", backgroundColor: "#f8f9fa" }}>
                            <img
                              // Nối chuỗi đường dẫn chính xác từ Backend
                              src={`http://localhost:8000/storage/${blog.hinh_anh}`}
                              className="card-img-top w-100 h-100"
                              alt={blog.tieu_de}
                              style={{ objectFit: "cover" }}
                              
                              // QUAN TRỌNG: Nếu ảnh lỗi -> Ẩn thẻ img ngay lập tức
                              onError={(e) => {
                                e.target.style.display = 'none'; 
                                // Có thể ẩn luôn cả div cha nếu muốn: e.target.parentElement.style.display = 'none';
                              }}
                            />
                          </div>
                      ) : (
                          // Nếu không có ảnh -> Không render gì cả (giữ giao diện sạch)
                          null 
                      )}
                      {/* ---------------------- */}
                      
                      <div className="card-body d-flex flex-column">
                        <div className="mb-2 text-muted small">
                          <i className="bi bi-calendar3 me-1"></i>
                          {blog.created_at 
                            ? new Date(blog.created_at).toLocaleDateString("vi-VN") 
                            : "Mới đăng"}
                        </div>

                        <h5 className="card-title fw-bold">
                          <Link to={`/blog/${safeId}`} className="text-decoration-none text-dark">
                            {blog.tieu_de}
                          </Link>
                        </h5>

                        <p className="card-text text-secondary flex-grow-1" style={{ fontSize: "0.9rem" }}>
                          {blog.noi_dung 
                            ? (blog.noi_dung.length > 100 ? blog.noi_dung.substring(0, 100) + "..." : blog.noi_dung) 
                            : "..."}
                        </p>

                        <Link to={`/blog/${safeId}`} className="btn btn-outline-dark btn-sm mt-3 align-self-start">
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