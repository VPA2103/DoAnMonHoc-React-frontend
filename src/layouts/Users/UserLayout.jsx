import React from "react";
import { Outlet } from "react-router-dom";
import { BsGear, BsShare } from "react-icons/bs";
import { FaInstagram } from "react-icons/fa"; // Dùng icon react-icons cho đồng bộ
import UserProfileTab from "../../components/UserProfile/UserProfileTab"; // Đảm bảo đường dẫn đúng
import { useAuth } from "../../context/useAuth";

const UserLayout = () => {
  const { user } = useAuth();
  if (!user) return null;
  const secondaryBtnStyle = {
    backgroundColor: "#2F2F2F",
    color: "white",
    border: "none",
  };

  return (
    <div className="bg-black text-white min-vh-100">
      <div className="container py-4" style={{ maxWidth: "1000px" }}>
        <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start mb-4">
          <div className="me-md-4 mb-3 mb-md-0">
            <div
              className="rounded-circle overflow-hidden d-flex justify-content-center align-items-center"
              style={{
                width: "116px",
                height: "116px",
                border: "1px solid #2F2F2F",
              }}
            >
              <img
                src={user.anh_dai_dien}
                alt="Avatar"
                className="w-100 h-100 object-fit-cover"
              />
            </div>
          </div>

          <div className="flex-grow-1 w-100">
            <h2 className="fw-bold mb-1">{user.ten_nguoi_dung}</h2>

            <div className="d-flex align-items-center gap-2 mb-3 mt-2">
              <button
                className="btn fw-semibold px-4 py-1 text-white"
                style={{ backgroundColor: "#FE2C55", border: "none" }}
              >
                Edit profile
              </button>
              <button className="btn py-1 px-2" style={secondaryBtnStyle}>
                <BsGear size={20} />
              </button>
              <button className="btn py-1 px-2" style={secondaryBtnStyle}>
                <BsShare size={20} />
              </button>
            </div>

            <div className="d-flex gap-4 mb-3 text-white-50">
              <div className="d-flex align-items-center gap-1">
                <strong className="text-white">9995</strong> Following
              </div>
              <div className="d-flex align-items-center gap-1">
                <strong className="text-white">1057</strong> Followers
              </div>
              <div className="d-flex align-items-center gap-1">
                <strong className="text-white">729</strong> Likes
              </div>
            </div>

            {/* Dòng 4: Bio */}
            <div className="mb-1">
              <p className="mb-0 text-white">Vào chốt đơn đi nào :&gt;</p>
            </div>

            {/* Dòng 5: Link Instagram */}
            <div className="mb-3">
              <a
                href="#"
                className="text-white text-decoration-none fw-semibold d-flex align-items-center gap-1"
              >
                <FaInstagram /> Instagram: vpa_healthy.beauty
              </a>
            </div>
          </div>
        </div>

        {/* --- PHẦN TABS --- */}
        <UserProfileTab />

        {/* --- NỘI DUNG CON (OUTLET) --- */}
        <div className="row mt-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
