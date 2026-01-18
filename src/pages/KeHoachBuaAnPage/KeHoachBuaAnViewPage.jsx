import { useEffect, useState } from "react";
import { getAllKeHoach } from "../../services/KeHoachBuaAnService";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 8;

const KeHoachBuaAnListPage = () => {
  const [keHoachs, setKeHoachs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getAllKeHoach();
        setKeHoachs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const totalPages = Math.ceil(keHoachs.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const currentData = keHoachs.slice(startIndex, startIndex + PAGE_SIZE);

  // 🔥 LẤY ẢNH NGẪU NHIÊN
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

    const randomIndex = Math.floor(Math.random() * images.length);
    return `http://localhost:8000/storage/${images[randomIndex]}`;
  };

  // 🔥 ĐẾM SỐ MÓN ĂN
  const getSoMonAn = (keHoach) => {
    return keHoach.chi_tiet?.length || 0;
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h3 className="fw-bold mb-4 text-center">
        📅 Kế hoạch bữa ăn
      </h3>

      <div className="row">
        {currentData.map((kh) => (
          <div
            key={kh.ma_ke_hoach}
            className="col-lg-3 col-md-4 col-sm-6 mb-4"
          >
            <div
              className="card h-100 shadow-sm kehoach-card"
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate(`/kehoachbuaan/${kh.ma_ke_hoach}`)
              }
            >
              {/* ẢNH + BADGE */}
              <div className="position-relative">
                <img
                  src={getRandomImage(kh)}
                  alt="Kế hoạch bữa ăn"
                  className="card-img-top"
                  style={{
                    height: 140,
                    objectFit: "cover",
                  }}
                />

                {/* ✅ SỐ LƯỢNG MÓN */}
                <span
                  className="badge bg-dark position-absolute"
                  style={{
                    top: 8,
                    right: 8,
                    fontSize: 12,
                  }}
                >
                  🍽 {getSoMonAn(kh)} món
                </span>
              </div>

              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <h6 className="fw-bold text-center mb-2">
                    {kh.ngay}
                  </h6>

                  <p
                    className="text-muted small text-center"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {kh.ghi_chu || "Không có ghi chú"}
                  </p>
                </div>

                <div className="text-center mt-2">
                  <span className="badge bg-primary">
                    Xem chi tiết
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PHÂN TRANG */}
      {totalPages > 1 && (
        <nav className="d-flex justify-content-center mt-4">
          <ul className="pagination">
            <li className={`page-item ${page === 1 && "disabled"}`}>
              <button
                className="page-link"
                onClick={() => setPage(page - 1)}
              >
                ‹
              </button>
            </li>

            {Array.from({ length: totalPages }).map((_, i) => (
              <li
                key={i}
                className={`page-item ${
                  page === i + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${
                page === totalPages && "disabled"
              }`}
            >
              <button
                className="page-link"
                onClick={() => setPage(page + 1)}
              >
                ›
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default KeHoachBuaAnListPage;
