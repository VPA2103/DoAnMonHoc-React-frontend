// import React from "react";
// import { NavLink } from "react-router-dom";

// export default function RecipeEditMenu({ id }) {
//   // Style giống hệt UserProfileTab của bạn
//   const activeStyle = "nav-link bg-transparent text-primary border-0 border-bottom border-2 border-primary fw-bold px-3";
//   const normalStyle = "nav-link bg-transparent text-secondary border-0 px-3 hover-text-primary";

//   return (
//     <div className="mb-4">
//       {/* Tiêu đề điều hướng */}
//       <div className="d-flex align-items-center justify-content-between mb-3">
//         <h4 className="fw-bold">Chỉnh sửa món ăn</h4>
//         <NavLink to="/user/quanlicongthuc" className="btn btn-outline-secondary btn-sm">
//           <i className="bi bi-arrow-return-left"></i> Quay lại danh sách
//         </NavLink>
//       </div>

//       {/* Thanh TAB điều hướng */}
//       <ul className="nav nav-tabs border-bottom-0">
        
//         {/* Tab 1: Thông tin chung */}
//         <li className="nav-item">
//           <NavLink
//             to={`/user/quanlicongthuc/sua/${id}`}
//             end // Dùng end để không bị active nhầm khi vào trang con
//             className={({ isActive }) => (isActive ? activeStyle : normalStyle)}
//           >
//             <i className="bi bi-info-circle me-2"></i> Thông tin chung
//           </NavLink>
//         </li>

//         <li className="nav-item">
//           <NavLink
//             to={`/user/quanlicongthuc/sua/${id}/buoc-nau`} 
//             className={({ isActive }) => (isActive ? activeStyle : normalStyle)}
//           >
//             <i className="bi bi-list-ol me-2"></i> Các bước nấu
//           </NavLink>
//         </li>

//       </ul>
//       <hr className="mt-0 text-secondary" />
//     </div>
//   );
// }