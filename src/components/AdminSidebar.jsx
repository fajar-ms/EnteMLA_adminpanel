import { Link, useNavigate } from "react-router-dom";
import "../style/AdminSidebar.css"; // Import CSS for styling

export default function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    navigate("/login");
  };

  return (

    <div className="sidebar">

      <h2 className="sidebar-title">
        Admin Panel
      </h2>

      <nav className="sidebar-nav">

        <Link
          to="/dashboard"
          className="sidebar-link"
        >
          Dashboard
        </Link>

        <Link
          to="/create-employee"
          className="sidebar-link"
        >
          Create Employee
        </Link>

        <Link
          to="/create-mla"
          className="sidebar-link"
        >
          Create MLA
        </Link>

        <Link
          to="/create-citizen"
          className="sidebar-link"
        >
          Create Citizen
        </Link>

        <Link
          to="/admin/banner"
          className="sidebar-link"
        >
          Manage Banner
        </Link>

        <button
          onClick={logout}
          className="logout-btn"
        >
          Logout
        </button>

      </nav>
    </div>
  );
}