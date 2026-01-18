import { useEffect, useState } from "react";
import {
  getAllKeHoach,
  deleteKeHoach
} from "../../../services/KeHoachBuaAnService";
import { Link } from "react-router-dom";


const KeHoachBuaAnPage = () => {
  const [keHoachs, setKeHoachs] = useState([]);
  const [loading, setLoading] = useState(true);
  const buaAnText = {
    Sang: "Sáng",
    Trua: "Trưa",
    Toi: "Tối",
    Phu: "Phụ",
  };

  const loadData = async () => {
    try {
      const data = await getAllKeHoach();
      console.log("KẾ HOẠCH:", data);
      setKeHoachs(data);
    } catch (err) {
      console.error("Lỗi load kế hoạch:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa kế hoạch này?")) return;
    await deleteKeHoach(id);
    loadData();
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

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold"> Kế hoạch bữa ăn</h3>
        <Link to="/user/kehoachbuaan/them" className="btn btn-primary">
          Thêm kế hoạch bữa ăn
        </Link>
      </div>
      {keHoachs.length === 0 && (
        <div className="alert alert-secondary text-center">
          Không có kế hoạch nào
        </div>
      )}

      {keHoachs.map((kh, index) => (
        <div key={kh.ma_ke_hoach} className="card mb-3 shadow-sm">
          <div className="card-header d-flex justify-content-between">
            <div>
              <strong>#{index + 1}</strong>
              <div className="text-muted small">{kh.ngay}</div>
            </div>

            <div>
              <Link to={`/user/kehoachbuaan/sua/${kh.ma_ke_hoach}`}>
                <button className="btn btn-outline-warning btn-sm me-2">
                  Sửa
                </button>
              </Link>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => handleDelete(kh.ma_ke_hoach)}
              >
                Xóa
              </button>
            </div>
          </div>

          <div className="card-body">
            <p>
              <strong>Ghi chú:</strong>{" "}
              {kh.ghi_chu || <i>Không có</i>}
            </p>

            <strong>Công thức:</strong>
            {kh.chi_tiet?.length > 0 ? (
              <ul className="mt-2">
                {kh.chi_tiet.map((ct) => (
                  <li key={ct.ma_chi_tiet}>
                    🍲 <b>{ct.cong_thuc?.ten_cong_thuc}</b>
                    <span className="text-muted ms-2">
                      ({buaAnText[ct.bua_an]})
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">Chưa có công thức</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KeHoachBuaAnPage;
