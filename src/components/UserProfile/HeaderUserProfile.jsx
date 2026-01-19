export default function HeaderUserProfile() {
  
  return (
    <div>
      <div className="row mb-4">
        <div className="col-auto">
          <img
            src="https://res.cloudinary.com/dtuffzxyb/image/upload/v1767074639/nhanvien/q6deixcj1sxspzn8cnkn.png"
            className="rounded-circle border border-secondary"
            style={{
              width: "120px",
              height: "120px",
              objectFit: "cover",
            }}
            alt="Avatar"
          />
        </div>
        <div className="col">
          <div className="d-flex align-items-center gap-2 mb-3">
            <h2 className="fw-bold mb-0">vpa_2103</h2>
            <span className="text-secondary">• VPA</span>
          </div>

          <div className="d-flex gap-2 mb-3">
            <button
              className="btn btn-danger btn-sm fw-bold px-4"
              style={{ backgroundColor: "#fe2c55", border: "none" }}
            >
              Edit profile
            </button>
            <button className="btn btn-dark btn-sm fw-bold px-3 bg-opacity-50">
              Promote post
            </button>
            <button className="btn btn-dark btn-sm px-2">
              <i className="bi bi-gear-fill"></i> {/* Cần Bootstrap Icons */}
              ⚙️
            </button>
            <button className="btn btn-dark btn-sm px-2">↗️</button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="d-flex gap-4 mb-3">
        <span>
          <strong>10K</strong>{" "}
          <span className="text-secondary small">Following</span>
        </span>
        <span>
          <strong>1057</strong>{" "}
          <span className="text-secondary small">Followers</span>
        </span>
        <span>
          <strong>729</strong>{" "}
          <span className="text-secondary small">Likes</span>
        </span>
      </div>

      <div className="mb-4 small">
        <p className="mb-0">Vào chốt đơn đi nào {">"}:</p>
        <p className="text-secondary">Instagram: vpa_healthy.beauty</p>
      </div>
    </div>
  );
}
