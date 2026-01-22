import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function DanhSachTheoDoi() {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchFollowers();
  }, []);

  // ===============================
  // LẤY DANH SÁCH NGƯỜI THEO DÕI MÌNH
  // ===============================
  const fetchFollowers = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/theo-doi/nguoi-theo-doi",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFollowers(res.data || []);
    } catch (error) {
      console.error("Lỗi lấy danh sách theo dõi:", error);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // FOLLOW / UNFOLLOW
  // ===============================
  const toggleFollow = async (userId, isFollowing) => {
    try {
      if (isFollowing) {
        // BỎ THEO DÕI
        await axios.delete(
          `http://127.0.0.1:8000/api/theo-doi/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // THEO DÕI
        await axios.post(
          `http://127.0.0.1:8000/api/theo-doi/${userId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // CẬP NHẬT UI NGAY
      setFollowers((prev) =>
        prev.map((item) =>
          item.ma_nguoi_dung === userId
            ? { ...item, da_theo_doi: !isFollowing }
            : item
        )
      );
    } catch (error) {
      console.error("Lỗi follow/unfollow:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-danger" />
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: 650 }}>
      {/* HEADER */}
      <div className="d-flex align-items-center mb-4">
        <button
          className="btn btn-light rounded-circle me-3"
          onClick={() => navigate(-1)}
        >
          ←
        </button>
        <h5 className="mb-0 fw-bold flex-grow-1 text-center">
          Người theo dõi bạn
        </h5>
      </div>

      {/* DANH SÁCH */}
      {followers.length > 0 ? (
        <div className="list-group list-group-flush shadow-sm rounded-3">
          {followers.map((item) => (
            <div
              key={item.ma_nguoi_dung}
              className="list-group-item d-flex align-items-center py-3"
            >
              {/* AVATAR */}
              <img
                src={
                  item.anh_dai_dien ||
                  "https://ui-avatars.com/api/?name=" +
                    item.ten_nguoi_dung
                }
                alt="avatar"
                className="rounded-circle me-3"
                width={52}
                height={52}
                style={{ objectFit: "cover" }}
              />

              {/* INFO */}
              <div className="flex-grow-1">
                <div className="fw-semibold">
                  {item.ten_nguoi_dung}
                </div>
                <div className="text-muted small">
                  @{item.username}
                </div>
              </div>

              {/* ACTION */}
              <button
                className={`btn btn-sm rounded-pill ${
                  item.da_theo_doi
                    ? "btn-outline-secondary"
                    : "btn-danger"
                }`}
                onClick={() =>
                  toggleFollow(
                    item.ma_nguoi_dung,
                    item.da_theo_doi
                  )
                }
              >
                {item.da_theo_doi ? "Bỏ theo dõi" : "Follow lại"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted mt-5">
          <i className="bi bi-people fs-1 d-block mb-2" />
          Chưa có người theo dõi
        </div>
      )}
    </div>
  );
}
