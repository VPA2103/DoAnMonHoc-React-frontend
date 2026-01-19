import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { HienDanhSachLenTrangChu } from "../../services/KeHoachBuaAnService";

const KeHoachBuaAnDetailPage = () => {
    const { id } = useParams();
    const [keHoach, setKeHoach] = useState(null);
    const [loading, setLoading] = useState(true);

    const buaAnText = {
        Sang: "Sáng",
        Trua: "Trưa",
        Toi: "Tối",
        Phu: "Phụ",
    };

    useEffect(() => {
        const loadDetail = async () => {
            try {
                const data = await HienDanhSachLenTrangChu();
                const found = data.find(
                    (k) => k.ma_ke_hoach === Number(id)
                );
                setKeHoach(found);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" />
            </div>
        );
    }

    if (!keHoach) {
        return <p className="text-center">Không tìm thấy kế hoạch</p>;
    }

    return (
        <div className="container mt-4">
            <Link to="/KeHoachBuaAn" className="btn btn-outline-secondary mb-3">
                ← Quay lại
            </Link>

            <h4 className="fw-bold">Ngày: {keHoach.ngay}</h4>
            <p>
                <strong>Ghi chú:</strong>{" "}
                {keHoach.ghi_chu || "Không có"}
            </p>

            <div className="row">
                {keHoach.chi_tiet?.map((ct) => (
                    <div key={ct.ma_chi_tiet} className="col-md-4 mb-3">
                        <div className="card h-100 shadow-sm">
                            <img
                                src={
                                    ct.cong_thuc?.anh_cong_thuc
                                        ? `http://localhost:8000/storage/${ct.cong_thuc.anh_cong_thuc}`
                                        : "/no-image.png"
                                }
                                alt={ct.cong_thuc?.ten_cong_thuc}
                                className="card-img-top"
                                style={{ height: 200, objectFit: "cover" }}
                            />
                            <div className="card-body">
                                <h6 className="fw-bold">
                                    {ct.cong_thuc?.ten_cong_thuc}
                                </h6>
                                <span className="badge bg-success">
                                    {buaAnText[ct.bua_an]}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KeHoachBuaAnDetailPage;
