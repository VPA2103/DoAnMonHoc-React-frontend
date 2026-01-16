import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const followers = [
  {
    name: "Afra Harris",
    username: "annabelle___boyle_",
    avatar: "https://via.placeholder.com/50",
  },
  {
    name: "than好huyeng",
    username: "_thanhhuyenn20",
    avatar: "https://via.placeholder.com/50",
  },
  {
    name: "Trần Văn Thuận",
    username: "vthuan.can",
    avatar: "https://via.placeholder.com/50",
  },
  {
    name: "An",
    username: "an27032003",
    avatar: "https://via.placeholder.com/50",
  },
];

export default function DanhSachTheoDoi() {
  return (
    <div className="container mt-3" style={{ maxWidth: 500 }}>
      {/* Header */}
      <div className="d-flex align-items-center mb-3">
        <button className="btn btn-link p-0 me-2">←</button>
        <h5 className="mb-0 flex-grow-1 text-center">Users</h5>
      </div>

      {/* Search */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Tìm kiếm"
      />

      {/* Follower list */}
      <ul className="list-group list-group-flush">
        {followers.map((item, index) => (
          <li
            key={index}
            className="list-group-item d-flex align-items-center"
          >
            <img
              src={item.avatar}
              alt="avatar"
              className="rounded-circle me-3"
              width={48}
              height={48}
            />
            <div className="flex-grow-1">
              <div className="fw-bold">{item.name}</div>
              <div className="text-muted small">{item.username}</div>
            </div>
            <button className="btn btn-danger btn-sm rounded-pill">
              Follow lại
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
