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

  // ===== FOLLOW =====
  const [isFollowing, setIsFollowing] = useState(false);

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

  // Khi đã có recipe → mới check follow
  useEffect(() => {
    if (token && recipe) {
      checkFollowing();
    }
  }, [recipe]);

  // ===== LOAD CHI TIẾT =====
  const fetchDetail = async () => {
    const res = await axios.get(`${API}/cong-thucc/${id}`);
    setRecipe(res.data.data);
  };

  // ===== CHECK FOLLOW =====
  const checkFollowing = async () => {
    const res = await axios.get(`${API}/user/following`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const authorId = recipe?.tac_gia?.ma_nguoi_dung;
    setIsFollowing(
      res.data.data.some((u) => u.ma_nguoi_dung === authorId)
    );
  };

  // ===== TOGGLE FOLLOW =====
  const handleFollow = async () => {
    const authorId = recipe?.tac_gia?.ma_nguoi_dung;
    if (!authorId) return;

    try {
      if (isFollowing) {
        await axios.delete(`${API}/unfollow/${authorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFollowing(false);
      } else {
        await axios.post(
          `${API}/follow/${authorId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsFollowing(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi theo dõi");
    }
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

  const author = recipe.tac_gia;

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

      {/* ===== TÁC GIẢ + FOLLOW ===== */}
      {author && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <img
            src={author.anh_dai_dien}
            alt=""
            style={{ width: 48, height: 48, borderRadius: "50%" }}
          />

          <div>
            <b>{author.ten_nguoi_dung}</b>

            {token &&
              user?.ma_nguoi_dung !== author.ma_nguoi_dung && (
                <div>
                  <button
                    onClick={handleFollow}
                    style={{
                      marginTop: 4,
                      padding: "4px 12px",
                      borderRadius: 20,
                      border: "none",
                      cursor: "pointer",
                      background: isFollowing ? "#ccc" : "#1877f2",
                      color: isFollowing ? "#000" : "#fff",
                    }}
                  >
                    {isFollowing ? "Đang theo dõi" : "Theo dõi"}
                  </button>
                </div>
              )}
          </div>
        </div>
      )}

      {/* ===== THÔNG TIN ===== */}
      <p>{recipe.mo_ta}</p>
      <p>
        <b>Độ khó:</b> {recipe.do_kho}
      </p>
      <p>
        <b>Thời gian:</b> {recipe.thoi_gian_nau} phút
      </p>

      {/* ===== ĐÁNH GIÁ ===== */}
      <hr />
      <h3>⭐ Đánh giá</h3>

      <p>
        Trung bình: <b>{avgStar}</b> ⭐ ({totalRating} lượt)
      </p>

      {token ? (
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <span
              key={s}
              onClick={() => setStar(s)}
              style={{
                fontSize: 32,
                cursor: "pointer",
                color: s <= star ? "#f5b301" : "#ddd",
              }}
            >
              ★
            </span>
          ))}

          <button onClick={submitRating}>Gửi đánh giá</button>
        </div>
      ) : (
        <p>🔒 Đăng nhập để đánh giá</p>
      )}

      {/* ===== BÌNH LUẬN ===== */}
      <hr />
      <h3>💬 Bình luận</h3>

      {binhLuans.map((bl) => (
        <div key={bl.ma_binh_luan}>
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
        <>
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
        </>
      )}
    </div>
  );
};

export default RecipeDetailPage;
