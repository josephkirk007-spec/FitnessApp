import "./BackgroundLayout.css";
import logo from "../assets/logo.png";

function BackgroundLayout({ children }) {
    return (
        <div className="background-layout">
            <img 
              src={logo}
              alt="Titan Trainer Logo"
              className="background-logo"
              />

              <div className="page-content">
                {children}
              </div>
        </div>
    );
}

export default BackgroundLayout;