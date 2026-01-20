import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:8000/api";

const RecipeDetailPage = () => {
  const { id } = useParams();

  // ===== CHI TIẾT CÔNG THỨC =====
  const [recipe, setRecipe] = useState(null);

  // ===== BÌNH LUẬN =====
  const [binhLuans, setBinhLuans] = useState([]);
  const [noiDung, setNoiDung] = useState("");
  const [editId, setEditId] = useState(null);

  // ⚠️ FIX CHỖ NÀY – KEY PHẢI ĐÚNG
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchDetail();
    fetchBinhLuan();
  }, [id]);

  // ===== LOAD CHI TIẾT =====
  const fetchDetail = async () => {
    try {
      const res = await axios.get(`${API}/cong-thucc/${id}`);
      setRecipe(res.data.data);
    } catch (error) {
      console.error("Lỗi load chi tiết:", error);
    }
  };

  // ===== LOAD BÌNH LUẬN =====
  const fetchBinhLuan = async () => {
    try {
      const res = await axios.get(`${API}/binh-luan/cong-thuc/${id}`);
      setBinhLuans(res.data.data);
    } catch (error) {
      console.error("Lỗi load bình luận:", error);
    }
  };

  // ===== THÊM / SỬA =====
  const handleSubmitBinhLuan = async () => {
    if (!noiDung.trim()) return;

    try {
      if (editId) {
        await axios.put(
          `${API}/user/binh-luan/${editId}`,
          { noi_dung: noiDung },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEditId(null);
      } else {
        await axios.post(
          `${API}/user/binh-luan`,
          { ma_cong_thuc: id, noi_dung: noiDung },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setNoiDung("");
      fetchBinhLuan();
    } catch (error) {
      console.error("Lỗi gửi bình luận:", error.response?.data || error);
    }
  };

  // ===== SỬA =====
  const handleEdit = (bl) => {
    setEditId(bl.ma_binh_luan);
    setNoiDung(bl.noi_dung);
  };

  // ===== XÓA =====
  const handleDelete = async (idBinhLuan) => {
    if (!window.confirm("Xóa bình luận này?")) return;

    try {
      await axios.delete(`${API}/user/binh-luan/${idBinhLuan}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBinhLuan();
    } catch (error) {
      console.error("Lỗi xóa bình luận:", error);
    }
  };

  if (!recipe) return <p style={{ textAlign: "center" }}>Đang tải...</p>;

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
      {/* ===== TÊN ===== */}
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>
        {recipe.ten_cong_thuc}
      </h1>

      {/* ===== ẢNH ĐẸP ===== */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}>
        <div
          style={{
            width: 360,
            height: 360,
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          }}
        >
          <img
            src={`http://localhost:8000/storage/${recipe.anh_cong_thuc}`}
            alt={recipe.ten_cong_thuc}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      </div>

      {/* ===== THÔNG TIN ===== */}
      <p>{recipe.mo_ta}</p>
      <p><strong>Độ khó:</strong> {recipe.do_kho}</p>
      <p><strong>Thời gian:</strong> {recipe.thoi_gian_nau} phút</p>
      <p><strong>Danh mục:</strong> {recipe.danh_muc?.ten_danh_muc}</p>
      <p><strong>Tác giả:</strong> {recipe.tac_gia?.ten_nguoi_dung}</p>

      <hr />

      {/* ===== NGUYÊN LIỆU ===== */}
      <h3>🧂 Nguyên liệu</h3>
      <ul>
        {recipe.nguyen_lieu?.map((nl, i) => (
          <li key={i}>
            {nl.ten_nguyen_lieu} – {nl.so_luong}
          </li>
        ))}
      </ul>

      {/* ===== CÁC BƯỚC ===== */}
      <h3>🍳 Các bước nấu</h3>
      <ol>
        {recipe.buoc_nau?.map((b, i) => (
          <li key={i}>{b.noi_dung}</li>
        ))}
      </ol>

      {/* ===== BÌNH LUẬN ===== */}
      <hr />
      <h3>💬 Bình luận</h3>

      {binhLuans.length === 0 && <p>Chưa có bình luận nào.</p>}

      {binhLuans.map((bl) => (
        <div
          key={bl.ma_binh_luan}
          style={{
            borderBottom: "1px solid #eee",
            padding: "12px 0",
          }}
        >
          <strong>{bl.nguoi_dung?.ten_nguoi_dung}</strong>
          <p style={{ margin: "6px 0" }}>{bl.noi_dung}</p>
          <small>
            {new Date(bl.created_at).toLocaleString("vi-VN")}
          </small>

          {user?.ma_nguoi_dung === bl.ma_nguoi_dung && (
            <div style={{ marginTop: 6 }}>
              <button onClick={() => handleEdit(bl)}>✏️ Sửa</button>
              <button
                onClick={() => handleDelete(bl.ma_binh_luan)}
                style={{ marginLeft: 10 }}
              >
                🗑️ Xóa
              </button>
            </div>
          )}
        </div>
      ))}

      {/* ===== FORM ===== */}
      {token ? (
        <div style={{ marginTop: 20 }}>
          <textarea
            rows="3"
            value={noiDung}
            onChange={(e) => setNoiDung(e.target.value)}
            placeholder="Viết bình luận..."
            style={{ width: "100%", padding: 10 }}
          />
          <button onClick={handleSubmitBinhLuan} style={{ marginTop: 10 }}>
            {editId ? "💾 Cập nhật" : "➕ Gửi bình luận"}
          </button>
        </div>
      ) : (
        <p>🔒 Đăng nhập để bình luận</p>
      )}
    </div>
  );
};

export default RecipeDetailPage;
