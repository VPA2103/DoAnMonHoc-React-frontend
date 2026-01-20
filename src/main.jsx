import { BrowserRouter } from "react-router-dom";
import App from "./App";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./context/AuthProvider";
import { ToastContainer } from "react-toastify";
// 1. IMPORT CSS BOOTSTRAP (Để giao diện đẹp)
import "bootstrap/dist/css/bootstrap.min.css"; 

// 2. IMPORT JS BOOTSTRAP (QUAN TRỌNG: Để dropdown Blog bấm được)
import "bootstrap/dist/js/bootstrap.bundle.min.js";
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  </BrowserRouter>
);
