import { NavLink, Link } from "react-router-dom";
import "./TopNav.css";
import logo from "../../assets/images/logo.png";

export default function TopNav() {
  return (
    <header className="topnav" role="banner">
      <div className="topnav__inner">
        <Link to="/" className="topnav__brand" aria-label="Go to home">
          <img className="topnav__logo" src={logo} alt="Doberpop" />
        </Link>

        <nav className="topnav__right" aria-label="Primary navigation">
          <NavLink
            exact
            to="/recipes"
            className="topnav__link"
            activeClassName="is-active"
          >
            Browse
          </NavLink>

          <NavLink
            exact
            to="/login"
            className="topnav__link"
            activeClassName="is-active"
          >
            Sign In
          </NavLink>

          <NavLink
            exact
            to="/register"
            className="topnav__link topnav__cta"
            activeClassName="is-active"
          >
            Register
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
