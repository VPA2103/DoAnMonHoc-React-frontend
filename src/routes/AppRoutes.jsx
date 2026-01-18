import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/Admin/AdminLayout";
import UserLayout from "../layouts/Users/UserLayout";

import PublicRoute from "./PublicRoute";
import RoleRoute from "./RoleRoute";
import { PATH } from "../constants/paths";

/* ===== PUBLIC ===== */
import HomePage from "../pages/Home/HomePage";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import Contact from "../pages/Contact/Contact";
import MealPlans from "../pages/MealPlans/MealPlans";
import MealPlanPage from "../pages/MealPlans/MealPlanDetail";
import Recipes from "../pages/Recipes/Recipes";
import RecipeDetailPage from "../pages/Recipes/RecipeDetailPage";

/* ===== ADMIN ===== */
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminUsers from "../pages/Admin/AdminUser/AdminUsers";
import AdminCreateUser from "../pages/Admin/AdminUser/AdminCreateUser";
import AdminEditUser from "../pages/Admin/AdminUser/AdminEditUser";
import QuanLiDanhMuc from "../pages/Admin/QuanLiDanhMuc";
import QuanLyNguyenLieu from "../pages/Admin/QuanLyNguyenLieu/QuanLyNguyenLieu";
import QuanLyLienHe from "../pages/Admin/QuanLyLienHe/QuanLyLienHe";

/* ===== USER ===== */
import CongThucList from "../pages/User/CongThuc/CongThucList";
import CreateCongThuc from "../pages/User/CongThuc/CreateCongThuc";
import CongThucEdit from "../pages/User/CongThuc/CongThucEdit";
import QuanLyBinhLuan from "../pages/User/QuanLyBinhLuan/QuanLyBinhLuan";
import DanhSachTheoDoi from "../pages/User/DanhSachTheoDoi/DanhSachTheoDoi";

import KeHoachBuaAn from "../pages/User/KeHoachBuaAn/KeHoachBuaAn";
import ThemMoiKeHoachBuaAn from "../pages/User/KeHoachBuaAn/ThemMoikeHoachbuaAn";
import SuaKeHoachBuaAn from "../pages/User/KeHoachBuaAn/SuaKeHoachBuaAn";

import KeHoachBuaAnViewPage from "../pages/KeHoachBuaAnPage/KeHoachBuaAnViewPage";
import KeHoachBuaAnDetailPage from "../pages/KeHoachBuaAnPage/KeHoachBuaAnDetailPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* 🌐 WEBSITE */}
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        <Route path={PATH.MEAL_PLANS} element={<MealPlans />} />
        <Route path={PATH.MEAL_PLAN_DETAIL} element={<MealPlanPage />} />
        <Route path={PATH.RECIPES} element={<Recipes />} />
        <Route path={PATH.RECIPE_DETAIL} element={<RecipeDetailPage />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/kehoachbuaan" element={<KeHoachBuaAnViewPage />} />
        <Route path="/kehoachbuaan/:id" element={<KeHoachBuaAnDetailPage />} />
      </Route>

      {/* 🛠 ADMIN */}
      <Route element={<RoleRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/create" element={<AdminCreateUser />} />
          <Route path="users/edit/:id" element={<AdminEditUser />} />
          <Route path="quanlilienhe" element={<QuanLyLienHe />} />
          <Route path="quanlidanhmuc" element={<QuanLiDanhMuc />} />
          <Route path="quanlinguyenlieu" element={<QuanLyNguyenLieu />} />
        </Route>
      </Route>

      {/* 👤 USER */}
      <Route element={<RoleRoute allowedRoles={["user"]} />}>
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<div>Profile</div>} />
          <Route path="profile" element={<div>Profile</div>} />
          <Route path="following" element={<DanhSachTheoDoi />} />

          <Route path="quanlicongthuc">
            <Route index element={<CongThucList />} />
            <Route path="them" element={<CreateCongThuc />} />
            <Route path="sua/:id" element={<CongThucEdit />} />
          </Route>

          <Route path="kehoachbuaan">
            <Route index element={<KeHoachBuaAn />} />
            <Route path="them" element={<ThemMoiKeHoachBuaAn />} />
            <Route path="sua/:id" element={<SuaKeHoachBuaAn />} />
          </Route>

          <Route path="quan-ly/binh-luan" element={<QuanLyBinhLuan />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;