import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:8000/api";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchRecipes(currentPage);
  }, [currentPage]);

  const fetchRecipes = async (page = 1) => {
    try {
      const res = await axios.get(
        `${API}/cong-thucc?page=${page}`,
        {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
        }
      );

      setRecipes(res.data.data || []);
      setPagination(res.data.pagination || {});
    } catch (error) {
      console.error("Lỗi lấy danh sách công thức:", error);
    }
  };

  // ❤️ Toggle yêu thích
  const handleToggleFavorite = async (e, recipeId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      alert("Vui lòng đăng nhập");
      return;
    }

    try {
      const res = await axios.post(
        `${API}/yeu-thich/toggle`,
        { ma_cong_thuc: recipeId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // dùng liked từ backend trả về
      setRecipes((prev) =>
        prev.map((r) =>
          r.ma_cong_thuc === recipeId
            ? { ...r, is_favorite: res.data.liked }
            : r
        )
      );
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Danh sách công thức</h1>

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20,
        }}
      >
        {recipes.map((recipe) => (
          <Link
            key={recipe.ma_cong_thuc}
            to={`/recipes/${recipe.ma_cong_thuc}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                overflow: "hidden",
                background: "#fff",
              }}
            >
              {/* IMAGE */}
              <div style={{ position: "relative" }}>
                <img
                  src={`http://localhost:8000/storage/${recipe.anh_cong_thuc}`}
                  alt={recipe.ten_cong_thuc}
                  style={{
                    width: "100%",
                    height: 180,
                    objectFit: "cover",
                  }}
                />

                {/* FAVORITE */}
                <span
                  onClick={(e) =>
                    handleToggleFavorite(e, recipe.ma_cong_thuc)
                  }
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    fontSize: 22,
                    cursor: "pointer",
                    background: "rgba(255,255,255,0.8)",
                    borderRadius: "50%",
                    padding: "4px 6px",
                  }}
                >
                  <i
                    className={
                      Number(recipe.is_favorite) === 1 || recipe.is_favorite === true
                        ? "bi bi-heart-fill text-danger"
                        : "bi bi-heart"
                    }
                  ></i>
                </span>
              </div>

              {/* CONTENT */}
              <div style={{ padding: 12 }}>
                <h3 style={{ margin: "8px 0" }}>
                  {recipe.ten_cong_thuc}
                </h3>

                <p>
                  <strong>Danh mục:</strong>{" "}
                  {recipe.danh_muc?.ten_danh_muc}
                </p>
                <p>
                  <strong>Độ khó:</strong> {recipe.do_kho}
                </p>
                <p>
                  <strong>Thời gian:</strong>{" "}
                  {recipe.thoi_gian_nau} phút
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* PAGINATION */}
      <div style={{ marginTop: 30, textAlign: "center" }}>
        {Array.from({ length: pagination.last_page || 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            style={{
              margin: "0 5px",
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #ccc",
              background:
                currentPage === i + 1 ? "#007bff" : "#fff",
              color:
                currentPage === i + 1 ? "#fff" : "#000",
              cursor: "pointer",
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Recipes; 