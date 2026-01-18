import { useEffect, useState } from "react";
import axios from "axios";
import "./QuanLyBinhLuan.css";

const QuanLyBinhLuan = () => {
  const [binhLuans, setBinhLuans] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBinhLuan();
  }, []);

  const fetchBinhLuan = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/binh-luan/cua-toi",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      setBinhLuans(res.data.data);
    } catch (err) {
      console.error("API ERROR:", err.response?.data || err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá bình luận này?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/binh-luan/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchBinhLuan();
    } catch (err) {
      console.error("DELETE ERROR:", err.response?.data || err);
    }
  };

  return (
    <div className="qlbl-page">
      <h2 className="qlbl-title">Bình luận của bạn</h2>

      {binhLuans.length === 0 ? (
        <p className="qlbl-empty">Bạn chưa có bình luận nào</p>
      ) : (
        <div className="fb-comment-list">
          {binhLuans.map((bl) => (
            <div className="fb-comment" key={bl.ma_binh_luan}>
              <div className="fb-bubble">
                <div className="fb-recipe">
                  {bl.cong_thuc?.ten_cong_thuc || "Công thức"}
                </div>
                <div className="fb-content">{bl.noi_dung}</div>
              </div>

              <div className="fb-meta">
                <span>
                  {new Date(bl.created_at).toLocaleTimeString("vi-VN")} ·{" "}
                  {new Date(bl.created_at).toLocaleDateString("vi-VN")}
                </span>
                ·
                <button
                  className="fb-delete"
                  onClick={() => handleDelete(bl.ma_binh_luan)}
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

export default QuanLyBinhLuan;