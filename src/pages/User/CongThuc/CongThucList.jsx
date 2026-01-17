import { useEffect, useState } from "react";
import { getAllCongThuc, deleteCongThuc } from "../../../services/CongThucService";
import { Link } from "react-router-dom";

function CongThucList() {
  const [congThucs, setCongThucs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await getAllCongThuc();
      console.log("DATA CÔNG THỨC:", data); // 👈 THÊM DÒNG NÀY
      setCongThucs(data);
    } catch (error) {
      console.error("Lỗi load công thức:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa công thức này không?")) return;

    try {
      const res = await deleteCongThuc(id);
      alert(res.message || "Xóa thành công");
      loadData();
    } catch (error) {
      console.error("Lỗi xóa:", error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Không thể xóa công thức");
      }
    }
  };


  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold"> Danh sách công thức</h3>
        <Link to="/user/quanlicongthuc/them" className="btn btn-primary">
          Thêm công thức
        </Link>
      </div>

      {/* Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" />
            </div>
          ) : congThucs.length === 0 ? (
            <p className="text-center text-muted">
              Chưa có công thức nào
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-dark text-center">
                  <tr>
                    <th style={{ width: "5%" }}>ID</th>
                    <th style={{ width: "12%" }}>Ảnh</th>
                    <th>Tên công thức</th>
                    <th>Danh mục</th>
                    <th style={{ width: "10%" }}>Độ khó</th>
                    <th style={{ width: "10%" }}>Trạng thái</th>
                    <th style={{ width: "15%" }}>Thời gian nấu</th>
                    <th style={{ width: "15%" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {congThucs.map((ct) => (
                    <tr key={ct.ma_cong_thuc}>
                      <td className="text-center">{ct.ma_cong_thuc}</td>
                      <td>
                        {ct.anh_cong_thuc ? (
                          <img
                            src={`http://localhost:8000/storage/${ct.anh_cong_thuc}`}
                            alt={ct.ten_cong_thuc}
                            style={{
                              width: "100px",
                              height: "70px",
                              objectFit: "cover",
                              borderRadius: "6px"
                            }}
                          />

                        ) : (
                          <span className="text-muted">Không có ảnh</span>
                        )}
                      </td>

                      <td>{ct.ten_cong_thuc}</td>
                      <td>{ct.danh_muc?.ten_danh_muc}</td>
                      <td className="text-center">
                        <span
                          className={`badge 
                            ${ct.do_kho === "De"
                              ? "bg-success"
                              : ct.do_kho === "Trung binh"
                                ? "bg-warning text-dark"
                                : ct.do_kho === "Kho"
                                  ? "bg-danger"
                                  : "bg-secondary"
                            }`}
                        >
                          {ct.do_kho === "De"
                            ? "Dễ"
                            : ct.do_kho === "Trung binh"
                              ? "Trung bình"
                              : ct.do_kho === "Kho"
                                ? "Khó"
                                : ""}
                        </span>
                      </td>


                      <td className="text-center">
                        {ct.trang_thai === 1 ? (
                          <span className="badge bg-warning text-dark">
                            Chưa xác nhận
                          </span>
                        ) : (
                          <span className="badge bg-success">
                            Đã xác nhận
                          </span>
                        )}
                      </td>

                      <td className="text-center">
                        {ct.thoi_gian_nau}
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <Link
                            to={`/user/quanlicongthuc/sua/${ct.ma_cong_thuc}`}
                            className="btn btn-sm btn-outline-warning"
                            title="Sửa công thức"
                          >
                            <i className="bi bi-pencil-square me-1"></i>
                            Sửa
                          </Link>

                          <button
                            onClick={() => handleDelete(ct.ma_cong_thuc)}
                            className="btn btn-sm btn-outline-danger"
                            title="Xóa công thức"
                          >
                            <i className="bi bi-trash me-1"></i>
                            Xóa
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CongThucList;
