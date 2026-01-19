import { Outlet } from "react-router-dom";
import UserHeader from "../Users/UserHeader";
import UserFooter from "../Users/UserFooter";
import UserProfileTab from "../../components/UserProfile/UserProfileTab";
import { useEffect, useState } from "react";
import axios from "axios";

const UserLayout = () => {
    const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://127.0.0.1:8000/api/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(res.data.data);
    };

    fetchProfile();
  }, []);

  if (!user) return null;

  return (
    <div className="bg-black text-white min-vh-100 d-flex flex-column">
      <div className="container py-4 flex-grow-1" style={{ maxWidth: "1000px" }}>
        <UserHeader user={user} />
        <UserProfileTab />

        <div className="row mt-3">
          <Outlet context={{ user, setUser }} />
        </div>
      </div>

      <UserFooter />
    </div>
  );
};

export default UserLayout;
