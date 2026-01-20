
import { useState, useRef, useEffect } from "react";
import { BsGear, BsShare } from "react-icons/bs";
import { FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";
import SuaProfile from "../../pages/User/SuaProfile/SuaProfile";
const UserHeader = ({ user }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false); 
    const menuRef = useRef(null);
  const SERVER_URL = "http://127.0.0.1:8000/storage/";
  const secondaryBtnStyle = {
    backgroundColor: "#2F2F2F",
    color: "white",
    border: "none",
  };
  console.log('data: ',user)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
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
            src={
              user?.anh_dai_dien
                ? (user.anh_dai_dien.startsWith('http') 
                    ? user.anh_dai_dien 
                    : `${SERVER_URL}${user.anh_dai_dien}`) 
                : "https://placehold.co/100" 
            }
            alt="Avatar"
            className="w-100 h-100 object-fit-cover"
            onError={(e) => {e.target.src = "https://placehold.co/100"}} 
          />
        </div>
      </div>

      <div className="flex-grow-1 w-100">
        <h2 className="fw-bold mb-1">{user?.ten_nguoi_dung}</h2>

        <div className="d-flex align-items-center gap-2 mb-3 mt-2">
          <button
            className="btn fw-semibold px-4 py-1 text-white"
            style={{ backgroundColor: "#FE2C55", border: "none" }}
              onClick={() => setShowEditModal(true)}  
          >
            Edit profile
          </button>

          <div className="position-relative">
            <button
              className="btn py-1 px-2"
              style={secondaryBtnStyle}
              onClick={() => setShowMenu(!showMenu)}
            >
              <BsGear size={20} />
            </button>

            {showMenu && (
              <div
                ref={menuRef}
                className="position-absolute end-0 mt-2 rounded shadow"
                style={{
                  width: 220,
                  backgroundColor: "#1f1f1f",
                  zIndex: 1000,
                }}
              >
                <Link
                  to="/user/quan-ly/binh-luan"
                  className="d-block px-3 py-2 text-white text-decoration-none"
                  onClick={() => setShowMenu(false)}
                  style={{ cursor: "pointer" }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#2F2F2F")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  🗨️ Quản lý bình luận
                </Link>

                 <Link
                    to="/user/quan-ly/danh-gia"
                    className="d-block px-3 py-2 text-white text-decoration-none"
                    onClick={() => setShowMenu(false)}
                    style={{ cursor: "pointer" }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor = "#2F2F2F")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    ⭐ Quản lý đánh giá
                  </Link>
              </div>
            )}
          </div>

          <button className="btn py-1 px-2" style={secondaryBtnStyle}>
            <BsShare size={20} />
          </button>
        </div>

        <div className="d-flex gap-4 mb-3 text-white-50">
          <div>
            <strong className="text-white">{user?.following}</strong> Following
          </div>
          <div>
            <strong className="text-white">{user?.followers}</strong> Followers
          </div>
        </div>
      </div>

      

      <SuaProfile 
        show={showEditModal} 
        handleClose={() => setShowEditModal(false)} 
        currentUser={user} 
      />
    </div>
  );
};

export default UserHeader;

