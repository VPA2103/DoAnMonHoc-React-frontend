import { Outlet } from "react-router-dom";
import HeaderUserProfile from "../../components/UserProfile/HeaderUserProfile";
import UserProfileTab from "../../components/UserProfile/UserProfileTab";

export default function UserLayout() {
  return (
    <>
      <div className="bg-black text-white min-h-screen">
        <div className="container py-4" style={{ maxWidth: "1000px" }}>
          {/* Header Section */}
          <HeaderUserProfile />
          {/* Tabs */}
          <UserProfileTab />
          <Outlet />
        </div>
      </div>
    </>
  );
}
