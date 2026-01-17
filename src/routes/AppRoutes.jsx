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


import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminUsers from "../pages/Admin/AdminUsers";


import PublicRoute from "./PublicRoute";
import RoleRoute from "./RoleRoute";
import { PATH } from "../constants/paths";
import DanhSachTheoDoi from "../pages/User/DanhSachTheoDoi/DanhSachTheoDoi";
import QuanLiDanhMuc from "../pages/Admin/QuanLiDanhMuc";
import QuanLyNguyenLieu from "../pages/Admin/QuanLyNguyenLieu/QuanLyNguyenLieu";

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
          <Route path="users" element={<AdminUsers />} />
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
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
