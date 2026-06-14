import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wraps pages like Login/Register: if the user is already logged in,
// redirect them to the Dashboard instead of showing the form again.
export default function RedirectIfAuthenticated({ children }) {
  const { token } = useAuth();
  if (token) return <Navigate to="/dashboard" replace />;
  return children;
}
