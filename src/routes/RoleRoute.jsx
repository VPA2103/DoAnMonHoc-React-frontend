import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const RoleRoute = ({ allowedRoles }) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(role)) return <Navigate to="/403" replace />;

  return <Outlet />;
};

export default RoleRoute;
