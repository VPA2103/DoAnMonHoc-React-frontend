import React, { useEffect, useState } from "react";
import axios from "axios";

const QuanLyCauHoiVaTraLoi = () => {
  const [cauHois, setCauHois] = useState([]);
  const [traLoi, setTraLoi] = useState({});
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // 🔹 Lấy danh sách câu hỏi
  const fetchCauHoi = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/admin/cau-hoi",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCauHois(res.data.data);
    } catch (err) {
      console.error("Lỗi lấy câu hỏi", err);
    }
  };

  useEffect(() => {
    fetchCauHoi();
  }, []);

  // 🔹 Gửi trả lời
  const handleTraLoi = async (maCauHoi) => {
    if (!traLoi[maCauHoi]?.trim()) {
      alert("Chưa nhập câu trả lời");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `http://localhost:8000/api/admin/cau-hoi/${maCauHoi}/tra-loi`,
        { noi_dung: traLoi[maCauHoi] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Trả lời thành công");
      setTraLoi({ ...traLoi, [maCauHoi]: "" });
      fetchCauHoi();
    } catch (err) {
      console.error("Lỗi trả lời", err);
      alert("Trả lời thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">📩 Quản lý câu hỏi & trả lời</h3>

      {cauHois.length === 0 && <p>Chưa có câu hỏi nào</p>}

      {cauHois.map((cauHoi) => (
        <div key={cauHoi.ma_cau_hoi} className="card mb-3">
          <div className="card-body">
            <p>
              <strong>Người hỏi:</strong>{" "}
              {cauHoi.nguoi_dung?.ten_nguoi_dung || "Ẩn danh"}
            </p>

            <p>
              <strong>Câu hỏi:</strong> {cauHoi.noi_dung}
            </p>

            {/* Hiển thị trả lời nếu có */}
            {cauHoi.tra_lois?.length > 0 && (
              <div className="alert alert-success">
                <strong>Admin trả lời:</strong>{" "}
                {cauHoi.tra_lois[0].noi_dung}
              </div>
            )}

            {/* Form trả lời */}
            <textarea
              className="form-control mb-2"
              rows="2"
              placeholder="Nhập câu trả lời..."
              value={traLoi[cauHoi.ma_cau_hoi] || ""}
              onChange={(e) =>
                setTraLoi({
                  ...traLoi,
                  [cauHoi.ma_cau_hoi]: e.target.value,
                })
              }
            />

            <button
              className="btn btn-primary btn-sm"
              onClick={() => handleTraLoi(cauHoi.ma_cau_hoi)}
              disabled={loading}
            >
              {loading ? "Đang gửi..." : "Trả lời"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuanLyCauHoiVaTraLoi;
