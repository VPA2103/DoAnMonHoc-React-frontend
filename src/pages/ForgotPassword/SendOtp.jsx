import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function SendOtp({ email, setEmail, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const sendOtp = async () => {
    if (!email) {
      toast.error("Vui lòng nhập email");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:8000/api/send-otp", { email });
      toast.success("Đã gửi OTP về email");
      setCountdown(60);
      onSuccess();
    } catch {
      toast.error("Email không tồn tại");
    } finally {
      setLoading(false);
    }
  };

  // Countdown 60s
  useEffect(() => {
    if (countdown === 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <div className="container mt-5">
      <ToastContainer />
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow">
            <div className="card-body">
              <h4 className="text-center mb-4">Quên mật khẩu</h4>

              <div className="mb-3">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <button
                className="btn btn-primary w-100"
                onClick={sendOtp}
                disabled={loading || countdown > 0}
              >
                {loading
                  ? "Đang gửi..."
                  : countdown > 0
                  ? `Gửi lại OTP (${countdown}s)`
                  : "Gửi OTP"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
