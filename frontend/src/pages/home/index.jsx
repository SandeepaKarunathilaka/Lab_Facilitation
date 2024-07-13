import React from "react";
import { useAuthStore } from "../../store/useAuthStore";
import NavBar from "../../components/NavBar";
import { USER_ROLES } from "../../constants/roles";
import { Link } from "react-router-dom";

const Home = () => {
  const { user, logout } = useAuthStore((state) => ({
    user: state.user,
    logout: state.logout,
  }));
  //
  return (
    <>
      <NavBar />
      <div className="container">
        <header className="bg-light p-5 rounded-lg m-3">
          <h1>Laboratory Management System</h1>
          <p></p>
          {user && (
            <>
              <div className="alert alert-primary" role="alert">
                You are logged in as <strong>{user.role}</strong>
              </div>
              <h3>Welcome, {user.name}</h3>
              <button onClick={logout} className="btn btn-danger">
                Logout
              </button>
              <button className="btn btn-primary mx-2">
                <a
                  // MANAGER, EXECUTIVE, GENERAL
                  href={user.role === USER_ROLES.ADMIN ? "/admin" : "/patient"}
                  className="text-white text-decoration-none"
                >
                  {user.role === USER_ROLES.ADMIN
                    ? "Admin Dashboard"
                    : "Patient Dashboard"}
                </a>
              </button>
            </>
          )}

          {!user && (
            <>
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
            </>
          )}
        </header>
      </div>
    </>
  );
};

export default Home;
