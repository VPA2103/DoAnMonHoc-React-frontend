import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/Home/HomePage";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Contact from "./pages/Contact/Contact";

import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";

import AdminLayout from "./layouts/Admin/AdminLayout";
import UserLayout from "./layouts/Users/UserLayout";
import RoleRoute from "./routes/RoleRoute";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path="/contact" element={<Contact />} />

        <Route element={<RoleRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<div>Trang quản trị</div>} />
          </Route>
        </Route>

        <Route element={<RoleRoute allowedRoles={["user"]} />}>
          <Route path="/user" element={<UserLayout />}>
            <Route path="profile" element={<div>Videos</div>} />
            <Route path="reposts" element={<div>Reposts</div>} />
            <Route path="favorites" element={<div>Favorites</div>} />
          </Route>
        </Route>
      </Routes>

      <Footer />
    </>
  );
}

export default App;
