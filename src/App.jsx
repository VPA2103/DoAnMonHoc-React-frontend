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

function App() {
  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />

      <MealPlanProvider>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path={PATH.MEAL_PLANS} element={<MealPlans />} />
        <Route path={PATH.MEAL_PLAN_DETAIL} element={<MealPlanPage />} />
        <Route path={PATH.RECIPES} element={<Recipes />} />
        <Route path={PATH.RECIPE_DETAIL} element={<RecipeDetailPage />} />
        <Route path="/contact" element={<Contact />} />

        {/* Admin */}
        <Route element={<PrivateRoute role="admin" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<div>Trang quản trị</div>} />
          </Route>
        </Route>

        {/* User */}
        <Route element={<PrivateRoute role="user" />}>
          <Route path="/user" element={<UserLayout />}>
            <Route path="videos" element={<div>Videos</div>} />
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
