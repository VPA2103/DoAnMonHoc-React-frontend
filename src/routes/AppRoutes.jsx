import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import HomePage from "../pages/Home/HomePage";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import Contact from "../pages/Contact/Contact";
import MealPlans from "../pages/MealPlans/MealPlans";
import MealPlanPage from "../pages/MealPlans/MealPlanDetail";
import Recipes from "../pages/Recipes/Recipes";
import RecipeDetailPage from "../pages/Recipes/RecipeDetailPage";

import AdminLayout from "../layouts/Admin/AdminLayout";
import UserLayout from "../layouts/Users/UserLayout";

import AdminDashboard from "../pages/Admin/Dashboard/AdminDashboard";

import PublicRoute from "./PublicRoute";
import RoleRoute from "./RoleRoute";
import { PATH } from "../constants/paths";
import DanhSachTheoDoi from "../pages/User/DanhSachTheoDoi/DanhSachTheoDoi";
import QuanLiDanhMuc from "../pages/Admin/QuanLiDanhMuc";
import QuanLieuNguyenLieu from "../pages/Admin/QuanLyNguyenLieu";
import KeHoachBuaAn from "../pages//User/KeHoachBuaAn/ThemMoikeHoachbuaAn";
import CongThucList from "../pages/User/CongThuc/CongThucList";
import CongThucEdit from "../pages/User/CongThuc/CongThucEdit";
import CreateCongThuc from "../pages/User/CongThuc/CreateCongThuc";
import AdminCreateUser from "../pages/Admin/AdminUser/AdminCreateUser";
import AdminEditUser from "../pages/Admin/AdminUser/AdminEditUser";
import AdminUsers from "../pages/Admin/AdminUser/AdminUsers";
import QuanLyBinhLuan from "../pages/User/QuanLyBinhLuan/QuanLyBinhLuan";
import QuanLyCongThuc from "../pages/Admin/QuanLyCongThuc/quanlicongthuc";
import AdminProfile from "../pages/Admin/Profile/AdminProfile";

const AppRoutes = () => {
  return (
    <Routes>
      {/* 🌐 WEBSITE CHÍNH */}
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
      </Route>

      {/* 🛠 ADMIN */}
      <Route element={<RoleRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="profile" element={<AdminProfile/>} />
          
          {/* USERS */}
          <Route path="users" element={< AdminUsers/>} />
          <Route path="users/create" element={<AdminCreateUser />} />
          <Route path="users/edit/:id" element={<AdminEditUser />} />


          <Route path="quanlidanhmuc" element={<QuanLiDanhMuc />} />
          <Route path="quanlinguyenlieu" element={<QuanLieuNguyenLieu />} />

          <Route path="quanlicongthuc" element={<QuanLyCongThuc />} />

        </Route>
      </Route>

      {/* 👤 USER */}
      <Route element={<RoleRoute allowedRoles={["user"]} />}>
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<div>Profile</div>} />
          <Route path="profile" element={<div>Profile</div>} />
          <Route path="following" element={<DanhSachTheoDoi />} />
          <Route path="kehoachbuaan" element={<KeHoachBuaAn />} />
          <Route path="quanlicongthuc">
            <Route index element={<CongThucList />} />
            <Route path="them" element={<CreateCongThuc />} />
            <Route path="sua/:id" element={<CongThucEdit />} />
          </Route>
          <Route path="quan-ly/binh-luan" element={<QuanLyBinhLuan />} />
          {/* // <Route path="/quan-ly/danh-gia" element={< />} /> */}
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
//hello