import { useEffect, useState } from "react";
import axios from "axios";
import "../QuanLyBinhLuan/QuanLyBinhLuan.css"; // dùng chung style cho đẹp

const API = "http://localhost:8000/api";

const QuanLyDanhGia = () => {
  const [danhGias, setDanhGias] = useState([]);
  const [editId, setEditId] = useState(null);
  const [star, setStar] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDanhGia();
  }, []);

  // ===== LOAD DANH SÁCH ĐÁNH GIÁ =====
  const fetchDanhGia = async () => {
    try {
      const res = await axios.get(`${API}/user/danh-gia`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      setDanhGias(res.data.data);
    } catch (err) {
      console.error("API ERROR:", err.response?.data || err);
    }
  };

  // ===== XOÁ ĐÁNH GIÁ =====
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá đánh giá này?")) return;

    try {
      await axios.delete(`${API}/danh-gia/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDanhGia();
    } catch (err) {
      console.error("DELETE ERROR:", err.response?.data || err);
    }
  };

  // ===== LƯU SỬA ĐÁNH GIÁ =====
  const handleUpdate = async (id) => {
    try {
      await axios.put(
        `${API}/danh-gia/${id}`,
        { so_sao: star },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditId(null);
      setStar(0);
      fetchDanhGia();
    } catch (err) {
      console.error("UPDATE ERROR:", err.response?.data || err);
    }
  };

  return (
    <div className="qlbl-page">
      <h2 className="qlbl-title">Đánh giá của bạn</h2>

      {danhGias.length === 0 ? (
        <p className="qlbl-empty">Bạn chưa đánh giá công thức nào</p>
      ) : (
        <div className="fb-comment-list">
          {danhGias.map((dg) => (
            <div className="fb-comment" key={dg.id}>
              <div className="fb-bubble">
                <div className="fb-recipe">
                  {dg.cong_thuc?.ten_cong_thuc || "Công thức"}
                </div>

                {/* ===== HIỂN THỊ / SỬA SAO ===== */}
                {editId === dg.id ? (
                  <div style={{ marginTop: 6 }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span
                        key={s}
                        onClick={() => setStar(s)}
                        style={{
                          fontSize: 22,
                          cursor: "pointer",
                          color: s <= star ? "#f5b301" : "#ccc",
                          marginRight: 4,
                        }}
                      >
                        ★
                      </span>
                    ))}

                    <div style={{ marginTop: 6 }}>
                      <button
                        onClick={() => handleUpdate(dg.id)}
                        style={{ marginRight: 6 }}
                      >
                        Lưu
                      </button>
                      <button onClick={() => setEditId(null)}>Huỷ</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ marginTop: 6 }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span
                        key={s}
                        style={{
                          fontSize: 20,
                          color: s <= dg.so_sao ? "#f5b301" : "#ccc",
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="fb-meta">
                <span>
                  {new Date(dg.created_at).toLocaleTimeString("vi-VN")} ·{" "}
                  {new Date(dg.created_at).toLocaleDateString("vi-VN")}
                </span>
                ·
                <button
                  className="fb-edit"
                  onClick={() => {
                    setEditId(dg.id);
                    setStar(dg.so_sao);
                  }}
                >
                  Sửa
                </button>
                ·
                <button
                  className="fb-delete"
                  onClick={() => handleDelete(dg.id)}
                >
                  Xoá
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuanLyDanhGia;
