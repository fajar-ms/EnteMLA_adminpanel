import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {

  const token = localStorage.getItem("adminToken");

  const user = JSON.parse(
    localStorage.getItem("adminUser")
  );

  // Not logged in
  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  // Not admin
  if (user.role !== "admin") {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}