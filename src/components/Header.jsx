import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [showQA, setShowQA] = useState(false);
  const [noiDung, setNoiDung] = useState("");
  const [loading, setLoading] = useState(false);

  const qaRef = useRef(null);

  // đóng form khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (qaRef.current && !qaRef.current.contains(e.target)) {
        setShowQA(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleQAClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setShowQA((prev) => !prev);
  };

  const handleSubmitQA = async () => {
    if (!noiDung.trim()) {
      alert("Vui lòng nhập nội dung câu hỏi");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:8000/api/cau-hoi",
        { noi_dung: noiDung },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Gửi câu hỏi thành công");
      setNoiDung("");
      setShowQA(false);
    } catch (err) {
      console.error(err);
      alert("❌ Gửi câu hỏi thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ===== TOP HEADER ===== */}
      <div className="bg-dark py-2">
        <div className="container d-flex align-items-center justify-content-between">
          <div className="text-white fw-bold">LOGO</div>

          <div className="w-50">
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm..."
            />
          </div>

          <div className="text-white d-flex gap-3 align-items-center fs-5">
            {/* ===== Q&A ===== */}
            <div ref={qaRef} style={{ position: "relative" }}>
              <i
                className="bi bi-chat-dots"
                style={{ cursor: "pointer" }}
                onClick={handleQAClick}
              ></i>

              {showQA && (
                <div
                  className="bg-white text-dark p-3 rounded shadow"
                  style={{
                    position: "absolute",
                    top: "130%",
                    right: 0,
                    width: "280px",
                    zIndex: 999,
                  }}
                >
                  <h6 className="mb-2">Gửi câu hỏi</h6>

                  <textarea
                    className="form-control mb-2"
                    rows="3"
                    placeholder="Nhập câu hỏi..."
                    value={noiDung}
                    onChange={(e) => setNoiDung(e.target.value)}
                  />

                  <button
                    className="btn btn-primary btn-sm w-100"
                    onClick={handleSubmitQA}
                    disabled={loading}
                  >
                    {loading ? "Đang gửi..." : "Gửi"}
                  </button>
                </div>
              )}
            </div>

            {/* ===== USER ===== */}
            {user ? (
              <>
                <span
                  className="fw-semibold"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/user/profile")}
                >
                  {user.ten_nguoi_dung}
                </span>

                <button className="btn btn-danger btn-sm" onClick={logout}>
                  Đăng xuất
                </button>
              </>
            ) : (
              <i
                className="bi bi-person"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/login")}
              ></i>
            )}
          </div>
        </div>
      </div>

      {/* ===== MENU  ===== */}
      <nav className="bg-light border-bottom">
        <div className="container">
          <ul className="nav">
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/">
                Trang chủ
              </Link>
            </li>

            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle text-dark"
                data-bs-toggle="dropdown"
                to=""
              >
                Blog
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/user/blog">
                    Quản lý blog cá nhân
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/blogs">
                    Xem blog
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <Link className="nav-link text-dark" to="/contact">
                Trang liên hệ
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link text-dark" to="/recipes">
                Danh sách công thức
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link text-dark" to="/KeHoachBuaAn">
                Kế hoạch bữa ăn
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link text-dark" to="/feed-blogs">
                Bài đăng người theo dõi
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Header;