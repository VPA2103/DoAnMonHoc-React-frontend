import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:8000/api";

const RecipeDetailPage = () => {
  const { id } = useParams();

  // ===== AUTH =====
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // ===== CHI TIẾT =====
  const [recipe, setRecipe] = useState(null);

  // ===== BÌNH LUẬN =====
  const [binhLuans, setBinhLuans] = useState([]);
  const [noiDung, setNoiDung] = useState("");
  const [editId, setEditId] = useState(null);

  // ===== ĐÁNH GIÁ =====
  const [avgStar, setAvgStar] = useState(0);
  const [totalRating, setTotalRating] = useState(0);
  const [star, setStar] = useState(0);
  const [ratingId, setRatingId] = useState(null);

  useEffect(() => {
    fetchDetail();
    fetchBinhLuan();
    fetchThongKe();
    if (token) fetchMyRating();
  }, [id]);

  // ===== LOAD CHI TIẾT =====
  const fetchDetail = async () => {
    const res = await axios.get(`${API}/cong-thucc/${id}`);
    setRecipe(res.data.data);
  };

  // ===== LOAD BÌNH LUẬN =====
  const fetchBinhLuan = async () => {
    const res = await axios.get(`${API}/binh-luan/cong-thuc/${id}`);
    setBinhLuans(res.data.data);
  };

  // ===== THỐNG KÊ SAO =====
  const fetchThongKe = async () => {
    const res = await axios.get(`${API}/danh-gia/thong-ke/${id}`);
    setAvgStar(res.data.avg_star || 0);
    setTotalRating(res.data.total || 0);
  };

  // ===== ĐÁNH GIÁ CỦA TÔI =====
  const fetchMyRating = async () => {
    const res = await axios.get(`${API}/user/danh-gia`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const found = res.data.data.find((r) => r.ma_cong_thuc == id);
    if (found) {
      setStar(found.so_sao);
      setRatingId(found.id);
    }
  };

  // ===== GỬI / SỬA ĐÁNH GIÁ =====
  const submitRating = async () => {
    try {
      if (ratingId) {
        await axios.put(
          `${API}/danh-gia/${ratingId}`,
          { so_sao: star },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${API}/danh-gia`,
          { ma_cong_thuc: id, so_sao: star },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      fetchThongKe();
      fetchMyRating();
      alert("⭐ Đánh giá thành công");
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi đánh giá");
    }
  };

  // ===== GỬI / SỬA BÌNH LUẬN =====
  const handleSubmitBinhLuan = async () => {
    if (!noiDung.trim()) return;

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
  };

  // ===== XÓA BÌNH LUẬN =====
  const handleDelete = async (blId) => {
    if (!window.confirm("Xóa bình luận này?")) return;

    await axios.delete(`${API}/user/binh-luan/${blId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchBinhLuan();
  };

  if (!recipe) return <p>Đang tải...</p>;

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
      <h1 style={{ textAlign: "center" }}>{recipe.ten_cong_thuc}</h1>

      {/* ===== ẢNH ===== */}
      <img
        src={`http://localhost:8000/storage/${recipe.anh_cong_thuc}`}
        alt=""
        style={{
          width: 350,
          height: 350,
          objectFit: "cover",
          borderRadius: 12,
          display: "block",
          margin: "20px auto",
        }}
      />

      {/* ===== THÔNG TIN ===== */}
      <p>{recipe.mo_ta}</p>
      <p><b>Độ khó:</b> {recipe.do_kho}</p>
      <p><b>Thời gian:</b> {recipe.thoi_gian_nau} phút</p>
      <p><b>Tác giả:</b> {recipe.tac_gia?.ten_nguoi_dung}</p>

      {/* ===== ĐÁNH GIÁ ===== */}
      <hr />
      <h3 style={{ display: "flex", alignItems: "center", gap: 8 }}>
        ⭐ Đánh giá
      </h3>

      <p style={{ color: "#555" }}>
        Trung bình: <b>{avgStar}</b> ⭐ ({totalRating} lượt)
      </p>

      {token ? (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* SAO */}
          <div style={{ display: "flex", gap: 6 }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                onClick={() => setStar(s)}
                onMouseEnter={() => setStar(s)}
                style={{
                  fontSize: 34,
                  cursor: "pointer",
                  transition: "0.2s",
                  color: s <= star ? "#f5b301" : "#ddd",
                }}
              >
                ★
              </span>
            ))}
          </div>

          {/* BUTTON */}
          <button
            onClick={submitRating}
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              border: "none",
              background: "#f5b301",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
              transition: "0.2s",
            }}
            onMouseOver={(e) => (e.target.style.background = "#e0a800")}
            onMouseOut={(e) => (e.target.style.background = "#f5b301")}
          >
            Gửi đánh giá
          </button>
        </div>
      ) : (
        <p style={{ color: "#999" }}>🔒 Đăng nhập để đánh giá</p>
      )}

      {/* ===== BÌNH LUẬN ===== */}
      <hr />
      <h3>💬 Bình luận</h3>

      {binhLuans.map((bl) => (
        <div key={bl.ma_binh_luan} style={{ borderBottom: "1px solid #eee", paddingBottom: 8 }}>
          <b>{bl.nguoi_dung?.ten_nguoi_dung}</b>
          <p>{bl.noi_dung}</p>

          {user?.ma_nguoi_dung === bl.ma_nguoi_dung && (
            <>
              <button
                onClick={() => {
                  setEditId(bl.ma_binh_luan);
                  setNoiDung(bl.noi_dung);
                }}
              >
                ✏️
              </button>

              <button onClick={() => handleDelete(bl.ma_binh_luan)}>
                🗑️
              </button>
            </>
          )}
        </div>
      ))}

      {token && (
        <div style={{ marginTop: 10 }}>
          <textarea
            rows="3"
            value={noiDung}
            onChange={(e) => setNoiDung(e.target.value)}
            placeholder="Viết bình luận..."
            style={{ width: "100%" }}
          />
          <button onClick={handleSubmitBinhLuan}>
            {editId ? "Cập nhật" : "Gửi"}
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeDetailPage;
