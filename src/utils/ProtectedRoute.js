import { Navigate, useLocation } from "react-router-dom";

const getLoginPathFromURL = (pathname) => {
  if (pathname.startsWith("/doctor")) return "/doctor/login";
  if (pathname.startsWith("/reception")) return "/reception/login";
  if (pathname.startsWith("/lab")) return "/lab/login";
  if (pathname.startsWith("/admin")) return "/admin/login";
  // Default for patient
  return "/patient/login";
};

const ProtectedRoute = ({ children, accessRoles }) => {
  const location = useLocation();
  console.log(location.pathname, "location.pathname");
  const token = localStorage.getItem("access_token");
  const isAuthenticated = !!token;
  const userRole = localStorage.getItem("user_role");

  if (!isAuthenticated) {
    // Redirect to login page based on URL path
    return (
      <Navigate
        to={getLoginPathFromURL(location.pathname)}
        state={{ from: location }}
        replace
      />
    );
  }

  if (accessRoles && !accessRoles.includes(userRole)) {
    // Logged in, but trying to access wrong module
    return <Navigate to={getLoginPathFromURL(location.pathname)} replace />;
  }

  return children;
};

export default ProtectedRoute;
