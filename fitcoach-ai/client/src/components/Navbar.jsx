import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="navbar">
            <Link to="/dashboard" className="navbar-brand">
              Titan Trainer 
              </Link>

              <nav className="navbar-links">
                <Link to="/dashboard"> Dashboard </Link>

                <Link to="/clients"> Clients </Link>

                <span> Welcome, {user?.name} </span>

                <button type="button" onClick={handleLogout}>
                    Logout
                </button>
              </nav>
        </header>
    );
}

export default Navbar;