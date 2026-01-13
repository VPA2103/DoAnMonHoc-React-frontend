import React from "react";
import "./HomePage.css";

export default function HomePage() {
  const categories = [
    "Món mặn",
    "Món chay",
    "Ăn vặt",
    "Tráng miệng",
    "Healthy",
    "Đồ uống",
  ];

  return (
    <div className="homepage">
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-overlay">
          <h2>Hôm nay ăn gì?</h2>
          <p>Khám phá hàng nghìn công thức nấu ăn mỗi ngày</p>

          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm theo tên món, nguyên liệu..."
            />
            <button>
              🔍
            </button>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="section">
        <h3>Danh mục món ăn</h3>
        <div className="category-grid">
          {categories.map((c) => (
            <div key={c} className="category-card">
              {c}
            </div>
          ))}
        </div>
      </section>

      {/* ===== RECIPES ===== */}
      <section className="section white">
        <h3>Công thức nổi bật</h3>
        <div className="recipe-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="recipe-card">
              <img
                src="https://images.unsplash.com/photo-1512058564366-c9e3e0464b2f"
                alt="recipe"
              />

              <div className="recipe-content">
                <h4>Gà chiên nước mắm</h4>

                <div className="time">
                  ⏱️ 30 phút
                </div>

                <div className="recipe-footer">
                  <div className="stars">
                    ⭐⭐⭐⭐⭐
                  </div>

                  <div className="author">
                    👤 Admin
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== BLOG ===== */}
      <section className="section">
        <h3>Blog ẩm thực</h3>
        <div className="blog-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="blog-card">
              <img
                src="https://images.unsplash.com/photo-1506084868230-bb9d95c24759"
                alt="blog"
              />
              <div className="blog-content">
                <h4>Mẹo nấu ăn ngon mỗi ngày</h4>
                <p>Chia sẻ bí quyết giúp món ăn đậm đà hơn...</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
