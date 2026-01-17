import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminCSS/AdminCreateUser.css";

const AdminCreateUser = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    ten_nguoi_dung: "",
    email: "",
    mat_khau: "",
    vai_tro: "user",
    trang_thai: 1,
    anh_dai_dien: null,
  });

  const submit = async () => {
    try {
      const data = new FormData();
      data.append("ten_nguoi_dung", form.ten_nguoi_dung);
      data.append("email", form.email);
      data.append("mat_khau", form.mat_khau);
      data.append("vai_tro", form.vai_tro);
      data.append("trang_thai", form.trang_thai);

      if (form.anh_dai_dien) {
        data.append("anh_dai_dien", form.anh_dai_dien);
      }

      await axios.post("http://localhost:8000/api/users", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Thêm người dùng thành công");
      navigate("/admin/users");
    } catch (err) {
      if (err.response?.status === 422) {
        alert(Object.values(err.response.data.errors).join("\n"));
      } else {
        alert("Thêm người dùng thất bại");
      }
    }
  };

  return (
    <div className="admin-create-user">
      <h2>Thêm người dùng</h2>

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
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Mật khẩu"
        value={form.mat_khau}
        onChange={(e) => setForm({ ...form, mat_khau: e.target.value })}
      />

      <select
        value={form.vai_tro}
        onChange={(e) => setForm({ ...form, vai_tro: e.target.value })}
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

      <div className="actions">
        <button className="btn-save" onClick={submit}>
          Lưu
        </button>
        <button
          className="btn-cancel"
          onClick={() => navigate("/admin/users")}
        >
          Huỷ
        </button>
      </div>
    </div>
  );
};

export default AdminCreateUser;
