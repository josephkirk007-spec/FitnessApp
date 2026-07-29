import { Link } from "react-router-dom";
import logo from "../assets/titan-logo.png";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <section className="footer-brand">
          <img
            src={logo}
            alt="Titan Trainer"
            className="footer-logo"
          />

          <div>
            <h2>Titan Trainer</h2>
            <p className="footer-slogan">
              Unlock the Monster Within
            </p>
          </div>
        </section>

        <section className="footer-column">
          <h3>Quick Links</h3>

          <Link to="/dashboard">Dashboard</Link>
          <Link to="/clients">Clients</Link>
          <Link to="/saved-plans?type=workout">
            Workout Plans
          </Link>
          <Link to="/saved-plans?type=diet">
            Diet Plans
          </Link>
        </section>

        <section className="footer-column">
          <h3>Developer</h3>

          <p className="developer-name">Joseph Kirk</p>
          <p>Software Engineer</p>
          <p>Full-Stack Developer</p>
        </section>

        <section className="footer-column">
          <h3>Connect</h3>

          <a
            href="https://github.com/josephkirk007-spec"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/joseph-kirk-b88111415"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>

          <button
            type="button"
            className="back-to-top"
            onClick={scrollToTop}
          >
            Back to Top ↑
          </button>
        </section>
      </div>

      <div className="footer-bottom">
        <p>
          © {currentYear} Titan Trainer · Built by Joseph Kirk
        </p>

        <p className="footer-stack">
          React · Node.js · Express · MongoDB
        </p>
      </div>
    </footer>
  );
}

export default Footer;