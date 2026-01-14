import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="container py-4">
      <h2>Admin Dashboard</h2>
      <Outlet />
    </div>
  );
};

export default AdminLayout;
