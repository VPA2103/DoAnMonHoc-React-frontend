import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminCSS/AdminEditUser.css"
const AdminEditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    ten_nguoi_dung: "",
    email: "",
    vai_tro: "user",
    trang_thai: 1,
    anh_dai_dien: null,
  });

  // ===== LOAD USER =====
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const user = res.data.data;

        setForm({
          ten_nguoi_dung: user.ten_nguoi_dung || "",
          email: user.email || "",
          vai_tro: user.vai_tro || "user",
          trang_thai: Number(user.trang_thai ?? 1),
          anh_dai_dien: null,
        });
      } catch (err) {
        console.error(err);
        alert("Không tải được dữ liệu người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  // ===== SUBMIT =====
  const submit = async () => {
    try {
      const data = new FormData();
      data.append("ten_nguoi_dung", form.ten_nguoi_dung);
      data.append("email", form.email);
      data.append("vai_tro", form.vai_tro);
      data.append("trang_thai", form.trang_thai);

      if (form.anh_dai_dien) {
        data.append("anh_dai_dien", form.anh_dai_dien);
      }

      await axios.post(
        `http://localhost:8000/api/users/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Cập nhật thành công");
      navigate("/admin/users");
    } catch (err) {
      if (err.response?.status === 422) {
        alert(Object.values(err.response.data.errors).join("\n"));
      } else {
        alert("Cập nhật thất bại");
      }
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="admin-edit-user">
      <h2>Sửa người dùng</h2>

      <input
        type="text"
        placeholder="Tên người dùng"
        value={form.ten_nguoi_dung}
        onChange={(e) =>
          setForm({ ...form, ten_nguoi_dung: e.target.value })
        }
      />

      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <select
        value={form.vai_tro}
        onChange={(e) =>
          setForm({ ...form, vai_tro: e.target.value })
        }
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <select
        value={form.trang_thai}
        onChange={(e) =>
          setForm({ ...form, trang_thai: Number(e.target.value) })
        }
      >
        <option value={1}>Hoạt động</option>
        <option value={0}>Khoá</option>
      </select>

      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setForm({ ...form, anh_dai_dien: e.target.files[0] })
        }
      />

      <div style={{ marginTop: 16 }}>
        <button className="btn-edit" onClick={submit}>
          Lưu
        </button>
        <button
          className="btn-delete"
          style={{ marginLeft: 8 }}
          onClick={() => navigate("/admin/users")}
        >
          Huỷ
        </button>
      </div>
    </div>
  );
};

export default AdminEditUser;
