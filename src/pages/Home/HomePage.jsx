import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HienDanhSachLenTrangChu } from "../../services/KeHoachBuaAnService";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HomePage.css";

const API_URL = "http://127.0.0.1:8000/api";

export default function HomePage() {
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [keHoachs, setKeHoachs] = useState([]);

  // 🔍 SEARCH
  const [keyword, setKeyword] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  /* ===== LOAD DANH MỤC ===== */
  useEffect(() => {
    axios
      .get(`${API_URL}/danh-muc`)
      .then((res) => setCategories(res.data.data || []));
  }, []);

  /* ===== LOAD KẾ HOẠCH ===== */
  useEffect(() => {
    HienDanhSachLenTrangChu()
      .then((data) => setKeHoachs(data.slice(0, 8)));
  }, []);

  /* ===== CLICK NGOÀI SEARCH ===== */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResult(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ===== SEARCH REALTIME ===== */
  const handleSearch = async (value) => {
    setKeyword(value);

    if (!value.trim()) {
      setShowResult(false);
      return;
    }

    const res = await axios.get(`${API_URL}/search?q=${value}`);
    setSearchResult(res.data.data);
    setShowResult(true);
  };

  /* ===== ẢNH NGẪU NHIÊN ===== */
  const getRandomImage = (keHoach) => {
    const images = [];
    keHoach.chi_tiet?.forEach((ct) => {
      if (ct.cong_thuc?.anh_cong_thuc) {
        images.push(ct.cong_thuc.anh_cong_thuc);
      }
    });

    if (images.length === 0) {
      return "/images/meal-plan.jpg";
    }

    const i = Math.floor(Math.random() * images.length);
    return `http://localhost:8000/storage/${images[i]}`;
  };

  const getSoMonAn = (keHoach) => keHoach.chi_tiet?.length || 0;

  return (
    <div className="homepage">
      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="hero-overlay">
          <h2>Hôm nay ăn gì?</h2>
          <p>Khám phá kế hoạch bữa ăn & công thức mỗi ngày</p>

          {/* 🔍 SEARCH BOX (GIỮ STYLE CŨ) */}
          <div className="search-wrapper position-relative mx-auto" ref={searchRef} style={{ maxWidth: 600 }}>

            {/* Ô search */}
            <div className="search-box">
              <input
                type="text"
                placeholder="Tìm theo tên món, danh mục..."
                value={keyword}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => keyword && setShowResult(true)}
              />
              <button>🔍</button>
            </div>

            {/* 🔽 KẾT QUẢ SEARCH */}
            {showResult && searchResult && (
              <div
                className="position-absolute start-0 end-0 bg-white rounded shadow mt-2"
                style={{ zIndex: 9999 }}
              >
                <div className="list-group list-group-flush text-start">

                  {searchResult.cong_thuc?.length > 0 && (
                    <>
                      <div className="list-group-item fw-bold">🍳 Công thức</div>
                      {searchResult.cong_thuc.map((ct) => (
                        <button
                          key={ct.ma_cong_thuc}
                          className="list-group-item list-group-item-action"
                          onClick={() => navigate(`/congthuc/${ct.slug}`)}
                        >
                          {ct.ten_cong_thuc}
                        </button>
                      ))}
                    </>
                  )}

                  {searchResult.ke_hoach?.length > 0 && (
                    <>
                      <div className="list-group-item fw-bold">📅 Kế hoạch</div>
                      {searchResult.ke_hoach.map((kh) => (
                        <button
                          key={kh.ma_ke_hoach}
                          className="list-group-item list-group-item-action"
                          onClick={() =>
                            navigate(`/kehoachbuaan/${kh.ma_ke_hoach}`)
                          }
                        >
                          {kh.ngay} – {kh.ghi_chu || "Không ghi chú"}
                        </button>
                      ))}
                    </>
                  )}

                  {searchResult.danh_muc?.length > 0 && (
                    <>
                      <div className="list-group-item fw-bold">📂 Danh mục</div>
                      {searchResult.danh_muc.map((dm) => (
                        <button
                          key={dm.ma_danh_muc}
                          className="list-group-item list-group-item-action"
                          onClick={() =>
                            navigate(`/danhmuc/${dm.ma_danh_muc}`)
                          }
                        >
                          {dm.ten_danh_muc}
                        </button>
                      ))}
                    </>
                  )}

                  {searchResult.blog?.length > 0 && (
                    <>
                      <div className="list-group-item fw-bold">📰 Blog</div>
                      {searchResult.blog.map((b) => (
                        <button
                          key={b.ma_blog}
                          className="list-group-item list-group-item-action"
                          onClick={() => navigate(`/blog/${b.slug}`)}
                        >
                          {b.tieu_de}
                        </button>
                      ))}
                    </>
                  )}

                  {Object.values(searchResult).every(
                    (arr) => arr.length === 0
                  ) && (
                      <div className="list-group-item text-muted text-center">
                        Không tìm thấy kết quả
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= DANH MỤC ================= */}
      <section className="section">
        <h3>Danh mục món ăn</h3>
        <div className="category-grid">
          {categories.map((c) => (
            <div
              key={c.ma_danh_muc}
              className="category-card"
              onClick={() => navigate(`/danhmuc/${c.ma_danh_muc}`)}
            >
              {c.ten_danh_muc}
            </div>
          ))}
        </div>
      </section>

      {/* ================= KẾ HOẠCH ================= */}
      <section className="section white">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>📅 Kế hoạch bữa ăn</h3>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => navigate("/kehoachbuaan")}
          >
            Xem tất cả →
          </button>
        </div>

        <div className="row">
          {keHoachs.map((kh) => (
            <div
              key={kh.ma_ke_hoach}
              className="col-lg-3 col-md-4 col-sm-6 mb-4"
            >
              <div
                className="card h-100 shadow-sm"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  navigate(`/kehoachbuaan/${kh.ma_ke_hoach}`)
                }
              >
                <div className="position-relative">
                  <img
                    src={getRandomImage(kh)}
                    className="card-img-top"
                    style={{ height: 140, objectFit: "cover" }}
                    alt=""
                  />
                  <span
                    className="badge bg-dark position-absolute"
                    style={{ top: 8, right: 8 }}
                  >
                    🍽 {getSoMonAn(kh)} món
                  </span>
                </div>

                <div className="card-body text-center">
                  <h6 className="fw-bold mb-1">{kh.ngay}</h6>
                  <p className="text-muted small mb-0">
                    {kh.ghi_chu || "Không có ghi chú"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
