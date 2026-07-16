import { Navigate, useLocation } from "react-router-dom";

const AUTH_KEYS = [
  "access_token", "refresh_token", "user_role", "regNo",
  "isDoctorLogin", "isReceptionLogin",
];

const clearAuthStorage = () => {
  AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
};

const getLoginPathFromURL = (pathname) => {
  if (pathname.startsWith("/doctor")) return "/doctor/login";
  if (pathname.startsWith("/reception")) return "/reception/login";
  if (pathname.startsWith("/lab")) return "/lab/login";
  if (pathname.startsWith("/admin")) return "/admin/login";
  return "/patient/login";
};

const ProtectedRoute = ({ children, accessRoles }) => {
  const location = useLocation();
  const token = localStorage.getItem("access_token");
  const isAuthenticated = !!token;
  const userRole = localStorage.getItem("user_role");

  if (!isAuthenticated) {
    clearAuthStorage();
    return (
      <Navigate
        to={getLoginPathFromURL(location.pathname)}
        state={{ from: location }}
        replace
      />
    );
  }

  if (accessRoles && (!userRole || !accessRoles.includes(userRole))) {
    clearAuthStorage();
    return <Navigate to={getLoginPathFromURL(location.pathname)} replace />;
  }

  return children;
};

export default ProtectedRoute;
