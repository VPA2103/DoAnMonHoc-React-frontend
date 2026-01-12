import { Route, Routes } from "react-router-dom";
import UserLayout from "../layouts/Users/UserLayout";
import ContentUserPost from "../pages/User/UserProfilePost";

export default function UserRoutes() {
  return (
    <>
      <Routes>
        <Route element={<UserLayout />}>
          {/* Route mặc định khi vào /user */}
          <Route index element={<ContentUserPost />} />

          {/* Khớp với /user/videos */}
          <Route path="videos" element={<ContentUserPost />} />

          {/* Khớp với /user/reposts */}
          <Route path="reposts" element={<div>Nội dung Reposts</div>} />

          {/* Khớp với /user/favorites */}
          <Route path="favorites" element={<div>Nội dung Favorites</div>} />

          {/* Khớp với /user/liked */}
          <Route path="liked" element={<div>Nội dung Liked</div>} />
        </Route>
      </Routes>
    </>
  );
}
