import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import UserHeader from "../Users/UserHeader";
import UserFooter from "../Users/UserFooter";
import UserProfileTab from "../../components/UserProfile/UserProfileTab";

const UserLayout = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="bg-black text-white min-vh-100 d-flex flex-column">
      <div className="container py-4 flex-grow-1" style={{ maxWidth: "1000px" }}>
        <UserHeader user={user} />
        <UserProfileTab />

        <div className="row mt-3">
          <Outlet />
        </div>
      </div>

      <UserFooter />
    </div>
  );
};

export default UserLayout;
//he