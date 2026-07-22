import "./Footer.css";
import logo from "../assets/logo.png";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">

                <div className="footer-brand">
                    <img
                      src={logo}
                      alt="Titan Trainer Logo"
                      className="footer-logo"
                      />
                <h2> Titan Trainer </h2>

                   <p className="footer-slogan">
                    Unlock the Monster Within
                </p>
                </div>

                <div className="footer-info">

                <p>
                    <strong> Built By:</strong> Joseph Kirk
                </p>
                </div>

                <div className="footer-links">
                    <a
                      href="https://github.com/josephkirk007-spec"
                      target="_blank"
                      rel="noreferrer"
                      >
                        GitHub
                      </a>

                    <a
                      href="https://linkedin.com/in/joseph-kirk-b88111415/"
                      target="_blank"
                      rel="noreferrer"
                      >
                        LinkedIn
                      </a>
                </div>

                <p className="footer-copyright">
                    &copy; {new Date().getFullYear()} Titan Trainer. All Rights Reserved.
                </p>
            </div>
        </footer>
    );
}

export default Footer;