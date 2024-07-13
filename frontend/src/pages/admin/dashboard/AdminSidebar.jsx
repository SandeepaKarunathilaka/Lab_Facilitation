import React, { useState } from "react";
import LOGO from "../../../assets/logo.webp";
import { FiLogOut } from "react-icons/fi";
import { useAuthStore } from "../../../store/useAuthStore";
import Dashboard from "./Dashboard";
import LabService from "../../lab_service";
import Appointment from "../../appointment";
import { useNavigate } from "react-router-dom";
//
const AdminSidebar = () => {
  const navigate = useNavigate();
  const [activeContent, setActiveContent] = useState("Dashboard");
  //
  const handleLinkClick = (content) => {
    setActiveContent(content);
  };
  //
  const { logout, user } = useAuthStore((state) => ({
    logout: state.logout,
    user: state.user,
  }));
  //
  const renderContent = () => {
    switch (activeContent) {
      case "Dashboard":
        return (
          <>
            <Dashboard />
          </>
        );
      case "LabServices":
        return (
          <>
            <LabService />
          </>
        );
      case "Appointments":
        return (
          <>
            <Appointment />
          </>
        );
      default:
        return (
          <p>
            Welcome to the application. Please select a link from the sidebar.
          </p>
        );
    }
  };

  // Function to handle logout logic
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  //
  // custom css for nav-link and active nav-link
  const navLinkStyle = {
    color: "#fff",
    backgroundColor: "#3b82f6",
    // text bold
    fontWeight: "bold",
  };
  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <div
        className="d-flex flex-column flex-shrink-0 p-3"
        style={{
          width: "280px",
          backgroundColor: "#d1d5db",
          borderRight: "2px solid #000",
        }}
      >
        <a
          href="/"
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none"
        >
          <img
            src={LOGO}
            alt="logo"
            style={{
              maxWidth: "100%",
              maxHeight: "60px",
              padding: "5px",
              backgroundColor: "#fff",
            }}
            className="rounded"
          />
        </a>
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <a
              href="#dashboard"
              className="nav-link"
              style={
                activeContent === "Dashboard" ? navLinkStyle : { color: "#000" }
              }
              onClick={() => handleLinkClick("Dashboard")}
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="#labServices"
              className="nav-link"
              style={
                activeContent === "LabServices"
                  ? navLinkStyle
                  : { color: "#000" }
              }
              onClick={() => handleLinkClick("LabServices")}
            >
              Lab Services
            </a>
          </li>
          <li>
            <a
              href="#appointments"
              className="nav-link"
              style={
                activeContent === "Appointments"
                  ? navLinkStyle
                  : { color: "#000" }
              }
              onClick={() => handleLinkClick("Appointments")}
            >
              Appointments
            </a>
          </li>
        </ul>
        <div className="mt-auto">
          <button
            className="btn btn-dark w-100 d-flex align-items-center justify-content-center"
            onClick={handleLogout}
          >
            <FiLogOut className="me-2" /> Logout
          </button>
        </div>
      </div>
      <div className="flex-grow-1 p-4" style={{ overflowY: "auto" }}>
        {renderContent()}
      </div>
    </div>
  );
};
//
export default AdminSidebar;
