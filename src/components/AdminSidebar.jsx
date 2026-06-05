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
      <div className="sidebar-brand">
        <h2 className="sidebar-title">Control Panel</h2>
        <span className="sidebar-subtitle">Administrative Suite</span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Core Directory</div>

        <Link to="/dashboard" className="sidebar-link">
          Dashboard Overview
        </Link>

        <div className="nav-section-label">Account Provisioning</div>

        <Link to="/create-employee" className="sidebar-link">
          Register Employee
        </Link>

        <Link to="/create-mla" className="sidebar-link">
          Register MLA Representative
        </Link>

        <Link to="/create-citizen" className="sidebar-link">
          Register Citizen Profile
        </Link>

        <div className="nav-section-label">Content Assets</div>

        <Link to="/admin/banner" className="sidebar-link">
          Manage Media Banners
        </Link>

        <div className="sidebar-divider"></div>

        <button onClick={logout} className="logout-btn">
          Terminate Session
        </button>
      </nav>
    </div>
  );
}