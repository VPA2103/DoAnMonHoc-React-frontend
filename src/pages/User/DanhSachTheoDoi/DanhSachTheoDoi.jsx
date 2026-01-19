import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { getFollowingUsers } from "../../../services/userService";
import { useOutletContext } from "react-router-dom";


export default function DanhSachTheoDoi() {

const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
   const { setUser } = useOutletContext();

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const res = await getFollowingUsers();
        setFollowing(res.data); // hoặc res.data.data tùy API
      } catch (error) {
        console.error("Lỗi lấy danh sách đang theo dõi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, []);
const handleUnfollow = async (userId) => {
    await axios.delete(`http://127.0.0.1:8000/api/unfollow/${userId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    setFollowing(prev =>
      prev.filter(u => u.ma_nguoi_dung !== userId)
    );

    // 🔥 cập nhật header ngay
    setUser(prev => ({
      ...prev,
      following: prev.following - 1
    }));
  };



  if (loading) return <p>Đang tải...</p>;

  return (
    <div className="container mt-3" style={{ maxWidth: 1000 }}>
    
      <ul className="list-group list-group-flush">
        {following.map((item, index) => (
          <li
            key={index}
            className="list-group-item d-flex align-items-center"
          >
            <img
              src={item.anh_dai_dien}
              alt="avatar"
              className="rounded-circle me-3"
              width={48}
              height={48}
            />
            <div className="flex-grow-1">
              <div className="fw-bold">{item.ten_nguoi_dung}</div>
            </div>
            <button
              className="btn btn-outline-danger btn-sm rounded-pill"
              onClick={() => handleUnfollow(item.ma_nguoi_dung)}
            >
              Hủy theo dõi
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
