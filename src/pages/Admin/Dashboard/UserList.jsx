import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  useEffect(() => {
    fetchUsers();
  }, []);


  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/admin/users",
        {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },}
      );
      // ❌ Loại bỏ admin
      const filteredUsers = res.data.data.filter(
        (user) => user.vai_tro !== "admin"
      );

      setUsers(filteredUsers);
    }catch (error) {
        console.error("Axios error full:", error);

        if (error.response) {
            console.error("STATUS:", error.response.status);
            console.error("DATA:", error.response.data);
        } else if (error.request) {
            console.error("NO RESPONSE FROM SERVER:", error.request);
        } else {
            console.error("ERROR MESSAGE:", error.message);
        }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Danh sách người dùng</h4>

      <table className="table table-bordered table-hover align-middle">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Avatar</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            users.map((user, index) => (
              <tr key={user.ma_nguoi_dung}>
                <td>{index + 1}</td>
                <td>
                  <img
                    src={
                      user.anh_dai_dien
                        ? user.anh_dai_dien
                        : "https://via.placeholder.com/40"
                    }
                    alt="avatar"
                    width="40"
                    height="40"
                    className="rounded-circle"
                  />
                </td>
                <td>{user.ten_nguoi_dung}</td>
                <td>{user.email}</td>
                <td>
                  <span className="badge bg-primary">
                    {user.vai_tro}
                  </span>
                </td>
                <td>
                  {user.trang_thai === 1 ? (
                    <span className="badge bg-success">Hoạt động</span>
                  ) : (
                    <span className="badge bg-secondary">Khóa</span>
                  )}
                </td>
                <td>{user.ngay_tao}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
