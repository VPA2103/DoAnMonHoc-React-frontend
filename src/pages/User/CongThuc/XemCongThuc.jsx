// import React, { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "axios";

// const XemCongThuc = () => {
//   const { id } = useParams();
//   const [steps, setSteps] = useState([]);
//   const [congThucInfo, setCongThucInfo] = useState(null); // Chỉ dùng để lấy tên món
//   const [loading, setLoading] = useState(true);

//   const token = localStorage.getItem("token");

//   // Cấu hình URL
//   const BASE_URL = "http://localhost:8000"; 
//   const BUOC_NAU_API = `${BASE_URL}/api/user/buoc-nau`;
//   const CONG_THUC_API = `${BASE_URL}/api/user/cong-thuc`;
  
//   // Đường dẫn để lấy ảnh bước nấu
//   const STORAGE_URL = `${BASE_URL}/storage/`;

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       // 1. Lấy danh sách bước nấu
//       const stepsRes = await axios.get(`${BUOC_NAU_API}/cong-thuc/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       // Sắp xếp theo thứ tự
//       const sortedSteps = stepsRes.data.sort((a, b) => a.so_thu_tu - b.so_thu_tu);
//       setSteps(sortedSteps);

//       // 2. Lấy tên công thức
//       const ctRes = await axios.get(`${CONG_THUC_API}/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setCongThucInfo(ctRes.data);
//     } catch (error) {
//       console.error("Lỗi tải dữ liệu:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (id) fetchData();
//   }, [id]);

//   return (
//     <div className="container mt-5 mb-5">
//       {/* Header: Tên món ăn & Nút quay lại */}
//       <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
//         <h2 className="text-primary fw-bold mb-0">
//           {congThucInfo ? congThucInfo.ten_cong_thuc : "Đang tải..."}
//         </h2>
        
//         <Link to="/user/quanlicongthuc" className="btn btn-outline-secondary">
//           <i className="bi bi-arrow-left me-2"></i>Quay lại
//         </Link>
//       </div>

//       {/* Danh sách các bước nấu */}
//       {loading ? (
//         <div className="text-center py-5">
//           <div className="spinner-border text-primary" />
//           <p className="mt-3 text-muted">Đang tải các bước...</p>
//         </div>
//       ) : steps.length === 0 ? (
//         <div className="alert alert-info text-center py-5">
//           <h5>Chưa có hướng dẫn nấu nào</h5>
//         </div>
//       ) : (
//         <div className="row g-4">
//           {steps.map((step, index) => (
//             <div key={step.ma_buoc_nau} className="col-12">
//               <div className="card shadow-sm border-0">
//                 <div className="card-header bg-white border-bottom-0 pt-3">
//                   <h5 className="text-primary fw-bold">
//                     <span className="badge bg-primary me-2 rounded-circle p-2" style={{width: '40px', height: '40px', lineHeight: '25px'}}>
//                       {index + 1}
//                     </span>
//                     Bước {index + 1}
//                   </h5>
//                 </div>
//                 <div className="card-body">
//                   {/* Nội dung bước nấu */}
//                   <p className="mb-3 fs-5 text-dark" style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>
//                     {step.noi_dung}
//                   </p>
                  
//                   {/* --- CHỈ HIỂN THỊ ẢNH CỦA BƯỚC NẤU TẠI ĐÂY --- */}
//                   {step.hinh_anh && (
//                     <div className="mt-3">
//                       <img
//                         src={`${STORAGE_URL}${step.hinh_anh}`}
//                         alt={`Minh họa bước ${index + 1}`}
//                         className="img-fluid rounded shadow-sm"
//                         style={{ maxHeight: "500px", maxWidth: "100%", objectFit: "contain" }}
//                         onError={(e) => { e.target.style.display = 'none'; }} 
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default XemCongThuc;