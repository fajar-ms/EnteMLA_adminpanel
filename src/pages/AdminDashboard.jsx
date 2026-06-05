import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import axiosInstance from "../services/axiosInstance";
import "../style/AdminDashboard.css"; // Import CSS for styling
import "../style/AdminSidebar.css";

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axiosInstance.get("/complaints/analytics/admin");
      setAnalytics(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const user = JSON.parse(localStorage.getItem("adminUser"));
  return (
    <div className="admin-dashboard">
      <AdminSidebar />

      <div className="dashboard-content">

        {/* ADMIN INFO CARD */}
        <div className="admin-card">
          <h1>Welcome Back, Administrator</h1>
          <div className="admin-info">
            <div className="info-meta-item">
              <span className="meta-label">Account Name:</span>
              <span className="meta-value">{user?.name}</span>
            </div>

            <div className="info-meta-item">
              <span className="meta-label">Access Level:</span>
              <span className="meta-value role-badge">{user?.role}</span>
            </div>
          </div>
        </div>

        {/* METRIC OVERVIEW CARDS */}
        <div className="analytics-cards">
          <div className="analytics-card">
            <span className="metric-label">Total Case Volume</span>
            <p className="metric-value">{analytics?.total || 0}</p>
          </div>

          <div className="analytics-card">
            <span className="metric-label">Mean Resolution Cycle</span>
            <p className="metric-value">
              {analytics?.avgResolutionTime?.toFixed(1) || 0} <span className="metric-unit">Days</span>
            </p>
          </div>
        </div>

        {/* ANALYTICS SECTION */}
        <div className="analytics-grid-layout">

          {/* STATUS PROFILE */}
          <div className="analytics-section">
            <h2 className="section-title">Case Status Summary</h2>
            <div className="analytics-table-wrapper">
              <div className="analytics-list">
                {analytics?.statusBreakdown?.map((item) => (
                  <div key={item._id} className="analytics-item">
                    <span className="item-label">{item._id}</span>
                    <b className="item-count">{item.count}</b>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* DISTRICT BREAKDOWN */}
          <div className="analytics-section">
            <h2 className="section-title">Regional District Distribution</h2>
            <div className="analytics-table-wrapper">
              <div className="analytics-list">
                {analytics?.districtWise?.map((item) => (
                  <div key={item._id} className="analytics-item">
                    <span className="item-label">{item._id}</span>
                    <b className="item-count">{item.count}</b>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CHRONOLOGICAL TREND */}
          <div className="analytics-section full-width">
            <h2 className="section-title">Chronological Case Progression</h2>
            <div className="analytics-table-wrapper">
              <div className="analytics-list horizontal-trend">
                {analytics?.monthlyTrend?.map((item, index) => (
                  <div key={index} className="analytics-item progression-node">
                    <span className="item-label mono-text">
                      {String(item._id.month).padStart(2, '0')}/{item._id.year}
                    </span>
                    <b className="item-count">{item.count}</b>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;