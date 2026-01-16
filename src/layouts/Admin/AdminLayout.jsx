import { Outlet } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="d-flex">
      <AdminSidebar />

      <div className="flex-grow-1">
        <AdminHeader />
        <main className="p-4 bg-light min-vh-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
