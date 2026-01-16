import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ResetPassword({ email, onBack }) {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const resetPassword = async () => {
    if (password !== confirm) {
      toast.error("Mật khẩu không khớp");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:8000/api/reset-password-otp", {
        email,
        otp,
        password,
        password_confirmation: confirm,
      });
      toast.success("Đổi mật khẩu thành công");
      navigate("/login")
    } catch {
      toast.error("OTP không đúng hoặc hết hạn");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow">
            <div className="card-body">
              <h4 className="text-center mb-4">Xác nhận OTP</h4>

              <div className="mb-3">
                <label>OTP</label>
                <input
                  className="form-control"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label>Mật khẩu mới</label>
                <div className="input-group">
                  <input
                    type={showPass ? "text" : "password"}
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <label>Nhập lại mật khẩu</label>
                <input
                  type={showPass ? "text" : "password"}
                  className="form-control"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>

              <button
                className="btn btn-success w-100 mb-2"
                onClick={resetPassword}
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
              </button>

              <button
                className="btn btn-link w-100"
                onClick={onBack}
                disabled={loading}
              >
                ← Quay lại
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
