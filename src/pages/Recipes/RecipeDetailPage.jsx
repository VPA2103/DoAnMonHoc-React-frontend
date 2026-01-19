import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const RecipeDetailPage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/cong-thucc/${id}`
      );
      setRecipe(res.data.data);
    } catch (error) {
      console.error("Lỗi load chi tiết công thức:", error);
    }
  };

  if (!recipe) return <p>Đang tải...</p>;

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "auto" }}>
      <h1>{recipe.ten_cong_thuc}</h1>

      <img
        src={`http://localhost:8000/storage/${recipe.anh_cong_thuc}`}
        alt={recipe.ten_cong_thuc}
        style={{ width: "100%", borderRadius: 10, marginBottom: 20 }}
      />

      <p>{recipe.mo_ta}</p>

      <p><strong>Độ khó:</strong> {recipe.do_kho}</p>
      <p><strong>Thời gian:</strong> {recipe.thoi_gian_nau} phút</p>
      <p><strong>Danh mục:</strong> {recipe.danh_muc?.ten_danh_muc}</p>
      <p><strong>Tác giả:</strong> {recipe.tac_gia?.ten_nguoi_dung}</p>

      <hr />

      <h3>🧂 Nguyên liệu</h3>
      <ul>
        {recipe.nguyen_lieu.map((nl, i) => (
          <li key={i}>
            {nl.ten_nguyen_lieu} – {nl.so_luong}
          </li>
        ))}
      </ul>

      <h3>🍳 Các bước nấu</h3>
      <ol>
        {recipe.buoc_nau.map((b, i) => (
          <li key={i}>{b.noi_dung}</li>
        ))}
      </ol>
    </div>
  );
};
export default RecipeDetailPage;
