import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminCSS/AdminUsers.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:8000/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUsers(res.data.data);
  };

  // ❌ Xoá người dùng
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá người dùng này?")) return;

    await axios.delete(`http://localhost:8000/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchUsers();
  };

  return (
    <div className="admin-users">
      <h2>Quản lý người dùng</h2>

      {/* ➕ THÊM */}
      <button
        className="btn btn-add"
        onClick={() => navigate("/admin/users/create")}
      >
        + Thêm người dùng
      </button>

      <table>
        <thead>
          <tr>
            <th>Ảnh</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.ma_nguoi_dung}>
              <td>
                <img
                  src={u.anh_dai_dien || "https://via.placeholder.com/40"}
                  className="avatar"
                />
              </td>
              <td>{u.ten_nguoi_dung}</td>
              <td>{u.email}</td>

              <td className={u.vai_tro === "admin" ? "role-admin" : "role-user"}>
                {u.vai_tro}
              </td>

              <td
                className={
                  u.trang_thai === 1 ? "status-active" : "status-lock"
                }
              >
                {u.trang_thai === 1 ? "Hoạt động" : "Khoá"}
              </td>

              <td>
                <div className="actions">
                  {/* ✏️ SỬA */}
                  <button
                    className="btn btn-edit"
                    onClick={() =>
                      navigate(`/admin/users/edit/${u.ma_nguoi_dung}`)
                    }
                  >
                    Sửa
                  </button>

                  {/* 🗑 XOÁ */}
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(u.ma_nguoi_dung)}
                  >
                    Xoá
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
