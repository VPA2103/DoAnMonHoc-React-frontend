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
import MealPlans from "./pages/MealPlans/MealPlans";
import MealPlanPage from "./pages/MealPlans/MealPlanDetail";
import Recipes from "./pages/Recipes/Recipes";
import RecipeDetailPage from "./pages/Recipes/RecipeDetailPage";
import { PATH } from "./constants/paths";

import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import { MealPlanProvider } from "./context/MealPlanContext";

import AdminLayout from "./layouts/Admin/AdminLayout";
import UserLayout from "./layouts/Users/UserLayout";
import RoleRoute from "./routes/RoleRoute";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";

function App() {
  return (
    <>
      <Header />

      <MealPlanProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
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
      </MealPlanProvider>
      <Footer />
    </>
  );
}

export default App;
