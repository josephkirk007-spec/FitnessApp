import { Link, NavLink } from "react-router-dom";
import logo from "../assets/titan-logo.png";
import { useAuth } from "../context/AuthContext";
import "../index.css";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <Link to= {
        user?.role === "client" ? "/client-dashboard" : "/dashboard"
      } 
        className="navbar-brand">
        <img
          src={logo}
          alt="Titan Trainer"
          className="navbar-logo"
        />

        <div className="navbar-brand-text">
          <h1>Titan Trainer</h1>
          <p>Unlock the Monster Within</p>
        </div>
      </Link>

      <nav className="navbar-links">
        {user?.role === "coach" && (
          <>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "nav-link active-nav-link" : "nav-link"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/clients"
          className={({ isActive }) =>
            isActive ? "nav-link active-nav-link" : "nav-link"
          }
        >
          Clients
        </NavLink>

        <NavLink
          to="/saved-plans?type=workout"
          className={({ isActive }) =>
            isActive ? "nav-link active-nav-link" : "nav-link"
          }
        >
          Saved Plans
        </NavLink>
        </>
      )}
        
        {user?.role === "client" && (
          <>
          <NavLink
            to="/client-dashboard"
            className={({ isActive }) =>
              isActive ? "nav-link active-nav-link" : "nav-link"
            }
          >
            My Dashboard
          </NavLink>

          <NavLink
            to="/client-dashboard#workouts"
            className={({ isActive }) =>
              isActive ? "nav-link active-nav-link" : "nav-link"
            }
          >
            My Workout
          </NavLink>

          <NavLink
            to="/client-dashboard#diet"
            className={({ isActive }) =>
              isActive ? "nav-link active-nav-link" : "nav-link"
            }
          >
            My Diet
          </NavLink>
          </>
        )}

        {user && (
          <>
        <span className="navbar-user">
          Welcome, {user?.name || "Coach"}
        </span>

        <button
          type="button"
          className="logout-button"
          onClick={logout}
        >
          Log Out
        </button>
        </>
      )}
      </nav>
    </header>
  );
}

export default Navbar;