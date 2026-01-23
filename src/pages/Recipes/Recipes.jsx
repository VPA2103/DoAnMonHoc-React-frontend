import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:8000/api";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  // 🔍 FILTER
  const [showFilter, setShowFilter] = useState(false);
  const [maDanhMuc, setMaDanhMuc] = useState("");
  const [doKho, setDoKho] = useState("");
  const [danhMucs, setDanhMucs] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchRecipes(currentPage);
  }, [currentPage, maDanhMuc, doKho]);

  useEffect(() => {
    fetchDanhMuc();
  }, []);

  const fetchDanhMuc = async () => {
    try {
      const res = await axios.get(`${API}/danh-muc`);
      setDanhMucs(res.data.data || []);
    } catch (err) {
      console.error("Lỗi lấy danh mục", err);
    }
  };

  const fetchRecipes = async (page = 1) => {
    try {
      const res = await axios.get(`${API}/cong-thucc`, {
        params: {
          page,
          ma_danh_muc: maDanhMuc || undefined,
          do_kho: doKho || undefined,
        },
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {},
      });

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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRecipes((prev) =>
        prev.map((r) =>
          r.ma_cong_thuc === recipeId
            ? { ...r, is_favorite: res.data.liked }
            : r
        )
      );
    } catch (err) {
      alert("Có lỗi xảy ra");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Danh sách công thức</h1>

        {/* ICON FILTER */}
        <button
          onClick={() => setShowFilter(!showFilter)}
          style={{
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: "6px 10px",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          <i className="bi bi-funnel"></i>
        </button>
      </div>

      {/* FILTER BOX */}
      {showFilter && (
        <div
          style={{
            margin: "15px 0",
            padding: 15,
            border: "1px solid #ddd",
            borderRadius: 10,
            display: "flex",
            gap: 10,
          }}
        >
          <select
            value={maDanhMuc}
            onChange={(e) => {
              setCurrentPage(1);
              setMaDanhMuc(e.target.value);
            }}
          >
            <option value="">-- Tất cả danh mục --</option>
            {danhMucs.map((dm) => (
              <option key={dm.ma_danh_muc} value={dm.ma_danh_muc}>
                {dm.ten_danh_muc}
              </option>
            ))}
          </select>

          <select
            value={doKho}
            onChange={(e) => {
              setCurrentPage(1);
              setDoKho(e.target.value);
            }}
          >
            <option value="">-- Tất cả độ khó --</option>
            <option value="De">Dễ</option>
            <option value="Trung binh">Trung bình</option>
            <option value="Kho">Khó</option>
          </select>

          <button
            onClick={() => {
              setMaDanhMuc("");
              setDoKho("");
            }}
          >
            Reset
          </button>
        </div>
      )}

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
              <div style={{ position: "relative" }}>
                <img
                  src={`http://localhost:8000/storage/${recipe.anh_cong_thuc}`}
                  alt={recipe.ten_cong_thuc}
                  style={{ width: "100%", height: 180, objectFit: "cover" }}
                />

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
                      recipe.is_favorite
                        ? "bi bi-heart-fill text-danger"
                        : "bi bi-heart"
                    }
                  ></i>
                </span>
              </div>

              <div style={{ padding: 12 }}>
                <h3>{recipe.ten_cong_thuc}</h3>
                <p><b>Danh mục:</b> {recipe.danh_muc?.ten_danh_muc}</p>
                <p><b>Độ khó:</b> {recipe.do_kho}</p>
                <p><b>Thời gian:</b> {recipe.thoi_gian_nau} phút</p>
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
