import React, { useEffect, useState } from "react";
import axios from "axios";

const QuanLyCauHoi = () => {
  const [cauHois, setCauHois] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCauHoi();
  }, []);

  const fetchCauHoi = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:8000/api/cau-hoi-cua-toi",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCauHois(res.data.data);
    } catch (err) {
      console.error("Lỗi lấy câu hỏi", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mt-4">Đang tải...</div>;
  }

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Câu hỏi của tôi</h4>

      {cauHois.length === 0 ? (
        <div className="alert alert-info">
          Bạn chưa gửi câu hỏi nào
        </div>
      ) : (
        cauHois.map((cauHoi) => (
          <div
            key={cauHoi.ma_cau_hoi}
            className="card mb-3 shadow-sm"
          >
            <div className="card-body">
              {/* CÂU HỎI */}
              <p className="fw-semibold mb-2">
                ❓ {cauHoi.noi_dung}
              </p>

              {/* CÂU TRẢ LỜI */}
              {cauHoi.tra_lois && cauHoi.tra_lois.length > 0 ? (
                <div className="bg-light p-2 rounded">
                  <p className="mb-1 fw-semibold text-success">
                    💬 Trả lời từ Admin:
                  </p>

                  {cauHoi.tra_lois.map((tl) => (
                    <p
                      key={tl.id}
                      className="mb-1 ps-2"
                    >
                      - {tl.noi_dung}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-muted fst-italic mb-0">
                  ⏳ Chưa có câu trả lời
                </p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default QuanLyCauHoi;
