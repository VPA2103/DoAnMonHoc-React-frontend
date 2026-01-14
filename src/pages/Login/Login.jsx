import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserCircle,
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css"; // Đừng quên import CSS của toastify

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State để ẩn/hiện mật khẩu

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.status !== 200 || !response.data?.token) {
        throw new Error("Token không hợp lệ");
      }

      const token = response.data.token;
      const decoded = jwtDecode(token);

      localStorage.setItem("token", token);
      localStorage.setItem("role", decoded.role);

      toast.success("Đăng nhập thành công! 🚀");

      // Đợi 1 chút để user đọc thông báo rồi mới chuyển trang
      setTimeout(() => {
        if (decoded.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }, 1000);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Email hoặc mật khẩu không đúng!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page d-flex justify-content-center align-items-center vh-100">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Background Styling Inline (hoặc bạn có thể để trong file CSS riêng) */}
      <style>
        {`
          .login-page {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .glass-card {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          .form-control:focus {
            box-shadow: none;
            border-color: #764ba2;
          }
          .btn-custom {
            background: linear-gradient(to right, #667eea, #764ba2);
            border: none;
            color: white;
            transition: transform 0.2s;
          }
          .btn-custom:hover {
            transform: translateY(-2px);
            color: white;
            opacity: 0.9;
          }
        `}
      </style>

      <div
        className="card glass-card shadow-lg p-4 p-md-5"
        style={{ width: "100%", maxWidth: "450px" }}
      >
        <div className="text-center mb-4">
          <div className="mb-3 text-primary" style={{ fontSize: "3rem" }}>
            <FaUserCircle />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label fw-semibold">Email</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <FaEnvelope className="text-secondary" />
              </span>
              <input
                type="email"
                name="email"
                className="form-control border-start-0 ps-0"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-2">
            <label className="form-label fw-semibold">Mật khẩu</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <FaLock className="text-secondary" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control border-start-0 border-end-0 ps-0"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                className="input-group-text bg-white border-start-0 cursor-pointer"
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="text-muted" />
                ) : (
                  <FaEye className="text-muted" />
                )}
              </span>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="d-flex justify-content-end mb-4">
            <a href="#" className="text-decoration-none small text-primary">
              Quên mật khẩu?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-custom w-100 py-2 fw-bold shadow-sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Đang xử lý...
              </>
            ) : (
              "Đăng Nhập"
            )}
          </button>
        </form>

        {/* Register Link */}
        <div className="text-center mt-4">
          <p className="text-muted small mb-0">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="text-primary fw-bold text-decoration-none"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
